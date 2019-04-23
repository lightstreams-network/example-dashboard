/**
 * User: ggarrido
 * Date: 22/04/19 8:35
 * Copyright 2019 (c) Lightstreams, Granada
 */

const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;

const Shelves = artifacts.require("Shelves");
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

contract('Shelves', (accounts) => {
  const ROOT_ACCOUNT = process.env.NETWORK === 'ganache' ? accounts[0] : web3Cfg.from;
  const SELLER_ACCOUNT = accounts[1];
  const BUYER_ACCOUNT = accounts[2];
  const itemInfo = {
    title: 'test item',
    priceInPht: '0.5',
    acl: '',
    file: 'QmPHYAfcy2MpVvKiS1pqPJg8b3juLi9N76VXAa12AYvaAg',
    cover: 'QmPHYAfcy2MpVvKiS1pqPJg8b3juLi9N76VXAa12AYvaAg',
  };

  it('should deploy the Faucet contract and store the address', async () => {
    const instance = await Shelves.deployed();
    assert.isDefined(instance.address, 'Token address could not be stored');
  });

  it('should deploy an permissioned file contract and grant with admin rights to shelves SC', async() => {
    const instanceShelves = await Shelves.deployed();
    const instance = await PermissionedFile.new(ROOT_ACCOUNT);
    await instance.grantAdmin(instanceShelves.address);
    itemInfo.acl = instance.address;
  });

  it('should add a new item into the shelved', async () => {
    const instance = await Shelves.deployed();
    const priceInWei = pht2wei(itemInfo.priceInPht);

    await instance.stackItem(itemInfo.title,
      priceInWei,
      itemInfo.file,
      itemInfo.cover,
      itemInfo.acl, {
        from: SELLER_ACCOUNT
      });

    const itemId = await instance.lastItemId.call();
    const itemObj = await instance.items(itemId);
    assert.equal(itemObj[ItemAttr.title], itemInfo.title);
    assert.equal(itemObj[ItemAttr.file], itemInfo.file);
    assert.equal(itemObj[ItemAttr.price].toString(), priceInWei.toString());
  });

  it('should buyer user complete a purchasing of a item', async () => {
    const instance = await Shelves.deployed();
    const itemId = await instance.lastItemId.call();

    const itemObjBefore = await instance.items(itemId);
    const itemPriceInWei = itemObjBefore[ItemAttr.price];
    const sellerBalanceBefore = toBN(await web3.eth.getBalance(SELLER_ACCOUNT));
    const buyerBalanceBefore = toBN(await web3.eth.getBalance(BUYER_ACCOUNT));

    const tx = await instance.purchase(itemId, {
      from: BUYER_ACCOUNT,
      value: itemPriceInWei
    });
    const txCost = await calculateGasCost(tx.receipt.gasUsed);

    const isPurchased = await instance.hasPurchased(itemId, BUYER_ACCOUNT);
    const sellerBalanceAfter = toBN(await web3.eth.getBalance(SELLER_ACCOUNT));
    const buyerBalanceAfter = toBN(await web3.eth.getBalance(BUYER_ACCOUNT));

    assert.equal(buyerBalanceAfter.toString(), buyerBalanceBefore.sub(itemPriceInWei).sub(txCost).toString());
    assert.equal(sellerBalanceAfter.toString(), sellerBalanceBefore.add(itemPriceInWei).toString());
    assert.equal(isPurchased, true);
  });

  // it('should buyer cannot buy same item twice', async () => {
  //   const instance = await Shelves.deployed();
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