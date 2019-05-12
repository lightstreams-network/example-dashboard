/**
 * User: ggarrido
 * Date: 26/03/19 13:50
 * Copyright 2019 (c) Lightstreams, Granada
 */

delete require.cache[require.resolve(`${process.env.PWD}/build/contracts/Faucet.json`)];
delete require.cache[require.resolve(`${process.env.PWD}/build/contracts/Profile.json`)];
delete require.cache[require.resolve(`${process.env.PWD}/build/contracts/Dashboard.json`)];
delete require.cache[require.resolve(`${process.env.PWD}/build/contracts/PermissionedFile.json`)];

let faucetSCData = require(`${process.env.PWD}/build/contracts/Faucet.json`);
let profileSCData = require(`${process.env.PWD}/build/contracts/Profile.json`);
let dashboardUserSCData = require(`${process.env.PWD}/build/contracts/Dashboard.json`);
let PermissionedFileSCData = require(`${process.env.PWD}/build/contracts/PermissionedFile.json`);

module.exports.dbCfg = {
  username: process.env.DB_USER || null,
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_NAME || 'fanbase',
  dialect: process.env.DB_DRIVER || 'sqlite',
  storage: process.env.DB_FILE_PATH || '/tmp/demo.sqlite'
};

module.exports.web3Cfg = {
  provider: process.env.WEB3_PROVIDER,
  gasPrice: process.env.WEB3_GAS_PRICE,
  defaultGas: 300000,
  from: process.env.STAKEHOLDER_ADDRESS,
  password: process.env.STAKEHOLDER_ADDRESS_PWD,
};

module.exports.authCfg = {
  jwtSecret: process.env.JWT_SECRET
};

module.exports.urls = {
  gateway: process.env.GATEWAY_DOMAIN,
  localhost: `http://localhost:${process.env.PORT}`
};

module.exports.smartContract = {
  faucet: {
    address: process.env.SMARTCONTRACT_FAUCET_ADDRESS,
    owner: process.env.STAKEHOLDER_ADDRESS,
    abi: faucetSCData.abi
  },
  profile: {
    bytecode: profileSCData.bytecode,
    abi: profileSCData.abi,
  },
  dashboard: {
    address: process.env.SMARTCONTRACT_DASHBOARD_ADDRESS,
    bytecode: dashboardUserSCData.bytecode,
    abi: dashboardUserSCData.abi,
  },
  permissionedFile: {
    bytecode: PermissionedFileSCData.bytecode,
    abi: PermissionedFileSCData.abi,
  }
};
