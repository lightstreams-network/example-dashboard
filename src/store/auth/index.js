import get from 'lodash.get';
import { createAccountAction, unlockAccountAction, generateAccountAuthToken, getWeb3Engine } from '../keystore'
import { createUserDashboard, retrieveUserByUsername } from '../../services/dashboard';
import { Leth } from 'lightstreams-js-sdk';

const initialState = {
  user: {},
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

export function loggedUser({username, password, profileAddress, ethAddress}) {
  return {
    type: LOGGED_USER,
    payload: { username, password, profileAddress, ethAddress }
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
        const user = await createUserDashboard(web3, { username, ethAddress });
        dispatch(createdNewUser(username, ethAddress));
        dispatch(loggedUser({...user, password}));
        dispatch(updateAuthUserToken(user.ethAddress));
        resolve();
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
        dispatch(loggedUser({ ...user, password }));
        dispatch(updateAuthUserToken(user.ethAddress));
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
        const token = await Leth.Token.generateAuthToken(web3, { address: ethAddress, tokenBlocksLifespan: 1000 });
        dispatch(receiveToken(token));
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
        user: action.payload,
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
        user: {
          username: getSessionUsername(state)
        },
        addresses: state.addresses,
      };

    default:
      return state;
  }
};

export const getAuthenticatedUser = (state) => get(state, ['auth', 'user'], {});
export const getUserAddress = (state, username) => get(state, ['auth', 'addresses', username || ''], null);
export const getSessionPassword = (state) => get(state, ['auth', 'user', 'password'], null);
export const getSessionProfileAddress = (state) => get(state, ['auth', 'user', 'profileAddress'], null);
export const getSessionUsername = (state) => get(state, ['auth', 'user', 'username'], null);
export const getSessionEthAddress = (state) => get(state, ['auth', 'user', 'ethAddress'], null);
export const getUserToken = (state) => get(state, ['auth', 'token'], null);
export const isAuthenticated = (state) => (get(state, ['auth', 'token'], null) !== null);
export const getAuthErrors = (state) => get(state, ['auth', 'error'], null);