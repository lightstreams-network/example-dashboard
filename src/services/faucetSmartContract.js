/**
 * User: ggarrido
 * Date: 23/03/19 17:50
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('web3');

const web3Provider = process.env.WEB3_PROVIDER;
const faucetScAddress = process.env.FAUCET_SC_ADDR;

const ABCI = "";

module.exports.requestFreeToken = async (address) => {
  const web3conn = new Web3(web3Provider);
  const FaucetContract = web3conn.eth.contract(ABCI);
  const Faucet = FaucetContract.at(faucetScAddress);

  web3.eth.personal.unlockAccount(from, pwd, 1000)
    .then(() => {
      console.log('Account unlocked!');
      Faucet.requestTopUp(address, {
        from: auth.AUTHOR_ACC,
      })
    })
    .catch((err) => {
      console.log(err);
    });
};