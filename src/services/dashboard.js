/**
 * User: ggarrido
 * Date: 25/04/19 9:44
 * Copyright 2019 (c) Lightstreams, Granada
 */

import { Gateway, Leth } from 'lightstreams-js-sdk';
import { gatewayCfg } from '../constants/config';
import {
  findUserByUsername,
  retrieveUserInfo,
  createUser,
  setNextRootDataId,
  retrievePublicAclAddr
} from '../smartcontracts/dashboard';
import { deployContract as deployContractProfile } from '../smartcontracts/profile';
import { retrieveRemoteItemList, retrieveRemoteItem } from './profile';
import { requestFundingFromHolder } from './faucet';

export const createUserDashboard = async (web3, { username, ethAddress }) => {
  const userEthAddress = await findUserByUsername(web3, { username });
  if (userEthAddress !== '0x0000000000000000000000000000000000000000') {
    throw new Error(`Cannot find user ${username}`);
  }

  await requestFundingFromHolder(ethAddress, 5);
  const txReceipt = await deployContractProfile(web3, { from: ethAddress });
  const profileContractAddr = txReceipt.contractAddress;
  await createUser(web3, { from: ethAddress, ethAddress, username, profileAddress: profileContractAddr });
  return await retrieveUserInfo(web3, { username });
};

export const retrieveUserByUsername = async (web3, { username }) => {
  const ethAddress = await findUserByUsername(web3, { username });
  if (ethAddress === '0x0000000000000000000000000000000000000000') {
    return null;
  }

  return await retrieveUserInfo(web3, { username });
};

export const getUserFileList = async (web3, { username, token }) => {
  const user = await retrieveUserByUsername(web3, { username });
  if (!user) {
    throw new Error(`User ${username} dose not exists`);
  }

  const items = await retrieveRemoteItemList(web3, { user });
  const itemRequests = await getItemRequestsData({ user, token });
  return items.map((item) => {
    item.events = itemRequests[item.id] || [];
    return item;
  });
};

export const requestAccessToFile = async (web3, { fromUser, toUsername, itemId, token }) => {
  const toUser = await retrieveUserByUsername(web3, { username: toUsername });
  if (!toUser) {
    throw new Error(`User ${toUsername} dose not exists`);
  }

  const curRootData = await retrieveUserRootData({ user: toUser, token });
  const nextRootData = insertPermissionItemRequest(curRootData, {
    fromUsername: fromUser.username,
    toUsername,
    itemId,
    status: 'pending'
  });

  const gateway = Gateway(gatewayCfg.provider);
  await updateUserRootData(web3, gateway, fromUser, { user: toUser, nextRootData });
  return nextRootData.permissionsByItem[itemId];
};

export const grantReadAccess = async (web3, { fromUser, toUsername, itemId, token }) => {
  const toUser = await retrieveUserByUsername(web3, { username: toUsername });
  if (!toUser) {
    throw new Error(`User ${toUsername} dose not exists`);
  }

  const item = await retrieveRemoteItem(web3, { user: fromUser, itemId });
  const curRootData = await retrieveUserRootData({ user: toUser, token });
  const nextRootData = insertPermissionItemRequest(curRootData, {
    fromUsername: fromUser.username,
    toUsername,
    itemId,
    status: 'granted'
  });

  const gateway = Gateway(gatewayCfg.provider);
  await Leth.ACL.grantRead(web3, {
    from: fromUser.ethAddress,
    contractAddr: item.acl,
    account: toUser.ethAddress
  });
  await updateUserRootData(web3, gateway, fromUser, { user: fromUser, nextRootData });
  return nextRootData.permissionsByItem[itemId];
};

export const revokeReadAccess = async (web3, { fromUser, toUsername, itemId, token }) => {
  const toUser = await retrieveUserByUsername(web3, { username: toUsername });
  if (!toUser) {
    throw new Error(`User ${toUsername} dose not exists`);
  }

  const item = await retrieveRemoteItem(web3, { user: fromUser, itemId });
  const curRootData = await retrieveUserRootData({ user: toUser, token });
  const nextRootData = insertPermissionItemRequest(curRootData, {
    fromUsername: fromUser.username,
    toUsername,
    itemId,
    status: 'revoked'
  });

  const gateway = Gateway(gatewayCfg.provider);
  await Leth.ACL.revokeAccess(web3, {
    from: fromUser.ethAddress,
    contractAddr: item.acl,
    account: toUser.ethAddress
  });
  await updateUserRootData(web3, gateway, fromUser, { user: fromUser, nextRootData });
  return nextRootData.permissionsByItem[itemId];
};

/**
 * IPFS
 */

const getItemRequestsData = async ({ user, token }) => {
  const rootData = await retrieveUserRootData({ user, token });
  return rootData.permissionsByItem || {};
};

const retrieveUserRootData = ({ user, token }) => {
  if (!user.rootIPFS || user.rootIPFS === '') {
    return {}
  }

  const gateway = Gateway(gatewayCfg.provider);
  return gateway.storage.fetch(user.rootIPFS, token, false)
  .then(rawData => {
    return rawData;
    // return JSON.parse(rawData);
  });
};

const insertPermissionItemRequest = (curRootData, { fromUsername, toUsername, itemId, status }) => {
  const newRequestItem = {
    from: fromUsername,
    to: toUsername,
    status: status,
    createdAt: Date.now()
  };

  const nextRootData = {
    ...curRootData,
    permissionsByItem: {
      ...(curRootData.permissionsByItem || {})
    }
  };

  if (!nextRootData.permissionsByItem[itemId]) {
    nextRootData.permissionsByItem[itemId] = [newRequestItem]
  } else {
    nextRootData.permissionsByItem[itemId].push(newRequestItem)
  }

  return nextRootData;
};

export const updateUserRootData = async (web3, gateway, fromUser, { user, nextRootData }) => {
  try {
    const data = new Blob([JSON.stringify(nextRootData, null, 2)], { type: 'application/json' });
    const aclAddr = await retrievePublicAclAddr(web3);
    const gwRes = await gateway.storage.addRawWithAcl(fromUser.ethAddress, aclAddr, data, "json");

    await setNextRootDataId(web3, {
      from: fromUser.ethAddress,
      ethAddress: user.ethAddress,
      nextRootDataId: gwRes.meta
    });

    console.log(`User ${fromUser.username} updated root data of user ${user.username} to ${JSON.stringify(gwRes)}`);
    return gwRes.meta;
  } catch ( err ) {
    if (err.host) {
      const gwErr = JSON.parse(err.body);
      throw new Error(gwErr.error.message);
    }
    throw err;
  }
};

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
//
//
// export const denyPermissionRequest = async (user, toUsername, itemId) => {
//   // return await this.updatePendingRequestItemAccess(user, fromUsername, itemId, 'denied');
//   return await this.createNewItemPermissionRequest(user, { toUsername: toUsername }, itemId, 'denied');
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