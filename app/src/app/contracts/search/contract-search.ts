import { Component } from '@angular/core';
import { select } from 'ng2-redux';
import { ContractActions } from '../../store/actions/contract';
import { IContract, IContractRecord } from '../../store/state/contract';
import { Observable, Subscription } from 'rxjs';
import { IDevice, } from '../../store/state/device';
import { ISignature, ISignatureRecord } from '../../store/state/signature';
import { List } from 'immutable';
import { Router } from '@angular/router';

@Component({
   selector: 'contract-search',
   template: require('./contract-search.html'),
   styles: [require('./contract-search.scss')],
})
export class ContractSearch {
   @select(state => state.session.processing) processing$;
   @select() contract$: Observable<IContractRecord>;
   @select(state => state.device.signatures) signatures$;
   @select() device$: Observable<IDevice>;

   protected signaturesSub: Subscription;
   protected deviceSub: Subscription;
   protected contractSubscription: Subscription;

   protected signatures: ISignature[];
   protected device: IDevice;

   protected metaAddr: string;
   protected found: boolean;
   protected error: string;
   protected searching: boolean;

   protected contract: IContract;

   constructor(
      private contractActions: ContractActions,
      private router: Router
   ) {
      this.contractActions.reset();
      this.resetForm();
   }

   resetForm() {
      this.metaAddr = null;
      this.error = null;
      this.found = false;
   }

   ngOnInit() {
      this.deviceSub = this.device$
         .subscribe((d: any) => {
            this.device = d.toJS();
         });

      this.signaturesSub = this.signatures$
         .subscribe((s: List<ISignatureRecord>) => {
            this.signatures = s.toJS();
         });

      this.contractSubscription = this.contract$.subscribe(c => {
         this.contract = c.toJS();
         if (this.isContractOwner()) {
            this.router.navigate(['contracts', this.contract.metaAddr]);
         }
      });
   }

   ngOnDestroy() {
      this.signaturesSub.unsubscribe();
      this.contractSubscription.unsubscribe();
      this.deviceSub.unsubscribe();
   }

   isContractOwner() {
      let owner = this.contract.owner;
      if (!owner) {
         return;
      }
      let matching = this.signatures.filter(s => s.signatureId === owner.signatureId);
      return matching.length > 0;
   }

   search(metaAddr: string) {
      this.error = null;
      this.found = false;
      this.searching = true;

      let signature = this.device.defaultSignature;

      this.contractActions.search(signature, {metaAddr})
         .then((c) => {
            this.error = null;
            this.searching = false;
            this.found = typeof c !== 'undefined';
         })
         .catch((err) => {
            console.log(err);
            this.error = `Unable to find content.
            Possibly there are no devices are seeding this content right now.`;
            this.searching = false;
         });
   }

   cancel() {
      this.searching = false;
   }
}
