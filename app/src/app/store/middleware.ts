import {Environment} from '../environment';
const createLogger = require('redux-logger');
import {deimmutify} from './app-state';

export const middleware = [];

// Friendly logger for development.
if (Environment.DEV) {
    middleware.push(
        createLogger({
            level: 'info',
            collapsed: true,
            stateTransformer: deimmutify,
        }));
}
