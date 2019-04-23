'use strict';

/**
 * Dependencies
 */
let MongooseValidationError = require('mongoose').Error.ValidationError;
let ClientError = require('../client');

/**
 * Constructor
 */
function ValidationError(message, data) {

  //Mongoose validation error fed?
  if (message instanceof MongooseValidationError) {
    let mongooseError = message;
    message = mongooseError.message;
    data = {fields: {}};
    for (let field in mongooseError.errors) {
      if (mongooseError.errors.hasOwnProperty(field)) {
        let error = mongooseError.errors[field];
        data.fields[field] = {
          type: error.kind,
          message: error.message
        };
      }
    }
  }

  //Otherwise object given?
  else if (typeof message === 'object') {
    data = message;
    message = '';
  }

  //Call parent constructor
  message = message || 'Validation error';
  ClientError.call(this, message, data, 422);
}

/**
 * Extend prototype
 */
ValidationError.prototype = Object.create(ClientError.prototype);
ValidationError.prototype.constructor = ValidationError;
ValidationError.prototype.name = 'ValidationError';
ValidationError.prototype.code = 'NOT_VALIDATED';

//Export
module.exports = ValidationError;
