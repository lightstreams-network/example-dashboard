/**
 * User: ggarrido
 * Date: 11/04/19 17:06
 * Copyright 2019 (c) Lightstreams, Granada
 */

const debug = require('debug')('app:server');
const { smartContract, web3Cfg } = require('src/lib/config');
const { phtToWei } = require('src/lib/ethereum');

module.exports.address = () => {
  const { shelves: shelvesSC } = smartContract;
  return shelvesSC.address;
};

module.exports.stackBook = (web3, { owner, pwd }, { title, priceInPht, file, cover, acl }) => {
  return new Promise((resolve, reject) => {
    const { shelves: shelvesSC } = smartContract;
    const priceInWei = phtToWei(priceInPht);
    const Shelves = web3.eth.Contract(shelvesSC.abi, shelvesSC.address, {
      defaultAccount: web3Cfg.from
    });

    web3.eth.personal.unlockAccount(owner, pwd, 100)
      .then(() => {
        Shelves.methods.stackBook(title, priceInWei, file, '', acl).send({
          from: owner,
          gasLimit: '300000',
        }).on('confirmation', (confirmationNumber, txReceipt) => {
          web3.eth.personal.lockAccount(owner);
          if (txReceipt.status === true || txReceipt.status === '0x1') {
            resolve(txReceipt.events.StackBook.returnValues['_bookId']);
          } else {
            reject(new Error("Transaction failed"));
          }
        }).on('error', (error) => {
          web3.eth.personal.lockAccount(owner);
          reject(new Error(error));
        });
      })
      .catch((err) => {
        debug(err);
        reject(err);
      });
  });
};