/**
 * User: ggarrido
 * Date: 23/03/19 17:04
 * Copyright 2019 (c) Lightstreams, Granada
 */

const Gateway = require('lightstreams-js-sdk');
const { urls } = require('src/lib/config');

module.exports.gateway = ({ gwDomain } = {}) => {
  return Gateway(gwDomain || urls.gateway);
};