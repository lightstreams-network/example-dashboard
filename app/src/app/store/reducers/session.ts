import {IPayloadAction} from '../root-reducer';
import {sessionState, ISessionRecord, SessionFactory} from '../state/session';
import {AppActions} from "../actions/app";
import {ServerActions} from "../actions/server";

export function sessionReducer(
    state: ISessionRecord = SessionFactory(),
    action: IPayloadAction): ISessionRecord {

    let payload = action.payload;

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

        case ServerActions.ERROR:
            return state.merge({
                processing: false
            });

        case AppActions.TOKEN:
            return state.merge({
                state: sessionState.AUTHENTICATED,
                token: payload.token
            });

        case AppActions.LOCAL_TOKEN:
            return state.merge({
                localToken: payload.localToken
            });

        case AppActions.DEVICE_NOT_VALIDATED:
            return state.merge({
                state: sessionState.DEVICE_NOT_REGISTERED
            });

        default:
            return state;
    }
}
