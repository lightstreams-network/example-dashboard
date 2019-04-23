import {deimmutify, reimmutify} from './app-state';
import { ClientModes, Environment } from '../environment';
const persistState = require('redux-localstorage');

export const enhancers = [
];

if (Environment.DEV || Environment.CLIENT_MODE === ClientModes.REMOTE)  {
    let localStorage = persistState('', {
        key: 'app-state',
        serialize: store => JSON.stringify(deimmutify(store)),
        deserialize: state => reimmutify(JSON.parse(state)),
    });

    enhancers.push(localStorage);
}

if (Environment.DEBUG) {

    const environment: any = window || this;

    if (environment.devToolsExtension) {
        enhancers.push(environment.devToolsExtension());
    }
}
