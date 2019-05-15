import Downloader from './downloader'

export default class ProfileService {
    static loadProfileItems(sessionToken) {
        return fetch(`${GLOBALS.SERVER_DOMAIN}/item/list`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + sessionToken,
                'Content-Type': 'application/json; charset=utf-8',
            }
        });
    }

    static loadProfilePicture(sessionToken) {
        return fetch(`${GLOBALS.SERVER_DOMAIN}/dashboard/profile/get-picture`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + sessionToken,
                'Content-Type': 'application/json; charset=utf-8',
            }
        });
    }

    static loadExclusiveContent(authToken, tokenSymbol) {
        return fetch(`${GLOBALS.SERVER_DOMAIN}/artist/get-exclusive-content?symbol=${tokenSymbol}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + authToken,
                'Content-Type': 'application/json; charset=utf-8',
            }
        });
    }

    static purchaseCoins(authToken, tokenSymbol, amount, password) {
        return fetch(`${GLOBALS.SERVER_DOMAIN}/artist/purchase-coin?symbol=${tokenSymbol}&amount=${amount}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + authToken,
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                password: password,
            }),
        });
    }

    static getIcoBalance(authToken, tokenSymbol) {
        return fetch(`${GLOBALS.SERVER_DOMAIN}/artist/get-coin-balance?symbol=${tokenSymbol}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + authToken,
            }
        });
    }

    static purchaseContent(authToken, tokenSymbol, contentMeta, password) {
        return fetch(`${GLOBALS.SERVER_DOMAIN}/artist/purchase-content?symbol=${tokenSymbol}&content_meta=${contentMeta}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + authToken,
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                password: password,
            }),
        });
    }

    static downloadContent(sessionToken, itemId) {
        const query = `item_id=${itemId}`;
        return Downloader.fetch(`${GLOBALS.SERVER_DOMAIN}/item/download?${query}`, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + sessionToken,
                'Content-Type': 'application/json; charset=utf-8',
            },
        })
    }
}