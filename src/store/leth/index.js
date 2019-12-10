import get from 'lodash.get';
import { createAction, createReducer } from 'redux-act';
import { hGet, hPost } from '../../lib/fetch';
import { Gateway, Web3 } from 'lightstreams-js-sdk'

import {
  PATH_ITEM_DOWNLOAD,
  PATH_ITEM_LIST,
  PATH_ITEM_ADD,
  PATH_PERMISSION_GRANT,
  PATH_PERMISSION_REVOKE,
  PATH_PERMISSION_REQUEST
} from '../../constants/routes';
import { downloadFile } from '../../lib/downloader';

import { gatewayCfg } from '../../constants/config';
import { uploadNewItem } from '../../services/profile';
import { getUserFileList } from '../../services/dashboard';
import { getWeb3Engine } from '../keystore'
import { getSessionUsername } from '../auth'

const initialState = {
  files: {},
  balance: null,
  error: null
};

const REQ_LETH_WALLET_BALANCE = 'lsn/leth/REQ_LETH_WALLET_BALANCE';
const requestLethWalletBalance = createAction(REQ_LETH_WALLET_BALANCE);

const RES_LETH_WALLET_BALANCE = 'lsn/leth/RES_LETH_WALLET_BALANCE';
const responseLethWalletBalance = createAction(RES_LETH_WALLET_BALANCE);

const REQ_LETH_ITEM_LIST = 'lsn/leth/REQ_LETH_ITEM_LIST';
const requestLethItemList = createAction(REQ_LETH_ITEM_LIST);

const RES_LETH_ITEM_LIST = 'lsn/leth/RES_LETH_ITEM_LIST';
const responseLethItemList = createAction(RES_LETH_ITEM_LIST);

const REQ_LETH_STORAGE_ADD = 'lsn/leth/REQ_LETH_STORAGE_ADD';
const requestLethStorageAdd = createAction(REQ_LETH_STORAGE_ADD);

const RES_LETH_STORAGE_ADD = 'lsn/leth/RES_LETH_STORAGE_ADD';
const responseLethStorageAdd = createAction(RES_LETH_STORAGE_ADD);

const REQ_LETH_STORAGE_FETCH = 'lsn/leth/REQ_LETH_STORAGE_FETCH';
const requestLethStorageFetch = createAction(REQ_LETH_STORAGE_FETCH);

const RES_LETH_STORAGE_FETCH = 'lsn/leth/RES_LETH_STORAGE_FETCH';
const responseLethStorageFetch = createAction(RES_LETH_STORAGE_FETCH);

const REQ_LETH_ACL_GRANT = 'lsn/leth/REQ_LETH_ACL_GRANT';
const requestLethAclGrant = createAction(REQ_LETH_ACL_GRANT);

const RES_LETH_ACL_GRANT = 'lsn/leth/RES_LETH_ACL_GRANT';
const responseLethAclGrant = createAction(RES_LETH_ACL_GRANT);

const RECEIVE_LETH_ERROR = 'lsn/leth/RECEIVE_LETH_ERROR';
const receiveLethError = createAction(RECEIVE_LETH_ERROR);

const gateway = Gateway(gatewayCfg.provider);

export function lethWalletBalance({ ethAddress }) {
  return (dispatch) => {
    dispatch(requestLethWalletBalance());

    return gateway.wallet.balance(ethAddress)
      .then(response => dispatch(responseLethWalletBalance(Web3.utils.toPht(response.balance))))
      .catch(error => dispatch(receiveLethError(error)));
  };
}

export function lethItemList({ token }) {
  return (dispatch, getState) => {
    dispatch(requestLethItemList());
    const web3 = getWeb3Engine(getState());
    const username = getSessionUsername(getState());
    return getUserFileList(web3, {
      username,
      token
    }).then(response => dispatch(responseLethItemList(response)))
      .catch(error => dispatch(receiveLethError(error)));
  };
}

export function lethUserItemList({ username, token }) {
  return (dispatch, getState) => {
    const web3 = getWeb3Engine(getState());
    return getUserFileList(web3, {
      username,
      token
    })
  };
}

