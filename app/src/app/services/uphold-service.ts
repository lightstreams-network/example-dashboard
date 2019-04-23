import { Injectable } from '@angular/core';
import { AppServer } from './server/app-server';

@Injectable()
export class UpholdService {

   constructor(private service: AppServer) {
   }

   public authenticate(redirect: string) {
      return this.service.get('/uphold/authenticate?redirect=' + redirect);
   }

   public getUser() {
      return this.service.get('/uphold/user');
   }

   public getCards() {
      return this.service.get('/uphold/cards');
   }

   public execute(transaction) {
      return this.service.post('/uphold/transaction', {transaction});
   }

   public logout() {
      return this.service.get('/uphold/logout');
   }
}
