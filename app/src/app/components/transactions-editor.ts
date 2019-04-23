import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TransactionField} from './transaction-field';
import {Transaction} from './transaction';

@Component({
   selector: 'transactions-editor',
   template: `
    <commercials-editor [data]="data" [header]="header"></commercials-editor>
  `
})

export class TransactionsEditor {
   @Input() transaction: Transaction;
   @Input() header: string[];

   data: string[][];

   constructor() {
      this.header = ['Name', 'Source', 'Value', 'Format'];
   }

   ngOnInit() {
      this.data = this.transaction.fields.map(d => d.toArray());
   }

   getData() : TransactionField[] {
      let inputData = [];
      for (let i: number = 1; i < this.data.length; i++) {
         let row = this.data[i];
         let input = new TransactionField(row[0], row[1], row[2], row[3]);
         inputData.push(input);
      }

      return inputData;
   }

   onGridChange() {
      let data = this.getData();
      // this.actions.transactionsChange(data);
   }

}
