/**
 * User: ggarrido
 * Date: 25/04/19 9:44
 * Copyright 2019 (c) Lightstreams, Granada
 */

// const { item: Item, event: Event } = require('src/models');
const { TYPE: EventType } = require('src/models/event');

const Web3 = require('src/services/web3');
const gateway = require('src/services/gateway').gateway();
const { web3Cfg } = require('src/lib/config');
const streams = require('memory-streams');
const fs = require('fs');
const tempfile = require('tempfile');

// const { requestFunding } = require('src/services/faucet');
// const profileSCService = require('src/smartcontracts/profile');
const dashboardSCService = require('src/smartcontracts/dashboard');
const debug = require('debug')('app:dashboard');

module.exports.createUserDashboard = async ({ username, ethAddress, profileAddress }) => {
  const web3 = await Web3();
  return await dashboardSCService.createUser(web3, { username, ethAddress, profileAddress });
};

module.exports.retrieveUserByUsername = async (username) => {
  const web3 = await Web3();
  const userEthAddress = await dashboardSCService.findUserByUsername(web3, username); // @TODO Migrate to SC data
  if (userEthAddress === '0x0000000000000000000000000000000000000000') {
    return null;
  }

  return await dashboardSCService.retrieveUserInfo(web3, userEthAddress);
};

// module.exports.requestItemAccess = async (user, meta) => {
//   event = await Event.create({
//     user_id: user.id,
//     uuid: meta,
//     type: EventType.REQUEST,
//     payload: {}
//   });
//
//   return event;
// };

module.exports.setProfilePictureData = async (user, item) => {
  await this.updateUserRootData(user, {
    profilePicture: {
      itemId: item.id,
      meta: item.meta
    }
  }); // @TODO Decide how to optimize data stored, one out of both is enough
};

module.exports.getProfilePictureData = async (user) => {
  const rootData = await this.getUserRootData(user);
  return rootData.profilePicture || {};
};

module.exports.getUserRootData = async(user) => {
  if(!user.rootIPFS || user.rootIPFS === '') {
    return {}
  }

  const { token } = await gateway.user.signIn(web3Cfg.from, web3Cfg.password); // @TODO Cache it somewhere
  const gwResRaw = await gateway.storage.fetch(user.rootIPFS, token);
  return gwResRaw.body;
};

module.exports.updateUserRootData = async (user, values) => {
  const curRootData = this.getUserRootData(user);
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
  } catch(err) {
    if (err.host) {
      const gwErr = JSON.parse(err.body);
      throw new Error(gwErr.error.message);
    }
    throw err;
  }
  await dashboardSCService.setNextRootDataId(await Web3(), user, gwRes.meta);
  return nextRootData;
};

// module.exports.updateUsersDataFromEvent = async(event) => {
//   // @TODO: Store on user_id RootIdIPFS
//   // @TODO: Store on meta owner RootIdIPFS
// };

// module.exports.denyRequestItemAccess = async (user, item_id, { requestId }) => {
//   const item = await this.retrieveRemoteItemInfo(user, item_id);
//   if (!item) {
//     throw new Error(`Item was not found '${item_id}'`);
//   }
//
//   event = await Event.create({
//     user_id: user.id,
//     uuid: item.meta,
//     type: EventType.DENIED,
//     payload: {
//       request_id: requestId
//     }
//   });
//
//   return event;
// };

// module.exports.getEvents = async (user) => {
//   const items = await this.retrieveRemoteItemList(user);
//   const userEvents = await Event.filterByUserId(user.id);
//
//   const itemMetaIds = items.map((item) => item.meta).filter((meta) => meta !== "");
//   const metaEvents = await Event.filterByUuid(itemMetaIds);
//
//   // @TODO Implement event aggregation by itemId(uuid)
//   return {
//     myUser: userEvents,
//     myItems: metaEvents
//   };
// };

module.exports.grantReadAccess = async (user, item_id, beneficiaryUser) => {
  const web3 = await Web3();
  const item = await this.retrieveRemoteItem(user, item_id);
  if (!item) {
    throw new Error(`Cannot find item '${item_id}'`);
  }

  await dashboardSCService.grantReadAccess(web3, user, item_id, beneficiaryUser.eth_address);

  event = await Event.create({
    user_id: user.id,
    uuid: item.meta,
    type: EventType.GRANTED,
    payload: {}
  });

  return event;
};

module.exports.revokeAccess = async (user, item_id, beneficiaryUser) => {
  const web3 = await Web3();
  const item = await this.retrieveRemoteItem(user, item_id);
  if (!item) {
    throw new Error(`Cannot find item '${item_id}'`);
  }

  await dashboardSCService.revokeAccess(web3, user, item_id, beneficiaryUser.eth_address);

  event = await Event.create({
    user_id: user.id,
    uuid: item.meta,
    type: EventType.REVOKED,
    payload: {}
  });

  return event;
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