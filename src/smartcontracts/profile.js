/**
 * User: ggarrido
 * Date: 11/04/19 17:06
 * Copyright 2019 (c) Lightstreams, Granada
 */

import { Web3 } from 'lightstreams-js-sdk';
import { contracts } from '../constants/config'

export const deployContract = async (web3, { from }) => {
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

  return txReceipt.events.StackItem.returnValues['_itemId'];
};

export const getMaxItemId = (web3, { contractAddr }) => {
  return Web3.contractCall(web3, {
    to: contractAddr,
    abi: contracts.profile.abi,
    method: 'lastItemId',
  });
};

export const retrieveItemById = async (web3, { contractAddr, itemId }) => {
  return Web3.contractCall(web3, {
    to: contractAddr,
    abi: contracts.profile.abi,
    method: 'items',
    params: [itemId]
  }).then(itemObj => {
    return {
      title: itemObj.title,
      description: itemObj.description,
      meta: itemObj.meta,
      acl: itemObj.acl,
    }
  });
};

//
// export const address = () => {
//   const { shelves: shelvesSC } = smartContract;
//   return shelvesSC.address;
// };
//

//
//
//
//

//
// export const retrieveItemPermissionsById = async (web3, item) => {
//   const { permissionedFile: permissionedFileSC } = smartContract;
//
//   const File = new web3.eth.Contract(permissionedFileSC.abi, item.acl);
//   const permissionsObj = await File.methods.permissions().call();
//   return permissionsObj;
// };