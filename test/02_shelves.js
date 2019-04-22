/**
 * User: ggarrido
 * Date: 22/04/19 8:35
 * Copyright 2019 (c) Lightstreams, Granada
 */

const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;

const ShopShelves = artifacts.require("ShopShelves");
const { web3Cfg } = require('src/lib/config');

const {
  timeTravel,
  wei2pht,
  pht2wei,
  toBN,
  calculateGasCost,
  BookAttr
} = require('./utils');

contract('ShopShelves', (accounts) => {
  const ROOT_ACCOUNT = process.env.NETWORK === 'ganache' ? accounts[0] : web3Cfg.from;
  const SELLER_ACCOUNT = accounts[1];
  const BUYER_ACCOUNT = accounts[2];
  const bookInfo = {
    title: 'test book',
    priceInPht: '0.5',
    acl: '0x5307C0F1146233884B3A9BC857738d8bDe0802E4',
    file: '0x50c9406f0942711b6e2e28301CE86bFbF42eBE3F',
    cover: '0x50c9406f0942711b6e2e28301CE86bFbF42eBE3E',
  };

  it('should deploy the Faucet contract and store the address', async () => {
    const instance = await ShopShelves.deployed();
    assert.isDefined(instance.address, 'Token address could not be stored');
  });

  it('should add a new book into the shelved', async () => {
    const instance = await ShopShelves.deployed();
    const priceInWei = pht2wei(bookInfo.priceInPht);

    await instance.stackBook(bookInfo.title,
      priceInWei,
      bookInfo.file,
      bookInfo.cover,
      bookInfo.acl, {
        from: SELLER_ACCOUNT
      });

    const bookId = await instance.lastBookId.call();
    const bookObj = await instance.shelves(bookId);
    assert.equal(bookObj[BookAttr.title], bookInfo.title);
    assert.equal(bookObj[BookAttr.file], bookInfo.file);
    assert.equal(bookObj[BookAttr.price].toString(), priceInWei.toString());
  });

  it('should buyer user complete a purchasing of a book', async () => {
    const instance = await ShopShelves.deployed();
    const bookId = await instance.lastBookId.call();

    const bookObjBefore = await instance.shelves(bookId);
    const bookPriceInWei = bookObjBefore[BookAttr.price];
    const sellerBalanceBefore = toBN(await web3.eth.getBalance(SELLER_ACCOUNT));
    const buyerBalanceBefore = toBN(await web3.eth.getBalance(BUYER_ACCOUNT));

    const tx = await instance.purchase(bookId, {
      from: BUYER_ACCOUNT,
      value: bookPriceInWei
    });
    const txCost = await calculateGasCost(tx.receipt.gasUsed);

    const isPurchased = await instance.hasPurchased(bookId, BUYER_ACCOUNT);
    const sellerBalanceAfter = toBN(await web3.eth.getBalance(SELLER_ACCOUNT));
    const buyerBalanceAfter = toBN(await web3.eth.getBalance(BUYER_ACCOUNT));

    assert.equal(buyerBalanceAfter.toString(), buyerBalanceBefore.sub(bookPriceInWei).sub(txCost).toString());
    assert.equal(sellerBalanceAfter.toString(), sellerBalanceBefore.add(bookPriceInWei).toString());
    assert.equal(isPurchased, true);
  });

  it('should buyer cannot buy same book twice', async () => {
    const instance = await ShopShelves.deployed();
    const bookId = await instance.lastBookId.call();

    const bookObjBefore = await instance.shelves(bookId);
    const bookPriceInWei = bookObjBefore[BookAttr.price];

    return assert.isRejected(instance.purchase(bookId, {
      from: BUYER_ACCOUNT,
      value: bookPriceInWei
    }));
  });
});