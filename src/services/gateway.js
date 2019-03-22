const got = require('got');
const debug = require('debug')('fanbase:gateway');
const http = require('http');
const https = require('https');
const querystring = require('querystring');
var URL = require('url').URL;

const { urls, auth: authConfig } = require('../config');
const { extractExtension, ext2MIME} = require('../lib/ext2MIME');

const _ = require('lodash');
const { DateTime } = require('luxon');
const { faucet: Faucet } = require('../models');

const URL_SIGNIN = `${urls.GATEWAY_DOMAIN}/user/signin`;
const URL_SIGNUP = `${urls.GATEWAY_DOMAIN}/user/signup`;
const URL_GET_WALLET_BALANCE = `${urls.GATEWAY_DOMAIN}/wallet/balance`;
const URL_REQUEST_TRANSFER = `${urls.GATEWAY_DOMAIN}/wallet/transfer`;
const URL_GET_ICO_BALANCE = `${urls.GATEWAY_DOMAIN}/erc20/balance`;
const URL_PURCHASE_ICO = `${urls.GATEWAY_DOMAIN}/erc20/purchase`;
const URL_TRANSFER_ICO = `${urls.GATEWAY_DOMAIN}/erc20/transfer`;
const URL_GRANT_PERMISSIONS = `${urls.GATEWAY_DOMAIN}/acl/grant`;
const URL_FETCH_CONTENT = `${urls.GATEWAY_DOMAIN}/storage/fetch`;

const handleGatewayError = (err) => {
    if (typeof err.response === "object") {
        if (typeof err.response.body === "object") {
            const { error, message } = err.response.body;
            if (typeof message !== "undefined") {
                throw new Error(message)
            }
            throw new Error(error)
        } else {
            throw new Error(err.response.body)
        }
    } else {
        throw err;
    }
};

module.exports.signInUser = (ethAddress, password) => {
    const options = {
        json: true,
        body: {
            account: ethAddress,
            password,
        }
    };
    debug(`POST: ${URL_SIGNIN}\t${JSON.stringify(options)}`);
    return got.post(URL_SIGNIN, options)
        .then(response => {
            const { token, error } = response.body;
            if (!_.isEmpty(error)) {
                debug(`ERROR: ${err.message}`);
                throw new Error(err.message)
            }
            return { token };
        })
        .catch(err => {
            handleGatewayError(err);
        });
};

module.exports.signUpUser = (password) => {
    const options = {
        json: true,
        body: {
            password,
        }
    };

    debug(`POST: ${URL_SIGNUP}\t${JSON.stringify(options)}`);
    return got.post(URL_SIGNUP, options)
        .then(response => {
            const { account, error } = response.body;
            if (!_.isEmpty(error)) {
                debug(`ERROR: ${err.message}`);
                throw new Error(err.message)
            }
            return { account };
        })
        .catch(err => {
            handleGatewayError(err);
        });
};

module.exports.getWalletBalance = (ethAddress) => {
    const options = {
        json: true,
        query: {
            account: ethAddress
        },
    };

    debug(`GET: ${URL_GET_WALLET_BALANCE}\t${JSON.stringify(options)}`);
    return got.get(URL_GET_WALLET_BALANCE, options)
        .then(response => {
            const { balance } = response.body;
            return { balance };
        }).catch(err => {
            handleGatewayError(err);
        });
};

module.exports.requestFaucetTransfer = async (ethAddress, weiAmount) => {
    const transfers = await Faucet.findByToAddress(ethAddress);
    const now = DateTime.utc();
    const waitingTimeSlotInSec = 30; // 30s window

    const validTransfers = _.filter(transfers, (transfer) => {
        if (transfer.succeeded === true) return true;
        if (now.toMillis() - transfer.created_at.getTime() < (waitingTimeSlotInSec * 1000)) return true;
        return false;
    });

    if (validTransfers.length > 0) {
        // throw new Error('Faucet transfer is not authorized');
    }

    const transfer = await Faucet.create({
        to_address: ethAddress,
        amount: weiAmount,
        succeeded: null,
        created_at: now.toSQL(),
        modified_at: now.toSQL(),
    });

    const options = {
        json: true,
        body: {
            from: authConfig.faucet.address,
            password: authConfig.faucet.pwd,
            to: ethAddress,
            amount_wei: weiAmount.toString()
        }
    };

    debug(`POST: ${URL_REQUEST_TRANSFER}\t${JSON.stringify(options)}`);
    return got.post(URL_REQUEST_TRANSFER, options)
        .then(async (gwResponse) => {
            const { balance } = gwResponse.body;
            await transfer.update({
                succeeded: true
            });
            return {
                balance
            }
        })
        .catch((err) => {
            handleGatewayError(err);
        });
};

