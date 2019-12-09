import { Web3, Gateway } from 'lightstreams-js-sdk';
import { gatewayCfg } from '../constants/config';
import { stackItem } from '../smartcontracts/profile';


export const uploadNewItem = (web3, user, { title, description, file }) => {
  return new Promise(async (resolve, reject) => {
    const gateway = Gateway(gatewayCfg.provider);

    const aclAddr = "0x0";
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

    // Granting admin access to Profile SC of the new file
    await gateway.acl.grant(gwRes.acl, user.ethAddress, user.password, user.profileAddress, 'admin');
    // Granting admin access to Dashboard SC of the new file
    await gateway.acl.grant(gwRes.acl, user.ethAddress, user.password, dashboardSC.address, 'admin');

    const item = {
      id: itemId,
      owner: user.ethAddress,
      title: title,
      description: description,
      meta: gwRes.meta,
      acl: gwRes.acl,
    };

    console.log(`File was uploaded correctly. ${JSON.stringify(item)}`);
    resolve(itemId);
  });
};

// export const retrieveRemoteItem = async (user, itemId) => {
//   const web3 = await Web3();
//   const item = await profileSCService.retrieveItemById(web3, user.profileAddress, itemId);
//
//   return { ...item, id: itemId };
// };
//
// export const retrieveRemoteItemList = async (user) => {
//   const web3 = await Web3();
//   const remoteMaxItemId = await profileSCService.getMaxItemId(web3, user.profileAddress);
//
//   const items = [];
//   for ( let i = 0; i <= remoteMaxItemId; i++ ) {
//     const item = await this.retrieveRemoteItem(user, i);
//     items.push(item);
//   }
//
//   return items;
// };