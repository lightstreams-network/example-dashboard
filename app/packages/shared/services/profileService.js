import Downloader from './downloader'

export default class ProfileService {
    static loadProfile(sessionToken, username = null) {
        return fetch(`${GLOBALS.SERVER_DOMAIN}/dashboard/profile/get`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + sessionToken,
                'Content-Type': 'application/json; charset=utf-8',
            }
        });
    }


    // static purchaseContent(authToken, tokenSymbol, contentMeta, password) {
    //     return fetch(`${GLOBALS.SERVER_DOMAIN}/artist/purchase-content?symbol=${tokenSymbol}&content_meta=${contentMeta}`, {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             Authorization: 'Bearer ' + authToken,
    //             'Content-Type': 'application/json; charset=utf-8',
    //         },
    //         body: JSON.stringify({
    //             password: password,
    //         }),
    //     });
    // }

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