import {Component, Input} from '@angular/core';
import {CommercialsEditor} from './commercials-editor';
import {TransactionField} from './transaction-field';

@Component({
   selector: 'invoices-editor',
   template: `
    <commercials-editor [data]="data" [header]="header"></commercials-editor>
  `
})

export class InvoicesEditor {
   @Input() data: string[][];
   @Input() header: string[];

   constructor() {
      let data = [
         new TransactionField('Transaction base', '100', 'calculated', 'currency'),
         new TransactionField('Commission', '5', 'calculated', 'currency'),
         new TransactionField('Subtotal', '=C2+C4', 'calculated', 'currency'),
         new TransactionField('VAT %', '21', 'calculated', 'currency'),
         new TransactionField('VAT', '=C5*C6/100', 'calculated', 'currency'),
         new TransactionField('Total', '=C7+C5', 'total', 'currency')
         ];

      this.data = data.map(d => d.toArray());

      this.header = ['Name', 'Source', 'Value', 'Format'];
   }

   getData() {
      let inputData = [];
      for (let i: number = 1; i <= this.data.length; i++) {
         let row = this.data[i];
         let input = new TransactionField(row[0], row[1], row[2], row[3]);
         inputData.push(input);
      }

      return inputData;
   }
}
