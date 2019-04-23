import {Component} from '@angular/core';
import {select} from "ng2-redux";
import {Observable, Subscription} from "rxjs";
import {compareDates} from "../../store/utils";
import {List} from "immutable";
import { DeviceActions } from '../../store/actions/device';
import { ISignature, ISignatureRecord, SignatureFactory } from '../../store/state/signature';


@Component({
    selector: 'signature-store',
    template: require('./signature-store.html'),
    styles: [require('./signature-store.scss')],
})
export class SignatureStoreComponent {
    @select(state => state.session.processing) processing$;
    @select(state => state.device.signatures) signatures$;

    signaturesSub: Subscription;
    signatures: ISignature[];

    signature: ISignature;

    constructor(private actions: DeviceActions) {
        this.resetForm();
    }

    ngOnInit() {
        this.signaturesSub = this.signatures$
           .subscribe((s: List<ISignatureRecord>)=> {

               // Sort descending
               let sorted = s.sort((a: ISignatureRecord, b: ISignatureRecord) =>
                  compareDates(b.createdAt, a.createdAt));

               this.signatures = sorted.toJS();
           });
    }

    ngOnDestroy() {
        this.signaturesSub.unsubscribe();
    }

    create() {
        this.actions.createSignature(this.signature)
           .then(() => this.resetForm())
           .catch(err => {});
    }

    resetForm() {
        this.signature = SignatureFactory(null).toJS();
    }
}
