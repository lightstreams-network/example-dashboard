import get from 'lodash.get';
import { createAccountAction, unlockAccountAction } from '../keystore'

const initialState = {
    password: null,
    username: null,
    error: null,
    addresses: {}
};

const ACTION_IN_PROGRESS = 'lsn/auth/ACTION_IN_PROGRESS';

function fetchingInProgress() {
    return {
        type: ACTION_IN_PROGRESS,
        payload: null
    };
}

const LOGGED_USER = 'lsn/auth/LOGGED_USER';

export function loggedUser(username, password) {
    return {
        type: LOGGED_USER,
        payload: { username, password }
    };
}

const CREATE_NEW_USER = 'lsn/auth/CREATE_NEW_USER';

export function createdNewUser(username, ethAddress) {
    return {
        type: CREATE_NEW_USER,
        payload: { username, ethAddress }
    };
}

const CLEAR_STORED_STATE = 'lsn/auth/CLEAR_STORED_STATE';

export function clearStoredState() {
    return {
        type: CLEAR_STORED_STATE,
        payload: null
    };
}

export function createUser({ username, password }) {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch(fetchingInProgress(true));
            dispatch(createAccountAction(password))
                .then((ethAddress) => {
                    dispatch(createdNewUser(username, ethAddress));
                    dispatch(loggedUser(username, password));
                    resolve(ethAddress);
                })
                .catch((error) => {
                    dispatch(receiveAuthError(error));
                    reject(error);
                });
        });
    };
}

export function login({ username, password }) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const userAddr = getUserAddress(getState(), username);
            dispatch(unlockAccountAction(userAddr, password))
                .then((response) => {
                    dispatch(loggedUser(username, password));
                    resolve(response.token);
                })
                .catch((error) => {
                    if (error.response && typeof error.response.json === 'function') {
                        error.response.json().then(err => {
                            dispatch(receiveAuthError(err));
                            reject(new Error(err.message));
                        });
                    } else {
                        dispatch(receiveAuthError(error));
                        reject(error);
                    }
                });
        });
    };
}

export default function authReducer(state = initialState, action = {}) {
    switch ( action.type ) {
        case ACTION_IN_PROGRESS:
            return {
                ...state,
                inProgress: true,
            };
        case LOGGED_USER:
            return {
                ...state,
                username: payload.username,
                password: payload.password
            };
        case CREATE_NEW_USER:
            return {
                ...state,
                addresses: {
                    ...state.addresses,
                    [action.payload.username]: action.payload.address
                },
            };

        case CLEAR_STORED_STATE:
            return initialState;

        default:
            return state;
    }
};

export const getAuthenticatedUser = (state) => get(state, ['auth', 'username'], null);
export const getUserAddress = (state, username) => get(state, ['auth', 'addresses', username], null);
export const getUserToken = (state) => null;
export const isAuthenticated = (state) => getAuthenticatedUser(state) !== null;
export const getAuthErrors = (state) => get(state, ['auth', 'error'], null);