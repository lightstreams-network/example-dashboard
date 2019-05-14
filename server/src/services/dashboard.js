/**
 * User: ggarrido
 * Date: 25/04/19 9:44
 * Copyright 2019 (c) Lightstreams, Granada
 */

// const { item: Item, event: Event } = require('src/models');
const Web3 = require('src/services/web3');
const gateway = require('src/services/gateway').gateway();
const { web3Cfg } = require('src/lib/config');
const fs = require('fs');
const tempfile = require('tempfile');

// const { requestFunding } = require('src/services/faucet');
// const ProfileSCService = require('src/smartcontracts/profile');
const ProfileService = require('src/services/profile');
const DashboardSCService = require('src/smartcontracts/dashboard');
const debug = require('debug')('app:dashboard');

module.exports.createUserDashboard = async ({ username, ethAddress, profileAddress }) => {
  const web3 = await Web3();
  return await DashboardSCService.createUser(web3, { username, ethAddress, profileAddress });
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

  const { token } = await gateway.user.signIn(web3Cfg.from, web3Cfg.password); // @TODO Cache it somewhere
  const gwResRaw = await gateway.storage.fetch(user.rootIPFS, token);
  return gwResRaw.body;
};

module.exports.updateUserRootData = async (user, values) => {
  const curRootData = await this.retrieveUserRootData(user);
  const nextRootData = {
    ...curRootData,
    ...values
  };

  // @TODO Improve to use stream-memory
  const tmpFile = tempfile('.json');
  fs.writeFileSync(tmpFile, JSON.stringify(nextRootData));
  const nextRootDataStream = fs.createReadStream(tmpFile);

  let gwRes;
  try {
    const gwResRaw = await gateway.storage.add(web3Cfg.from, web3Cfg.password, nextRootDataStream, { throwHttpErrors: true });
    gwRes = JSON.parse(gwResRaw.body);
  } catch ( err ) {
    if (err.host) {
      const gwErr = JSON.parse(err.body);
      throw new Error(gwErr.error.message);
    }
    throw err;
  }
  await DashboardSCService.setNextRootDataId(await Web3(), user, gwRes.meta);
  return nextRootData;
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

// module.exports.updatePendingRequestItemAccess = async (user, toUsername, itemId, nextStatus) => {
//   const curRequestList = await this.getItemRequestsData(user);
//   const curItemRequests = curRequestList[itemId] || [];
//   const nextItemRequests = curItemRequests.map(req => {
//     if (req.status === 'pending' && req.from === toUsername) {
//       req.status = nextStatus;
//     }
//     return req;
//   });
//
//   await this.updateUserRootData(user, {
//     permissionsByItem: {
//       ...curRequestList,
//       [itemId]: nextItemRequests
//     },
//   });
//
//   return nextItemRequests;
// };

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
  await DashboardSCService.grantReadAccess(web3, user, itemId, beneficiaryUser.ethAddress);

  // await this.updatePendingRequestItemAccess(user, toUsername, itemId, 'accepted');
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
  await DashboardSCService.revokeAccess(web3, user, itemId, beneficiaryUser.ethAddress);

  // await this.updatePendingRequestItemAccess(user, toUsername, itemId, 'denied');
  return await this.createNewItemPermissionRequest(user, { toUsername: toUsername }, itemId, 'revoked');
};

// module.exports.syncItems = async () => {
//   const web3 = await Web3();
//   const localMaxItemId = (await ShelveItem.getMaxItemId() || 0) + 1;
//   const remoteMaxItemId = await profileSCService.getMaxItemId(web3);
//
//   // @TODO Optimize running in parallel
//   for ( let i = localMaxItemId; i <= remoteMaxItemId; i++ ) {
//     await this.updateRemoteItem(i);
//   }
// };