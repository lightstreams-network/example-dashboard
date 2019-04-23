'use strict';

/**
 * Dependencies
 */
let normalizeError = require('./normalize-error');
let logError = require('./log-error');
let storeError = require('./store-error');

/**
 * This is a wrapper function to send an error through the three basic
 * handlers, e.g. normalize, log and store. This should not be used as
 * error handling middleware, but rather in cases where you want to capture
 * an error, yet don't want it to break the response. By using this handler,
 * you avoid silent errors that go unnoticed.
 */
module.exports = function(error, req) {
  normalizeError(error, req);
  logError(error, req);
  storeError(error, req);
};
