import ProfileService from '../../services/profileService';
import { getSessionToken, getSessionUsername } from '../selectors/session';
import { updateTokenBalance } from '../actions/wallet'

export const LOAD_USER_PROFILE = 'LOAD_USER_PROFILE';

export const loadUserProfile = (username = null) => (dispatch, getState) => {
    const { session } = getState();
    return ProfileService.loadProfile(getSessionToken(session))
        .then(response => {
            return response.json();
        })
        .then(json => {
            if (!json.success) {
                throw new Error(json.message)
            }
            dispatch({
                type: LOAD_USER_PROFILE,
                payload: {
                    username: username || getSessionUsername(session),
                    data: json.data
                }
            });
        })
};

export const downloadItemAction = (item) => (dispatch, getState) => {
    const { session } = getState();
    return ProfileService.downloadContent(getSessionToken(session), item.id);
};