module.exports.getCoinBalance = (ethAddress, icoAddress) => {
    const options = {
        json: true,
        query: {
            erc20_address: icoAddress,
            account: ethAddress
        },
    };

    debug(`GET: ${URL_GET_ICO_BALANCE}\t${JSON.stringify(options)}`);
    return got.get(URL_GET_ICO_BALANCE, options)
        .then((response) => {
            const { balance } = response.body;
            return {
                balance
            }
        }).catch(err => {
            handleGatewayError(err);
        });
};

module.exports.purchaseCoins = (ethAddress, icoAddress, password, weiAmount) => {
    const options = {
        json: true,
        body: {
            erc20_address: icoAddress,
            password: password,
            account: ethAddress,
            amount_wei: weiAmount.toString()
        },
    };

    debug(`POST: ${URL_PURCHASE_ICO}\t${JSON.stringify(options)}`);
    return got.post(URL_PURCHASE_ICO, options)
        .then((response) => {
            const { tokens } = response.body;
            return {
                coins: tokens
            }
        }).catch(err => {
            handleGatewayError(err);
        });
};

module.exports.grantReadAccess = (artistAccount, artistAccountPassword, itemAcl, granteeEthAddress) => {
    const options = {
        json: true,
        body: {
            acl: itemAcl,
            owner: artistAccount,
            password: artistAccountPassword,
            to: granteeEthAddress,
            permission: 'read'
        },
    };

    debug(`POST: ${URL_GRANT_PERMISSIONS}\t${JSON.stringify(options)}`);
    return got.post(URL_GRANT_PERMISSIONS, options)
        .then(gwResponse => {
            const { is_granted, error } = gwResponse.body;
            if (!_.isEmpty(error)) {
                debug(`ERROR: ${err.message}`);
                throw new Error(err.message);
            }

            return {
                is_granted
            }
        }).catch(err => {
            handleGatewayError(err);
        });
};

module.exports.transferIco = (icoAddress, artistAccount, sourceEthAddress, password, amount) => {
    const options = {
        json: true,
        body: {
            erc20_address: icoAddress,
            account: sourceEthAddress,
            password: password,
            to: artistAccount,
            amount: amount.toString()
        },
    };

    debug(`POST: ${URL_TRANSFER_ICO}\t${JSON.stringify(options)}`);
    return got.post(URL_TRANSFER_ICO, options)
        .then(gwResponse => {
            const { balance } = gwResponse.body;
            return {
                balance
            }
        }).catch(err => {
            handleGatewayError(err);
        });
};

module.exports.downloadFileContent = (req, res, lethToken, contentMeta, filename) => {
    const url = new URL(URL_FETCH_CONTENT);
    var query = querystring.stringify({
        meta: contentMeta,
        token: lethToken
    });

    var options = {
        host: url.hostname,
        port: url.port,
        path: `${url.pathname}?${query}`,
        method: 'GET',
        headers: req.headers,
    };

    debug(`GET: ${URL_FETCH_CONTENT}\t${JSON.stringify(options)}`);
    var creq = https.request(options, function(cres) {
        // if (typeof cres.headers['content-disposition'] !== "undefined") {
        //     res.setHeader('Content-Length', cres.headers['content-length']);
        //     res.setHeader('Content-Type', cres.headers['content-type']);
        //     res.setHeader('Content-Disposition', cres.headers['content-disposition']);
        // } else {
            res.setHeader('Content-Type', ext2MIME(extractExtension(filename)));
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        // }

        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

        cres.pipe(res);
    }).on('error', function(e) {
        // we got an error, return 500 error to client and log error
        res.writeHead(500);
        res.end();
    });

    req.pipe(creq);
};

module.exports.proxyDownloadFileContent = (req, res, lethToken, contentMeta) => {
    var options = {
        host: '127.0.0.1',
        port: 3000,
        path: '/artist/stream-test-file',
        method: 'GET',
        headers: req.headers,
        body: {
            meta: contentMeta,
            token: lethToken
        }
    };

    var creq = http.request(options, function(cres) {
        res.setHeader('Content-Length', cres.headers['content-length']);
        res.setHeader('Content-Type', cres.headers['content-type']);
        res.setHeader('Content-Disposition', cres.headers['content-disposition']);
        cres.pipe(res);
    }).on('error', function(e) {
        // we got an error, return 500 error to client and log error
        res.writeHead(500);
        res.end();
    });

    req.pipe(creq);
};
