/**
 * User: ggarrido
 * Date: 25/04/19 9:44
 * Copyright 2019 (c) Lightstreams, Granada
 */

import { findUserByUsername, retrieveUserInfo, createUser } from '../smartcontracts/dashboard';
import { deployProfile } from '../smartcontracts/profile';
import { requestFundingFromHolder } from './faucet';

export const createUserDashboard = async (web3, { username, ethAddress }) => {
  const userEthAddress = await findUserByUsername(web3, { username });
  if (userEthAddress !== '0x0000000000000000000000000000000000000000') {
    throw new Error(`Cannot find user ${username}`);
  }

  await requestFundingFromHolder(ethAddress, 5);
  const txReceipt = await deployProfile(web3, { from: ethAddress });
  const profileContractAddr = txReceipt.contractAddress;
  await createUser(web3, { from: ethAddress, ethAddress , username, profileAddress: profileContractAddr });
  return await retrieveUserInfo(web3, { username });
};

export const retrieveUserByUsername = async (web3, { username }) => {
  const ethAddress = await findUserByUsername(web3, { username });
  if (ethAddress === '0x0000000000000000000000000000000000000000') {
    return null;
  }

  return await retrieveUserInfo(web3, { username });
};
//
// export const setProfilePictureData = async (user, item) => {
//   await this.updateUserRootData(user, {
//     profilePicture: {
//       itemId: item.id,
//       meta: item.meta
//     }
//   }); // @TODO Decide how to optimize data stored, one out of both is enough
// };
//
// export const getProfilePictureData = async (user) => {
//   const rootData = await this.retrieveUserRootData(user);
//   return rootData.profilePicture || {};
// };
//
// export const getItemRequestsData = async (user) => {
//   const rootData = await this.retrieveUserRootData(user);
//   return rootData.permissionsByItem || {};
// };
//
// export const retrieveUserRootData = async (user) => {
//   if (!user.rootIPFS || user.rootIPFS === '') {
//     return {}
//   }
//
//   const { token } = await gateway.user.signIn(web3Cfg.holder, web3Cfg.password); // @TODO Cache it somewhere
//   return await gateway.storage.fetch(user.rootIPFS, token);
// };
//
// export const updateUserRootData = async (user, values) => {
//   const curRootData = await this.retrieveUserRootData(user);
//   const nextRootData = {
//     ...curRootData,
//     ...values
//   };
//
//   const tmpFile = tempfile('.json');
//   fs.writeFileSync(tmpFile, JSON.stringify(nextRootData));
//   const nextRootDataStream = fs.createReadStream(tmpFile);
//   try {
//     const gwRes = await gateway.storage.add(web3Cfg.holder, web3Cfg.password, nextRootDataStream, { throwHttpErrors: true });
//     console.log(`Created new root data for user ${user.username}: ${JSON.stringify(gwRes)}`);
//     const { is_granted } = await gateway.acl.grantPublic(gwRes.acl, web3Cfg.holder, web3Cfg.password);
//     if (!is_granted) {
//       throw new Error(`Failed to grant public access to: ${JSON.stringify(gwRes)}`);
//     }
//     await DashboardSC.setNextRootDataId(await Web3(), user, gwRes.meta);
//     fs.unlinkSync(tmpFile);
//     return nextRootData;
//   } catch ( err ) {
//     fs.unlinkSync(tmpFile);
//     if (err.host) {
//       const gwErr = JSON.parse(err.body);
//       throw new Error(gwErr.error.message);
//     }
//     throw err;
//   }
// };
//
// export const createNewItemPermissionRequest = async (user, { fromUsername, toUsername }, itemId, status) => {
//   // @TODO Filter duplicated requests
//   const curRequestList = await this.getItemRequestsData(user);
//   const nextItemRequests = curRequestList[itemId] || [];
//   // @TODO Use classes instead of raw objects
//   if (fromUsername) {
//     nextItemRequests.push({
//       from: fromUsername,
//       status: status,
//       createdAt: Date.now()
//     });
//   } else if (toUsername) {
//     nextItemRequests.push({
//       to: toUsername,
//       status: status,
//       createdAt: Date.now()
//     });
//   } else {
//     throw new Error(`Missing argument`);
//   }
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
//
//
// export const denyPermissionRequest = async (user, toUsername, itemId) => {
//   // return await this.updatePendingRequestItemAccess(user, fromUsername, itemId, 'denied');
//   return await this.createNewItemPermissionRequest(user, { toUsername: toUsername }, itemId, 'denied');
// };
//
// export const grantReadAccess = async (user, toUsername, itemId) => {
//   const web3 = await Web3();
//   const item = await ProfileService.retrieveRemoteItem(user, itemId);
//   if (!item) {
//     throw new Error(`Cannot find item '${itemId}'`);
//   }
//
//   const beneficiaryUser = await this.retrieveUserByUsername(toUsername);
//   if (!beneficiaryUser) {
//     throw new Error(`Cannot find username '${toUsername}'`);
//   }
//   await gateway.acl.grant(item.acl, user.ethAddress, user.password, beneficiaryUser.ethAddress, "read");
//
//   return await this.createNewItemPermissionRequest(user, { toUsername: toUsername }, itemId, 'granted');
// };
//
// export const revokeAccess = async (user, toUsername, itemId) => {
//   const web3 = await Web3();
//   const item = await ProfileService.retrieveRemoteItem(user, itemId);
//   if (!item) {
//     throw new Error(`Cannot find item '${itemId}'`);
//   }
//
//   const beneficiaryUser = await this.retrieveUserByUsername(toUsername);
//   if (!beneficiaryUser) {
//     throw new Error(`Cannot find username '${toUsername}'`);
//   }
//   await gateway.acl.revoke(item.acl, user.ethAddress, user.password, beneficiaryUser.ethAddress);
//
//   // await this.updatePendingRequestItemAccess(user, toUsername, itemId, 'denied');
//   return await this.createNewItemPermissionRequest(user, { toUsername: toUsername }, itemId, 'revoked');
// };