import {Component, EventEmitter, Input, Output} from '@angular/core';
declare var Handsontable: any;

@Component({
   selector: 'commercials-editor',
   template: `
    <hot [data]="data" [options]="options"></hot>
  `
})
export class CommercialsEditor {
   @Input() data: Array<[string]>;
   @Input() header: [string];
   @Output() change = new EventEmitter<void>();

   options: any;

   colors: any = {
   grey: '#E6E6E6',
      green: '#CEC',
      blue: '#E8FDFF',
      yellow: '#FFF5C9'
   };

   ngOnInit() {
      this.data.unshift(this.header);

      let sourceValues = ['input', 'constant', 'contract', 'calculated', 'total'];
      let formatValues = ['currency', 'number', 'text', 'percent'];

      this.options = {
         colHeaders: true,
         rowHeaders: true,
         colWidths: [230, 100, 150, 100],
         cells: (row, col, prop) => {
            let props: any = {};

            if (row === 0) {
               props.renderer = this.firstRowRenderer;
            }

            if (row !== 0 && col === 1) {
               props.type = 'dropdown';
               props.source = sourceValues;
            }

            if (row !== 0 && col === 2) {
               props.validator = this.formulaCellValidator;
            }

            if (row !== 0 && col === 3) {
               props.type = 'dropdown';
               props.source = formatValues;
            }

            return props;
         },
         minSpareRows: 1,
         minSpareCols: 1,
         contextMenu: true,
         formulas: {
            enabled: true,
            onCellRender: this.valueColRenderer
         },
         afterChange: (changes, source) => {
            if (source === 'edit') {
               let row = changes[0];
               let col = changes[0];
               let newVal = changes[3];
               // console.log(changes);
            }
            this.change.emit(null);
         }
      };
   }

   firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
      Handsontable.renderers.TextRenderer.apply(this, arguments);
      td.style.color = 'black';
      td.style.background = '#FFF5C9';
   }

   valueColRenderer(instance, td, row, col, prop, value, cellProperties) {
      if (col !== 2) {
         return;
      }

      let format = instance.getDataAtCell(row, 3);
      switch (format) {
         case 'currency':
            td.style['text-align'] = 'right';
            cellProperties.type = 'numeric';
            cellProperties.format = '0,0.00';
            break;
         case 'number':
            td.style['text-align'] = 'right';
            cellProperties.type = 'numeric';
            cellProperties.format = '0,0';
            break;
         case 'percent':
            td.style['text-align'] = 'right';
            cellProperties.type = 'numeric';
            cellProperties.format = '0,%';
            break;
      }
      return cellProperties;
   }

   formulaCellValidator(value, callback) {
      callback(true);
   }
}
