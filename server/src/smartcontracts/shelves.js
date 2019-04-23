/**
 * User: ggarrido
 * Date: 11/04/19 17:06
 * Copyright 2019 (c) Lightstreams, Granada
 */

const debug = require('debug')('app:server');
const { smartContract } = require('src/lib/config');
const { phtToWei, weiToPht } = require('src/lib/ethereum');

module.exports.address = () => {
  const { shelves: shelvesSC } = smartContract;
  return shelvesSC.address;
};

module.exports.stackItem = (web3, { owner, pwd }, { title, priceInPht, file, cover, acl }) => {
  return new Promise((resolve, reject) => {
    const { shelves: shelvesSC } = smartContract;
    const priceInWei = phtToWei(priceInPht);
    const Shelves = web3.eth.Contract(shelvesSC.abi, shelvesSC.address);

    web3.eth.personal.unlockAccount(owner, pwd, 100).then(() => {
      Shelves.methods.stackItem(title, priceInWei, file, '', acl).send({
        from: owner,
        gasLimit: '300000',
      }).on('confirmation', (confirmationNumber, txReceipt) => {
        web3.eth.personal.lockAccount(owner);
        if (txReceipt.status === true || txReceipt.status === '0x1') {
          resolve({
            itemId: txReceipt.events.StackContent.returnValues['_itemId']
          });
        } else {
          reject(new Error("Transaction failed"));
        }
      }).on('error', (error) => {
        web3.eth.personal.lockAccount(owner);
        reject(new Error(error));
      });
    }).catch((err) => {
      debug(err);
      reject(err);
    });
  });
};

module.exports.retrieveItemById = async (web3, itemId) => {
  const { shelves: shelvesSC } = smartContract;
  const Shelves = web3.eth.Contract(shelvesSC.abi, shelvesSC.address);

  const item = await Shelves.methods.items(itemId).call();
  return {
    title: item.title,
    owner: item.owner,
    file: item.file,
    cover: item.cover,
    priceInPht: weiToPht(item.price.toString(10)),
    priceInWei: item.price.toString(10),
  };
};

module.exports.purchase = (web3, { owner, pwd }, { itemId, amountInPht }) => {
  const { shelves: shelvesSC } = smartContract;
  const amountInWei = phtToWei(amountInPht);
  const Shelves = web3.eth.Contract(shelvesSC.abi, shelvesSC.address);

  return new Promise((resolve, reject) => {
    web3.eth.personal.unlockAccount(owner, pwd, 100).then(() => {
      Shelves.methods.purchase(itemId).send({
        from: owner,
        value: amountInWei,
        gasLimit: '300000',
      }).on('confirmation', (confirmationNumber, txReceipt) => {
        web3.eth.personal.lockAccount(owner);
        if (txReceipt.status === true || txReceipt.status === '0x1') {
          resolve(txReceipt.events.PurchaseContent.returnValues['_itemId']);
        } else {
          reject(new Error("Transaction failed"));
        }
      }).on('error', (error) => {
        web3.eth.personal.lockAccount(owner);
        reject(new Error(error));
      });
    }).catch((err) => {
      debug(err);
      reject(err);
    });
  });
};