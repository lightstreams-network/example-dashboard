/**
 * User: ggarrido
 * Date: 11/04/19 17:06
 * Copyright 2019 (c) Lightstreams, Granada
 */

const { smartContract } = require('src/lib/config');
const { web3SendTx } = require('src/services/web3');
const debug = require('debug')('app:web3');

module.exports.address = () => {
  const { shelves: shelvesSC } = smartContract;
  return shelvesSC.address;
};

module.exports.getMaxItemId = (web3, profileAddress) => {
  const { profile: profileSC } = smartContract;
  const Profile = web3.eth.Contract(profileSC.abi, profileAddress);
  return Profile.methods.lastItemId.call();
};

module.exports.createProfile = async (web3, { from, password }) => {
  const { profile: profileSC } = smartContract;
  const ProfileArtifact = web3.eth.Contract(profileSC.abi, null);

  const ProfileInstance = await web3SendTx(web3, () => {
    return ProfileArtifact.deploy({
      data: profileSC.bytecode,
      arguments: []
    });
  }, {
    gas: 2000000, from, password
  });

  debug(`Profile SmartContract created at: ${ProfileInstance.options.address}`);

  return ProfileInstance.options.address;
};

module.exports.stackItem = async (web3, user, password, { title, description, meta, acl, profileAddress }) => {
  const { profile: profileSC } = smartContract;

  const txReceipt = await web3SendTx(web3, () => {
    const Profile = web3.eth.Contract(profileSC.abi, profileAddress);
    return Profile.methods.stackItem(title, description, meta, acl);
  }, {
    from: user.eth_address,
    password,
    gas: '1200000'
  });

  return txReceipt.events.StackItem.returnValues['_itemId'];
};

module.exports.retrieveItemById = async (web3, profileAddress, itemId) => {
  const { profile: profileSC } = smartContract;
  const Profile = web3.eth.Contract(profileSC.abi, profileAddress);
  const itemObj = await Profile.methods.items(itemId).call();
  return {
    title: itemObj.title,
    description: itemObj.description,
    meta: itemObj.meta,
    acl: itemObj.acl,
  }
};

module.exports.retrieveItemPermissionsById = async (web3, item) => {
  const { permissionedFile: permissionedFileSC } = smartContract;

  const File = web3.eth.Contract(permissionedFileSC.abi, item.acl);
  const permissionsObj = await File.methods.permissions.call();
  return permissionsObj;
};