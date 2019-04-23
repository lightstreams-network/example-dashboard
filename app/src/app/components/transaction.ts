import {TransactionField} from './transaction-field';
export class Transaction {
   public title: string;
   public fields: TransactionField[];
   public total: string;

   public minor: boolean;
}
