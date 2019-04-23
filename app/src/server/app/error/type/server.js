'use strict';

/**
 * Dependencies
 */
let BaseError = require('./base');

/**
 * Constructor
 */
function ServerError(message, data, status) {

  //Check if status given as data
  if (data && typeof data === 'number') {
    status = data;
    data = null;
  }

  //Set status if valid
  if (status && status >= 500 && status <= 599) {
    this.status = status;
  }

  //Call parent constructor
  message = message || 'Server error';
  BaseError.call(this, message, data);
}

//Extend prototype
ServerError.prototype = Object.create(BaseError.prototype);
ServerError.prototype.constructor = ServerError;
ServerError.prototype.name = 'ServerError';
ServerError.prototype.status = 500;

//Export
module.exports = ServerError;
