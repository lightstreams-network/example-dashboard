///<reference path="../../../../node_modules/primeng/components/common/api.d.ts"/>
import {Component} from '@angular/core';
import {select} from "ng2-redux";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {ContractActions} from "../../store/actions/contract";
import {
   IContractRecord, contractState, IContract,
   ContractRecordFactory, IContractHeader, IPrivateState, IPublicState, PrivateStateFactory, PublicStateFactory,
   PrivateStateChainFactory, PublicStateChainFactory
} from "../../store/state/contract";
import {Environment} from "../../environment";
import {IProfile, IProfileRecord} from "../../store/state/profile";
import {DeviceActions} from "../../store/actions/device";
import {IDevice} from "../../store/state/device";
import {ActionsDispatcher} from "../../store/actions-dispatcher";
import {SessionState} from "../../store/state/session";
import {ServerActions} from "../../store/actions/server";
import {AbstractControl, FormBuilder, FormGroup, NG_VALIDATORS} from "@angular/forms";
import {formatPrice, priceToValue} from "../../store/utils";
import {SelectItem} from "primeng/primeng";
import { ISignatureRecord } from '../../store/state/signature';

@Component({
   selector: 'create-content',
   template: require('./create-content.html'),
   styles: [require('./create-content.scss')],
})
export class CreateContentComponent {
   @select(state => state.session.processing) processing$;
   @select() device$: Observable<IDevice>;
   @select() contract$: Observable<IContractRecord>;
   @select() profile$: Observable<IProfileRecord>;

   price: string;
   deviceRegistered: boolean;

   deviceSubscription: Subscription;
   device: IDevice;

   registerLink: string;

   profileSubscription: Subscription;
   profile: IProfile;

   contractSubscription: Subscription;
   header: IContractHeader;

   INITIALISED = contractState.INITIALISED;
   ERROR = contractState.ERROR;
   CREATING = contractState.CREATING;
   GENERATING_OWNER_KEY = contractState.GENERATING_OWNER_KEY;
   GENERATING_CONTRACT_KEY = contractState.GENERATING_CONTRACT_KEY;
   CREATED = contractState.CREATED;
   READY = contractState.READY;
   SIGNING = contractState.SIGNING;
   SIGNED = contractState.SIGNED;

   termsUrl = Environment.LOCAL_SERVER + '/contracts/terms';
   addFileUrl = Environment.LOCAL_SERVER + '/contracts/addFile';
   addCoverUrl = Environment.LOCAL_SERVER + '/ipfs/add';

   contentFile: any;
   coverFile: any;

   error: string = null;

   addingContent: boolean;
   addingCover: boolean;
   contentAdded: boolean;
   coverAdded: boolean;

   contract: IContract;
   privateState: IPrivateState;
   publicState: IPublicState;

   insufficientFunds: boolean;

   selectedContentType: any;
   contentType: SelectItem[] = [
      //{label: 'Select content type...', value: ''},
      {label: 'Document', value: 'Document'},
      {label: 'Video', value: 'Video'}
   ];

   contentError: string = null;

   constructor(private session: SessionState,
               private actions: ActionsDispatcher,
               private contractActions: ContractActions,
               private deviceActions: DeviceActions,
               private formBuilder: FormBuilder,
               private router: Router) {

      this.resetForm();
   }

   resetForm() {
      this.contractActions.reset();
      this.error = null;

      this.contract = ContractRecordFactory(null).toJS();
      this.privateState = PrivateStateFactory(null).toJS();
      this.publicState = PublicStateFactory(null).toJS();
      this.selectedContentType = 'Document';

      this.header = this.contract.header;
      this.addingContent = false;
   }

   ngOnInit() {
      if (this.session.profileLoaded) {
         this.deviceRegistered = true;
      }

      this.deviceSubscription = this.device$.subscribe(d => {
         this.device = d;

         let location = window.location;
         let callbackUrl = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/sell-content';
         let account = this.device.defaultSignature.publicKey;
         this.registerLink = `${Environment.PUBLIC_WEB_SERVER}/?device=${this.device.deviceId}&account=${account}&callback=${callbackUrl}`;

         this.checkFunds();
      });

      this.profileSubscription = this.profile$.subscribe(p => {
         this.profile = p.toJS();
      });

      this.contractSubscription = this.contract$.subscribe(c => {
         this.contract = c.toJS();
      });
   }

