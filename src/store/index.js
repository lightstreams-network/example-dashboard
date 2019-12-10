import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import { persistCombineReducers } from 'redux-persist';
import { createBlacklistFilter } from 'redux-persist-transform-filter';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension';

import authReducer from './auth';
import lethReducer from './leth';
import keystoreReducer, { initializeWeb3Action } from './keystore';
import { getAuthenticatedUser, isAuthenticated, login } from './auth';


function restoreGlobalKeystore({ getState, dispatch }) {
  return next => action => {
    const nextState = next(action);
    if (action.type === 'persist/REHYDRATE') {
      dispatch(initializeWeb3Action());
      if(isAuthenticated(getState())) {
        const sessionUser = getAuthenticatedUser(getState());
        dispatch(login({ username: sessionUser.username, password: sessionUser.password}));
      }
    }

    return nextState;
  }
}

// const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore() {
  // you want to remove some keys before you save
  const blacklistKeystoreFilter = createBlacklistFilter(
    'keystore', ['web3'],
  );

    const middleware = process.env.NODE_ENV !== 'production' ?
        [thunk, restoreGlobalKeystore, logger] :
        [thunk, restoreGlobalKeystore];

    let reducer = persistCombineReducers({
    key: 'primary',
    storage: storage,
    transforms: [blacklistKeystoreFilter]
  }, {
    auth: authReducer,
    leth: lethReducer,
    keystore: keystoreReducer,
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