import { combineReducers } from 'redux';
import authReducer from '../auth';
import lethReducer from '../leth';

const rootReducer = combineReducers({
    auth: authReducer,
    leth: lethReducer,
});

export default rootReducer;
