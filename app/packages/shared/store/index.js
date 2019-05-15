import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, autoRehydrate } from 'redux-persist';
import { REHYDRATE, PURGE, persistCombineReducers } from 'redux-persist'
import { AsyncStorage } from 'react-native';

import sessionReducer from './reducers/session';
import walletReducer from './reducers/wallet';
import profileReducer from './reducers/profile';

const middleware = [thunk];
if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger())
}

export default function configureStore() {
    const config = {
        key: 'primary',
        storage: AsyncStorage
    };

    let reducer = persistCombineReducers(config, {
        session: sessionReducer,
        wallet: walletReducer,
        profile: profileReducer,
    });

    const enhancer = composeWithDevTools({
        shouldHotReload: false
    })(applyMiddleware(...middleware));

    const store = createStore(
        reducer,
        undefined,
        enhancer
    );

    persistStore(store, null, () => {
        store.getState();
    });

    return store;
}