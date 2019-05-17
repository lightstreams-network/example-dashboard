import { combineReducers } from 'redux';
import authReducer from '../auth';
import lethReducer from '../leth';
import ipfsReducer from '../ipfs';

const rootReducer = combineReducers({
    auth: authReducer,
    leth: lethReducer,
    ipfs: ipfsReducer,
});

export default rootReducer;
