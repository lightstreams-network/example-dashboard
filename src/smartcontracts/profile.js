/**
 * User: ggarrido
 * Date: 11/04/19 17:06
 * Copyright 2019 (c) Lightstreams, Granada
 */

import { Web3 } from 'lightstreams-js-sdk';
import { contracts } from '../constants/config'

export const deployProfile = async (web3, { from }) => {
  return Web3.deployContract(web3, {
    abi: contracts.profile.abi,
    bytecode: contracts.profile.bytecode,
    from,
    params: []
  });
};

export const stackItem = async (web3, { from, contractAddr, title, description, meta, acl }) => {

  const txReceipt = await Web3.contractSendTx(web3, {
    to: contractAddr,
    from,
    abi: contracts.profile.abi,
    method: 'stackItem',
    params: [title, description, meta, acl]
  });

  debugger;
  return txReceipt.events.StackItem.returnValues['_itemId'];
};
//
// export const address = () => {
//   const { shelves: shelvesSC } = smartContract;
//   return shelvesSC.address;
// };
//
// export const getMaxItemId = (web3, profileAddress) => {
//   const { profile: profileSC } = smartContract;
//   const Profile = new web3.eth.Contract(profileSC.abi, profileAddress);
//   return Profile.methods.lastItemId().call();
// };
//
//
//
//
// export const retrieveItemById = async (web3, profileAddress, itemId) => {
//   const { profile: profileSC } = smartContract;
//   const Profile = new web3.eth.Contract(profileSC.abi, profileAddress);
//   const itemObj = await Profile.methods.items(itemId).call();
//   return {
//     title: itemObj.title,
//     description: itemObj.description,
//     meta: itemObj.meta,
//     acl: itemObj.acl,
//   }
// };
//
// export const retrieveItemPermissionsById = async (web3, item) => {
//   const { permissionedFile: permissionedFileSC } = smartContract;
//
//   const File = new web3.eth.Contract(permissionedFileSC.abi, item.acl);
//   const permissionsObj = await File.methods.permissions().call();
//   return permissionsObj;
// };