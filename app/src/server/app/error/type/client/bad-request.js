'use strict';

/**
 * Dependencies
 */
let ClientError = require('../client');

/**
 * Constructor
 */
function BadRequestError(message, data) {
  message = message || 'Bad request';
  ClientError.call(this, message, data, 400);
}

/**
 * Extend prototype
 */
BadRequestError.prototype = Object.create(ClientError.prototype);
BadRequestError.prototype.constructor = BadRequestError;
BadRequestError.prototype.name = 'BadRequestError';
BadRequestError.prototype.code = 'BAD_REQUEST';

//Export
module.exports = BadRequestError;
