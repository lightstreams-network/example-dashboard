'use strict';

/**
 * Dependencies
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

/**
 * Error schema
 */
let ErrorSchema = new Schema({
  name: {
    type: String
  },
  code: {
    type: String
  },
  message: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  data: {},
  stack: {},
  request: {},
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

/**
 * Define model
 */
let ErrorModel = mongoose.model('Error', ErrorSchema);

/**
 * Module export
 */
module.exports = function(error, req) {

  //Create error data
  let data = {
    name: error.name || 'UnknownError',
    code: error.code || '',
    message: error.message || '',
    data: error.data || null,
    stack: error.stack || null,
    request: req ? {
      url: req.baseUrl,
      body: req.body
    } : null,
    user: req.user ? req.user._id : null
  };

  //Disable debugging for this operation
  let debug = mongoose.get('debug');
  if (debug) {
    mongoose.set('debug', false);
  }

  //Save in database and re-enable debug if needed
  ErrorModel.create(data)
    .then(() => {
      if (debug) {
        mongoose.set('debug', true);
      }
    });
};
