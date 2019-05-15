import ProfileService from '../../services/profileService';
import { getSessionToken } from '../selectors/session';
import { updateTokenBalance } from '../actions/wallet'

export const LOAD_PROFILE_PICTURE = 'LOAD_PROFILE_PICTURE';
export const LOAD_PROFILE_ITEMS = 'LOAD_PROFILE_ITEMS';

export const loadUserProfile = () => (dispatch, getState) => {
    const { session } = getState();
    return ProfileService.loadProfileItems(getSessionToken(session))
        .then(response => {
            return response.json();
        })
        .then(json => {
            if (!json.success) {
                throw new Error(json.message)
            }
            dispatch({
                type: LOAD_PROFILE_ITEMS,
                payload: json.data
            });
        })
        .then(() => {
            ProfileService.loadProfilePicture(getSessionToken(session))
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    if (!json.success) {
                        throw new Error(json.message)
                    }
                    dispatch({
                        type: LOAD_PROFILE_PICTURE,
                        payload: json.data
                    });
                })
        });
};

export const downloadItemAction = (item) => (dispatch, getState) => {
    const { session } = getState();
    return ProfileService.downloadContent(getSessionToken(session), item.id);
};