import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'dateFormat'})
export class DateFormatPipe implements PipeTransform {
   transform(value: Date, args: string): string {
      if (args) {
         return moment(value).format(args);
      }
      return moment(value).format('DD MMM YYYY HH:mm');
   }
}

