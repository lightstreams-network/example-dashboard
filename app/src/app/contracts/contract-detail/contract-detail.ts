import {Component} from '@angular/core';
import {select} from "ng2-redux";
import {IContractRecord, INITIAL_RECORD, IContract} from "../../store/state/contract";
import {Observable, Subscription} from "rxjs";
import {ContractActions} from "../../store/actions/contract";
import {Router, ActivatedRoute} from "@angular/router";
import {SignatureFactory, ISignature, ISignatureRecord} from "../../store/state/signature";
import {IProfileRecord, IProfile} from "../../store/state/profile";
import {List} from "immutable";

@Component({
   selector: 'contract-detail',
   template: require('./contract-detail.html'),
   styles: [require('./contract-detail.scss')],
})
export class ContractDetail {
   @select() contract$: Observable<IContractRecord>;
   @select(state => state.device.signatures) signatures$;

   signaturesSub: Subscription;
   contractSubscription: Subscription;

   signatures: ISignature[];

   contract: IContract;
   metaAddr: string;
   isNew: boolean;

   constructor(
      private contractActions: ContractActions,
      private route: ActivatedRoute,
      private router: Router
   ) {

      this.contract = INITIAL_RECORD;
   }

   ngOnInit() {
      this.metaAddr = this.route.snapshot.params['id'];
      let isNew = this.route.snapshot.params['isNew'];
      if (isNew === 'true') {
         this.isNew = true;
      }

      this.signaturesSub = this.signatures$
         .subscribe((s: List<ISignatureRecord>)=> {
            this.signatures = s.toJS();
         });

      this.contractSubscription = this.contract$.subscribe(c => {
         this.contract = c.toJS();
      });
   }

   isContractOwner() {
      let owner = this.contract.owner;
      let matching = this.signatures.filter(s => s.signatureId === owner.signatureId)
      return matching.length > 0;
   }

   ngOnDestroy() {
      this.signaturesSub.unsubscribe();
      this.contractSubscription.unsubscribe();
   }

   permissions() {
      this.router.navigate([`contracts/${this.metaAddr}/permissions`]);
   }

   transfer() {
      this.router.navigate([`contracts/${this.metaAddr}/transfer`]);
   }

   insure() {
      this.router.navigate([`/create-insurance/${this.metaAddr}`]);
   }

   home() {
      this.router.navigate(["/"]);
   }
}
