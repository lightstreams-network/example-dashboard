/**
 * User: ggarrido
 * Date: 23/03/19 17:50
 * Copyright 2019 (c) Lightstreams, Granada
 */

const { web3Cfg } = require('src/lib/config');
const Web3 = require('web3');

module.exports = async ({ provider, from, pwd }) => {
  const cfg = {
    provider: provider || web3Cfg.provider,
    from: from || web3Cfg.from,
    pwd: pwd || web3Cfg.pwd,
  };

  try {
    const web3 = new Web3(cfg.provider);
    await web3.eth.personal.unlockAccount(cfg.from, cfg.pwd, 1000);
    console.log(`Account ${cfg.from } unlocked!`);
    return web3;
  } catch(err) {
    console.error(err);
    return null
  }
};