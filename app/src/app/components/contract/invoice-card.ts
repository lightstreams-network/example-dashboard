import {Component, ViewEncapsulation} from '@angular/core';
import {NgIf, NgFor, AsyncPipe} from '@angular/common';
import {MdInput} from '@angular/material/input/input';
import {MdButton, MdAnchor} from '@angular/material/button/button';
import {MdIcon} from '@angular/material/icon/icon';
import {TransactionsEditor} from '../transactions-editor';
import {InvoicesEditor} from '../invoices-editor';
import {TransactionField} from '../transaction-field';
import {Transaction} from '../transaction';

@Component({
   selector: 'invoice-card',
   template: require('./invoice-card.html'),
   styles: [require('./invoice-card.scss')],
   encapsulation: ViewEncapsulation.None,
})
export class InvoiceCard {
   transactions: Transaction[];

   constructor() {
      let unitCost = new Transaction();
      unitCost.title = 'Unit Cost';
      unitCost.fields = [
         new TransactionField('Unit price', '10.50', 'input', 'currency'),
         new TransactionField('Quantity', '100', 'input', 'number')
      ];
      unitCost.total = '1050.00';

      let commission = new Transaction();
      commission.title = 'Commission';
      commission.fields = [
         new TransactionField('Commission', '5 %', 'constant', 'percent')
      ];
      commission.total = '52.50';

      let subtotal = new Transaction();
      subtotal.title = 'Gross';
      subtotal.minor = true;
      subtotal.total = '1102.50';

      let vat = new Transaction();
      vat.title = 'VAT';
      vat.minor = true;
      vat.total = '231.52';

      let total = new Transaction();
      total.title = 'Total';
      total.minor = true;
      total.total = '1334.02';

      this.transactions = [unitCost, commission, subtotal, vat, total];
   }
}
