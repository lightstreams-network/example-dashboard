import {Injectable} from '@angular/core';
import {DocusignService} from '../../services/docusign-service';
import {ActionsDispatcher} from '../actions-dispatcher';

@Injectable()
export class DocusignActions {
   static AUTHENTICATE = 'AUTHENTICATE';
   static LOG_OUT = 'LOG_OUT';
   static GET_USER = 'GET_USER';
   static GET_TEMPLATES = 'GET_TEMPLATES';
   static SET_DEFAULT_ACCOUNT = 'SET_DEFAULT_ACCOUNT';
   static GET_DOCUMENT_IMAGE = 'GET_DOCUMENT_IMAGE';

   constructor(
      private actions: ActionsDispatcher,
      private service: DocusignService) {}

   authenticate(redirect: string) {
      this.actions.dispatchAsync(
          DocusignActions.AUTHENTICATE,
          () => this.service.authenticate(redirect),
          (err, url) => window.location.href = url
      );
   }

   logout() {
      this.service.logout()
         .then(result => this.actions.dispatch(DocusignActions.LOG_OUT));
   }

   getUser() {
      this.actions.dispatchAsync(
          DocusignActions.GET_USER,
          () => this.service.getUser()
      );
   }

   setDefaultAccount(account: any) {
      this.actions.dispatch(DocusignActions.SET_DEFAULT_ACCOUNT, account);
   }

   getTemplates() {
      this.actions.dispatchAsync(
          DocusignActions.GET_TEMPLATES,
          () => this.service.getTemplates()
      );
   }

   getDocumentPageImage(envelopeId: string, documentId: string, pageNumber: number, next) {
      this.actions.dispatchAsync(
          DocusignActions.GET_DOCUMENT_IMAGE,
          () => this.service.getDocumentPageImage(envelopeId, documentId, pageNumber),
          next
      );
   }
}
