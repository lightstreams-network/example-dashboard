import {Component} from '@angular/core';
import {select} from "ng2-redux";
import {Observable, Subscription} from "rxjs";
import {Router, ActivatedRoute} from "@angular/router";
import {ContractActions} from "../../store/actions/contract";
import {IContractRecord, contractState, IContract,
   ContractRecordFactory, IContractHeader
} from "../../store/state/contract";
import {Environment} from "../../environment";
import {IProfile, IProfileRecord} from "../../store/state/profile";
import {DeviceActions} from "../../store/actions/device";
import {SignatureFactory, ISignature} from "../../store/state/signature";
import {ActionsDispatcher} from "../../store/actions-dispatcher";
import {ProfileActions} from "../../store/actions/profile";

@Component({
    selector: 'create-insurance',
    template: require('./create-insurance.html'),
    styles: [require('./create-insurance.scss')],
})
export class CreateInsuranceComponent {
    @select(state => state.session.processing) processing$;
    @select() contract$: Observable<IContractRecord>;
    @select() profile$: Observable<IProfileRecord>;

    profileSubscription: Subscription;
    profile: IProfile;

    contractSubscription: Subscription;
    contract: IContract;
    header: IContractHeader;

    INITIALISED = contractState.INITIALISED;
    INITIALISED2 = "INTIALISED_2";
    ERROR = contractState.ERROR;
    CREATING = contractState.CREATING;
    GENERATING_OWNER_KEY = contractState.GENERATING_OWNER_KEY;
    GENERATING_CONTRACT_KEY = contractState.GENERATING_CONTRACT_KEY;
    CREATED = contractState.CREATED;
    READY = contractState.READY;
    SIGNING = contractState.SIGNING;
    SIGNED = contractState.SIGNED;

    indexProviderSignature: ISignature;
    signatureIdReset: boolean;
    verified: boolean;

    termsUrl = Environment.LOCAL_SERVER + '/contracts/terms';
    termsFile: any;
    termsFileSize: string;

    error: string = null;

    addingTerms: boolean;

    region: string;
    district: string;
    regions = [{label: "Choose a region", value: ""}, {label: "Western Kenya", value: "Western Kenya"}];
    districts = [{label: "Choose a district", value: ""},
        {label: "BARINGO", value: "BARINGO"},
        {label: "BOMET", value: "BOMET"},
        {label: "BUNGOMA", value: "BUNGOMA"},
        {label: "BUSIA", value: "BUSIA"},
        {label: "ELGEYO-MARAKWET", value: "ELGEYO-MARAKWET"},
        {label: "HOMA BAY", value: "HOMA BAY"}];

    constructor(
        private actions: ActionsDispatcher,
        private contractActions: ContractActions,
        private deviceActions: DeviceActions,
        private profileActions: ProfileActions,
        private route: ActivatedRoute,
        private router: Router) {

        this.resetForm();
    }

    resetForm() {
        this.contractActions.reset();
        this.contract = ContractRecordFactory(null).toJS();
        this.header = this.contract.header;
        this.addingTerms = false;

        this.signatureIdReset = true;
        this.verified = false;
        this.indexProviderSignature = SignatureFactory(null).toJS();
    }

    ngOnInit() {
        this.header.farmer = this.route.snapshot.params['id'];

        this.profileSubscription = this.profile$.subscribe(p => {
            this.profile = p.toJS();
        });

        this.contractSubscription = this.contract$.subscribe(c => {
            this.contract = c.toJS();
        });
    }

    ngOnDestroy() {
        this.contractSubscription.unsubscribe();
        this.profileSubscription.unsubscribe();
    }

    cancel() {
        this.contractActions.reset();
        this.resetForm()
    }

    verify(signatureId: string) {
        this.signatureIdReset = false;

        if (!signatureId || signatureId.length != 8) {
            this.verified = false;
            this.indexProviderSignature.name = "";
            return;
        }

        this.profileActions.getSignature(signatureId)
           .then(data => {
               let signature: ISignature = data.signature;

               if (!signature) {
                   this.verified = false;
                   this.indexProviderSignature.name = "";
                   return;
               }

               this.verified = true;
               this.indexProviderSignature = signature;
           });
    }

    newAsset() {
        let header = this.header;
        if (header.description.length === 0) {
            header.description = '(no description)';
        }

        this.actions.dispatch(ContractActions.GENERATING_OWNER_KEY);
        let signature = SignatureFactory(null).toJS();
        this.deviceActions.createSignature(signature)
           .then(signature => {
               let owner = this.header.owner;

               owner.signatureId = signature.signatureId;
               owner.name = `${this.profile.firstName} ${this.profile.lastName}`;

               header.issuer = owner;
               header.owner = owner;
               header.counterparty = this.indexProviderSignature;
               header.contractType = "Insurance";

               this.contract.signatureId = signature.signatureId;
               this.contract.header = header;
               this.contract.owner = owner;
               return this.contractActions.createContract(this.contract);
           })
           .catch(err => this.error = err);
    }

    beforeUpload(event) {
        let owner = this.header.owner;
        this.addingTerms = true;
        event.formData.append("signatureId", owner.signatureId);
        event.formData.append("contract", this.contract.metaAddr);
    }

    uploadComplete(event) {
        this.addingTerms = false;

        this.termsFile = event.files[0];
        let fileSize = this.termsFile.size;
        if (fileSize > 1000000){
            fileSize = Math.floor(fileSize/1000000);
            this.termsFileSize = `${fileSize} MB`;
        } else if (fileSize > 1000) {
            fileSize = Math.floor(fileSize/1000);
            this.termsFileSize = `${fileSize} KB`;
        }

        let response = JSON.parse(event.xhr.response);
        if (response.success) {
            this.contractActions.setTerms(response.data.termsAddr);
        } else {
            this.contractActions.setError(response.error)
        }
    }

    sign() {
        this.contractActions.signContract(this.contract);
    }

    permissions() {
        this.router.navigate([`contracts/${this.contract.metaAddr}/permissions`]);
    }
}
