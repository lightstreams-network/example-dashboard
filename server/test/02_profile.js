/**
 * User: ggarrido
 * Date: 22/04/19 8:35
 * Copyright 2019 (c) Lightstreams, Granada
 */

const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;

const Profile = artifacts.require("Profile");
const PermissionedFile = artifacts.require("PermissionedFile");
const { web3Cfg } = require('src/lib/config');

const {
  timeTravel,
  wei2pht,
  pht2wei,
  toBN,
  calculateGasCost,
  ItemAttr
} = require('./utils');

contract('Profile', (accounts) => {
  const ROOT_ACCOUNT = process.env.NETWORK === 'ganache' ? accounts[0] : web3Cfg.from;
  const USER_ACCOUNT = process.env.NETWORK === 'ganache' ? accounts[1] : '0x3a4D89734F60ED62773CC14d042aDB5d2B8d3B3E';
  const profile_contract_addr = '0xE59240c027bD90D0c2b25258C4C9A03513E79e72';

  let profileInstance;
  const itemInfo = {
    title: 'test item',
    description: 'desc item',
    acl: '',
    meta: '0xA4Ed84E2806Df3cfFEa48D7c1c0DF139574DD789'
  };

  it('should deploy the Profile contract and store the address', async () => {
    if (process.env.NETWORK === 'ganache') {
      profileInstance = await Profile.new(USER_ACCOUNT);
    } else {
      profileInstance = await Profile.at(profile_contract_addr);
    }

    const owner = await profileInstance.owner();

    assert.equal(owner.toLowerCase(), USER_ACCOUNT.toLowerCase(), 'Invalid expected owner account');
    assert.isDefined(profileInstance.address, 'Profile address could not be stored');
  });

  it('should deploy an permissioned file contract and grant with admin rights to shelves SC', async() => {
    const instance = await PermissionedFile.new(ROOT_ACCOUNT);
    await instance.grantAdmin(profileInstance.address);
    itemInfo.acl = instance.address;
  });

  it('should add a new item into the shelved', async () => {
    if (process.env.NETWORK !== 'ganache') {
      await web3.eth.personal.unlockAccount(USER_ACCOUNT, 'test123', 1000);
    }

    await profileInstance.stackItem(itemInfo.title,
      itemInfo.description,
      itemInfo.meta,
      itemInfo.acl, {
        from: USER_ACCOUNT,
        gas: '1000000'
      });

    const itemId = await profileInstance.lastItemId.call();
    const itemObj = await profileInstance.items(itemId);
    assert.equal(itemObj[ItemAttr.title], itemInfo.title);
    assert.equal(itemObj[ItemAttr.desc], itemInfo.description);
    assert.equal(itemObj[ItemAttr.meta], itemInfo.meta);
    assert.equal(itemObj[ItemAttr.acl], itemInfo.acl);
  });

  // it('should buyer user complete a purchasing of a item', async () => {
  //   const instance = await Profile.deployed();
  //   const itemId = await instance.lastItemId.call();
  //
  //   const itemObjBefore = await instance.items(itemId);
  //   const itemPriceInWei = itemObjBefore[ItemAttr.price];
  //   const sellerBalanceBefore = toBN(await web3.eth.getBalance(USER_ACCOUNT));
  //   const buyerBalanceBefore = toBN(await web3.eth.getBalance(BUYER_ACCOUNT));
  //
  //   const tx = await instance.purchase(itemId, {
  //     from: BUYER_ACCOUNT,
  //     value: itemPriceInWei
  //   });
  //   const txCost = await calculateGasCost(tx.receipt.gasUsed);
  //
  //   const isPurchased = await instance.hasPurchased(itemId, BUYER_ACCOUNT);
  //   const sellerBalanceAfter = toBN(await web3.eth.getBalance(USER_ACCOUNT));
  //   const buyerBalanceAfter = toBN(await web3.eth.getBalance(BUYER_ACCOUNT));
  //
  //   assert.equal(buyerBalanceAfter.toString(), buyerBalanceBefore.sub(itemPriceInWei).sub(txCost).toString());
  //   assert.equal(sellerBalanceAfter.toString(), sellerBalanceBefore.add(itemPriceInWei).toString());
  //   assert.equal(isPurchased, true);
  // });

  // it('should buyer cannot buy same item twice', async () => {
  //   const instance = await Profile.deployed();
  //   const itemId = await instance.lastItemId.call();
  //
  //   const itemObjBefore = await instance.items(itemId);
  //   const itemPriceInWei = itemObjBefore[ItemAttr.price];
  //
  //   return assert.isRejected(instance.purchase(itemId, {
  //     from: BUYER_ACCOUNT,
  //     value: itemPriceInWei
  //   }));
  // });
});