/**
 * User: ggarrido
 * Date: 22/04/19 8:35
 * Copyright 2019 (c) Lightstreams, Granada
 */

const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;

const Faucet = artifacts.require("Faucet");
const { web3Cfg } = require('src/lib/config');

const {
  timeTravel,
  wei2pht,
  pht2wei,
  toBN,
  calculateGasCost,
  VI
} = require('./utils');

contract('Faucet', (accounts) => {
  const ROOT_ACCOUNT = process.env.NETWORK === 'ganache' ? accounts[0] : web3Cfg.from;
  const USER1_ACCOUNT = accounts[1];
  const USER2_ACCOUNT = accounts[2];

  it('should deploy the Faucet contract and store the address', async () => {
    const instance = await Faucet.deployed();
    assert.isDefined(instance.address, 'Token address could not be stored');
  });

  it('should increase faucet contract balance', async () => {
    const instance = await Faucet.deployed();
    const sendAmount = 100;
    const weiSentAmountBN = pht2wei(sendAmount.toString());

    const contractBalanceBefore = toBN(await web3.eth.getBalance(instance.address));

    await web3.eth.sendTransaction({
      from: ROOT_ACCOUNT,
      to: instance.address,
      value: weiSentAmountBN
    });

    const contractBalanceAfter = toBN(await web3.eth.getBalance(instance.address));
    const contractAttrBalanceAfter = await instance.balance.call();

    assert.equal(contractBalanceAfter.toString(), contractBalanceBefore.add(weiSentAmountBN).toString());
    assert.equal(contractBalanceAfter.toString(), contractAttrBalanceAfter.toString());
  });

  it('should increase balance of user account via topUp action', async () => {
    const instance = await Faucet.deployed();

    const weiRequestedBN = toBN(await instance.topUpLimit.call());

    const userBalanceBefore = toBN(await web3.eth.getBalance(USER1_ACCOUNT));
    const contractBalanceBefore = toBN(await web3.eth.getBalance(instance.address));

    await instance.topUp(USER1_ACCOUNT, weiRequestedBN, {
      from: ROOT_ACCOUNT
    });

    const userBalanceAfter = toBN(await web3.eth.getBalance(USER1_ACCOUNT));
    const contractBalanceAfter = toBN(await web3.eth.getBalance(instance.address));

    assert.equal(userBalanceAfter.toString(), userBalanceBefore.add(weiRequestedBN).toString());
    assert.equal(contractBalanceAfter.toString(), contractBalanceBefore.sub(weiRequestedBN).toString());
  });

  it('should fail when user try to exceed top up limit', async () => {
    const instance = await Faucet.deployed();
    const weiRequestedBN = pht2wei('0.1');
    return assert.isRejected(instance.topUp(USER1_ACCOUNT, weiRequestedBN, {
      from: ROOT_ACCOUNT
    }));
  });

  it('should allow to request a new top up after owner increase limit', async () => {
    const instance = await Faucet.deployed();
    // Increase top up limit
    const topUpLimitBN = toBN(await instance.topUpLimit.call());
    const incrementBN = pht2wei('1');

    await instance.setNewLimit(topUpLimitBN.add(incrementBN), {
      from: ROOT_ACCOUNT
    });

    // User request more funds
    const userBalanceBefore = toBN(await web3.eth.getBalance(USER1_ACCOUNT));
    const contractBalanceBefore = toBN(await web3.eth.getBalance(instance.address));

    await instance.topUp(USER1_ACCOUNT, incrementBN, {
      from: ROOT_ACCOUNT
    });

    const userBalanceAfter = toBN(await web3.eth.getBalance(USER1_ACCOUNT));
    const contractBalanceAfter = toBN(await web3.eth.getBalance(instance.address));

    assert.equal(userBalanceAfter.toString(), userBalanceBefore.add(incrementBN).toString());
    assert.equal(contractBalanceAfter.toString(), contractBalanceBefore.sub(incrementBN).toString());
  });

  it('should fail when user try to exceed top up limit', async () => {
    const instance = await Faucet.deployed();
    const weiRequestedBN = pht2wei('0.1');
    return assert.isRejected(instance.topUp(USER1_ACCOUNT, weiRequestedBN, {
      from: ROOT_ACCOUNT
    }));
  });
});