/**
 * User: ggarrido
 * Date: 11/05/19 21:10
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Web3 = require('src/services/web3');
const { smartContract } = require('src/lib/config');
const { phtToWei, weiToPht } = require('src/lib/ethereum');
const faucetSCService = require('src/smartcontracts/faucet');
const debug = require('debug')('app:faucet');
const { web3Cfg } = require('src/lib/config');
const gateway = require('src/services/gateway').gateway();

module.exports.requestFundingFromHolder = async(beneficiary, amountInPht) => {
  debug(`Sent ${amountInPht}PHT to ${beneficiary} from app holder account ${web3Cfg.holder}`);
  await gateway.wallet.transfer(web3Cfg.holder, web3Cfg.password, beneficiary, phtToWei(amountInPht));
};

module.exports.requestFunding = async (user, amountInPht) => {
  const web3 = await Web3();
  const beneficiary = user.ethAddress;
  const amountInWei = phtToWei(amountInPht);
  const { faucet: faucetSC } = smartContract;

  const beneficiaryRemainingInWei = await faucetSCService.remainingAmount(web3, { beneficiary },
    { from: user.ethAddress, password: user.password });
  if(beneficiaryRemainingInWei < amountInWei) {
    debug(`Warning: User ${beneficiary} exceeded faucet limit`);
    return;
  }

  const faucetBalanceInWei = await web3.eth.getBalance(faucetSC.address);
  if (faucetBalanceInWei < amountInWei) {
    const faucetBalanceInPht = weiToPht(faucetBalanceInWei);
    debug(`Error: Faucet contract(${faucetSC.address}) does not have enough funds: ${faucetBalanceInPht} PHT`);
    throw new Error(`Faucet contract(${faucetSC.address}) does not have enough funds: ${faucetBalanceInPht} PHT`);
  }

  debug(`Sent ${amountInPht}PHT to ${beneficiary} from faucet account`);
  await faucetSCService.requestFreeToken(web3, {
    beneficiary,
    amountInWei
  }, { from: user.ethAddress, password: user.password });
};