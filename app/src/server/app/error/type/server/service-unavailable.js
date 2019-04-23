'use strict';

/**
 * Dependencies
 */
let ServerError = require('../server');

/**
 * Constructor
 */
function ServiceUnavailableError(message) {
  ServerError.call(this, message, 503);
}

/**
 * Extend prototype
 */
ServiceUnavailableError.prototype = Object.create(ServerError.prototype);
ServiceUnavailableError.prototype.constructor = ServiceUnavailableError;
ServiceUnavailableError.prototype.name = 'ServiceUnavailableError';
ServiceUnavailableError.prototype.code = 'SERVICE_UNAVAILABLE';

//Export
module.exports = ServiceUnavailableError;
