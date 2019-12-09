require('dotenv').config({ path: `${process.env.PWD}/.env` });

module.exports = (deployer) => {
  process.env.NETWORK = deployer.network;

  deployer.then(function() {
    if (deployer.network === 'ganache') {
      return true;
    }

    const rootAcc = process.env.STAKEHOLDER_ADDRESS;
    const rootAccPwd = process.env.STAKEHOLDER_PASSWORD;
    return web3.eth.personal.unlockAccount(rootAcc, rootAccPwd, 1000)
      .then(console.log('Root Account unlocked!'))
      .catch((err) => {
        console.log(err);
      });
  });
};
