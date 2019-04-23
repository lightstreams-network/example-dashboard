import {Component, ViewEncapsulation, ViewChild} from '@angular/core';
import {NgIf, NgFor, AsyncPipe} from '@angular/common';
import {MdToolbar} from '@angular/material/toolbar/toolbar';
import {MdInput} from '@angular/material/input/input';
import {MdButton, MdAnchor} from '@angular/material/button/button';
import {MdIcon} from '@angular/material/icon/icon';
import {TransactionsEditor} from '../transactions-editor';
import {InvoicesEditor} from '../invoices-editor';
import {TransactionField} from '../transaction-field';

@Component({
   selector: 'invoice-template-wizard',
   template: require('./invoice-template-wizard.html'),
   styles: [require('./invoice-template-wizard.scss')],
   encapsulation: ViewEncapsulation.None,
})
export class InvoiceTempateWizard {
   docusignUrl: string;
   isSignedInToDocuSign: boolean;

   links: any[] = [
      {name: 'Contract 1'},
      {name: 'Contract 2'},
      {name: 'Contract 3'},
      {name: 'Contract 4'}
   ];

   constructor() {
      this.createDocuSignUrl();

      let docuSignToken = location.search.split('code=')[1];
      if (docuSignToken) {
         this.isSignedInToDocuSign = true;
      }
   }

   createDocuSignUrl() {
      let docusignUrl = 'https://account-d.docusign.com/oauth/auth';
      let integratorKey = 'e8955f08-09d7-41b5-b909-a3523d81ab03';
      let state = 'xxx';
      let redirectUri = `${window.location.origin}/docusign`;
      let response_type = 'code';
      let scope = 'signature';

      this.docusignUrl = `${docusignUrl}?` +
         `response_type=${response_type}&` +
         `scope=${scope}&` +
         `client_id=${integratorKey}&` +
         `state=${state}&` +
         `redirect_uri=${redirectUri}`;
   }

   transactionsGridChange(data: TransactionField[]) {
      // let transactionField = this.transactionsGrid.getData();
      // console.log(data);
      let x = 5;
   }
}
