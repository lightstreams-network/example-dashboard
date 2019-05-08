/**
 * User: ggarrido
 * Date: 11/04/19 17:06
 * Copyright 2019 (c) Lightstreams, Granada
 */

const { smartContract } = require('src/lib/config');
const { phtToWei } = require('src/lib/ethereum');
const { web3SendTx } = require('src/services/web3');
const debug = require('debug')('app:web3');

module.exports.address = () => {
  const { shelves: shelvesSC } = smartContract;
  return shelvesSC.address;
};

module.exports.getMaxItemId = (web3, profileAddress) => {
  const { profile: profileSC } = smartContract;
  const Shelves = web3.eth.Contract(profileSC.abi, profileAddress);
  return Shelves.methods.lastItemId.call();
};

module.exports.createProfile = async (web3, { username, holder }) => {
  const { dashboardUser: dashboardSC } = smartContract;
  const { profile: profileSC } = smartContract;
  const DashboardArtifact = web3.eth.Contract(dashboardSC.abi, null);
  const ProfileArtifact = web3.eth.Contract(profileSC.abi, null);

  const ProfileInstance = await web3SendTx(web3, () => {
    return ProfileArtifact.deploy({
      data: profileSC.bytecode,
      arguments: [holder]
    });
  }, {
    gas: 1000000
  });

  debug(`Profile SmartContract created at: ${ProfileInstance.options.address}`);

  const DashboardInstance = await web3SendTx(web3, (options) => {
    return DashboardArtifact.deploy({
      arguments: [username, ProfileInstance.options.address],
      data: dashboardSC.bytecode
    });
  },{
    gas: 3000000
  });

  debug(`DashboardUser SmartContract created at: ${DashboardInstance.options.address}`);

  return {
    profileAddress: ProfileInstance.options.address,
    dashboardAddress: DashboardInstance.options.address
  }
};

module.exports.stackItem = async (web3, { owner, pwd }, { title, priceInPht, file, cover, acl }) => {
  const { shelves: shelvesSC } = smartContract;
  const priceInWei = phtToWei(priceInPht);
  const Shelves = web3.eth.Contract(shelvesSC.abi, shelvesSC.address);

  const txReceipt = await web3SendTx(web3, { from: owner, pwd }, (options) => {
    return Shelves.methods.stackItem(title, priceInWei, file, '', acl).send({
      ...options,
      gasLimit: '300000',
    });
  });
  return {
    itemId: txReceipt.events.StackContent.returnValues['_itemId']
  };
};

module.exports.retrieveItemById = async (web3, profileAddress, itemId) => {
  const { profile: profileSC, permissionedFile: permissionedFileSC } = smartContract;
  const Profile = web3.eth.Contract(profileSC.abi, profileAddress);
  const item = await Profile.methods.items(itemId).call();

  const File = web3.eth.Contract(permissionedFileSC.abi, item.meta);
  const permissions = await File.methods.permissions().call();

  return {
    title: item.title,
    description: item.description,
    meta: item.meta,
    permissions: permissions
  };
};