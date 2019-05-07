import { LOGIN_ACTION, LOGOUT_ACTION, SIGN_UP_ACTION } from '../actions/session'

const INITIAL_STATE = {
    token: null,
    artistTokenSymbol: 'JB',
    user: {}
};

export default function(state = INITIAL_STATE, action) {
    switch ( action.type ) {
        case LOGIN_ACTION:
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user
            };
        case SIGN_UP_ACTION:
            return {
                ...state,
                user: action.payload.user
            };
        case LOGOUT_ACTION:
            return INITIAL_STATE;
        default:
            return state
    }
};