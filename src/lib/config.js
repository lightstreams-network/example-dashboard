/**
 * User: ggarrido
 * Date: 26/03/19 13:50
 * Copyright 2019 (c) Lightstreams, Granada
 */

module.exports.dbCfg = {
  username: process.env.DB_USER || null,
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_NAME || 'fanbase',
  dialect: process.env.DB_DRIVER || 'sqlite',
  storage: process.env.DB_FILE_PATH || '/tmp/demo.sqlite'
};

module.exports.webCfg = {
  provider: process.env.WEB3_PROVIDER,
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
    address: process.env.SMART_CONTRACT_FAUCET_ADDRESS,
    abci: ""
  },
  shelves: {
    address: process.env.SMART_CONTRACT_SHELVES_ADDRESS,
    abci: ""
  }
};
