import {Component} from '@angular/core';
import {select} from "ng2-redux";
import {ContractActions} from "../../store/actions/contract";
import {ISignature, SignatureFactory} from "../../store/state/signature";
import {ActivatedRoute, Router} from "@angular/router";
import {ProfileActions} from "../../store/actions/profile";
import {IContractRecord, IContract} from "../../store/state/contract";
import {Observable, Subscription} from "rxjs";

@Component({
   selector: 'contract-transfer',
   template: require('./contract-transfer.html'),
   styles: [require('./contract-transfer.scss')],
})
export class ContractTransfer {
   @select(state => state.session.processing) processing$;
   @select() contract$: Observable<IContractRecord>;

   contractSubscription: Subscription;

   signature: ISignature;
   signatureIdReset: boolean;

   metaAddr: string;
   verified: boolean;
   clientIPs: string[];
   error: string = null;

   receipt: any;
   contract: IContract;

   constructor(
      private contractActions: ContractActions,
      private profileActions: ProfileActions,
      private router: Router,
      private route: ActivatedRoute) {

      this.resetForm();
   }

   resetForm() {
      this.error = null;
      this.signatureIdReset = true;
      this.verified = false;
      this.signature = SignatureFactory(null).toJS();
   }

   ngOnInit() {
      this.metaAddr = this.route.snapshot.params['id'];

      this.contractSubscription = this.contract$.subscribe(c => {
         this.contract = c.toJS();
      });
   }

   ngOnDestroy() {
      this.contractSubscription.unsubscribe();
   }

   verify(signatureId: string) {
      this.signatureIdReset = false;

      if (!signatureId || signatureId.length != 8) {
         this.verified = false;
         this.signature.name = "";
         return;
      }

      this.profileActions.getSignature(signatureId)
         .then(data => {
            let signature: ISignature = data.signature;
            this.clientIPs = data.clientIPs;

            if (!signature) {
               this.verified = false;
               this.signature.name = "";
               return;
            }

            this.verified = true;
            this.signature = signature;
      });
   }

   transfer() {

      this.contractActions.transferOwnership(this.metaAddr, this.signature)
         .then(receipt => {
            this.receipt = receipt;
            this.resetForm();
         })
         .catch(err => {
            this.error = err;
         });
   }

}
