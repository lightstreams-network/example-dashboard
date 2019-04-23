import { IPayloadAction } from '../root-reducer';
import { ContractActions } from "../actions/contract";
import {
   ContractRecordFactory,
   contractState,
   IContractRecord,
   INITIAL_RECORD,
   IPermission,
   PermissionsFactory,
   PrivateStateChainFactory,
   PurchaseReceiptFactory
} from "../state/contract";
import { List } from "immutable";

export function contractReducer(state: IContractRecord = INITIAL_RECORD,
                                action: IPayloadAction): IContractRecord {

   let payload = action.payload;
   let permissions = state.permissions as List<IPermission>;

   switch (action.type) {
      case ContractActions.RESET:
         return state.merge(ContractRecordFactory(null));

      case ContractActions.ERROR:
         return state.merge({
            state: contractState.ERROR,
            error: payload
         });

      case ContractActions.GENERATING_OWNER_KEY:
         return state.merge({
            state: contractState.GENERATING_OWNER_KEY,
            statusLog: state.statusLog.push('Generating a new signature...')
         });

      case ContractActions.PAYING_DEPLOYMENT_FEE:
         return state.merge({
            state: contractState.PAYING_FEE,
            statusLog: state.statusLog.push('Paying fee...')
         });

      case ContractActions.CREATE:
         return state.merge({
            state: contractState.CREATING,
            statusLog: state.statusLog.push('Creating contract...')
         });

      case ContractActions.GENERATING_CONTRACT_KEY:
         console.log(state.statusLog);
         return state.merge({
            state: contractState.GENERATING_CONTRACT_KEY,
            statusLog: state.statusLog.push('Setting up permissions...')
         });

      case ContractActions.CREATED:
         state = ContractRecordFactory(payload);

         return state.merge({
            state: contractState.CREATED
         });

      case ContractActions.READY:
         return state.merge({
            state: contractState.READY
         });

      case ContractActions.NEW_TERMS:
         return state.merge({
            state: contractState.READY,
            termsAddr: payload
         });

      case ContractActions.SIGN:
         return state.merge({
            state: contractState.SIGNING
         });

      case ContractActions.SIGNED:
         return state.merge({
            state: contractState.SIGNED
         });

      case ContractActions.LOADED:
         state = ContractRecordFactory(payload);

         return state.merge({
            state: contractState.SIGNED,
            loaded: true
         });

      case ContractActions.PERMISSION_GRANTED:
         return state.merge({
            permissions: PermissionsFactory(payload)
         });

      case ContractActions.UNLOCK:
         return state.merge({
            state: contractState.UNLOCKING,
            unlocked: true
         });

      case ContractActions.PURCHASED:
         return state.merge({
            purchaseReceipt: PurchaseReceiptFactory(payload)
         });

      case ContractActions.UNLOCKED:
         return state.merge({
            state: contractState.UNLOCKED,
            privateStateChain: PrivateStateChainFactory(payload.privateStateChain),
            unlocked: true
         });

      default:
         return state;
   }
}
