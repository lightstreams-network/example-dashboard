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
  const USER2_ACCOUNT = accounts[2];
  const profile_contract_addr = '0xE59240c027bD90D0c2b25258C4C9A03513E79e72';

  let profileInstance;
  let permissionedFileInstance;
  const itemInfo = {
    title: 'test item',
    description: 'desc item',
    acl: '',
    meta: '0xA4Ed84E2806Df3cfFEa48D7c1c0DF139574DD789'
  };

  it('should deploy the Profile contract and store the address', async () => {
    if (process.env.NETWORK === 'ganache') {
      profileInstance = await Profile.new();
    } else {
      profileInstance = await Profile.at(profile_contract_addr);
    }

    const owner = await profileInstance.owner();

    assert.equal(owner.toLowerCase(), ROOT_ACCOUNT.toLowerCase(), 'Invalid expected owner account');
    assert.isDefined(profileInstance.address, 'Profile address could not be stored');
  });

  it('should deploy an permissioned file contract and grant with admin rights to profile SC', async() => {
    permissionedFileInstance = await PermissionedFile.new(ROOT_ACCOUNT);
    await permissionedFileInstance.grantAdmin(profileInstance.address);
    itemInfo.acl = permissionedFileInstance.address;

    const hasAccess = await permissionedFileInstance.hasAdmin(profileInstance.address);
    assert.equal(hasAccess, true);
  });

  it('should add a new item into the shelved', async () => {
    await profileInstance.stackItem(itemInfo.title,
      itemInfo.description,
      itemInfo.meta,
      itemInfo.acl, {
        from: ROOT_ACCOUNT,
        gas: '1000000'
      });

    const itemId = await profileInstance.lastItemId.call();
    const itemObj = await profileInstance.items(itemId);
    assert.equal(itemObj[ItemAttr.title], itemInfo.title);
    assert.equal(itemObj[ItemAttr.desc], itemInfo.description);
    assert.equal(itemObj[ItemAttr.meta], itemInfo.meta);
    assert.equal(itemObj[ItemAttr.acl], itemInfo.acl);
  });

  it('should grant user with read access to the element of a item', async () => {
    const itemId = await profileInstance.lastItemId.call();
    await profileInstance.grantReadAccess(itemId, USER_ACCOUNT, {
      from: ROOT_ACCOUNT,
      gas: '1000000'
    });

    const hasAccess = await permissionedFileInstance.hasRead(USER_ACCOUNT);
    assert.equal(hasAccess, true);
  });

  it('should revoke user access to the element of a item', async () => {
    const itemId = await profileInstance.lastItemId.call();
    await profileInstance.revokeAccess(itemId, USER_ACCOUNT, {
      from: ROOT_ACCOUNT,
      gas: '1000000'
    });

    const hasAccess = await permissionedFileInstance.hasRead(USER_ACCOUNT);
    assert.equal(hasAccess, false);
  });

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