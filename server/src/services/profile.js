const Web3 = require('src/services/web3');
const streams = require('memory-streams');
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
    const reqStream = await gateway.storage.addProxy(user.ethAddress, password, file);
    const resStream = new streams.WritableStream();

    resStream.on('finish', async () => {
      const gwRes = JSON.parse(resStream.toString());
      debug(`Leth gateway response: ${JSON.stringify(gwRes)}`);
      if (gwRes.error) {
        reject(gwRes);
      }

      try {
        const itemId = await profileSCService.stackItem(await Web3(), user, password,
          { title, description, meta: gwRes.meta, acl: gwRes.acl, profileAddress: user.profileAddress });

        // Granting admin access to Profile SC of the new file
        await gateway.acl.grant(gwRes.acl, user.ethAddress, password, user.profileAddress, 'admin');
        // Granting admin access to Dashboard SC of the new file
        await gateway.acl.grant(gwRes.acl, user.ethAddress, password, dashboardSC.address, 'admin');

        const item = {
          item_id: itemId,
          owner: user.ethAddress,
          title: title,
          description: description,
          meta: gwRes.meta,
          acl: gwRes.acl,
        };

        debug(`File was uploaded correctly. ${JSON.stringify(item)}`);
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
      const gwErr = JSON.parse(err.body);
      reject(new Error(gwErr.error.message));
    }).pipe(resStream);
  });
};

module.exports.retrieveRemoteItem = async (user, itemId) => {
  const web3 = await Web3();
  const item = await profileSCService.retrieveItemById(web3, user.profileAddress, itemId);
  // const permissions = await profileSCService.retrieveItemPermissionsById(web3, item);

  return { ...item, id: itemId };
};

module.exports.retrieveRemoteItemList = async (user) => {
  const web3 = await Web3();
  const remoteMaxItemId = await profileSCService.getMaxItemId(web3, user.profileAddress);

  const items = [];
  for ( let i = 0; i <= remoteMaxItemId; i++ ) {
    const item = await this.retrieveRemoteItem(user, i);
    items.push(item);
    // const itemEvents = await Event.filterByUuid(item.meta);
    // items.push({
    //   ...item, events: itemEvents
    // });
  }

  return items;
};


// module.exports.verifyUser = async (username, password) => {
//   const user = await Profile.findOneByUsername(username);
//   if (!user) {
//     throw new UserServiceError(`User ${username} is not found`);
//   }
//
//   let passwordIsValid;
//   try {
//     passwordIsValid = bcrypt.compareSync(password, user.password);
//   } catch ( err ) {
//     throw new UserServiceError(`Invalid password`);
//   }
//
//   if (!passwordIsValid) {
//     throw new UserServiceError(`Password does not match`);
//   }
//
//   return user;
// };
//
// module.exports.updateUser = async (username, values) => {
//   const user = await Profile.findOneByUsername(username);
//   if (!user) {
//     throw new UserServiceError(`User ${username} is not found`);
//   }
//
//   await user.update(values);
//   return user;
// };
//
// module.exports.searchUserByUsername = async (username) => {
//   const user = await Profile.findOneByUsername(username);
//   if (!user) {
//     throw new UserServiceError(`User ${username} is not found`);
//   }
//
//   return user;
// };