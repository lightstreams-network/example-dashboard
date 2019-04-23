import {Component} from '@angular/core';
import {select} from "ng2-redux";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {ContractActions} from "../../store/actions/contract";
import {IContractRecord, contractState, IContract,
   ContractRecordFactory, IContractHeader
} from "../../store/state/contract";
import {Environment} from "../../environment";
import {IProfile, IProfileRecord} from "../../store/state/profile";
import {DeviceActions} from "../../store/actions/device";
import {SignatureFactory} from "../../store/state/signature";
import {ActionsDispatcher} from "../../store/actions-dispatcher";

@Component({
    selector: 'create-profile',
    template: require('./create-profile.html'),
    styles: [require('./create-profile.scss')],
})
export class CreateProfileComponent {
    @select(state => state.session.processing) processing$;
    @select() contract$: Observable<IContractRecord>;
    @select() profile$: Observable<IProfileRecord>;

    profileSubscription: Subscription;
    profile: IProfile;

    contractSubscription: Subscription;
    contract: IContract;
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
    termsFile: any;
    termsFileSize: string;

    error: string = null;

    addingTerms: boolean;

    crops = [{label: "Choose crop type", value: ""},
        {label: "Maize", value: "Maize"},
        {label: "Corn", value: "Corn"},
        {label: "Coffee", value: "Coffee"}];

    constructor(
        private actions: ActionsDispatcher,
        private contractActions: ContractActions,
        private deviceActions: DeviceActions,
        private router: Router) {

        this.resetForm();
    }

    resetForm() {
        this.contractActions.reset();
        this.contract = ContractRecordFactory(null).toJS();
        this.header = this.contract.header;
        this.addingTerms = false;
    }

    ngOnInit() {
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
               header.counterparty = owner;
               header.contractType = "Profile";

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
