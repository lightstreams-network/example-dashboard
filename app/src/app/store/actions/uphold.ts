import {Injectable} from '@angular/core';
import {NgRedux} from 'ng2-redux';
import {IAppState} from '../app-state';
import {UpholdService} from '../../services/uphold-service';
import {ActionsDispatcher} from '../actions-dispatcher';

@Injectable()
export class UpholdActions {
    static AUTHENTICATE = 'AUTHENTICATE';
    static LOG_OUT = 'LOG_OUT';
    static NEW_PAYMENT = 'NEW_PAYMENT';
    static GET_USER = 'GET_USER';
    static GET_CARDS = 'GET_CARDS';
    static EXECUTE_TRANSACTION = 'EXECUTE_TRANSACTION';

    constructor(private actions: ActionsDispatcher,
                private service: UpholdService) {
    }

    authenticate(redirect: string) {
        this.service.authenticate(redirect)
            .then((url: string) => {
                this.actions.dispatch(UpholdActions.AUTHENTICATE);
                window.location.href = url;
            })
            .catch(err => this.handleError(err));
    }

    logout(cb) {
        this.service.logout()
            .then(result => this.actions.dispatch(UpholdActions.LOG_OUT))
            .then(cb())
            .catch(err => this.handleError(err));
    }

    getUser() {
        this.service.getUser()
            .then(result => this.actions.dispatch(UpholdActions.GET_USER, result))
            .catch(err => this.handleError(err));
    }

    getCards() {
        this.service.getCards()
            .then(result => this.actions.dispatch(UpholdActions.GET_CARDS, result))
            .catch(err => this.handleError(err));
    }

    newPayment() {
        this.actions.dispatch(UpholdActions.NEW_PAYMENT);
    }

    execute(transaction: any, cb) {
        this.service.execute(transaction)
            .then(result => this.actions.dispatch(UpholdActions.EXECUTE_TRANSACTION, result))
            .then(cb(null))
            .catch(err => {
                cb(err);
                this.handleError(err);
            });
    }

    handleError(err) {
        console.log(err);
    }
}
