import AuthService from '../../services/authService';

export const LOGIN_ACTION = 'LOGIN_ACTION';
export const LOGOUT_ACTION = 'LOGOUT_ACTION';
export const SIGN_UP_ACTION = 'SIGN_UP_ACTION';

export const loginAction = (username, password) => (dispatch) => {
    return AuthService.authenticate(username, password)
        .then(response => {
            return response.json();
        })
        .then(json => {
            if (!json.success) {
                throw new Error(json.message)
            }
            dispatch({
                type: LOGIN_ACTION,
                payload: json.data
            });
        })
};

export const signUpAction = (username, password) => (dispatch) => {
    return AuthService.createUser(username, password)
        .then(response => {
            return response.json();
        })
        .then(json => {
            if (!json.success) {
                throw new Error(json.message)
            }

            dispatch({
                type: SIGN_UP_ACTION,
                payload: json.data
            });
        })
};

export const logoutAction = () => (dispatch) => {
    return dispatch({
        type: LOGOUT_ACTION
    });
};