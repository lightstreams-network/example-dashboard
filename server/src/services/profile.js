const Web3 = require('src/services/web3');
const debug = require('debug')('app:profile');

const gateway = require('src/services/gateway').gateway();
const { requestFunding } = require('src/services/faucet');
const profileSCService = require('src/smartcontracts/profile');
const { dashboard: dashboardSC } = require('src/lib/config').smartContract;

module.exports.UserServiceError = class UserServiceError extends Error {};

module.exports.createUser = async (ethAddress, password) => {
  const web3 = await Web3();

  await requestFunding(ethAddress, 1);
  return await profileSCService.createProfile(web3, { from: ethAddress, password });
};

module.exports.uploadNewItem = (user, password, { title, description, file }) => {
  return new Promise(async (resolve, reject) => {

    await requestFunding(user.ethAddress, 1);
    const gwRes = await gateway.storage.add(user.ethAddress, password, file);
    debug(`Leth gateway response: ${JSON.stringify(gwRes)}`);
    if (gwRes.error) {
      reject(gwRes);
    }

    const itemId = await profileSCService.stackItem(await Web3(), user, password,
      { title, description, meta: gwRes.meta, acl: gwRes.acl, profileAddress: user.profileAddress });

    // Granting admin access to Profile SC of the new file
    await gateway.acl.grant(gwRes.acl, user.ethAddress, password, user.profileAddress, 'admin');
    // Granting admin access to Dashboard SC of the new file
    await gateway.acl.grant(gwRes.acl, user.ethAddress, password, dashboardSC.address, 'admin');

    const item = {
      id: itemId,
      owner: user.ethAddress,
      title: title,
      description: description,
      meta: gwRes.meta,
      acl: gwRes.acl,
    };

    debug(`File was uploaded correctly. ${JSON.stringify(item)}`);
    resolve(itemId);
  });
};

module.exports.retrieveRemoteItem = async (user, itemId) => {
  const web3 = await Web3();
  const item = await profileSCService.retrieveItemById(web3, user.profileAddress, itemId);

  return { ...item, id: itemId };
};

module.exports.retrieveRemoteItemList = async (user) => {
  const web3 = await Web3();
  const remoteMaxItemId = await profileSCService.getMaxItemId(web3, user.profileAddress);

  const items = [];
  for ( let i = 0; i <= remoteMaxItemId; i++ ) {
    const item = await this.retrieveRemoteItem(user, i);
    items.push(item);
  }

  return items;
};