import {TypedRecord, recordify} from 'typed-immutable-record';
import { List } from 'immutable';
import { ContractsFactory, IContract } from './contract';
import { ISignature, SignatureFactory, SignaturesFactory } from './signature';

export interface IDevice {
   lightClient: boolean;
   localhost: string;
   processing: boolean;
   deviceId: string;
   defaultSignature: ISignature;
   balance: string;
   signatures: List<ISignature> | ISignature[];
   contracts: List<IContract> | IContract[];
   deploymentAccount: string;
   deploymentPrice: string;
   cached: boolean;
}

export interface IDeviceRecord extends TypedRecord<IDeviceRecord>, IDevice {}

export const INITIAL_STATE = {
   lightClient: false,
   localhost: null,
   processing: false,
   deviceId: null,
   defaultSignature: SignatureFactory(null).toJS(),
   balance: "0",
   signatures: [],
   contracts: [],
   deploymentAccount: "",
   deploymentPrice: "",
   cached: false
};

export const INITIAL_RECORD = recordify<IDevice, IDeviceRecord>(INITIAL_STATE);

export function DeviceRecordFactory(device: IDevice = INITIAL_RECORD): IDeviceRecord {
   let record = INITIAL_RECORD.merge(device);

   return record.merge({
      defaultSignature: SignatureFactory(device.defaultSignature),
      signatures: SignaturesFactory(device.signatures),
      contracts: ContractsFactory(device.contracts)
   });
}




