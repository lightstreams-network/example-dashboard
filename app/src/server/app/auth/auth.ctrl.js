'use strict';


/**
 * Dependencies
 */
const passport = require('passport');
const moment = require('moment');
const NotAuthenticatedError = require('../error/type/auth/not-authenticated');
const NotAuthorizedError = require('../error/type/auth/not-authorized');
const UserSuspendedError = require('../error/type/auth/user-suspended');
const tokens = require('../services/tokens');
const config = require('../config');
const request = require('request');
const argv = require('yargs').argv;
const mongoose = require('mongoose');
const async = require('async');
const crypto = require('crypto');

/**
 * Constants
 */
const REFRESH_TOKEN_COOKIE_MAX_AGE = config.REFRESH_TOKEN_COOKIE_MAX_AGE;
const REFRESH_TOKEN_COOKIE_SECURE = config.REFRESH_TOKEN_COOKIE_SECURE;
const SECURE_STATUS_EXPIRATION = config.SECURE_STATUS_EXPIRATION;
const ENV = argv.env || process.env.NODE_ENV || 'dev';

/**
 * To camel case
 */
function toCamelCase(str, ucfirst) {
   if (typeof str === 'number') {
      return String(str);
   }
   else if (typeof str !== 'string') {
      return '';
   }
   if ((str = String(str).trim()) === '') {
      return '';
   }
   return str
      .replace(/_+|\-+/g, ' ')
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
         if (+match === 0) {
            return '';
         }
         return (index === 0 && !ucfirst) ?
            match.toLowerCase() : match.toUpperCase();
      });
}

/**
 * Auth controller
 */
