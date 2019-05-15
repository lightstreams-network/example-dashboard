export default class WalletService {
    static requestFaucetTransfer(token) {
        return fetch(`${GLOBALS.SERVER_DOMAIN}/wallet/request-faucet-transfer`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + token,
            }
        });
    }

    static getWalletBalance(token) {
        return fetch(`${GLOBALS.SERVER_DOMAIN}/wallet/balance`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + token,
            }
        });
    }
}