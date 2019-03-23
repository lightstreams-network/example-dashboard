/**
 * User: ggarrido
 * Date: 23/03/19 17:20
 * Copyright 2019 (c) Lightstreams, Granada
 */

module.exports.dbCfg = {
  username: process.env.DB_USER || null,
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_NAME || 'fanbase',
  dialect: process.env.DB_DRIVER || 'sqlite',
  storage: process.env.DB_FILE_PATH || '/tmp/fanbase.sqlite'
};