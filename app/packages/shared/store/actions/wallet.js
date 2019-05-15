import artistService from '../../services/profileService';
import walletService from '../../services/walletService';

import { getSessionToken, getEtherAddress } from '../selectors/session';

export const UPDATE_WALLET = 'UPDATE_WALLET';
export const UPDATE_ICO_WALLET = 'UPDATE_ICO_WALLET';

export const updateWalletAction = () => (dispatch, getState) => {
    const state = getState();
    const { session } = state;
    return walletService.getWalletBalance(getSessionToken(session))
        .then(response => {
            return response.json();
        })
        .then(json => {
            if (!json.success) {
                throw new Error(json.message)
            }
            dispatch({
                type: UPDATE_WALLET,
                payload: {
                    address: getEtherAddress(session),
                    ...json.data
                },
            });
        })
};

export const requestFaucetTransfer = () => (dispatch, getState) => {
    const { session } = getState();
    return walletService.requestFaucetTransfer(getSessionToken(session))
        .then(response => {
            return response.json();
        })
        .then(json => {
            if (!json.success) {
                throw new Error(json.message)
            }

            dispatch(updateWalletAction());
        })
};

