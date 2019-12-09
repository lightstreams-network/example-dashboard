/**
 * User: ggarrido
 * Date: 11/04/19 17:06
 * Copyright 2019 (c) Lightstreams, Granada
 */

import { Web3 } from 'lightstreams-js-sdk';
import { contracts } from '../constants/config'

export const createUser = async (web3, { from, ethAddress, username, profileAddress }) => {
  return await Web3.contractSendTx(web3, {
    to: contracts.dashboard.address,
    abi: contracts.dashboard.abi,
    method: 'createUser',
    from: from,
    params: [ethAddress, username, profileAddress, '']
  });
};

export const findUserByUsername = async (web3, { username }) => {
  return await Web3.contractCall(web3, {
    to: contracts.dashboard.address,
    abi: contracts.dashboard.abi,
    method: 'findUser',
    params: [username]
  });
};

export const retrieveUserInfo = async (web3, { username }) => {
  const ethAddress = await Web3.contractCall(web3, {
    to: contracts.dashboard.address,
    abi: contracts.dashboard.abi,
    method: 'findUser',
    params: [username]
  });
  const profileAddress = await Web3.contractCall(web3, {
    to: contracts.dashboard.address,
    abi: contracts.dashboard.abi,
    method: 'findProfile',
    params: [ethAddress]
  });
  const rootIPFS = await Web3.contractCall(web3, {
    to: contracts.dashboard.address,
    abi: contracts.dashboard.abi,
    method: 'findRootIPFS',
    params: [ethAddress]
  });

  return {
    username,
    ethAddress,
    profileAddress,
    rootIPFS
  }
};

export const setNextRootDataId = async (web3, { ethAddress, nextRootDataId }) => {
  return await Web3.contractSendTx(web3, {
    to: contracts.dashboard.address,
    abi: contracts.dashboard.abi,
    method: 'updateRootIPFS',
    params: [ethAddress, nextRootDataId]
  });
};

