import { hGet, hPost } from '../../lib/fetch';
import  get from 'lodash.get';
import { PATH_SIGNUP, PATH_LOGIN } from '../../constants';


const initialState = {
    user: null,
    error: null,
    token: null
};


export const REQUEST_TOKEN = 'lsn/auth/REQUEST_TOKEN';
export function requestToken(username, password) {
    return {
        type: REQUEST_TOKEN,
        payload: {
            username,
            password
        }
    };
};

const RECEIVE_TOKEN = 'lsn/auth/RECEIVE_TOKEN';
function receiveToken(token) {
    return {
        type: RECEIVE_TOKEN,
        payload: token
    }
}

const RECEIVE_AUTH_ERROR = 'lsn/auth/RECEIVE_AUTH_ERROR';
export function receiveAuthError(error) {
    return {
        type: RECEIVE_AUTH_ERROR,
        payload: error
    };
}

export function login({ username, password }) {
    return (dispatch) => {
        return hPost(PATH_LOGIN, { username, password })
        .then((response) => {
            const { user, token } = response.data;
            dispatch(receiveToken(token));
            dispatch(receiveUser(user));
            return response.token;
        })
        .catch((error) => {
            dispatch(receiveAuthError(error));
            throw error;
        });
    }
}

const REQUEST_CREATE_USER = 'lsn/auth/REQUEST_CREATE_USER';
function requestCreateUser() {
    return {
        type: REQUEST_CREATE_USER,
        payload: null
    };
}

const REQUEST_USER = 'lsn/auth/REQUEST_USER';
export function requestUser() {
    return {
        type: REQUEST_USER,
        payload: null
    };
}

const RECEIVE_USER = 'lsn/auth/RECEIVE_USER';
export function receiveUser(user) {
    return {
        type: RECEIVE_USER,
        payload: user
    };
}

const CLEAR_STORED_STATE = 'lsn/auth/CLEAR_STORED_STATE';
export function clearStoredState() {
    return {
        type: CLEAR_STORED_STATE,
        payload: null
    }
}

export function fetchUserFromToken(token) {
    return (dispatch) => {
        dispatch(requestUser());

        return hGet('/profile', null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((user) => dispatch(receiveUser(user)))
        .catch((error) => {
            throw error;
        });
    };
}

export function createUser({ username, password }) {
    return (dispatch) => {
        dispatch(requestCreateUser());
        return hPost(PATH_SIGNUP, { username, password })
        .then((response) => {
            const { user, token } = response.data;
            dispatch(receiveToken(token));
            dispatch(receiveUser(user));
            return response;
        })
        .catch((error) => {
            debugger;
            dispatch(receiveAuthError(error));
            throw error;
        });
    }
}

export default function authReducer(state = initialState, action = {}) {
    switch (action.type) {
        case REQUEST_TOKEN:
            return {
                ...state,
                isFetching: true,
                error: null,
                lastRequestedAt: (new Date()).toISOString(),
            };
        case RECEIVE_TOKEN:
            return {
                ...state,
                isFetching: false,
                token: action.payload,
                error: null,
            };

        case RECEIVE_AUTH_ERROR:
            return {
                ...state,
                isFetching: false,
                error: action.payload
            };
        case REQUEST_CREATE_USER:
            return {
                ...state,
                isFetching: true,
                error: null,
            };
        case REQUEST_USER:
            return {
                ...state,
                user: {
                    ...state.user
                }
            };

        case RECEIVE_USER:
            return {
                ...state,
                user: action.payload
            };

        case CLEAR_STORED_STATE:
            return initialState;

        default:
            return state;
    }
};


export const getAuthenticatedUser = (state) => get(state, ['auth', 'user'], null)
export const getUserToken = (state) => get(state, ['auth', 'token'], null)
export const isAuthenticated = (state) => getAuthenticatedUser(state) !== null;
export const getAuthErrors = (state) => get(state, ['auth', 'error'], null)