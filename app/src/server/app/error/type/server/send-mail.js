'use strict';

/**
 * Dependencies
 */
let ServerError = require('../server');

/**
 * Constructor
 */
function SendMailError(message) {
  ServerError.call(this, message);
}

/**
 * Extend prototype
 */
SendMailError.prototype = Object.create(ServerError.prototype);
SendMailError.prototype.constructor = SendMailError;
SendMailError.prototype.name = 'SendMailError';
SendMailError.prototype.code = 'MAILER_FAULT';

//Export
module.exports = SendMailError;
