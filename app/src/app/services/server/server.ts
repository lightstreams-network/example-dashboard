import { Http, Response, Headers, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';
import {ActionsDispatcher} from '../../store/actions-dispatcher';
import {ServerActions} from '../../store/actions/server';
import {Observable} from 'rxjs/Rx';
import {SessionState} from '../../store/state/session';
import { fromJS } from 'immutable';

export class Server {

   public baseUrl: string;

   constructor(private _http: Http,
               private actions: ActionsDispatcher,
               private responseHandler: IResponseHandler) {
   }

   public post(path, data): Promise<any> {
      let req = this.requestPending('POST', path, data);
      let stream = this._http.post(
            req.url,
            JSON.stringify(data),
            {headers: this.responseHandler.createHeaders()})
         .map((res: Response) => this.responseHandler.onComplete(req, res));

      return this.toPromise(req, stream);
   }

   public get(path): Promise<any>  {
      let req = this.requestPending('GET', path);

      // RC5 workaround: need to set body to empty string
      // See: https://github.com/angular/angular/issues/10612
      let stream = this._http.get(
            req.url,
            {
               headers: this.responseHandler.createHeaders(),
               body: ''
            })
         .map((res: Response) => this.responseHandler.onComplete(req, res));

      return this.toPromise(req, stream);
   }

   public getBlob(path, token): Promise<any>  {
      let req = this.requestPending('GET', path);

      let headers = this.responseHandler.createHeaders();
      headers.append('Authorization', token);

      let stream = this._http.get(
          req.url,
          {
             headers,
             responseType: ResponseContentType.Blob
          });

      return this.toPromise(req, stream);
   }

   public patch(path, id, data): Promise<any>  {
      let req = this.requestPending('PATCH', path, data, id);

      let stream = this._http.patch(
          req.url,
          JSON.stringify(data),
          {headers: this.responseHandler.createHeaders()})
          .map((res: Response) => this.responseHandler.onComplete(req, res));

      return this.toPromise(req, stream);
   }

   public put(path, id, data): Promise<any>  {
      let req = this.requestPending('PUT', path, data, id);

      let stream = this._http.put(
            req.url,
            JSON.stringify(data),
            {headers: this.responseHandler.createHeaders()})
         .map((res: Response) => this.responseHandler.onComplete(req, res));

      return this.toPromise(req, stream);
   }

   public delete(path, id): Promise<any> {
      let req = this.requestPending('DELETE', path, null, id);

      let stream =  this._http.put(req.url,
         {headers: this.responseHandler.createHeaders()})
         .map((res: Response) => this.responseHandler.onComplete(req, res));

      return this.toPromise(req, stream);
   }

   private requestPending(method: string, path: string, data?: any, id?: string): any {
      let url = `${this.baseUrl}${path}`;
      if (id) {
         url = `${url}/${id}`;
      }
      let req = {
         method: method,
         url: url
      };

      if (data) {
         req['body'] = data;
      }

      this.actions.dispatch(ServerActions.REQUEST_PENDING, req);

      return req;
   }

   private toPromise(request: any, stream: Observable<any>) {
      return stream.toPromise().catch((error => {
         let requestClone = fromJS(request);
         requestClone = requestClone.merge({error: error});

         this.actions.dispatch(ServerActions.ERROR, requestClone.toJS());

         throw error;
      }));
   }
}

export interface IResponseHandler {
   onComplete(request: any, response: Response);
   createHeaders(): Headers;
}

export class ServerResponseHandler implements IResponseHandler {
   constructor(private actions: ActionsDispatcher,
               private sessionState: SessionState) {
   }

   public createHeaders(): Headers {
      let sessionState = this.sessionState;
      let token = sessionState &&  sessionState.session && sessionState.session.token || null;

      let headers = new Headers({
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         'Access-Control-Allow-Origin': '*'
      });

      if (token) {
         headers.append('Authorization', `Bearer ${token}`)
      }

      return headers;
   }

   public onComplete(request: any, response: Response): any {
      let resObj = response.json();

      let payload = {
         request: request,
         response: response,
         data: resObj.data
      };
      this.actions.dispatch(ServerActions.REQUEST_COMPLETE, payload);

      if (!resObj.success) {
         throw(resObj.error);
      }

      return resObj.data;
   }
}
