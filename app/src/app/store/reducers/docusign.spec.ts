import {
    IDocusignUserAccount, DocusignRecordFactory, IDocusignUserRecord, INITIAL_RECORD, DocusignUserFactory
} from '../state/docusign';
import { Map, List, fromJS } from 'immutable';
import {docusignReducer} from './docusign';
import {IPayloadAction} from '../root-reducer';
import {DocusignActions} from '../actions/docusign';

describe('IDocusign', () => {
    describe('DocusignRecordFactory', () => {
        let docusign: any = {
            processing: false,
            is_authenticated: true
        };

        it('should create a typed immutable record', () => {
            docusign.user = {
                    accounts: [{base_uri: 'uri', account_id: '12345'}]
                };
            docusign.token = {
                    expires_in: 1234,
                    refresh_token: 'xxxx',
                    token_type: 'type',
                    access_token: 'zzzz'
                };

            let docusignRecord = DocusignRecordFactory(docusign);

            let userRecord = docusignRecord.user as IDocusignUserRecord;
            let accounts = userRecord.accounts as List<IDocusignUserAccount>;

            accounts.forEach(account => {
                expect(account.base_uri).toBe('uri');
                expect(account.account_id).toBe('12345');
            });

            userRecord = userRecord.merge({
                accounts: [{base_uri: 'xxx', account_id: '12345'}]
            });

            docusignRecord = docusignRecord.merge({
                user: userRecord
            });

            let result = docusignRecord.toJS();
            let user = result.user;

            expect(result.token.expires_in).toBe(1234);
            expect(user.accounts.length).toBe(1);
            expect(user.accounts[0].account_id).toBe('12345');
            expect(user.accounts[0].base_uri).toBe('xxx');
        });

        it('should create a typed immutable record with null token', () => {
            docusign.user = {
                    accounts: [{base_uri: 'uri', account_id: '12345'}]
                };
            docusign.token = null;

            let docusignRecord = DocusignRecordFactory(docusign);
            let result = docusignRecord.toJS();
            let user = result.user;

            expect(result.token).toBeNull();
            expect(user.accounts.length).toBe(1);
        });

        /*it('should create a typed immutable record with null user', () => {
            docusign.user = null;

            let docusignRecord = DocusignRecordFactory(docusign);
            let result = docusignRecord.toJS();
            let user = result.user;

            expect(user.accounts.length).toBe(0);
        });*/

        it('should create a typed immutable record with empty user account', () => {
            docusign.user = {
                    accounts: [{}]
                };
            let docusignRecord = DocusignRecordFactory(docusign);
            let result = docusignRecord.toJS();
            let user = result.user;

            expect(user.accounts.length).toBe(1);
        });

        it('should merge users', () => {
            let user = {
                accounts: [{base_uri: 'uri', account_id: '12345'}]
            };

            let docusignRecord = INITIAL_RECORD.merge({
                user: DocusignUserFactory(user)
            });

            let userRecord = docusignRecord.user as IDocusignUserRecord;
            let accounts = userRecord.accounts as List<IDocusignUserAccount>;

            accounts.forEach(account => {
                expect(account.base_uri).toBe('uri');
                expect(account.account_id).toBe('12345');
            });
        });

        it('should set the default account', () => {
            docusign.user = {
                accounts: [{base_uri: 'https://demo.docusign.net', account_id: '12345'}]
            };

            let action: IPayloadAction = {'type': '', payload: {}};
            action.type = DocusignActions.GET_USER;
            action.payload = docusign.user;

            let docusignRecord = docusignReducer(INITIAL_RECORD, action);

            let userRecord = docusignRecord.user as IDocusignUserRecord;
            let accounts = userRecord.accounts as List<IDocusignUserAccount>;

            let account = accounts.get(0);

            action.type = DocusignActions.SET_DEFAULT_ACCOUNT;
            action.payload = account;

            docusignRecord = docusignReducer(docusignRecord, action);
            expect(docusignRecord.defaultAccount.base_uri).toBe('https://demo.docusign.net');
            expect(docusignRecord.accountDomain).toBe('demo.docusign.net');

        });
    });
});
