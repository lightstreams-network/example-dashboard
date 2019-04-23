'use strict';

/**
 * Dependencies
 */
let ClientError = require('../client');

/**
 * Constructor
 */
function InvalidTokenError(message) {
  message = message || 'Invalid token';
  ClientError.call(this, message);
}

/**
 * Extend prototype
 */
InvalidTokenError.prototype = Object.create(ClientError.prototype);
InvalidTokenError.prototype.constructor = InvalidTokenError;
InvalidTokenError.prototype.name = 'InvalidTokenError';
InvalidTokenError.prototype.code = 'INVALID_TOKEN';

//Export
module.exports = InvalidTokenError;
