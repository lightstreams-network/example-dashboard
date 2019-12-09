/**
 * User: ggarrido
 * Date: 25/04/19 9:44
 * Copyright 2019 (c) Lightstreams, Granada
 */

// const { item: Item, event: Event } = require('src/models');
const Web3 = require('src/services/web3');
const gateway = require('src/services/gateway').gateway();
const fs = require('fs');
const { web3Cfg } = require('src/lib/config');
const tempfile = require('tempfile');
const debug = require('debug')('app:dashboard');

const ProfileService = require('src/services/profile');
const DashboardSCService = require('src/smartcontracts/dashboard');

module.exports.createUserDashboard = async ({ ethAddress, username, profileAddress }) => {
  const web3 = await Web3();
  return await DashboardSCService.createUser(web3, { ethAddress, username, profileAddress });
};

module.exports.retrieveUserByUsername = async (username) => {
  const web3 = await Web3();
  const userEthAddress = await DashboardSCService.findUserByUsername(web3, username); // @TODO Migrate to SC data
  if (userEthAddress === '0x0000000000000000000000000000000000000000') {
    return null;
  }

  return await DashboardSCService.retrieveUserInfo(web3, userEthAddress);
};

module.exports.setProfilePictureData = async (user, item) => {
  await this.updateUserRootData(user, {
    profilePicture: {
      itemId: item.id,
      meta: item.meta
    }
  }); // @TODO Decide how to optimize data stored, one out of both is enough
};

module.exports.getProfilePictureData = async (user) => {
  const rootData = await this.retrieveUserRootData(user);
  return rootData.profilePicture || {};
};

module.exports.getItemRequestsData = async (user) => {
  const rootData = await this.retrieveUserRootData(user);
  return rootData.permissionsByItem || {};
};

module.exports.retrieveUserRootData = async (user) => {
  if (!user.rootIPFS || user.rootIPFS === '') {
    return {}
  }

  const { token } = await gateway.user.signIn(web3Cfg.holder, web3Cfg.password); // @TODO Cache it somewhere
  return await gateway.storage.fetch(user.rootIPFS, token);
};

module.exports.updateUserRootData = async (user, values) => {
  const curRootData = await this.retrieveUserRootData(user);
  const nextRootData = {
    ...curRootData,
    ...values
  };

  const tmpFile = tempfile('.json');
  fs.writeFileSync(tmpFile, JSON.stringify(nextRootData));
  const nextRootDataStream = fs.createReadStream(tmpFile);
  try {
    const gwRes = await gateway.storage.add(web3Cfg.holder, web3Cfg.password, nextRootDataStream, { throwHttpErrors: true });
    debug(`Created new root data for user ${user.username}: ${JSON.stringify(gwRes)}`);
    const { is_granted } = await gateway.acl.grantPublic(gwRes.acl, web3Cfg.holder, web3Cfg.password);
    if (!is_granted) {
      throw new Error(`Failed to grant public access to: ${JSON.stringify(gwRes)}`);
    }
    await DashboardSCService.setNextRootDataId(await Web3(), user, gwRes.meta);
    fs.unlinkSync(tmpFile);
    return nextRootData;
  } catch ( err ) {
    fs.unlinkSync(tmpFile);
    if (err.host) {
      const gwErr = JSON.parse(err.body);
      throw new Error(gwErr.error.message);
    }
    throw err;
  }
};

module.exports.createNewItemPermissionRequest = async (user, { fromUsername, toUsername }, itemId, status) => {
  // @TODO Filter duplicated requests
  const curRequestList = await this.getItemRequestsData(user);
  const nextItemRequests = curRequestList[itemId] || [];
  // @TODO Use classes instead of raw objects
  if (fromUsername) {
    nextItemRequests.push({
      from: fromUsername,
      status: status,
      createdAt: Date.now()
    });
  } else if (toUsername) {
    nextItemRequests.push({
      to: toUsername,
      status: status,
      createdAt: Date.now()
    });
  } else {
    throw new Error(`Missing argument`);
  }

  await this.updateUserRootData(user, {
    permissionsByItem: {
      ...curRequestList,
      [itemId]: nextItemRequests
    },
  });

  return nextItemRequests;
};


module.exports.denyPermissionRequest = async (user, toUsername, itemId) => {
  // return await this.updatePendingRequestItemAccess(user, fromUsername, itemId, 'denied');
  return await this.createNewItemPermissionRequest(user, { toUsername: toUsername }, itemId, 'denied');
};

module.exports.grantReadAccess = async (user, toUsername, itemId) => {
  const web3 = await Web3();
  const item = await ProfileService.retrieveRemoteItem(user, itemId);
  if (!item) {
    throw new Error(`Cannot find item '${itemId}'`);
  }

  const beneficiaryUser = await this.retrieveUserByUsername(toUsername);
  if (!beneficiaryUser) {
    throw new Error(`Cannot find username '${toUsername}'`);
  }
  await gateway.acl.grant(item.acl, user.ethAddress, user.password, beneficiaryUser.ethAddress, "read");

  return await this.createNewItemPermissionRequest(user, { toUsername: toUsername }, itemId, 'granted');
};

module.exports.revokeAccess = async (user, toUsername, itemId) => {
  const web3 = await Web3();
  const item = await ProfileService.retrieveRemoteItem(user, itemId);
  if (!item) {
    throw new Error(`Cannot find item '${itemId}'`);
  }

  const beneficiaryUser = await this.retrieveUserByUsername(toUsername);
  if (!beneficiaryUser) {
    throw new Error(`Cannot find username '${toUsername}'`);
  }
  await gateway.acl.revoke(item.acl, user.ethAddress, user.password, beneficiaryUser.ethAddress);

  // await this.updatePendingRequestItemAccess(user, toUsername, itemId, 'denied');
  return await this.createNewItemPermissionRequest(user, { toUsername: toUsername }, itemId, 'revoked');
};