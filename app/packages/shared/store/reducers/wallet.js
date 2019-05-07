import { UPDATE_WALLET, UPDATE_ICO_WALLET } from '../actions/wallet'

const INITIAL_STATE = {
    balance: 0,
    appTokenSymbol: 'ETH',
    tokens: [
        { symbol: 'JB', balance: 0 }
    ]
};

export default function(state = INITIAL_STATE, action) {
    switch ( action.type ) {
        case UPDATE_WALLET:
            return {
                ...state,
                balance: parseFloat(action.payload.balance)
            };
        case UPDATE_ICO_WALLET:
            return {
                ...state,
                tokens: _.map(state.tokens, (token) => {
                    if (token.symbol.toLowerCase() === action.payload.symbol.toLowerCase()) {
                        return { ...token, balance: parseInt(action.payload.balance) }
                    }
                    return token;
                })
            };
        default:
            return state
    }
};