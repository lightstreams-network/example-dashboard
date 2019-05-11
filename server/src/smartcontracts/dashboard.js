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
  const Shelves = web3.eth.Contract(profileSC.abi, profileAddress);
  return Shelves.methods.lastItemId.call();
};

module.exports.createUserDashboard = async (web3, { username, profileAddress }) => {
  const { dashboardUser: dashboardSC } = smartContract;
  const DashboardArtifact = web3.eth.Contract(dashboardSC.abi, null);

  const DashboardInstance = await web3SendTx(web3, () => {
    return DashboardArtifact.deploy({
      arguments: [username, profileAddress],
      data: dashboardSC.bytecode
    });
  },{
    gas: 1000000
  });

  debug(`DashboardUser SmartContract created at: ${DashboardInstance.options.address}`);

  return DashboardInstance.options.address;
};

module.exports.stackItem = async (web3, {from, password, address: profileAddress}, { title, description, meta, acl }) => {
  const { profile: profileSC } = smartContract;

  const txReceipt = await web3SendTx(web3, () => {
    const Profile = web3.eth.Contract(profileSC.abi, profileAddress);
    return Profile.methods.stackItem(title, description, meta, acl);
  }, {
    from,
    password,
    gas: '1200000'
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