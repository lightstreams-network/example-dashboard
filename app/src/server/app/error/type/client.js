'use strict';

/**
 * Dependencies
 */
let BaseError = require('./base');

/**
 * Constructor
 */
function ClientError(message, data, status) {

  //Check if status given as data
  if (data && typeof data === 'number') {
    status = data;
    data = null;
  }

  //Set status if valid
  if (status && status >= 400 && status <= 499) {
    this.status = status;
  }

  //Call parent constructor
  message = message || 'Client error';
  BaseError.call(this, message, data);
}

/**
 * Extend prototype
 */
ClientError.prototype = Object.create(BaseError.prototype);
ClientError.prototype.constructor = ClientError;
ClientError.prototype.name = 'ClientError';
ClientError.prototype.status = 400;

//Export
module.exports = ClientError;
