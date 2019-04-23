'use strict';

/**
 * Base error class
 */
function BaseError(message, data) {

  //If used another error as constructor, copy those properties
  if (message && message instanceof Error) {
    let error = message;
    this.name = error.name;
    this.message = error.message;
    this.stack = error.stack || null;
    if (error.code) {
      this.code = error.code;
    }
    return;
  }

  //Otherwise, check if data given as first parameter
  else if (message && typeof message === 'object') {
    data = message;
    message = '';
  }

  //Set message and data
  this.message = message || '';
  this.data = data || null;

  //Still no message present?
  if (!this.message) {
    this.message = 'Unknown error';
  }
}

/**
 * Extend prototype
 */
BaseError.prototype = Object.create(Error.prototype);
BaseError.prototype.constructor = BaseError;
BaseError.prototype.status = 500;

/**
 * Convert to simple object for JSON responses
 */
BaseError.prototype.toJSON = function() {

  //If no code, then we don't send any data
  if (!this.code) {
    return undefined;
  }

  //Create object
  let error = {
    code: this.code
  };

  //Append data
  if (this.data) {
    error.data = this.data;
  }

  //Retun JSON
  return error;
};

//Export
module.exports = BaseError;
