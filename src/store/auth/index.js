import get from 'lodash.get';
import { createAccountAction, unlockAccountAction, generateAccountAuthToken, getWeb3Engine } from '../keystore'
import { createUserDashboard, retrieveUserByUsername } from '../../services/dashboard';
import { generateAuthToken } from "lightstreams-js-sdk/src/token";

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
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        dispatch(fetchingInProgress(true));
        const ethAddress = await dispatch(createAccountAction(password));
        const web3 = getWeb3Engine(getState());
        await createUserDashboard(web3, { username, ethAddress });
        dispatch(createdNewUser(username, ethAddress));
        dispatch(loggedUser(username, password));
        dispatch(updateAuthUserToken(ethAddress));
        resolve();
      } catch ( error ) {
        console.error(error);
        dispatch(receiveAuthError(error));
        reject(error);
      }
    });
  };
}

export function updateAuthUserToken(ethAddress) {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        const web3 = getWeb3Engine(getState());
        const token = await generateAuthToken(web3, { address: ethAddress, tokenBlocksLifespan: 1000 });
        dispatch(receiveToken(token));
      } catch ( error ) {
        console.error(error);
        dispatch(receiveAuthError(error));
        reject(error);
      }
    });
  };
}

export function login({ username, password }) {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        const web3 = getWeb3Engine(getState());
        const user = await retrieveUserByUsername(web3, { username });
        if (!user) {
          const errMsg = `User ${username} is not registered`;
          dispatch(receiveAuthError(errMsg));
          reject(new Error(errMsg));
          return;
        }

        await dispatch(unlockAccountAction(user.ethAddress, password));
        dispatch(loggedUser(username, password));
        dispatch(updateAuthUserToken(user.ethAddress));
      } catch ( error ) {
        console.error(error);
        dispatch(receiveAuthError(error));
        reject(error);
      }
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

export const getAuthenticatedUser = (state) => ({
  username: get(state, ['auth', 'username'], null),
  password: getUserPassword(state, get(state, ['auth', 'username'], null)),
  ethAddress: getUserAddress(state, get(state, ['auth', 'username'], null))
});
export const getAuthenticatedUserAddress = (state) => getUserAddress(state, get(state, ['auth', 'username'], null));
export const getUserAddress = (state, username) => get(state, ['auth', 'addresses', username || ''], null);
export const getUserPassword = (state, username) => get(state, ['auth', 'password', username || ''], null);
export const getUserToken = (state) => get(state, ['auth', 'token'], null);
export const isAuthenticated = (state) => (get(state, ['auth', 'token'], null) !== null);
export const getAuthErrors = (state) => get(state, ['auth', 'error'], null);