/**
 * User: ggarrido
 * Date: 16/05/19 10:35
 * Copyright 2019 (c) Lightstreams, Granada
 */

require('dotenv').config({ path: `${process.env.PWD}/.env` });

const Web3 = require('web3');
const { web3Cfg } = require('./lib/config');

console.log(web3Cfg);
let web = new Web3(web3Cfg.provider, {}, {
  defaultAccount: web3Cfg.holder,
  defaultGas: web3Cfg.defaultGas,
  defaultGasPrice: web3Cfg.gasPrice,
});

web.eth.personal.unlockAccount(web3Cfg.holder, web3Cfg.password, 1000)
  .then(console.log('Root Account unlocked!'))
  .catch((err) => {
    console.log(err);
  });