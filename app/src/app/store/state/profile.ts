import {TypedRecord, recordify} from 'typed-immutable-record';
import { List } from 'immutable';
import {toRecordOrNull, toTypedList, sanitizedMerge} from "../utils";

export interface IDevice {
    id: string;
    name: string;
    publicKey: string;
    createdAt: Date;
    updatedAt: Date;
}

export const INITIAL_DEVICE_STATE: IDevice = {
    id: null,
    name: '',
    publicKey: '',
    createdAt: new Date(),
    updatedAt: new Date()
};

export interface IProfile {
    processing: boolean;
    publicKey: string;
    username: string;
    firstName: string;
    lastName: string;
    pictureUrl: string;
    devices: List<IDevice> | IDevice[];
}

export const INITIAL_STATE: IProfile = {
    processing: false,
    publicKey: null,
    username: null,
    firstName: null,
    lastName: null,
    pictureUrl: '',
    devices: []
};

export interface IProfileRecord extends TypedRecord<IProfileRecord>, IProfile {}
export interface IDeviceRecord extends TypedRecord<IDeviceRecord>, IDevice {}

export const INITIAL_DEVICE_RECORD = recordify<IDevice, IDeviceRecord>(INITIAL_DEVICE_STATE);
export const INITIAL_RECORD = recordify<IProfile, IProfileRecord>(INITIAL_STATE);

export function DeviceFactory(device: IDevice) {
    let record = recordify<IDevice, IDeviceRecord>(INITIAL_DEVICE_STATE);
    if (!device) {
        return record;
    }

    return sanitizedMerge(device, record);
}

export function DevicesFactory(devices: List<IDevice> | IDevice[]) {
    return toTypedList(devices, (d: IDevice) =>
        DeviceFactory(d)
    );
}

export function ProfileRecordFactory(profile: IProfile = INITIAL_RECORD): IProfileRecord {
    let record = INITIAL_RECORD.merge(profile);

    return record.merge({
        devices: DevicesFactory(profile.devices),
    });
}
