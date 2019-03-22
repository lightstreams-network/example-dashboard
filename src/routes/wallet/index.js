const express = require('express');
const router = express.Router();
const _ = require('lodash');
const debug = require('debug')('fanbase:server');
const { GATEWAY_DOMAIN } = require('../../config/urls');
const { jsonResponse } = require('../../lib/responses');
const { etherToWei, weiToEth } = require('../../lib/helpers');
const gateway = require('lightstreams-js-sdk')(GATEWAY_DOMAIN);
const { requestFaucetTransfer } = require('../../services/gateway');
const { passport } = require('../../services/auth');

router.get('/get-balance', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const { balance } = await gateway.wallet.balance(req.user.eth_address);
        res.json(jsonResponse({ balance: weiToEth(balance) }));
    } catch(err) {
        debug(err);
        next(err);
    }
});

router.post('/request-faucet-transfer', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const { balance } = await requestFaucetTransfer(req.user.eth_address, etherToWei(0.11))
        res.json(jsonResponse({
            balance: weiToEth(balance)
        }))
    } catch (err) {
        debug(err);
        next(err);
    }
});

module.exports = router;