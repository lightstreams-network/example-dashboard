import { routerReducer } from 'ng2-redux-router';
import {Action, combineReducers} from 'redux';
import {IAppState} from './app-state';
import {sessionReducer} from './reducers/session';
import {docusignReducer} from './reducers/docusign';
import {upholdReducer} from './reducers/uphold';
import {profileReducer} from "./reducers/profile";
import {contractReducer} from "./reducers/contract";
import {blockchainReducer} from "./reducers/blockchain";
import {deviceReducer} from "./reducers/device";

export interface IPayloadAction extends Action {
    payload?: any;
}

let combinedReducers = combineReducers<IAppState>({
    router: routerReducer,
    session: sessionReducer,
    device: deviceReducer,
    profile: profileReducer,
    contract: contractReducer,
    docusign: docusignReducer,
    uphold: upholdReducer,
    blockchain: blockchainReducer
});

export const rootReducer = (state, action) : IAppState  => {
    if (action.type === 'RESTORE') {
        return state.merge(action.payload);
    }

    return combinedReducers(state, action);
};
