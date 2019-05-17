
import { LOCAL_STORAGE_NAMESPACE } from '../../constants';

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem(LOCAL_STORAGE_NAMESPACE);
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify({
            auth: state.auth,
            leth: state.leth
        });
        return localStorage.setItem(LOCAL_STORAGE_NAMESPACE, serializedState);
    } catch (err) {
        return undefined;
    }
};

export const clearState = () => {
    try {
        return localStorage.removeItem(LOCAL_STORAGE_NAMESPACE);
    } catch (err) {
        return undefined;
    }
};