'use strict';

/**
 * External dependencies
 */
let util = require('util');
let Strategy = require('passport-strategy');

/**
 * Define refresh token strategy
 */
function UrlStrategy(options, verify) {
  if (typeof options === 'function') {
    verify = options;
    options = {};
  }

  Strategy.call(this);
  this.name = 'url';
  this._verify = verify;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(UrlStrategy, Strategy);

/**
 * Authenticate request based on refresh token in http only cookie
 */
UrlStrategy.prototype.authenticate = function(req) {

  //Initialize vars
  let state;
  let self = this;

  //Get refresh token from url
  if (req.query.state) {
    state = req.query.state;
  }

  /**
   * Verification handler
   */
  function verified(error, user, info) {
    if (error) {
      return self.error(error);
    }
    if (!user) {
      info = info || {};
      self.fail('invalid_token', info);
    }
    self.success(user, info);
  }

  //Call verify handler
  this._verify(state, verified);
};

/**
 * Expose strategy
 */
module.exports = UrlStrategy;
