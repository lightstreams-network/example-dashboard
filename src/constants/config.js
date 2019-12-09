/**
 * User: ggarrido
 * Date: 26/03/19 13:50
 * Copyright 2019 (c) Lightstreams, Granada
 */


let faucetContract = require(`@contracts/Faucet.json`);
let profileContract = require(`@contracts/Profile.json`);
let dashboardUserContract = require(`@contracts/Dashboard.json`);


module.exports.web3Cfg = {
  provider: process.env.WEB3_PROVIDER,
  holder: process.env.STAKEHOLDER_ADDRESS,
  password: process.env.STAKEHOLDER_ADDRESS_PWD,
};

module.exports.authCfg = {
  jwtSecret: process.env.JWT_SECRET
};

module.exports.urls = {
  gateway: process.env.GATEWAY_DOMAIN,
};

module.exports.smartContract = {
  faucet: {
    address: faucetContract.networks[process.env.NET_ID]
      ? faucetContract.networks[process.env.NET_ID].address : process.env.ADDRESS_FAUCET_CONTRACT,
    abi: faucetContract.abi,
    bytecode: faucetContract.bytecode
  },
  profile: {
    bytecode: profileContract.bytecode,
    abi: profileContract.abi,
  },
  dashboard: {
    address: dashboardUserContract.networks[process.env.NET_ID]
      ? dashboardUserContract.networks[process.env.NET_ID].address : process.env.ADDRESS_DASHBOARD_CONTRACT,
    bytecode: dashboardUserContract.bytecode,
    abi: dashboardUserContract.abi,
  },
};
