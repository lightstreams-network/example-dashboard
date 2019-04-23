import { Component, Input } from '@angular/core';
import { select } from 'ng2-redux';
import {
   contractState,
   IContract,
   IImage,
   ImageFactory,
   INITIAL_RECORD,
   IPermission,
   IPrivateState,
   IPublicState,
   PublicStateFactory
} from '../../store/state/contract';
import { Observable, Subscription } from 'rxjs';
import { ContractActions } from '../../store/actions/contract';
import { LocalService } from '../../services/local-service';
import { Environment } from '../../environment';
import { IDevice } from '../../store/state/device';
import { ISignatureRecord } from '../../store/state/signature';

interface Window {
   webkitURL?: any;
   URL?: any;

   open(url ?: any);
}

declare var window: Window;

@Component({
   selector: 'contract-card',
   template: require('./contract-card.html'),
   styles: [require('./contract-card.scss')]
})
export class ContractCard {
   @Input() contract: IContract;

   @select() device$: Observable<IDevice>;

   deviceSubscription: Subscription;
   device: IDevice;

   documentAddrUrl: string = '';
   explorerUrl: string = '';
   signatureId: string = null;
   privateState: IPrivateState = null;
   publicState: IPublicState = PublicStateFactory(null).toJS();

   INITIALISED = contractState.INITIALISED;
   ERROR = contractState.ERROR;
   SIGNED = contractState.SIGNED;
   UNLOCKING = contractState.UNLOCKING;

   cover: IImage = ImageFactory(null).toJS();
   refreshing: boolean;
   error: string;
   coverImgWidth: number = 1;
   coverImgHeight: number = 1;
   receipt: any = null;
   insufficientFunds = false;

   constructor(
      private server: LocalService,
      private contractActions: ContractActions
   ) {

      this.contract = INITIAL_RECORD;
      this.error = null;

      this.explorerUrl = `${Environment.EXPLORER_SERVER}transaction/`;
   }

   ngOnInit() {
      this.deviceSubscription = this.device$.subscribe((d: any) => {
         this.device = d.toJS();
         this.update();
      });

      this.update();
   }

   ngOnDestroy() {
      this.deviceSubscription.unsubscribe();
   }

   update() {
      let base = Environment.LOCAL_SERVER;
      let metaAddr = this.contract.metaAddr;

      this.checkFunds();

      this.publicState = this.contract.publicStateChain.current;
      if (this.publicState.cover) {
         this.cover = this.publicState.cover;
         this.resizeCoverImage();
      }

      if (!this.contract.privateStateChain) {
         return;
      }

      this.privateState = this.contract.privateStateChain.current;

      let documentAddr = this.privateState.documentAddr;

      let meta = this.contract.meta;
      if (meta.name === 'Video') {
         this.documentAddrUrl =
            `${base}/app/player/play.html#ipfs/${documentAddr}.mp4?contract=${metaAddr}`;
      } else {
         this.documentAddrUrl = `${base}/ipfs/${documentAddr}`;
      }
   }

   checkFunds() {
      if (!this.device) {
         return;
      }
      let balance = parseInt(this.device.balance);
      let price = parseInt(this.contract.price);

      this.insufficientFunds = balance < price;
   }

   resizeCoverImage() {
      let img = new Image();
      img.onload = () => {
         if (img.width == 0 || img.height == 0) {
            return;
         }

         if (img.width > img.height) {
            this.coverImgWidth = 300;
            let ratio = img.height / img.width;
            this.coverImgHeight = 300 * ratio;
         } else {
            this.coverImgHeight = 200;
            let ratio = img.width / img.height;
            this.coverImgWidth = 200 * ratio;
         }
      };
      img.src = this.cover.base64Encoded;
   }

   ngOnChanges() {
      this.update();
   }

   refresh() {
      this.refreshing = true;
      let signature = this.device.defaultSignature;
      this.contractActions.getContract(signature, this.contract.metaAddr)
         .then((contract) => this.refreshing = false)
         .catch((err) => {
            this.refreshing = false;
            this.error = err;
         });
   }

   purchase() {
      let defaultSignature = this.device.defaultSignature as ISignatureRecord;

      this.contractActions.purchaseContent(defaultSignature,
         this.contract.metaAddr,
         this.contract.price)
         .then((receipt: any) => {
            if (receipt) {
               this.receipt = {
                  transactionHash: receipt.transactionHash,
                  blockNumber: receipt.blockNumber
               };
            }
         })
         .catch((err) => {
            console.log(err);
            this.error = 'An error has occurred during the purchasing process.' +
               'Try clicking refresh.';
         });
   }

   /*unlock(signatureId: string) {
      let base = Environment.LOCAL_SERVER;
      let metaAddr = this.contract.metaAddr;

      this.contractActions.unlock(this.contract.metaAddr, signatureId)
         .then(contract => {
            let termsAddr = contract.termsAddr;
            this.termsUrl =
            `${base}/ipfs/${termsAddr}/?contract=${metaAddr}&signatureId=${signatureId}`;
         })
         .catch(err => this.error = err)
   }*/

   getCoverData() {
      let windowUrl = window.URL || window.webkitURL;
      let coverData =
         this.cover.base64Encoded.replace('data:image/png;base64,', '');
      let file = this._b64toBlob(coverData, this.cover.encoding, null);
      let fileUrl = windowUrl.createObjectURL(file);
      window.open(fileUrl.toString());
   }

   getContentData() {
      let signature = this.device.defaultSignature;
      let documentAddr = this.privateState.documentAddr;
      let contractAddr = this.contract.metaAddr;

      this.contractActions.getPrivateData(signature, contractAddr, documentAddr)
         .then((response) => {
            let windowUrl = window.URL || window.webkitURL;
            let blob = response.blob();
            let file = new Blob([blob], { type: blob.type });
            let fileUrl = windowUrl.createObjectURL(file);
            window.open(fileUrl.toString());
         })
         .catch((err) => {
            this.refreshing = false;
            this.error = err;
         });

   }

   displayRole(permission: IPermission) {
      if (permission.capabilities.length > 0) {
         return permission.capabilities[0];
      }
   }

   _b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || '';
      sliceSize = sliceSize || 512;

      let byteCharacters = atob(b64Data);
      let byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
         let slice = byteCharacters.slice(offset, offset + sliceSize);
         let byteNumbers = new Array(slice.length);
         for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
         }

         let byteArray = new Uint8Array(byteNumbers);
         byteArrays.push(byteArray);
      }

      return new Blob(byteArrays, {type: contentType});
   }
}
