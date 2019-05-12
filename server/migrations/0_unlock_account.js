require('dotenv').config({ path: `${process.env.PWD}/.env` });

const { web3Cfg } = require('src/lib/config');

module.exports = (deployer) => {
  process.env.NETWORK = deployer.network;

  deployer.then(function() {
    if (deployer.network === 'ganache') {
      return true;
    }

    console.log(web3Cfg);
    return web3.eth.personal.unlockAccount(web3Cfg.from, web3Cfg.password, 1000)
      .then(console.log('Root Account unlocked!'))
      .catch((err) => {
        console.log(err);
      });
  });
};