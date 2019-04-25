/**
 * User: ggarrido
 * Date: 25/04/19 9:44
 * Copyright 2019 (c) Lightstreams, Granada
 */

const { shelveItem: ShelveItem } = require('src/models');

const Web3 = require('src/services/web3');
const shelvesSC = require('src/smartcontracts/shelves');

module.exports.syncItems = async () => {
  const web3 = await Web3();
  const localMaxItemId = (await ShelveItem.getMaxItemId() || 0) + 1;
  const remoteMaxItemId = await shelvesSC.getMaxItemId(web3);

  // @TODO Optimize running in parallel
  for ( let i = localMaxItemId ; i <= remoteMaxItemId; i++ ) {
    await this.updateRemoteItem(i);
  }
};

module.exports.findByFileHash = async (fileHash) => {
  const shelveItem = await ShelveItem.findOneByFileHash(fileHash);
  return shelveItem;
};

module.exports.updateRemoteItem = async (itemId) => {
  const web3 = await Web3();
  const remoteItem = await shelvesSC.retrieveItemById(web3, itemId);

  return ShelveItem.create({
    item_id: remoteItem.item_id,
    title: remoteItem.title,
    description: remoteItem.description,
    file: remoteItem.file,
    cover: remoteItem.cover,
    acl: remoteItem.acl,
    owner: remoteItem.owner,
    price: parseFloat(remoteItem.priceInPht, 10),
  });
};