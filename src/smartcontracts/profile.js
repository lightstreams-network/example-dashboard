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
//
// module.exports.address = () => {
//   const { shelves: shelvesSC } = smartContract;
//   return shelvesSC.address;
// };
//
// module.exports.getMaxItemId = (web3, profileAddress) => {
//   const { profile: profileSC } = smartContract;
//   const Profile = new web3.eth.Contract(profileSC.abi, profileAddress);
//   return Profile.methods.lastItemId().call();
// };
//
//
//
// module.exports.stackItem = async (web3, user, { title, description, meta, acl, profileAddress }) => {
//   const { profile: profileSC } = smartContract;
//
//   const txReceipt = await web3SendTx(web3, () => {
//     const Profile = new web3.eth.Contract(profileSC.abi, profileAddress);
//     return Profile.methods.stackItem(title, description, meta, acl);
//   }, {
//     gas: '1200000', from: user.ethAddress, password: user.password
//   });
//
//   return txReceipt.events.StackItem.returnValues['_itemId'];
// };
//
// module.exports.retrieveItemById = async (web3, profileAddress, itemId) => {
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
// module.exports.retrieveItemPermissionsById = async (web3, item) => {
//   const { permissionedFile: permissionedFileSC } = smartContract;
//
//   const File = new web3.eth.Contract(permissionedFileSC.abi, item.acl);
//   const permissionsObj = await File.methods.permissions().call();
//   return permissionsObj;
// };