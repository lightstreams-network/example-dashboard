'use strict';

/**
 * Dependencies
 */
let InvalidTokenError = require('./invalid-token');

/**
 * Constructor
 */
function ExpiredTokenError(message) {
  message = message || 'Expired token';
  InvalidTokenError.call(this, message);
}

/**
 * Extend prototype
 */
ExpiredTokenError.prototype = Object.create(InvalidTokenError.prototype);
ExpiredTokenError.prototype.constructor = ExpiredTokenError;
ExpiredTokenError.prototype.name = 'ExpiredTokenError';
ExpiredTokenError.prototype.code = 'EXPIRED_TOKEN';

//Export
module.exports = ExpiredTokenError;