module.exports = {

   // Since passport session is set to false,
   // and we may use passport Strategies other than our local one,
   // we need to create unknown but authenticated users
   // See: https://blog.hyphe.me/token-based-authentication-with-node/
   serialize(req, res, next) {
      const Account = mongoose.model('accounts');

      if (!req.user.id) {
         // This is for other strategies such as Facebook where
         Account.create(req.user, function (err, user) {
            if (err) {
               return next(err);
            }
            // we store information needed in token in req.user again
            req.user = {
               id: user.id
            };
            next();
         });
      }
      else {
         next();
      }
   },

   /**
    * Validates a token that is signed using a blockchain account.
    */
   validate(req, res, next) {
      let token = req.body && req.body.token || null;
      let localhost = req.body && req.body.localhost || null;
      if (!token) {
         let error = new Error('No token in body');
         return next(error, null);
      }

      console.log('token:');
      console.log(token);

      let options = {
         url: config.REGISTRY_URL + '/token/validate',
         method: 'POST',
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify({token: token, localhost: localhost})
      };

      console.log('Requesting url:');
      console.log(options.url);

      let response = {
         success: false
      };

      request(options, (err, resp, body) => {
         try {
            console.log("body:");
            console.log(body);
            body = JSON.parse(body);
         } catch (e) {
            /*console.log('Error for body:');
             console.log(body);*/
            body.error = 'could not parse body';
            err = new Error(e);
         }
         if (body.error) {
            console.log('error::');
            console.log(body.error);
            response.error = body.error;
            return res.status(200).send(JSON.stringify(response));
         }

         let accountId = body.accountId;
         console.log("accountId:");
         console.log(accountId);

         let claims = {
            id: accountId
         };

         let token = tokens.generate('access', claims);
         response.success = true;
         response.data = {token: token};

         return res.status(200).send(JSON.stringify(response));

      });
   },

   generateAPIToken(req, res, next) {
      const Account = mongoose.model('accounts');

      let response = {
         success: false
      };

      let state = req.body.state;

      let streams = [];
      streams.push(next => {
         if (!state) {
            return next(new NotAuthenticatedError());
         }

         next(null, state);
      });

      streams.push((state, next) => {
         Account.findUserBySessionState(state, next);
      });

      streams.push((user, next) => {
         if (!user) {
            return next(new NotAuthenticatedError());
         }

         let expected = user.session && user.session.auth_state || null;
         if (!expected) {
            return next(new NotAuthenticatedError());
         }

         if (expected !== state) {
            return next(new NotAuthenticatedError());
         }

         user.session.auth_state = '';
         return Account.update(user.id, user, next);
      });

      async.waterfall(streams, (err, user) => {
         if (err) {
            response.error = err;
            return res.status(200).send(JSON.stringify(response));
         }

         let claims = {
            id: user.id
         };
         let token = tokens.generate('access', claims);

         response.success = true;
         response.data = {token: token};

         return res.status(200).send(JSON.stringify(response));
      });
   },

   generateToken(req, res, next) {
      console.log('generating token...');

      let claims = {
         id: req.user.id
      };

      //Generate access token
      let accessToken = tokens.generate('access', claims);
      console.log("accessToken:");
      console.log(accessToken);

      req.user.token = accessToken;

      next();
   },

   redirectToApp(req, res) {
      let user = req.user;

      let state = crypto.randomBytes(48).toString('hex');
      user.session = {
         auth_state: state
      };


      let Account = mongoose.model('accounts');
      Account.update(user.id, user, (err, user) => {
         if (err) {
            res.status(500);
            return res.end();
         }

         let url = `${config.APP_BASE_URL}?state=${state}`;
         res.redirect(url);
      });
   },

   addDevice(req, res, next) {
      let session = req.session;

      if (!session.device) {
         console.log("No device id specified");
         return next();
      }

      console.log("Adding Device: " + session.device + " for user: " + req.user.id);

      let Account = mongoose.model('accounts');
      let device = {
         publicKey: session.device
      };

      Account.addDevice(req.user.id, device, (err, newDevice) => {
         session.device = null;
         if (err) {
            console.log("Error adding device", err);
            return next(err);
         }
         console.log("Added Device.");
         console.log(device);

         req.user.devices.push(newDevice);

         next();
      });
   },

   transferEther(req, res, next) {
      console.log("Transferring ether...");
      let user = req.user;
      let session = req.session;
      
      if (user.initial_eth) {
         return res.redirect(session.callbackUrl);
      }

      user.initial_eth = true;

      let streams = [];
      let Account = mongoose.model('accounts');
      streams.push(next => Account.update(user.id, user, next));

      streams.push((result, next) => {
         if (!session.eth_account) {
            return next('No eth_account value set.');
         }

         let signature = {type: 'ETH', publicKey: session.eth_account};

         let options = {
            url: config.REGISTRY_URL + '/key',
            method: 'POST',
            headers: {
               'content-type': 'application/json'
            },
            body: JSON.stringify(signature)
         };


         console.log("transferEth request", options);

         request(options, (err, resp, body) => {
            if (err) {
               console.log('request error:');
               console.log(err);
               return next(err);
            }

            let error = null;
            try {
               console.log("received response:");
               console.log(body);
               body = JSON.parse(body);
               error = body.error;
            } catch (e) {
               error = 'An error occurred when attempting to send request to register key';
            }
            if (error) {
               console.log('error:');
               console.log(error);
               return next(error);
            }

            next(null);
         });
      });

      async.waterfall(streams, (err) => {
         if (err) {
            console.log("Error transferring Ether to account " + session.eth_account, err);
            user.initial_eth = false;
            Account.update(user.id, user, () => {});
         } else {
            console.log("Ether transferred to account " + session.eth_account)
         }

         let url = session.callbackUrl;
         
         session.eth_account = null;
         session.callbackUrl = null;

         res.redirect(url);
         //next();
      });

   },

   /**
    * Verify authentication
    */
   verify(req, res) {
      res.end();
   },

   /**
    * Forget a user
    */
   forget(req, res) {
      res.clearCookie('refreshToken', {
         secure: REFRESH_TOKEN_COOKIE_SECURE,
         httpOnly: true
      });
      res.end();
   },

   /**
    * Token request handler
    */
   token(req, res, next) {

      //Get grant type and initialize access token
      let grantType = toCamelCase(req.body.grantType);
      let remember = !!req.body.remember;
      let secureStatus = !!req.body.secureStatus;

      /**
       * Callback handler
       */
      function authCallback(error, user) {

         //Error given?
         if (error) {
            error = new NotAuthenticatedError(error);
         }

         //No user found?
         else if (!user) {
            error = new NotAuthenticatedError();
         }

         //User suspended?
         else if (user.isSuspended) {
            error = new UserSuspendedError();
         }

         //Check error
         if (error) {
            return next(error);
         }

         //Set user in request and get claims
         req.user = user;
         let claims = user.getClaims();

         //Requesting secure status?
         if (secureStatus && grantType === 'password') {
            claims.secureStatus = moment()
               .add(SECURE_STATUS_EXPIRATION, 'seconds')
               .toJSON();
         }

         //Generate access token
         let accessToken = tokens.generate('access', claims);

         //Generate refresh token if we want to be remembered
         if (remember) {
            let refreshToken = tokens.generate('refresh', user.getClaims());
            res.cookie('refreshToken', refreshToken, {
               maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE * 1000, //in ms
               secure: REFRESH_TOKEN_COOKIE_SECURE,
               httpOnly: true
            });
         }

         //Send response
         return res.send({
            accessToken: accessToken
         });
      }

      //Handle specific grant types
      switch (grantType) {
         case 'password':
            passport.authenticate('local', authCallback)(req, res, next);
            break;
         case 'bearer':
            passport.authenticate('bearer', authCallback)(req, res, next);
            break;
         case 'refreshToken':
            passport.authenticate('refresh', authCallback)(req, res, next);
            break;
      }
   },

   /**************************************************************************
    * Middleware
    ***/

   /**
    * Ensure a user is an admin middleware
    */
   ensureAdmin(req, res, next) {
      if (!req.user || !req.user.hasRole('admin')) {
         return next(new NotAuthorizedError());
      }
      next();
   },

   /**
    * Ensure a user is authenticated middleware
    */
   ensureAuthenticated(req, res, next) {
      console.log('ensuring authentication');

      passport.authenticate('bearer', {session: false}, (error, user) => {
         if (error) {
            error = new NotAuthenticatedError(error);
         }

         //No user found?
         else if (!user) {
            error = new NotAuthenticatedError();
         }

         //User suspended?
         else if (user.isSuspended) {
            error = new UserSuspendedError();
         }

         //Check error
         if (error) {
            return next(error);
         }

         //Set user in request
         req.user = user;
         next();
      })(req, res, next);
   }
};
