/**
 * User: ggarrido
 * Date: 11/04/19 17:06
 * Copyright 2019 (c) Lightstreams, Granada
 */

const { smartContract, web3Cfg } = require('src/lib/config');
const { phtToWei } = require('src/lib/ethereum');

module.exports.requestFreeToken = (web3, { beneficiary, amountInPht }) => {
  return new Promise((resolve, reject) => {
    try {
      const { faucet: faucetSC } = smartContract;
      const topUpAmountInWei = phtToWei(amountInPht);
      const Faucet = web3.eth.Contract(faucetSC.abi, faucetSC.address, {
        defaultAccount: web3Cfg.from
      });

      Faucet.methods.topUp(beneficiary, topUpAmountInWei).send()
        .on('confirmation', (confirmationNumber, txReceipt) => {
          if (txReceipt.status === true || txReceipt.status === '0x1') {
            resolve();
          } else {
            reject(new Error("Transaction failed"));
          }
        })
        .on('error', (error) => {
          reject(new Error(error));
        });
    } catch ( err ) {
      reject(new Error('Failed to request tokens'));
    }
  });
};