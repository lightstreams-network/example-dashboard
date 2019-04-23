'use strict';

/**
 * Dependencies
 */
let storeError = require('../../error/store-error');

/**
 * Module export
 */
module.exports = function(error, req, res, next) {
  storeError(error, req);
  next(error);
};
