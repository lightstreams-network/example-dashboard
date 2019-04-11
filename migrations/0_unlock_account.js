require('dotenv').config({ path: `${process.env.PWD}/.env` });

const { web3Cfg } = require('src/lib/config');

module.exports = (deployer) => {
  deployer.then(function() {
    console.log(web3Cfg);
    return web3.eth.personal.unlockAccount(web3Cfg.from, web3Cfg.pwd, 1000)
      .then(console.log('Account unlocked!'))
      .catch((err) => {
        console.log(err);
      });
  });
};
