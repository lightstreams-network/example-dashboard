import {Component, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs/Rx';
import {select} from 'ng2-redux/lib/index';
import {IUpholdRecord} from '../../store/state/uphold';
import {UpholdActions} from '../../store/actions/uphold';
import {ActivatedRoute, Router} from '@angular/router';
import {SelectItem} from 'primeng/primeng';

@Component({
   selector: 'uphold-pay',
   template: require('./uphold-pay.html'),
   styles: [require('./uphold-pay.scss')],
})
export class UpholdPay {
   @select() uphold$: Observable<IUpholdRecord>;
   @select(state => state.uphold.processing) processing$;

   upholdSubscription: Subscription;
   querySubscription: Subscription;

   is_authenticated: boolean;
   processingPayment: boolean;
   loading: boolean;
   upholdUser: any;
   amount: string;
   destination: string;
   message: string;

   cards: SelectItem[];
   selectedCard: any;
   errorMessage: string;
   transactionReceipt: any;

   constructor(private actions: UpholdActions,
               private route: ActivatedRoute,
               private router: Router) {
   }

   ngOnInit() {
      this.querySubscription = this.route.queryParams.subscribe(params => {
         if (params['auth']) {
            this.actions.getUser();
            this.actions.getCards();

            this.router.navigate(['/uphold-pay']);
         }
      });

      this.upholdSubscription = this.uphold$.subscribe(u  => {
         let uphold = u.toJS();
         this.upholdUser = uphold.user;

         this.cards = uphold.cards.map(card => {
            return {label: card.currency, value: card};
         });
         this.cards.unshift({label: 'Choose a currency', value: null});

         this.is_authenticated = uphold.is_authenticated;
         this.transactionReceipt = uphold.transactionReceipt;
      });

      this.actions.newPayment();
   }

   ngOnDestroy() {
      this.upholdSubscription.unsubscribe();
      this.querySubscription.unsubscribe();
   }

   executeTransaction() {
      if (!this.selectedCard) {
         return;
      }

      this.processingPayment = true;
      this.errorMessage = null;

      let cardId = this.selectedCard.id;
      let transaction = {
         card: cardId,
         currency: this.selectedCard.currency,
         amount: this.amount,
         destination: this.destination,
         message: this.message
      };

      this.actions.execute(transaction, error => {
         this.processingPayment = false;

         if (error) {
            this.errorMessage = error.statusText;
         }
      });
   }
}
