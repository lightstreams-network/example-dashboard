'use strict';

/**
 * Dependencies
 */
let NotAuthenticatedError = require('../../error/type/auth/not-authenticated');
let config = require('../../config');

/**
 * Constants
 */
const REFRESH_TOKEN_COOKIE_SECURE = config.REFRESH_TOKEN_COOKIE_SECURE;

/**
 * Module export
 */
module.exports = function(error, req, res, next) {
  next = next || null;

  //For any unauthenticated error, clear the refresh token cookie
  //unless we were requesting secure status
  if (error instanceof NotAuthenticatedError && !req.body.secureStatus) {
    res.clearCookie('refreshToken', {
      secure: REFRESH_TOKEN_COOKIE_SECURE,
      httpOnly: true
    });
  }

  //Next middleware
  next(error);
};
