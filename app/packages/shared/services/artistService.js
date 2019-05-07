import Downloader from './downloader'

export default class ArtistService {
    static loadArtistProfile(tokenSymbol) {
        return fetch(`${GLOBALS.FANBASE_DOMAIN}/artist/get-profile?symbol=${tokenSymbol}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
            }
        });
    }

    static loadExclusiveContent(authToken, tokenSymbol) {
        return fetch(`${GLOBALS.FANBASE_DOMAIN}/artist/get-exclusive-content?symbol=${tokenSymbol}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + authToken,
                'Content-Type': 'application/json; charset=utf-8',
            }
        });
    }

    static purchaseCoins(authToken, tokenSymbol, amount, password) {
        return fetch(`${GLOBALS.FANBASE_DOMAIN}/artist/purchase-coin?symbol=${tokenSymbol}&amount=${amount}`, {
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
        return fetch(`${GLOBALS.FANBASE_DOMAIN}/artist/get-coin-balance?symbol=${tokenSymbol}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + authToken,
            }
        });
    }

    static purchaseContent(authToken, tokenSymbol, contentMeta, password) {
        return fetch(`${GLOBALS.FANBASE_DOMAIN}/artist/purchase-content?symbol=${tokenSymbol}&content_meta=${contentMeta}`, {
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

    static downloadContent(lethToken, tokenSymbol, contentMeta) {
        const query = `content_meta=${contentMeta}&leth_token=${lethToken}&symbol=${tokenSymbol}`;
        return Downloader.fetch(`${GLOBALS.FANBASE_DOMAIN}/artist/download-file-content?${query}`, {
            method: 'GET',
        })
    }
}