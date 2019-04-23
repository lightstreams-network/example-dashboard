/**
 * User: ggarrido
 * Date: 26/03/19 13:50
 * Copyright 2019 (c) Lightstreams, Granada
 */

let faucetSCData = require(`${process.env.PWD}/build/contracts/Faucet.json`);
let shopShelvesSCData = require(`${process.env.PWD}/build/contracts/ShopShelves.json`);

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
  from: process.env.STAKEHOLDER_ADDRESS,
  pwd: process.env.STAKEHOLDER_ADDRESS_PWD,
};

module.exports.authCfg = {
  jwtSecret: process.env.JWT_SECRET
};

module.exports.urls = {
  gateway: process.env.GATEWAY_DOMAIN,
};

module.exports.smartContract = {
  faucet: {
    address: process.env.SMARTCONTRACT_FAUCET_ADDRESS,
    owner: process.env.STAKEHOLDER_ADDRESS,
    abi: faucetSCData.abi
  },
  shelves: {
    address: process.env.SMARTCONTRACT_SHELVES_ADDRESS,
    owner: process.env.STAKEHOLDER_ADDRESS,
    abi: shopShelvesSCData.abi
  }
};
