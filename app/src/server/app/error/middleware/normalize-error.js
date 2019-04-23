'use strict';

/**
 * Dependencies
 */
let normalizeError = require('../../error/normalize-error');

/**
 * Module export
 */
module.exports = function(error, req, res, next) {
  error = normalizeError(error);
  next(error);
};
