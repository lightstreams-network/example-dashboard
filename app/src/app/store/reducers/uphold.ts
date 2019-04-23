import {UpholdActions} from '../actions/uphold';
import {UpholdRecordFactory, INITIAL_STATE, IUpholdRecord} from '../state/uphold';
import {ServerActions} from '../actions/server';

export function upholdReducer(
   state: IUpholdRecord = UpholdRecordFactory(INITIAL_STATE),
   action: any = {type: ''}) {

   switch (action.type) {
      case ServerActions.REQUEST_PENDING:
         return state.merge({
            processing: true
         });

      case ServerActions.REQUEST_COMPLETE:
         return state.merge({
            processing: false
         });

      case UpholdActions.NEW_PAYMENT:
         return state.merge({
            transactionReceipt: null
         });

      case UpholdActions.LOG_OUT:
         return state.merge(INITIAL_STATE);

      case UpholdActions.GET_USER:
         state = state.merge({
            user: action.payload
         });
         break;

      case UpholdActions.GET_CARDS:
         state = state.merge({
            cards: action.payload
         });
         break;

      case UpholdActions.EXECUTE_TRANSACTION:
         return state.merge({
            transactionReceipt: action.payload
         });
   }

   if (state.user && state.cards) {
      state = state.merge({
         is_authenticated: true,
      });
   }

   return state;
}
