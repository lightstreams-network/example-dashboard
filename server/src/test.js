/**
 * User: ggarrido
 * Date: 16/05/19 10:35
 * Copyright 2019 (c) Lightstreams, Granada
 */

require('dotenv').config({ path: `${process.env.PWD}/.env` });
const net = require('net');
const Web3 = require('web3');
const { web3Cfg } = require('./lib/config');

console.log(web3Cfg);
let web3 = new Web3(web3Cfg.provider, net, {
  defaultAccount: web3Cfg.holder,
  defaultGas: web3Cfg.defaultGas,
  defaultGasPrice: web3Cfg.gasPrice,
});

web3.eth.personal.unlockAccount(web3Cfg.holder, web3Cfg.password, 1000)
  .then(console.log('Root Account unlocked!'))
  .then(() => {
    return web3.eth.sendTransaction({
      from: web3Cfg.holder,
      to: "0xa99e88afdaf1afd72995c754958ba18c03ecf5ee",
      value: "1000000000000000000"
    });
  })
  .then((receipt) => {
    console.log(`Receipt: `, receipt)
  })
  .catch((err) => {
    console.log(err);
  });