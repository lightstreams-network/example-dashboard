import {
   ProfileRecordFactory, INITIAL_STATE, IProfileRecord, DevicesFactory, IDevice,
   DeviceFactory
} from '../state/profile';
import {ServerActions} from '../actions/server';
import {ProfileActions} from "../actions/profile";
import {AppActions} from "../actions/app";
import { List } from 'immutable';
import {parseDate} from "../utils";
import {SignaturesFactory} from "../state/signature";

export function profileReducer(
   state: IProfileRecord = ProfileRecordFactory(INITIAL_STATE),
   action: any = {type: ''}) {

   let devices = state.devices as List<IDevice>;

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

      case ProfileActions.UPDATE:

         return state.merge(action.payload);

      case ProfileActions.ADD_DEVICE:
         return state.merge({
            devices: devices.push(action.payload)
         });

      case ProfileActions.GET_DEVICES:
         return state.merge({
            devices: DevicesFactory(action.payload)
         });
   }

   return state;
}

export function parseDevices(plain: any[]): IDevice[] {
   return plain.map(s => parseDevice(s));
}

export function parseDevice(d: any): IDevice {
   d.createdAt = parseDate(d.createdAt);
   return DeviceFactory(d);
}
