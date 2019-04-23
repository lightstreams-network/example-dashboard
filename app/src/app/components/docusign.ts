import {Component} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';

@Component({
   selector: 'docusign',
   template: `
    <button (click)="signIn()">Docusign</button>
  `
})
export class Docusign {
   constructor(private http: Http) {

   }

   signIn() {

      let docusignUrl = 'https://account-d.docusign.com/oauth/auth';
      let integratorKey = 'e8955f08-09d7-41b5-b909-a3523d81ab03';
      let state = 'xxx';
      let redirectUri = `${window.location.origin}/docusign`;
      let response_type = 'code';
      let scope = 'signature';

      let url = `${docusignUrl}?` +
         `response_type=${response_type}&` +
         `scope=${scope}&` +
         `client_id=${integratorKey}&` +
         `state=${state}&` +
         `redirect_uri=${redirectUri}`;

      window.location.href = url;
   }

   revoke() {
      let url = 'https://account-d.docusign.com/restapi/v2/oauth2/revoke';
      let headers = new Headers();
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Access-Control-Allow-Methods', 'DELETE, HEAD, GET, OPTIONS, POST, PUT');
      headers.append('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, ' +
         'Content-Range, Content-Disposition, Content-Description');
      // headers.append('', '');

      /*this.http.post(url, '')
         .map(this.extractData)
         .catch(this.handleError)
         .subscribe(
            data => {
               console.log(data);
            },
            error => {
               console.log(error);
            }
         );*/
   }

   private extractData(res: Response) {
      let body = res.json();
      return body.data || { };
   }

   private handleError (error: any) {
      // In a real world app, we might use a remote logging infrastructure
      // We'd also dig deeper into the error to get a better message
      let errMsg = (error.message) ? error.message :
         error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
      return Observable.throw(errMsg);
   }
}