   checkFunds() {
      if (!this.device) {
         return;
      }
      let balance = parseInt(this.device.balance);
      let price = parseInt(this.device.deploymentPrice);

      this.insufficientFunds = balance < price;
   }

   ngOnDestroy() {
      this.deviceSubscription.unsubscribe();
      this.contractSubscription.unsubscribe();
      this.profileSubscription.unsubscribe();
   }

   cancel() {
      this.router.navigate([`contracts`]);
   }

   newContent() {

      let header = this.header;

      let defaultSignature = this.device.defaultSignature as ISignatureRecord;
      let owner = defaultSignature.toJS();
      let ownerAccount = owner.account;

      header.owner = owner;
      header.issuer = owner;
      header.counterparty = owner;

      this.header = header;

      this.contract.owner = owner;
      this.contract.header = header;
      this.contract.ownerAccount = ownerAccount;
      this.contract.issuerAccount = ownerAccount;

      this.contract.publicStateChain.current = this.publicState;

      let deploymentAccount = this.device.deploymentAccount;
      let deploymentFee = this.device.deploymentPrice;

      this.contract.meta.name = this.selectedContentType;

      // this.contractActions.createContentWithFee(this.contract, deploymentAccount, deploymentFee)
      this.contractActions.createContent(this.contract)
         .catch(err => this.error = err);
   }

   uploadError(event) {
      console.log("error event", event.xhr.response);
   }

   beforeUploadContent(event) {
      this.contentError = null;

      let owner = this.header.owner;
      this.addingContent = true;
      event.formData.append("contractMetaAddr", this.contract.metaAddr);
      event.formData.append("privateKey", owner.privateKey);
   }

   uploadContentComplete(event) {

      this.addingContent = false;

      this.contentFile = event.files[0];

      if (this.selectedContentType == "Video") {
         let extension = this.getFileExtension(this.contentFile.name);
         if (extension.toLowerCase() != 'mp4') {
            console.log("Video must be an mp4 file.");
            this.contentError = "Video must be an mp4 file.";
            this.contentAdded = false;
            return;
         }
      }

      try {
         let response = JSON.parse(event.xhr.response);
         if (response.success) {
            this.privateState.documentAddr = response.data.fileAddr;
            this.privateState.documentSize = this.contentFile.size;
            this.contentAdded = true;
         } else {
            this.error = response.error;
            this.addingContent = false;
         }
      }
      catch (err) {
         this.error = "Error adding file to the contract.";
         this.addingContent = false;
      }
   }

   beforeUploadCover(event) {
      this.addingCover = true;
   }

   uploadCoverComplete(event) {

      this.addingCover = false;

      this.coverFile = event.files[0];

      try {
         let response = JSON.parse(event.xhr.response);
         if (response.success) {

            let cover = this.publicState.cover;
            cover.address = response.data.fileAddr;
            cover.encoding = this.getImageEncoding(this.coverFile);

            this.coverAdded = true;
         } else {

            this.error = response.error;
            this.addingCover = false;
         }
      }
      catch (err) {
         this.error = "Error adding file to the contract.";
         this.addingCover = false;
      }
   }

   getImageEncoding(file: any): string {
      let encoding = 'image/png';

      if (!file.name) {
         return encoding;
      }

      let extension = this.getFileExtension(file.name);

      return 'image/' + extension;
   }

   getFileExtension(filename): string {
      let parts = filename.split(".");
      if (parts.length != 2) {
         return "";
      }

      return parts[1];
   }

   sign() {
      this.contract.meta.name = this.selectedContentType;
      this.contract.price = priceToValue(this.price);

      this.contract.publicStateChain = PublicStateChainFactory(null).toJS();
      this.contract.publicStateChain.current = this.publicState;
      this.contract.privateStateChain = PrivateStateChainFactory(null).toJS();
      this.contract.privateStateChain.current = this.privateState;
      this.contract.unlocked = true;

      this.contractActions.initilizeState(this.contract);
   }

   permissions() {
      this.router.navigate([`contracts/${this.contract.metaAddr}/permissions`]);
   }
}
