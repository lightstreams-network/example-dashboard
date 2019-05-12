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

module.exports.createUser = async (web3, user) => {
  const { dashboard: dashboardSC } = smartContract;
  const DashboardInstance = web3.eth.Contract(dashboardSC.abi, dashboardSC.address);

  await web3SendTx(web3, () => {
    return DashboardInstance.methods.createUser(user.eth_address, user.username, user.profile_address, '');
  },{
    gas: 1000000
  });

  debug(`Added user to dashboard SC: ${DashboardInstance.options.address}`);

  return DashboardInstance.options.address;
};

module.exports.grantReadAccess = async (web3, user, itemId, beneficiaryAddress) => {
  const { dashboard: dashboardSC } = smartContract;
  await web3SendTx(web3, () => {
    const Dashboard = web3.eth.Contract(dashboardSC.abi, dashboardSC.address);
    return Dashboard.methods.grantReadAccess(user.eth_address, itemId, beneficiaryAddress);
  }, {
    gas: 60000
  });

  return {
    access: 'READ',
    beneficiary: beneficiaryAddress
  };
};

module.exports.stackItem = async (web3, user, password, { title, description, meta, acl }) => {
  const { profile: profileSC } = smartContract;

  const txReceipt = await web3SendTx(web3, () => {
    const Profile = web3.eth.Contract(profileSC.abi, user.profile_address);
    return Profile.methods.stackItem(title, description, meta, acl);
  }, {
    from: user.eth_address,
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