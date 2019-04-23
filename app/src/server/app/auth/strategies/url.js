'use strict';

/**
 * Dependencies
 */
let passport = require('passport');
let mongoose = require('mongoose');
let UrlStrategy = require('../../plugins/passport/url-strategy');
let tokens = require('../../services/tokens');
let Account = mongoose.model('accounts');

/**
 * Refresh token strategy
 */
module.exports = function() {
  passport.use(new UrlStrategy((state, cb) => {

    //No state token?
    if (!state) {
      return cb(null, false);
    }

    Account.findUserBySessionState(state, cb);
  }));
};
