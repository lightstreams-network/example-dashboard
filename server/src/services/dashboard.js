/**
 * User: ggarrido
 * Date: 25/04/19 9:44
 * Copyright 2019 (c) Lightstreams, Granada
 */

const { item: Item, event: Event, user: User } = require('src/models');
const { TYPE: EventType } = require('src/models/event');

const Web3 = require('src/services/web3');
const gateway = require('src/services/gateway').gateway();
const { dashboard: dashboardSC } = require('src/lib/config').smartContract;

const { requestFunding } = require('src/services/faucet');
const profileSCService = require('src/smartcontracts/profile');
const dashboardSCService = require('src/smartcontracts/dashboard');
const streams = require('memory-streams');
const debug = require('debug')('app:dashboard');

module.exports.createUserDashboard = async (user) => {
  const web3 = await Web3();
  const dashboardAddress = await dashboardSCService.createUser(web3, user);

  await user.update({
    dashboard_address: dashboardAddress
  })
};

module.exports.uploadNewItem = (user, password, { title, description, file }) => {
  return new Promise(async (resolve, reject) => {

    await requestFunding(user.eth_address, 1);
    const reqStream = await gateway.storage.addProxy(user.eth_address, password, file);
    const resStream = new streams.WritableStream();

    resStream.on('finish', async () => {
      const gwRes = JSON.parse(resStream.toString());
      debug(`Leth gateway response: ${JSON.stringify(gwRes)}`);
      if (gwRes.error) {
        reject(gwRes);
      }

      try {
        const itemId = await profileSCService.stackItem(await Web3(), user, password,
          { title, description, meta: gwRes.meta, acl: gwRes.acl, profileAddress: user.profile_address });

        Item.create({
          item_id: itemId,
          user_id: user.id,
          title: title,
          description: description,
          meta: gwRes.meta,
          acl: gwRes.acl,
        });

        // Granting admin access to Profile SC of the new file
        await gateway.acl.grant(gwRes.acl, user.eth_address, password, user.profile_address, 'admin');
        // Granting admin access to Dashboard SC of the new file
        await gateway.acl.grant(gwRes.acl, user.eth_address, password, dashboardSC.address, 'admin');

        debug(`File was added correctly. ID: ${itemId}`);
        resolve(itemId);
      } catch ( err ) {
        debug(`ERROR: ${err}`);
        reject(err);
      }
    });

    reqStream.on('uploadProgress', progress => {
      debug(`Uploaded ${progress.transferred} Bytes`);
      if (progress.percent === 1) {
        debug("Upload completed");
      }
    }).on('error', err => {
      debug(`ERROR: ${err}`);
      reject(err);
    }).pipe(resStream);
  });
};

module.exports.retrieveRemoteItemInfo = async (user, itemId) => {
  const web3 = await Web3();
  const item = await profileSCService.retrieveItemById(web3, user.profile_address, itemId);
  // const permissions = await profileSCService.retrieveItemPermissionsById(web3, item);

  return { ...item, id: itemId };
};

module.exports.retrieveRemoteItemList = async (user) => {
  const web3 = await Web3();
  const remoteMaxItemId = await profileSCService.getMaxItemId(web3, user.profile_address);

  const items = [];
  for ( let i = 0; i <= remoteMaxItemId; i++ ) {
    const item = await this.retrieveRemoteItemInfo(user, i);
    const itemEvents = await Event.filterByUuid(item.meta);
    items.push({
      ...item, events: itemEvents
    });
  }

  return items;
};

module.exports.requestItemAccess = async (user, meta) => {
  event = await Event.create({
    user_id: user.id,
    uuid: meta,
    type: EventType.REQUEST,
    payload: {}
  });

  return event;
};

module.exports.updateUsersDataFromEvent = async(event) => {
  // @TODO: Store on user_id RootIdIPFS
  // @TODO: Store on meta owner RootIdIPFS
};

module.exports.denyRequestItemAccess = async (user, item_id, { requestId }) => {
  const item = await this.retrieveRemoteItemInfo(user, item_id);
  if (!item) {
    throw new Error(`Item was not found '${item_id}'`);
  }

  event = await Event.create({
    user_id: user.id,
    uuid: item.meta,
    type: EventType.DENIED,
    payload: {
      request_id: requestId
    }
  });

  return event;
};

module.exports.getEvents = async (user) => {
  const items = await this.retrieveRemoteItemList(user);
  const userEvents = await Event.filterByUserId(user.id);

  const itemMetaIds = items.map((item) => item.meta).filter((meta) => meta !== "");
  const metaEvents = await Event.filterByUuid(itemMetaIds);

  return {
    myUser: userEvents,
    myItems: metaEvents
  };
};

module.exports.grantReadAccess = async (user, item_id, beneficiaryUser) => {
  const web3 = await Web3();
  const item = await this.retrieveRemoteItemInfo(user, item_id);
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

module.exports.revokeAccess = async (user, item_id, beneficiaryUserId) => {
  const beneficiaryUser = await User.findByPk(beneficiaryUserId);
  if (!beneficiaryUser) {
    throw new Error(`User '${beneficiaryUserId}' not found`)
  }
  const web3 = await Web3();
  const item = await this.retrieveRemoteItemInfo(user, item_id);
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

module.exports.syncItems = async () => {
  const web3 = await Web3();
  const localMaxItemId = (await ShelveItem.getMaxItemId() || 0) + 1;
  const remoteMaxItemId = await profileSCService.getMaxItemId(web3);

  // @TODO Optimize running in parallel
  for ( let i = localMaxItemId; i <= remoteMaxItemId; i++ ) {
    await this.updateRemoteItem(i);
  }
};