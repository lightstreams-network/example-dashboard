export default class AuthService {

    static authenticate(username, password) {
        return fetch(`${GLOBALS.FANBASE_DOMAIN}/auth/authenticate`, {
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
        return fetch(`${GLOBALS.FANBASE_DOMAIN}/auth/create-user`, {
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