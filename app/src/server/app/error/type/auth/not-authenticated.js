'use strict';

/**
 * Dependencies
 */
let ClientError = require('../client');

/**
 * Constructor
 */
function NotAuthenticatedError(message) {
  message = message || 'Not authenticated';
  ClientError.call(this, message, 401);
}

/**
 * Extend prototype
 */
NotAuthenticatedError.prototype = Object.create(ClientError.prototype);
NotAuthenticatedError.prototype.constructor = NotAuthenticatedError;
NotAuthenticatedError.prototype.name = 'NotAuthenticatedError';
NotAuthenticatedError.prototype.code = 'NOT_AUTHENTICATED';

//Export
module.exports = NotAuthenticatedError;
