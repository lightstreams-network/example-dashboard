import { List } from 'immutable';
import {TypedRecord, recordify} from 'typed-immutable-record';
import * as moment from 'moment';

export function toTypedList<T>(array : List<T> | T[], factory) : List<T> {
    array = array || [];
    return List<T>((array as T[]).map(a => factory(a)));
}

export function toRecordOrNull<E, T extends TypedRecord<T> & E>(value) : T {
    if (!value) {
        return null;
    }
    return recordify<E, T>(value);
}

export function parseDate(value: string): Date {
    let m = moment(value);
    return m.toDate();
}

export function compareDateStrings(a: string, b: string): number {
    return compareDates(this.parseDate(a), this.parseDate(b));
}

export function compareDates(a: Date, b: Date): number {
    if (a < b) {
        return -1;
    }
    if (a === b) {
        return 0;
    }
    if (a > b) {
        return 1;
    }
}

export function sMerge<E, T extends TypedRecord<T> & E>(val: E, defaultVal: E, ext?: any): T {
   let record = recordify<E, T>(defaultVal);

   if (!val) {
      return record;
   }

   record = sanitizedMerge(val, record);
   if (!ext) {
      return ext;
   }

   return record.merge(ext);
}

export function sanitizedMerge(item: any, record: any): any {

    let itemFields  = Object.keys(item);

    // Delete keys that are not declared on the record.
    let template = record.toJS();
    for (let field of itemFields) {
        if (!template.hasOwnProperty(field)) {
            delete item[field];
        }
    }
    record = record.merge(item);
    
    return record;
}


export function formatPrice(price: string) : string {
   let formatted = parseInt(price);
   let precision = 7;
   let factor = Math.pow(10, precision);
   formatted = Math.ceil(formatted / factor);
   formatted = formatted/100;

   return `${formatted.toFixed(2)} PHT`;
}

export function priceToValue(formatted: string) : string {
   let price = parseFloat(formatted);
   let precision = 9;
   let factor = Math.pow(10, precision);
   price = Math.floor(price * factor);
   return price.toString();
}
