/**
 * User: ggarrido
 * Date: 11/04/19 17:06
 * Copyright 2019 (c) Lightstreams, Granada
 */

const { smartContract } = require('src/lib/config');
const { web3SendTx } = require('src/services/web3');
const debug = require('debug')('app:web3');

module.exports.createUser = async (web3, { ethAddress, username, profileAddress }) => {
  const { dashboard: dashboardSC } = smartContract;
  const DashboardInstance = web3.eth.Contract(dashboardSC.abi, dashboardSC.address);

  await web3SendTx(web3, () => {
    return DashboardInstance.methods.createUser(ethAddress, username, profileAddress, '');
  },{
    gas: 1000000
  });

  debug(`Added user to dashboard SC: ${DashboardInstance.options.address}`);

  return DashboardInstance.options.address;
};

module.exports.retrieveUserInfo = async(web3, ethAddress) => {
  const { dashboard: dashboardSC } = smartContract;
  const DashboardInstance = web3.eth.Contract(dashboardSC.abi, dashboardSC.address);
  const username = await DashboardInstance.methods.findUsername(ethAddress).call();
  const profileAddress = await DashboardInstance.methods.findProfile(ethAddress).call();
  const rootIPFS = await DashboardInstance.methods.findRootIPFS(ethAddress).call();

  return {
    username,
    ethAddress,
    profileAddress,
    rootIPFS
  }
};

module.exports.setNextRootDataId = async(web3, user, nextRootDataId) => {
  const { dashboard: dashboardSC } = smartContract;
  await web3SendTx(web3, () => {
    const Dashboard = web3.eth.Contract(dashboardSC.abi, dashboardSC.address);
    return Dashboard.methods.updateRootIPFS(user.ethAddress, nextRootDataId);
  }, {
    gas: 100000
  });
};

module.exports.findUserByUsername = async (web3, username) => {
  const { dashboard: dashboardSC } = smartContract;
  const DashboardInstance = web3.eth.Contract(dashboardSC.abi, dashboardSC.address);
  return await DashboardInstance.methods.findUser(username).call();
};

