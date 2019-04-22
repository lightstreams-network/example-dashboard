const express = require('express');
const router = express.Router();
const _ = require('lodash');
const debug = require('debug')('app:server');
const { weiToPht } = require('src/lib/ethereum');
const { extractRequestAttrs } = require('src/lib/request');
const { badInputResponse, unauthorizedResponse, jsonResponse } = require('src/lib/responses');

const passport = require('src/services/session').passport();
const gateway = require('src/services/gateway').gateway();
const Web3 = require('src/services/web3');
const faucetSC = require('src/smartcontracts/faucet');

router.get('/balance', passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { balance } = await gateway.wallet.balance(req.user.eth_address);
      res.json(jsonResponse({
        pht: weiToPht(balance),
        wei: balance
      }));
    } catch ( err ) {
      debug(err);
      next(err);
    }
  });

router.post('/request-top-up', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const attrs = extractRequestAttrs(req, ['amount']);
  if (!attrs.amount) {
    next(badInputResponse());
    return;
  }
  try {
    await faucetSC.requestFreeToken(await Web3(), {
      beneficiary: req.user.eth_address,
      amountInPht: attrs.amount
    });
    const { balance } = await gateway.wallet.balance(req.user.eth_address);
    res.json(jsonResponse({
      pht: weiToPht(balance),
      wei: balance
    }));
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

module.exports = router;