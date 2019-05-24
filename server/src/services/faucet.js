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

module.exports.requestFundingFromFaucet = async (user, amountInPht) => {
  const web3 = await Web3();
  const beneficiary = user.ethAddress;
  const { faucet: faucetSC } = smartContract;

  const beneficiaryRemainingInWeiBN = await faucetSCService.remainingAmount(web3, beneficiary);
  const beneficiaryRemainingInPht = weiToPht(beneficiaryRemainingInWeiBN.toString());
  if(parseFloat(beneficiaryRemainingInPht) < parseFloat(amountInPht)) {
    debug(`Warning: User ${beneficiary} exceeded faucet limit`);
    return;
  }

  const faucetBalanceInWeiBN = await web3.eth.getBalance(faucetSC.address);
  const faucetBalanceInPht = weiToPht(faucetBalanceInWeiBN.toString());
  if (parseFloat(faucetBalanceInPht) < parseFloat(amountInPht)) {
    debug(`Warning: Faucet contract(${faucetSC.address}) does not have enough funds: ${faucetBalanceInPht} PHT`);
    return;
  }

  debug(`Sent ${amountInPht}PHT to ${beneficiary} from faucet account`);
  await faucetSCService.requestFreeToken(web3, {
    beneficiary,
    amountInWei: phtToWei(amountInPht)
  }, { from: user.ethAddress, password: user.password });
};