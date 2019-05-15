export default class AuthService {

    static authenticate(username, password) {
        return fetch(`${GLOBALS.SERVER_DOMAIN}/auth/sign-in`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });
    }

    static createUser(username, password) {
        return fetch(`${GLOBALS.SERVER_DOMAIN}/auth/sign-up`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });
    }
}