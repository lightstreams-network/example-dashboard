import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'price'})
export class PricePipe implements PipeTransform {
   transform(value: string): string {
      return formatPrice(value);
   }
}

export function formatPrice(price: string) : string {
   let formatted = parseInt(price);
   let precision = 7;
   let factor = Math.pow(10, precision);
   formatted = Math.ceil(formatted / factor);
   formatted = formatted/100;

   return `${formatted.toFixed(2)} PHT`;
}