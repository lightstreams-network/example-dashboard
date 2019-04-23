import {Component, ViewEncapsulation} from '@angular/core';
import {NgIf, NgFor, AsyncPipe} from '@angular/common';
import {MdInput} from '@angular/material/input/input';
import {MdButton, MdAnchor} from '@angular/material/button/button';
import {MdIcon} from '@angular/material/icon/icon';
import {TransactionsEditor} from '../transactions-editor';
import {InvoicesEditor} from '../invoices-editor';
import {TransactionField} from '../transaction-field';
import {InvoiceCard} from './invoice-card';
import {DocusignCard} from './docusign-card';
import {Transaction} from '../transaction';

@Component({
   selector: 'contract-design',
   template: require('./contract-design.html'),
   styles: [require('./contract-design.scss')],
   encapsulation: ViewEncapsulation.None,
})
export class ContractDesign {

   unitCost: Transaction;
   commission: Transaction;
   incentive: Transaction;

   constructor() {

      this.unitCost = new Transaction();
      this.unitCost.title = 'Unit Cost';
      this.unitCost.fields = [
         new TransactionField('Unit price', '10.50', 'input', 'currency'),
         new TransactionField('Quantity', '100', 'input', 'number'),
         new TransactionField('Total', '=C2*C3', 'calculated', 'currency')
      ];
      this.unitCost.total = '1050.00';

      this.commission = new Transaction();
      this.commission.title = 'Commission';
      this.commission.fields = [
         new TransactionField('Unit Cost', '1050.00', 'input', 'currency'),
         new TransactionField('Commission %', '0.05', 'constant', 'percent'),
         new TransactionField('Commission', '=C2*C3', 'calculated', 'currency')
      ];
      this.commission.total = '52.50';

      this.incentive = new Transaction();
      this.incentive.fields = [
         new TransactionField('Total Sales', '3500000.00', 'input', 'currency'),
         new TransactionField('incentive 2%', '-0.02', 'constant', 'percent'),
         new TransactionField('Rebate', '=C2*C3', 'calculated', 'currency')
      ];
   }

   transactionsGridChange(data: TransactionField[]) {
      // let transactionField = this.transactionsGrid.getData();
      // console.log(data);
      let x = 5;
   }
}
