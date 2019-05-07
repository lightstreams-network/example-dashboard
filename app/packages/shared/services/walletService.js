export default class WalletService {
    static requestFaucetTransfer(token) {
        return fetch(`${GLOBALS.FANBASE_DOMAIN}/wallet/request-faucet-transfer`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + token,
            }
        });
    }

    static getWalletBalance(token) {
        return fetch(`${GLOBALS.FANBASE_DOMAIN}/wallet/get-balance`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + token,
            }
        });
    }
}