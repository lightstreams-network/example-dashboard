import { isAddress } from './checks';

export function validatePassword(values) {
    const errors = {};
    if (!values.password) {
        errors.password = 'Password is missing';
    } else if (
        values.password.length < 6
    ) {
        errors.password = 'The password needs to be at least 6 characters long';
    }
    return errors;
}

export function validateAccount(values) {
    const errors = {};
    if (!values.account) {
        errors.account = 'Account address is missing';
    } else if (
        !isAddress(values.account)
    ) {
        errors.account = 'We need a valid account address';
    }
    return errors;
}