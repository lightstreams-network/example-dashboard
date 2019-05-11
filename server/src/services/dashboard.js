/**
 * User: ggarrido
 * Date: 25/04/19 9:44
 * Copyright 2019 (c) Lightstreams, Granada
 */

const { shelveItem: ShelveItem } = require('src/models');
const { items: Items } = require('src/models');
const Web3 = require('src/services/web3');
const { sendPhtTo } = require('src/services/web3');
const gateway = require('src/services/gateway').gateway();

const profileSCService = require('src/smartcontracts/profile');
const dashboardSCService = require('src/smartcontracts/dashboard');
const streams = require('memory-streams');
const debug = require('debug')('app:dashboard');

module.exports.createUserDashboard = async (user) => {
  const web3 = await Web3();
  const dashboardAddress = await dashboardSCService.createUserDashboard(web3, {
    username: user.username,
    profileAddress: user.profile_address
  });

  await user.update({
    dashboard_address: dashboardAddress
  })
};

module.exports.uploadNewItem = (user, password, { title, description, file }) => {
  return new Promise(async (resolve, reject) => {
    const web3 = await Web3();
    const amountInPht = 0.7;
    await sendPhtTo(web3, user.eth_address, amountInPht);
    const reqStream = await gateway.storage.addProxy(user.eth_address, password, file);
    const resStream = new streams.WritableStream();

    resStream.on('finish', async () => {
      const gwRes = JSON.parse(resStream.toString());
      debug(`Leth gateway response: ${JSON.stringify(gwRes)}`);
      if (gwRes.error) {
        reject(gwRes);
      }

      try {
        const itemId = await profileSCService.stackItem(await Web3(),
          { from: user.eth_address, password: password },
          { title, description, meta: gwRes.meta, acl: gwRes.acl, profileAddress: user.profile_address });

        Items.create({
          item_id: itemId,
          user_id: user.id,
          title: title,
          description: description,
          meta: gwRes.meta,
          acl: gwRes.acl,
        });
        // Granting admin access to Dashboard SC of the new file
        await gateway.acl.grant(gwRes.acl, user.eth_address, password, user.dashboard_address, 'admin');
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

module.exports.syncItems = async () => {
  const web3 = await Web3();
  const localMaxItemId = (await ShelveItem.getMaxItemId() || 0) + 1;
  const remoteMaxItemId = await profileSCService.getMaxItemId(web3);

  // @TODO Optimize running in parallel
  for ( let i = localMaxItemId; i <= remoteMaxItemId; i++ ) {
    await this.updateRemoteItem(i);
  }
};
