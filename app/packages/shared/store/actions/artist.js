import ArtistService from '../../services/artistService';
import { getSessionToken, getSessionArtistToken, getLethToken } from '../selectors/session';
import { updateTokenBalance } from '../actions/wallet'

export const PURCHASE_CONTENT = 'PURCHASE_CONTENT';
export const LOAD_ARTIST_PROFILE = 'LOAD_ARTIST_PROFILE';
export const LOAD_ARTIST_EXCLUSIVE_CONTENT = 'LOAD_ARTIST_EXCLUSIVE_CONTENT';

export const loadArtistProfile = () => (dispatch, getState) => {
    const { session } = getState();
    return ArtistService.loadArtistProfile(getSessionArtistToken(session))
        .then(response => {
            return response.json();
        })
        .then(json => {
            if (!json.success) {
                throw new Error(json.message)
            }
            dispatch({
                type: LOAD_ARTIST_PROFILE,
                payload: json.data
            });
        })
};

export const loadExclusiveContent = () => (dispatch, getState) => {
    const { session } = getState();
    return ArtistService.loadExclusiveContent(
        getSessionToken(session),
        getSessionArtistToken(session)
    ).then(response => {
        return response.json();
    }).then(json => {
        if (!json.success) {
            throw new Error(json.message)
        }

        dispatch({
            type: LOAD_ARTIST_EXCLUSIVE_CONTENT,
            payload: json.data,
        });
    })
};

export const purchaseContentAction = (item, password) => (dispatch, getState) => {
    const { session } = getState();
    return ArtistService.purchaseContent(getSessionToken(session),
        getSessionArtistToken(session),
        item.meta,
        password
    ).then(response => {
        return response.json();
    }).then(json => {
        if (!json.success) {
            throw new Error(json.message)
        }

        dispatch(loadExclusiveContent());
        dispatch(updateTokenBalance());
    })
};

export const downloadItemAction = (item) => (dispatch, getState) => {
    const { session } = getState();
    return ArtistService.downloadContent(getLethToken(session), getSessionArtistToken(session), item.meta);
};