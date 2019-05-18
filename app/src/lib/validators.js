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
    if (!values.username) {
        errors.account = 'Account address is missing';
    } else if (
        values.username.length < 4
    ) {
        errors.username = 'We need be longer than 4 chars';
    }
    return errors;
}