import {Injectable} from '@angular/core';
import {AppServer} from "./server/app-server";

@Injectable()
export class SessionService {
   constructor(private service: AppServer) {
   }

   /*public refreshToken(): Promise<any> {
      return this.service.post('/auth/token', {grantType: 'bearer'});
   }*/

   public getToken(state: string): Promise<any> {
      return this.service.post('/auth/token', {state: state});
   }

   public validateLocalToken(req: any): Promise<any> {
      return this.service.post('/auth/validate', req);
   }

   /*public validateLocalToken(token: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
    this.service.post('/auth/validate', {token: token})
    .then(() => resolve('xxxx'))
    .catch(() => resolve(null));
    });
    }*/
}
