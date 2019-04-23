import {Component, ViewEncapsulation} from '@angular/core';
import {Observable, Subscription} from 'rxjs/Rx';
import {select} from 'ng2-redux/lib/index';
import {IDocusignUser, IDocusignUserAccount} from '../../store/state/docusign';
import {DocusignActions} from '../../store/actions/docusign';
import {List } from 'immutable';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
   selector: 'docusign-card',
   template: require('./docusign-card.html'),
   styles: [require('./docusign-card.scss')],
   encapsulation: ViewEncapsulation.None,
})
export class DocusignCard {
   is_authenticated: boolean;
   docusignUser: IDocusignUser;
   token: any;

   @select() docusign$: Observable<any>;

   querySubscription: Subscription;
   docusignSubscription: Subscription;
   imageBase64: string;

   links: any[] = [
      {name: 'Contract 1'},
      {name: 'Contract 2'},
      {name: 'Contract 3'},
      {name: 'Contract 4'}
   ];

   constructor(private actions: DocusignActions,
               private route: ActivatedRoute,
               private router: Router) {
   }

   ngOnInit() {
      this.querySubscription = this.route.queryParams.subscribe(params => {
         if (params['auth']) {
            this.router.navigate(['/contract-design']);
            this.actions.getUser();
         }
      });

      this.docusign$.subscribe(u  => {
         this.token = u.token;
         this.is_authenticated = u.is_authenticated;

         let accounts = u.user.accounts as List<IDocusignUserAccount>;
         if (accounts && accounts.size > 0) {
            let account = accounts.get(0);
            console.log('account:');
            console.log(account.base_uri);
            console.log(account.account_id);
            this.actions.setDefaultAccount(account);
         }
      });
   }

   getImage() {
      this.actions.getDocumentPageImage('518bbc5c-2656-4002-a745-3aa9d321ab44', '82127754', 1, (err, data) => {
         this.imageBase64 = data;
      });
   }

   ngOnDestroy() {
      this.querySubscription.unsubscribe();
      this.docusignSubscription.unsubscribe();
   }
}
