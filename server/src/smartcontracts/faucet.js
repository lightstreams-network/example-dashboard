/**
 * User: ggarrido
 * Date: 11/04/19 17:06
 * Copyright 2019 (c) Lightstreams, Granada
 */

const { smartContract } = require('src/lib/config');
const { phtToWei } = require('src/lib/ethereum');
const { web3SendTx } = require('src/services/web3');

module.exports.requestFreeToken = async (web3, { beneficiary, amountInPht }) => {
  const topUpAmountInWei = phtToWei(amountInPht);

  await web3SendTx(web3, () => {
    const { faucet: faucetSC } = smartContract;
    const Faucet = web3.eth.Contract(faucetSC.abi, faucetSC.address);
    return Faucet.methods.topUp(beneficiary, topUpAmountInWei);
  });
};