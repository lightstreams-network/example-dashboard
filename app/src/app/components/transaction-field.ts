export class TransactionField {
   constructor(
      public name: string,
      public value: string,
      public source: string,
      public format: string
   ) {}

   public toArray() {
      return [this.name, this.source, this.value, this.format];
   }
}
