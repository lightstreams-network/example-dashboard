/**
 * User: ggarrido
 * Date: 23/03/19 17:50
 * Copyright 2019 (c) Lightstreams, Granada
 */

const { web3Cfg } = require('src/lib/config');
const Web3 = require('web3');
const debug = require('debug')('app:web3');

module.exports = async ({ provider } = {}) => {
  const cfg = {
    provider: provider || web3Cfg.provider
  };

  try {
    return new Web3(cfg.provider, null, {
      defaultGas: web3Cfg.defaultGas,
      defaultGasPrice: web3Cfg.gasPrice,
    });
  } catch ( err ) {
    console.error(err);
    return null
  }
};

module.exports.web3SendTx = (web3, {from, password}, txCall, options = {}) => {
  cfg = {
    ...{ gas: web3Cfg.defaultGas, gasPrice: web3Cfg.gasPrice },
    ...options,
    ...{ from, password }
  };
  return new Promise((resolve, reject) => {
    web3.eth.personal.unlockAccount(cfg.from, cfg.password, 100).then(() => {
      txCall().send(cfg)
        .on('transactionHash', (transactionHash) => {
          debug(`Transaction Executed: ${transactionHash}`);
        })
        .on('confirmation', (confirmationNumber, txReceipt) => {
          web3.eth.personal.lockAccount(cfg.from);
          if (typeof txReceipt.status !== 'undefined') {
            if (txReceipt.status === true || txReceipt.status === '0x1') {
              resolve(txReceipt);
            } else {
              reject(new Error("Transaction failed"));
            }
          } else {
            resolve(txReceipt);
          }
        })
        .on('error', (err) => {
          web3.eth.personal.lockAccount(cfg.from);
          debug(err);
          reject(err);
        })
        .catch(err => {
          debug(err);
          reject(err);
        });
    }).catch((err) => {
      debug(err);
      reject(err);
    });
  });
};