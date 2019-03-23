/**
 * User: ggarrido
 * Date: 23/03/19 17:04
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Gateway = require('lightstreams-js-sdk');
const { GATEWAY_DOMAIN } = process.env;

module.exports.gateway = () => {
  return Gateway(GATEWAY_DOMAIN);
};