'use strict';

/**
 * Dependencies
 */
let logError = require('../../error/log-error');

/**
 * Module export
 */
module.exports = function(error, req, res, next) {
  logError(error);
  next(error);
};
