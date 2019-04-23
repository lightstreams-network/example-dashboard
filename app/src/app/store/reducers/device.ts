import { ServerActions } from '../actions/server';
import { AppActions } from '../actions/app';
import { List } from 'immutable';
import { DeviceRecordFactory, IDeviceRecord, INITIAL_STATE } from '../state/device';
import { IPayloadAction } from '../root-reducer';
import { DeviceActions } from '../actions/device';
import { IContract } from '../state/contract';
import { ISignature, SignatureFactory, SignaturesFactory } from '../state/signature';

export function deviceReducer(state: IDeviceRecord = DeviceRecordFactory(INITIAL_STATE),
                              action: IPayloadAction) {

   let signatures = state.signatures as List<ISignature>;
   let contracts = state.contracts as List<IContract>;

   switch (action.type) {
      case AppActions.RESET:
         return state.merge({
            processing: false
         });

      case ServerActions.REQUEST_PENDING:
         return state.merge({
            processing: true
         });

      case ServerActions.REQUEST_COMPLETE:
         return state.merge({
            processing: false
         });

      case AppActions.CHANGE_DEVICE:
         state = state.merge(action.payload);
         return state.merge({
            defaultSignature: SignatureFactory(action.payload.defaultSignature)
         });

      case DeviceActions.GET_BALANCE:
         return state.merge({
            balance: action.payload
         });

      case DeviceActions.ADD_SIGNATURES:
         return state.merge({
            signatures: SignaturesFactory(action.payload)
         });

      case DeviceActions.NEW_SIGNATURE:
         return state.merge({
            signatures: signatures.push(SignatureFactory(action.payload))
         });

      case DeviceActions.ADD_CONTRACT:
         let indexedContracts = contracts.reduce((acc, cur) => {
            let addr = typeof cur['get'] === 'function' ? cur['get']('metaAddr') : cur.metaAddr;
            acc[addr] = cur;
            return acc;
         }, {});

         indexedContracts[action.payload.metaAddr] = action.payload;
         return state.merge({
            contracts: Object.keys(indexedContracts).map((key) => indexedContracts[key])
         });

      default:
         return state;
   }
}
