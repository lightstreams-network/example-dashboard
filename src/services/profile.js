import { Gateway, Leth } from 'lightstreams-js-sdk';
import { gatewayCfg } from '../constants/config';
import { stackItem, getMaxItemId, retrieveItemById } from '../smartcontracts/profile';


export const uploadNewItem = (web3, user, { title, description, file }) => {
  return new Promise(async (resolve, reject) => {
    const gateway = Gateway(gatewayCfg.provider);

    const txReceiptAcl = await Leth.ACL.create(web3, { from: user.ethAddress, owner: user.ethAddress, isPublic: false});
    const aclAddr = txReceiptAcl.contractAddress;
    const gwRes = await gateway.storage.addWithAcl(user.ethAddress, aclAddr, file);
    console.log(`Leth gateway response: ${JSON.stringify(gwRes)}`);
    if (gwRes.error) {
      reject(gwRes);
    }

    const itemId = await stackItem(web3, {
      from: user.ethAddress,
      contractAddr: user.profileAddress,
      title,
      description,
      meta: gwRes.meta,
      acl: gwRes.acl
    });

    const item = {
      id: itemId,
      owner: user.ethAddress,
      title: title,
      description: description,
      meta: gwRes.meta,
      acl: gwRes.acl,
      events: []
    };

    console.log(`File was uploaded correctly. ${JSON.stringify(item)}`);
    resolve(item);
  });
};

export const retrieveRemoteItem = async (web3, { user, itemId }) => {
  const item = await retrieveItemById(web3, { contractAddr: user.profileAddress, itemId });
  return { ...item, id: itemId };
};

export const retrieveRemoteItemList = async (web3, { user }) => {
  const remoteMaxItemId = await getMaxItemId(web3, { contractAddr: user.profileAddress });

  const items = [];
  for ( let i = 0; i <= remoteMaxItemId; i++ ) {
    const item = await retrieveRemoteItem(web3, { user, itemId: i});
    items.push(item);
  }

  return items;
};