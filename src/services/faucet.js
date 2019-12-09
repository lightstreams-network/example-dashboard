/**
 * User: ggarrido
 * Date: 11/05/19 21:10
 * Copyright 2019 (c) Lightstreams, Granada
 */

import { Gateway, Web3 } from 'lightstreams-js-sdk';
import { faucetAcc, gatewayCfg } from '../constants/config';

// @TODO Replace by GSN https://docs.lightstreams.network/products-1/lightchain/guides
export const requestFundingFromHolder = async (beneficiary, amountInPht) => {
  const gateway = Gateway(gatewayCfg.provider);
  console.log(`Requesting ${amountInPht}PHT to ${beneficiary} from app holder account ${faucetAcc.holder}`);
  await gateway.wallet.transfer(faucetAcc.holder, faucetAcc.password, beneficiary, Web3.utils.toWei(`${amountInPht}`));
};
