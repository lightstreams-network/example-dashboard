import get from 'lodash.get';
import { Web3, EthersWallet as EW } from 'lightstreams-js-sdk';
import { web3Cfg } from '../../constants/config'

const initialState = {
  encryptedKeys: [],
  web3: null,
};

export const KEYSTORE_APPEND_ENCODED_JSON_KEY_ACTION = 'lsn/keystore/KEYSTORE_APPEND_ENCODED_JSON_KEY';
export const KEYSTORE_SET_SELECTED_ADDRESS = 'lsn/keystore/KEYSTORE_SET_SELECTED_ADDRESS';
export const KEYSTORE_SET_WEB3_ACTION = 'lsn/keystore/KEYSTORE_SET_WEB3';

// Actions

export const initializeWeb3Action = () => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      let web3 = getWeb3Engine(getState());
      const encryptedKeys = getEncryptedKeys(getState());
      if (web3 !== null) {
        throw new Error(`Web3 is already initialized`);
      }

      web3 = Web3.newEngine(web3Cfg.provider);

      // In case MetaMask is not in used we inject out local web3
      if (typeof window.web3 === 'undefined') {
        window.web3 = web3;
      }

      encryptedKeys.forEach(encryptedJson => {
        console.log(`Imported ${EW.Account.formatAddress(encryptedJson.address)} into web3 engine`);
        Web3.keystore.importAccount(web3, { encryptedJson });
      });

      dispatch({
        type: KEYSTORE_SET_WEB3_ACTION,
        payload: { web3 }
      });

      resolve();
    } catch ( err ) {
      console.log(`ERROR: ${err.message}`);
      reject(err);
    }
  });
};

export const createAccountAction = (password) => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3 = getWeb3Engine(getState());
      const decryptedWallet = EW.Keystore.createRandomWallet();
      const encryptedJson = await EW.Keystore.encryptWallet(decryptedWallet, password);
      console.log(`Create new account ${EW.Account.formatAddress(encryptedJson.address)}`);
      Web3.keystore.importAccount(web3, { encryptedJson, decryptedWallet });

      dispatch({
        type: KEYSTORE_APPEND_ENCODED_JSON_KEY_ACTION,
        payload: {
          encryptedJson
        }
      });

      const ethAddress = EW.Account.formatAddress(encryptedJson.address);
      resolve(ethAddress);
    } catch ( err ) {
      reject(err);
    }
  })
};

export const unlockAccountAction = (ethAddress, password) => (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
        try {
            const web3 = getWeb3Engine(getState());
            await Web3.keystore.unlockAccount(web3, { address: ethAddress, password });
            const isUnlocked = Web3.keystore.isAccountLocked(web3, { address: ethAddress });
            resolve(isUnlocked);
        } catch ( err ) {
            reject(err);
        }
    })
};



// REDUCERS

export default function keystoreReducer(state = initialState, action = {}) {
  switch ( action.type ) {
    case KEYSTORE_SET_WEB3_ACTION:
      return {
        ...state,
        web3: action.payload.web3,
      };
    case KEYSTORE_SET_SELECTED_ADDRESS:
      state.web3.currentProvider.selectedAddress = action.payload.ethAddress;
      break;
    case KEYSTORE_APPEND_ENCODED_JSON_KEY_ACTION:
      return {
        ...state,
        encryptedKeys: [...state.encryptedKeys, action.payload.encryptedJson]
      };
    default:
      return state
  }
};

// SELECTORS

export const getEncryptedKeys = (state) => get(state, ['keystore', 'encryptedKeys'], []);
export const getWeb3Engine = (state) => get(state, ['keystore', 'web3'], null);