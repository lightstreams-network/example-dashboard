/**
 * User: ggarrido
 * Date: 11/04/19 17:06
 * Copyright 2019 (c) Lightstreams, Granada
 */

const { smartContract } = require('src/lib/config');
const { web3SendTx } = require('src/services/web3');
const debug = require('debug')('app:web3');

const { weiToPht } = require('src/lib/ethereum');

module.exports.requestFreeToken = async (web3, { beneficiary, amountInWei }, {from, password}) => {
  await web3SendTx(web3, () => {
    const { faucet: faucetSC } = smartContract;
    const Faucet = new web3.eth.Contract(faucetSC.abi, faucetSC.address);
    return Faucet.methods.topUp(beneficiary, amountInWei);
  }, { from, password });

  const amountInPht = weiToPht(amountInWei);
  debug(`Account ${beneficiary} was top-up with: ${amountInPht} PHT`);
};

module.exports.remainingAmount = async (web3, beneficiary) => {
  const { faucet: faucetSC } = smartContract;
  const Faucet = new web3.eth.Contract(faucetSC.abi, faucetSC.address);
  return await Faucet.methods.remainingAmount(beneficiary).call()
};