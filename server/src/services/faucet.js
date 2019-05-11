/**
 * User: ggarrido
 * Date: 11/05/19 21:10
 * Copyright 2019 (c) Lightstreams, Granada
 */

const { phtToWei } = require('src/lib/ethereum');
const { web3Cfg } = require('src/lib/config');
const gateway = require('src/services/gateway').gateway();
const debug = require('debug')('app:faucet');

module.exports.requestFunding = async (beneficiary, amountInPht) => {
  debug(`Sent ${amountInPht}PHT to ${beneficiary} from faucet account`);
  await gateway.wallet.transfer(web3Cfg.from, web3Cfg.password, beneficiary, phtToWei(amountInPht));
};