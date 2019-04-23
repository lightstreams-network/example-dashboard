import {IPayloadAction} from '../root-reducer';
import {DocusignActions} from '../actions/docusign';
import {
    IDocusignRecord, INITIAL_RECORD, DocusignUserFactory, DocusignUserAccountFactory
} from '../state/docusign';
import {ServerActions} from '../actions/server';

export function docusignReducer(
   state: IDocusignRecord = INITIAL_RECORD,
   action: IPayloadAction): IDocusignRecord {

   let payload = action.payload;

   switch (action.type) {
      case ServerActions.REQUEST_PENDING:
         return state.merge({
            processing: true
         });

      case ServerActions.REQUEST_COMPLETE:
         return state.merge({
            processing: false
         });

      case DocusignActions.AUTHENTICATE:
         return state.merge({
            authenticateUrl: payload
         });

      case DocusignActions.LOG_OUT:
         return state.merge(INITIAL_RECORD);

      case DocusignActions.GET_USER:
         return state.merge({
            is_authenticated: true,
            user: DocusignUserFactory(payload)
         });

      case DocusignActions.SET_DEFAULT_ACCOUNT:
         return state.merge({
            defaultAccount: payload,
            accountDomain: getDomain(payload.base_uri)
         });

      case DocusignActions.GET_TEMPLATES:
         console.log(payload);
         return state;

      default:
         return state;
   }
}

function getDomain(url) {
   url = url.replace(/(https?:\/\/)?(www.)?/i, '');

   if (url.indexOf('/') !== -1) {
      return url.split('/')[0];
   }

   return url;
}
