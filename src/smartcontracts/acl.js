/**
 * User: ggarrido
 * Date: 11/04/19 17:06
 * Copyright 2019 (c) Lightstreams, Granada
 */

import { Web3 } from 'lightstreams-js-sdk';
import { contracts } from '../constants/config'

export const deployContract = async (web3, { from, owner, isPublic }) => {
  return Web3.deployContract(web3, {
    abi: contracts.acl.abi,
    bytecode: contracts.acl.bytecode,
    from,
    params: [owner, isPublic]
  });
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