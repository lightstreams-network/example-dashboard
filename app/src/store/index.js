import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './reducers';
import { loadState, saveState } from './local-storage';

const initialState = loadState();

const middleware = process.env.NODE_ENV !== 'production' ?
    applyMiddleware(thunk, logger) :
    applyMiddleware(thunk);

// const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    initialState,
    middleware
);

store.subscribe(() => {
    saveState(store.getState());
});

export default store;