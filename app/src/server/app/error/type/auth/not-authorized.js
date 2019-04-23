'use strict';

/**
 * Dependencies
 */
let ClientError = require('../client');

/**
 * Constructor
 */
function NotAuthorizedError(message) {
  message = message || 'Not authorized';
  ClientError.call(this, message, 403);
}

/**
 * Extend prototype
 */
NotAuthorizedError.prototype = Object.create(ClientError.prototype);
NotAuthorizedError.prototype.constructor = NotAuthorizedError;
NotAuthorizedError.prototype.name = 'NotAuthorizedError';
NotAuthorizedError.prototype.code = 'NOT_AUTHORIZED';

//Export
module.exports = NotAuthorizedError;
