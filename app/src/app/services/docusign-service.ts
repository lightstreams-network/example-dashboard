import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {select} from 'ng2-redux';
import {IDocusignUserAccount, IDocusign} from '../store/state/docusign';
import {AppServer} from "./server/app-server";

export interface DocusignAccount {
   account_id: string;
   is_default: boolean;
   account_name: string;
   base_url: string;
}

@Injectable()
export class DocusignService {

   @select()
   docusign$: Observable<IDocusign>;

   accountDomain: string;
   accountId: string;

   constructor(
      private serverService: AppServer
   ) {
      this.docusign$.subscribe(docusign => {
         this.accountDomain = docusign.accountDomain;
         this.accountId = docusign.defaultAccount && docusign.defaultAccount.account_id;
      });
   }

   public authenticate(redirect: string): Promise<any> {
      return this.serverService.get('/docusign/authenticate?redirect=' + redirect);
   }

   public getUser(): Promise<any> {
      return this.serverService.get('/docusign/user');
   }

   public logout() {
      return this.serverService.get('/docusign/logout');
   }

   public getTemplates() {
      let data = {
         accountDomain: this.accountDomain,
         accountId: this.accountId
      };
      return this.serverService.post('/docusign/templates', data);
   }

   public getDocumentPageImage(envelopeId: string, documentId: string, pageNumber: number) {
      let data = {
         accountDomain: this.accountDomain,
         accountId: this.accountId,
         envelopeId: envelopeId,
         documentId: documentId,
         pageNumber: pageNumber,
      };
      //return this.serverService.getImage('/docusign/pageImage', data);
   }
}
