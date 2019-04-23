import {TypedRecord, makeTypedFactory, recordify} from 'typed-immutable-record';
import { Map, List, fromJS } from 'immutable';
import {toTypedList, toRecordOrNull} from '../utils';

export interface IDocusignUserAccount {
   base_uri?: string;
   account_id?: string;
};

export interface IDocusignUser {
   accounts: List<IDocusignUserAccount> | IDocusignUserAccount[];
}

export interface IToken {
    expires_in: number;
    refresh_token: string;
    token_type: string;
    access_token: string;
}

export interface IDocusign {
    processing: boolean;
    authenticateUrl?: string;
    is_authenticated: boolean;
    user: IDocusignUser;
    token?: IToken;
    defaultAccount?: IDocusignUserAccount;
    accountDomain?: string;
}

const INITIAL_STATE : IDocusign = {
    processing: false,
    authenticateUrl: null,
    is_authenticated: false,
    user: {
        accounts: []
    },
    token: null,
    defaultAccount: null,
    accountDomain: null
};

export interface IDocusignUserAccountRecord extends TypedRecord<IDocusignUserAccountRecord>, IDocusignUserAccount {}
export interface IDocusignUserRecord extends TypedRecord<IDocusignUserRecord>, IDocusignUser {}
export interface ITokenRecord extends TypedRecord<ITokenRecord>, IToken {}
export interface IDocusignRecord extends TypedRecord<IDocusignRecord>, IDocusign {}

export const INITIAL_RECORD = recordify<IDocusign, IDocusignRecord>(INITIAL_STATE);

export function DocusignUserAccountFactory(userAccount: IDocusignUserAccount) {
    return toRecordOrNull<IDocusignUserAccount, IDocusignUserAccountRecord>(userAccount);
}

export function DocusignUserAccountsFactory(accounts: List<IDocusignUserAccount> | IDocusignUserAccount[]) {
    return toTypedList(accounts, (userAccount: IDocusignUserAccount) =>
        DocusignUserAccountFactory(userAccount)
    );
}

export function DocusignUserFactory(user: IDocusignUser) {
    return recordify<IDocusignUser, IDocusignUserRecord>({
        accounts: DocusignUserAccountsFactory(user.accounts)
    });
}

export function DocusignRecordFactory(docusign: IDocusign = INITIAL_RECORD): IDocusignRecord {
    let record = INITIAL_RECORD.merge(docusign);

    return record.merge({
        user: DocusignUserFactory(docusign.user),
        token: toRecordOrNull<IToken, ITokenRecord>(docusign.token),
        defaultAccount: DocusignUserAccountFactory(docusign.defaultAccount)
    });
}
