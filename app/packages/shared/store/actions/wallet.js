import artistService from '../../services/artistService';
import walletService from '../../services/walletService';

import { getSessionToken, getSessionArtistToken } from '../selectors/session';

export const UPDATE_WALLET = 'UPDATE_WALLET';
export const UPDATE_ICO_WALLET = 'UPDATE_ICO_WALLET';

export const updateWalletAction = () => (dispatch, getState) => {
    const state = getState();
    const { session } = state;
    return walletService.getWalletBalance(session.token)
        .then(response => {
            return response.json();
        })
        .then(json => {
            if (!json.success) {
                throw new Error(json.message)
            }
            dispatch({
                type: UPDATE_WALLET,
                payload: json.data
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

export const updateTokenBalance = () => (dispatch, getState) => {
    const { session } = getState();
    return artistService.getIcoBalance(getSessionToken(session), getSessionArtistToken(session))
        .then(response => {
            return response.json();
        })
        .then(json => {
            if (!json.success) {
                throw new Error(json.message)
            }

            dispatch({
                type: UPDATE_ICO_WALLET,
                payload: json.data
            });
        })
};

export const purchaseCoins = (amount, password) => (dispatch, getState) => {
    const { session } = getState();
    return artistService.purchaseCoins(getSessionToken(session),
        getSessionArtistToken(session),
        amount,
        password
    ).then(response => {
        return response.json();
    }).then(json => {
        if (!json.success) {
            throw new Error(json.message)
        }

        dispatch(updateWalletAction());
        dispatch(updateTokenBalance());
        return json.data;
    })
};
