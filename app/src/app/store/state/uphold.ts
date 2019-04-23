import {TypedRecord, recordify} from 'typed-immutable-record';
import { List } from 'immutable';

export interface IUphold {
    processing: boolean;
    is_authenticated: boolean;
    user?: any;
    cards: List<any> | any[];
    transactionReceipt?: any;
}

export const INITIAL_STATE: IUphold = {
    processing: false,
    is_authenticated: false,
    user: null,
    cards: [],
    transactionReceipt: null
};

export interface IUpholdRecord extends TypedRecord<IUpholdRecord>, IUphold {}

export function UpholdRecordFactory(uphold: IUphold): IUpholdRecord {
    if (!uphold) {
        return recordify<IUphold, IUpholdRecord>(INITIAL_STATE, uphold);
    }

    /*return recordify<IUphold, IUpholdRecord>({
        is_authenticated: uphold.is_authenticated || INITIAL_STATE.is_authenticated,
        user: user,
        token: token
    });*/

    return recordify<IUphold, IUpholdRecord>(uphold);
}
