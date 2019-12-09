/**
 * User: ggarrido
 * Date: 26/03/19 13:50
 * Copyright 2019 (c) Lightstreams, Granada
 */


import profileContract from '@contracts/Profile.json'
import dashboardContract from '@contracts/Dashboard.json'

export const web3Cfg = {
  provider: process.env.WEB3_PROVIDER,
};

export const gatewayCfg = {
  provider: process.env.GATEWAY_DOMAIN,
};

export const faucetAcc = {
  holder: process.env.STAKEHOLDER_ADDRESS,
  password: process.env.STAKEHOLDER_PASSWORD,
};

export const contracts = {
  profile: {
    bytecode: profileContract.bytecode,
    abi: profileContract.abi,
  },
  dashboard: {
    address: dashboardContract.networks[process.env.NET_ID]
      ? dashboardContract.networks[process.env.NET_ID].address : process.env.ADDRESS_DASHBOARD_CONTRACT,
    bytecode: dashboardContract.bytecode,
    abi: dashboardContract.abi,
  },
};