export function lethStorageAdd(user, { title, description, file }) {
  return (dispatch) => {
    dispatch(requestLethStorageAdd());

    return uploadNewItem(web3, user, { title, description, file })
      .then((res) => {
        dispatch(responseLethStorageAdd(res));
        return res;
      }).catch((error) => {
        dispatch(receiveLethError(error));
        throw error;
      });
  };
}

export function lethStorageFetch({ token, meta }) {
  return (dispatch) => {
    dispatch(requestLethStorageFetch());

    return gateway.storage.fetch(meta, token, true).then((response) => {
      if(response.status !== 200) throw new Error(response.message);
      const disposition = response.headers.get('Content-Disposition');
      const contentType = response.headers.get('Content-Type');
      let filename;
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      response.blob().then(data => {
        downloadFile(data, filename, contentType);
      });
    }).catch((error) => {
      dispatch(receiveLethError(error));
      throw error;
    });
  };
}

export function lethFileGrant({ token, itemId, toUsername }) {
  return async (dispatch) => {
    dispatch(requestLethAclGrant());

    return hPost(PATH_PERMISSION_GRANT, {
      item_id: `${itemId}`,
      username: toUsername
    }, {
      token
    }).then(() => {
      dispatch(lethItemList({ token }));
    }).catch((error) => {
      dispatch(receiveLethError(error));
      throw error;
    });
  };
}

export function lethFileRevoke({ token, itemId, toUsername }) {
  return async (dispatch) => {
    dispatch(requestLethAclGrant());

    return hPost(PATH_PERMISSION_REVOKE, {
      item_id: `${itemId}`,
      username: toUsername
    }, {
      token
    }).then((res) => {
      dispatch(lethItemList({ token }));
    }).catch((error) => {
      dispatch(receiveLethError(error));
      throw error;
    });
  };
}

export function lethFileRequestAccess({ token, itemId, toUsername }) {
  return async (dispatch) => {
    dispatch(requestLethAclGrant());

    return hPost(PATH_PERMISSION_REQUEST, {
      item_id: `${itemId}`,
      username: toUsername
    }, {
      token
    }).then((res) => {
      dispatch(lethItemList({ token }));
    }).catch((error) => {
      dispatch(receiveLethError(error));
      throw error;
    });
  };
}

const CLEAR_STORED_STATE = 'lsn/auth/CLEAR_STORED_STATE';
const clearStoredState = createAction(CLEAR_STORED_STATE);

export default createReducer({
  [requestLethStorageAdd]: (state) => ({
    ...state,
    isFetching: true,
    error: null,
    lastRequestedAt: (new Date()).toISOString()
  }),
  [responseLethStorageAdd]: (state, payload) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      files: { ...state.files, ...{ [payload.id]: payload } }
    };
  },
  [requestLethStorageFetch]: (state) => ({
    ...state,
    isFetching: true
  }),
  [responseLethStorageFetch]: (state, payload) => ({
    ...state,
    fileDataUrl: payload,
    isFetching: false
  }),
  [receiveLethError]: (state, payload) => ({
    ...state,
    isFetching: false,
    error: payload
  }),
  [requestLethWalletBalance]: (state) => ({
    ...state,
    isFetching: true,
    error: null,
    lastRequestedAt: (new Date()).toISOString()
  }),
  [responseLethWalletBalance]: (state, payload) => ({
    ...state,
    isFetching: false,
    balance: payload,
    error: null
  }),
  [responseLethItemList]: (state, payload) => {
    const mappedItems = {};
    payload.forEach(item => {
      mappedItems[item.id] = item;
    });

    return {
      ...state,
      isFetching: false,
      files: { ...mappedItems }
    };
  },
  [clearStoredState]: (state) => initialState
}, initialState);

export const getLethFiles = (state) => get(state, ['leth', 'files'], null);
export const getLethErrors = (state) => get(state, ['leth', 'error'], null);
export const getWalletBalance = (state) => get(state, ['leth', 'balance'], null);
export const getFileDataUrl = (state) => get(state, ['leth', 'fileDataUrl'], null);