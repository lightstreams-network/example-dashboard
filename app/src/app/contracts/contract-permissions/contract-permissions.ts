import {Component} from '@angular/core';
import {select} from "ng2-redux";
import {IPermission, IContractRecord, IContract} from "../../store/state/contract";
import {ContractActions} from "../../store/actions/contract";
import {ISignature, SignatureFactory} from "../../store/state/signature";
import {ActivatedRoute} from "@angular/router";
import {ProfileActions} from "../../store/actions/profile";
import {RemoteClient} from "../../services/server/remote-client";
import {Observable, Subscription} from "rxjs";

@Component({
   selector: 'contract-permissions',
   template: require('./contract-permissions.html'),
   styles: [require('./contract-permissions.scss')],
})
export class ContractPermissions {
   @select(state => state.session.processing) processing$;
   @select() contract$: Observable<IContractRecord>;

   contractSubscription: Subscription;

   contract: IContract;
   signature: ISignature;
   signatureIdReset: boolean;

   metaAddr: string;
   verified: boolean;
   clientIPs: string[];
   error: string = null;

   constructor(
      private contractActions: ContractActions,
      private profileActions: ProfileActions,
      private service: RemoteClient,
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
      this.contractSubscription = this.contract$.subscribe(c => {
         this.contract = c.toJS();
         this.metaAddr = this.contract.metaAddr;
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

   grant() {
      if (!this.clientIPs || this.clientIPs.length === 0) {
         this.error = "Could not send a message to client's device";
         return;
      }

      let permission: IPermission = {
         signature: this.signature,
         capabilities: ["READ"]
      };

      this.contractActions.grantPermission(this.metaAddr, permission, this.clientIPs)
         .then(() => {
            //this.notifyClients();
            this.resetForm();
         })
         .catch(err => {
            this.error = err;
         });
   }
}
