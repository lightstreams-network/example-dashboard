import 'rxjs/Observable'
import 'rxjs/Subscription'
import  'rxjs/Subject'
import  'rxjs/BehaviorSubject'
import  'rxjs/add/operator/map'
import  'rxjs/add/operator/mergeMap'
import  'ng2-redux'
import  'ng2-redux-router'
import  'redux'
import  'redux-localstorage'
import  'redux-logger'
import  'rxjs/add/operator/distinctUntilChanged'

/*
 * Angular bootstraping
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { decorateModuleRef } from './app/environment';
import { bootloader } from '@angularclass/hmr';
/*
 * App Module
 * our top level module that holds all of our components
 */
import { AppModule } from './app';

declare var window: Window;

// Remove token from url
var newUrl = refineUrl(); //fetch new url

/*Helper function to extract the URL between the last / and before ?
 If url is www.example.com/file.php?f_id=55 this function will return file.php
 pseudo code: edit to match your url settings
 */
function refineUrl() {
  //get full url
  var url = window.location.href;
  //get url after/
  var value = url.substring(url.lastIndexOf('/') + 1);
  //get the part after before ?
  value  = value.split('?')[0];
  return value;
}

require('zone.js/dist/long-stack-trace-zone');

/*
 * Bootstrap our Angular app with a top level NgModule
 */
export function main() {
  var queryString = (function(a: string[]) {
    var b = {};
    for (var i = 0; i < a.length; ++i) {
      var p = a[i].split('=', 2);
      if (p.length !== 1) {
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ''));
      }
    }
    return b;
  })(window.location.search.substr(1).split('&'));

  let config: any = {};

  config.state = queryString['state'];
  delete queryString['state'];

  let params = Object.keys(queryString);
  if (params.length > 0) {
    newUrl += '?';
    params.forEach(param => {
      newUrl += param + '=' + queryString[param];
    });
  }

  window.history.pushState('', '', newUrl );

  return platformBrowserDynamic([{provide: 'config', useValue: config }])
    .bootstrapModule(AppModule)
    .then(decorateModuleRef)
    .catch((err) => console.error(err));
}

// needed for hmr
// in prod this is replace for document ready
bootloader(main);
