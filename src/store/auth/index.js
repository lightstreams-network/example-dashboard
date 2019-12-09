import get from 'lodash.get';
import { createAccountAction, unlockAccountAction, generateAccountAuthToken } from '../keystore'

const initialState = {
    password: null,
    username: null,
    token: null,
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
        payload: { username, address: ethAddress }
    };
}

const RECEIVE_TOKEN = 'lsn/auth/RECEIVE_TOKEN';
export function receiveToken(token) {
    return {
        type: RECEIVE_TOKEN,
        payload: token
    };
}

const CLEAR_STORED_STATE = 'lsn/auth/CLEAR_STORED_STATE';
export function clearStoredState() {
    return {
        type: CLEAR_STORED_STATE,
        payload: null
    };
}

const RECEIVE_AUTH_ERROR = 'lsn/auth/RECEIVE_AUTH_ERROR';
export function receiveAuthError(error) {
    return {
        type: RECEIVE_AUTH_ERROR,
        payload: typeof error === 'string' ? error : error.message
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
                    return dispatch(generateAccountAuthToken(ethAddress))
                })
                .then((token) => {
                    dispatch(receiveToken(token));
                })
                .then(resolve)
                .catch((error) => {
                    console.error(error);
                    dispatch(receiveAuthError(error));
                    reject(error);
                });
        });
    };
}

export function login({ username, password }) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const ethAddress = getUserAddress(getState(), username);
            if(!ethAddress) {
                const errMsg = `User ${username} is not registered`;
                dispatch(receiveAuthError(errMsg));
                reject(new Error(errMsg));
                return;
            }

            dispatch(unlockAccountAction(ethAddress, password))
                .then(() => {
                    dispatch(loggedUser(username, password));
                    return dispatch(generateAccountAuthToken(ethAddress))
                })
                .then((token) => {
                    dispatch(receiveToken(token));
                })
                .then(resolve)
                .catch((error) => {
                    if (error.response && typeof error.response.json === 'function') {
                        error.response.json().then(err => {
                            dispatch(receiveAuthError(err));
                            reject(new Error(err.message));
                        });
                    } else {
                        console.error(error);
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
                error: null,
                inProgress: false,
                username: action.payload.username,
                password: action.payload.password
            };
        case CREATE_NEW_USER:
            return {
                ...state,
                error: null,
                inProgress: false,
                addresses: {
                    ...state.addresses,
                    [action.payload.username]: action.payload.address
                },
            };

        case RECEIVE_TOKEN:
            return {
                ...state,
                inProgress: false,
                error: null,
                token: action.payload
            };

        case RECEIVE_AUTH_ERROR:
            return {
                ...state,
                inProgress: false,
                error: action.payload
            };

        case CLEAR_STORED_STATE:
            return {
                ...initialState,
                addresses: state.addresses,
                username: state.username
            };

        default:
            return state;
    }
};

export const getAuthenticatedUser = (state) => get(state, ['auth', 'username'], null);
export const getUserAddress = (state, username) => get(state, ['auth', 'addresses', username], null);
export const getUserToken = (state) => get(state, ['auth', 'token'], null);
export const isAuthenticated = (state) => (get(state, ['auth', 'token'], null) !== null);
export const getAuthErrors = (state) => get(state, ['auth', 'error'], null);