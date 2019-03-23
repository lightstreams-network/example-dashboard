const express = require('express');
const router = express.Router();
const _ = require('lodash');
const debug = require('debug')('app:server');
const { jsonResponse } = require('service/lib/responses');
const { weiToEth } = require('src/lib/ethereum');

const passport = require('src/services/session').passport();
const gateway = require('src/services/gateway').gateway();
const faucetSC = require('src/services/faucetSmartContract');

router.get('/get-balance', passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { balance } = await gateway.wallet.balance(req.user.eth_address);
      res.json(jsonResponse({ balance: weiToEth(balance) }));
    } catch ( err ) {
      debug(err);
      next(err);
    }
  });

router.post('/request-faucet-transfer', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    await faucetSC.requestFreeToken(req.user.eth_address);
    const { balance } = await gateway.wallet.balance(req.user.eth_address);
    res.json(jsonResponse({
      balance: weiToEth(balance)
    }))
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

module.exports = router;