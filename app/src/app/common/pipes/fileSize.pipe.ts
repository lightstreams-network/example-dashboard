import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'fileSize'})
export class FileSizePipe implements PipeTransform {
   transform(value: string): string {
      return formatSize(value);
   }
}

export function formatSize(value: string) : string {
   let fileSize = parseInt(value);

   let precision = 9;
   let factor = Math.pow(10, precision);
   if (fileSize > factor) {
      fileSize = Math.floor(fileSize / factor);
      return `${fileSize} GB`;
   }

   precision = 6;
   factor = Math.pow(10, precision);
   if (fileSize > factor) {
      fileSize = Math.floor(fileSize / factor);
      return `${fileSize} MB`;
   }

   precision = 3;
   factor = Math.pow(10, precision);
   if (fileSize > factor) {
      fileSize = Math.floor(fileSize / factor);
      return `${fileSize} KB`;
   }

   return `${fileSize} Bytes`;
}