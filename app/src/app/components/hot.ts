import {Component, ElementRef, ViewChild, Input} from '@angular/core';

require('script-loader!../_scripts/blueimp-md5/js/md5.min.js');
require('script-loader!../_scripts/underscore.string/dist/underscore.string.min.js');
require('script-loader!../_scripts/lodash/dist/lodash.min.js');
require('script-loader!../_scripts/moment/moment.js');
require('script-loader!../_scripts/jstat/dist/jstat.min.js');
require('script-loader!../_scripts/numeral/min/numeral.min.js');
require('script-loader!../_scripts/formalajs/formula.js');
require('script-loader!../_scripts/ruleJS/dist/full/ruleJS.parser.full.js');
require('script-loader!../_scripts/handsontable-custom/handsontable.full.js');
require('script-loader!../_scripts/handsontable-formula/handsontable.formula.js');

@Component({
  selector: 'hot',
  template: `
    <div #table></div>
  `
})
export class Hot {
  @ViewChild('table')
  table: ElementRef;

  @Input() data: any;
  @Input() options: any;

  ngOnInit() {
    this.options.data = this.data;
  }

  ngAfterViewInit() {
    let container = this.table.nativeElement;

    let hot = new Handsontable(container, this.options);
  }

}
