import { Component } from '@angular/core';
import { select } from 'ng2-redux';
import { ContractRecordFactory, IContract, IContractRecord } from '../../store/state/contract';
import { Observable, Subscription } from 'rxjs';
import { ContractActions } from '../../store/actions/contract';
import { ActivatedRoute, Router } from '@angular/router';
import { compareDates } from '../../store/utils';

@Component({
   selector: 'contracts',
   template: require('./contracts.html'),
   styles: [require('./contracts.scss')],
})

export class Contracts {
   @select((state) => state.session.processing) processing$;
   @select() contract$: Observable<IContractRecord>;

   protected contracts: IContract[] = [];
   protected routerSub: Subscription;

   constructor(
      private contractActions: ContractActions,
      private router: Router,
      private route: ActivatedRoute) {
   }

   public ngOnInit() {
      this.routerSub = this.route.data.subscribe((data: { contracts: any }) => {
         this.contracts = data.contracts.map((c) => this.parseContract(c));

         // Sort descending
         this.contracts = this.contracts.sort((a: IContract, b: IContract) =>
            compareDates(b.meta.createdAt, a.meta.createdAt));
      });
   }

   public ngOnDestroy() {
      this.routerSub.unsubscribe();
   }

   private parseContract(c) {
      let contract = ContractRecordFactory(c).toJS();
      contract.description = contract.publicStateChain.current.title;

      return contract;
   }

}
