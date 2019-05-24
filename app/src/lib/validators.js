
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

export function validatePassword2(values) {
    const errors = {};
    if (
        values.password !== values.password2
    ) {
        errors.password2 = 'Password does not match';
    }
    return errors;
}

export function validateAccount(values) {
    const errors = {};
    if (!values.username) {
        errors.username = 'Username is missing';
    } else if (
        values.username.length < 4
    ) {
        errors.username = 'We need be longer than 4 chars';
    }
    return errors;
}