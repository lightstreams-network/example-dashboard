const express = require('express');
const router = express.Router();
const _ = require('lodash');
const debug = require('debug')('app:server');
const { jsonResponse } = require('src/lib/responses');
const { weiToEth } = require('src/lib/ethereum');

const passport = require('src/services/session').passport();
const gateway = require('src/services/gateway').gateway();
const Web3 = require('src/services/web3');
const faucetSC = require('src/smartcontracts/faucet');

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
    const web3 = await Web3();
    await faucetSC.requestFreeToken(web3, req.user.eth_address);
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