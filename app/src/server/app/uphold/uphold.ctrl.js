'use strict';

const moment = require('moment');
const mongoose = require('mongoose');
const async = require('async');
const config = require('../config');
const Account = mongoose.model('accounts');

const UPHOLD_APP_KEY = config.UPHOLD_APP_KEY;
const UPHOLD_APP_SECRET = config.UPHOLD_APP_SECRET;
const API_BASE_URL = config.API_BASE_URL;
const UPHOLD_LIB = config.UPHOLD_LIB;

module.exports = {
   authenticate: (req, res, uphold, cb) => {
      uphold = require(UPHOLD_LIB)({
         key: UPHOLD_APP_KEY,
         secret: UPHOLD_APP_SECRET,
         scope: "accounts:read,cards:read,cards:write,contacts:read,contacts:write,transactions:deposit,transactions:read,transactions:transfer:application,transactions:transfer:others,transactions:transfer:self,transactions:withdraw,user:read"
      });

      const auth = uphold.buildAuthURL();
      const user = req.user;

      // store the state to validate against
      if (!user.uphold) {
         user.uphold = {};
      }

      user.uphold.auth_state = auth.state;
      user.uphold.redirect = req.query.redirect;
      Account.update(user.id, user, (err, user) => {
         if (err) {
            console.log('uphold authentication: unable to update user');
            return res.send(401);
         }

         console.log('uphold authenticate url:');
         console.log(auth.url);

         cb(null, auth.url);
      });
   },

   token: (req, res) => {
      let streams = [];

      // Get user
      streams.push(next => {
         console.log('auth state: ');
         console.log(req.query.state);
         Account.findUserByUpholdState(req.query.state, (err, user) => {
            if (err) {
               console.log('uphold authentication: state does not equal expected authentication state.');
               return next(err, null);
            }

            next(null, user);
         });
      });

      // Create token
      streams.push((user, next) => {
         console.log('user: ');
         console.log(user);

         console.log('creating token');

         let Uphold = require(UPHOLD_LIB)({
            key: UPHOLD_APP_KEY,
            secret: UPHOLD_APP_SECRET
         });

         Uphold.createToken(req.query.code, (err, token) => {
            if(err) {
               console.log(err);
               console.log('uphold authentication: unable to create token');
               return next(err, null);
            }

            console.log('token created:');
            console.log(token);

            // store the token for later use
            user.uphold.token = token;

            next(null, user);
         });

      });

      // Update user
      streams.push((user, next) => {
         Account.update(user.id, user, (err, user) => {
            if (err) {
               console.log(err);
               console.log('uphold authentication: unable to save token');
               return next(err, null);
            }

            console.log('token saved.');

            next(null, user);
         });
      });

      async.waterfall(streams, (error, user) => {
         if (error) {
            return res.send(401);
         }

         let access_token = user.session.token;
         let url = `${API_BASE_URL}${user.uphold.redirect}&token=${access_token}`;

         res.redirect(url);
      });
   },

   logout: (req, res, uphold, cb) => {
      const user = req.user;
      if (user.uphold && user.uphold.token) {
         console.log('deleting token.');
         user.uphold.token = undefined;
         user.uphold.auth_state = undefined;
         console.log('user.uphold:');
         console.log(user.uphold);
      }

      Account.update(user.id, user, (err, user) => {
         if (err) {
            console.log(err);
            console.log('uphold authentication: unable to save user on logout');
            return cb(err);
         }

         console.log('uphold: user logged out.');

         cb(null, user);
      });
   },

   user: (req, res, uphold, cb) => {
      if(!uphold) {
         cb('user is not authenticated');
         return;
      }

      uphold.user((err, uphold_user) => {
         console.log('uphold config:');
         console.log(uphold.config);
         if (err) {
            console.log(err);
            console.log('uphold authentication: unable to get user');
         }

         cb(err, uphold_user);
      });
   },

   transaction: (req, res, uphold, cb) => {
      console.log(req.body);
      if (!req.body.transaction) {
         return cb('No transaction specified in body.');
      }
      console.log('transaction:');
      console.log(req.body.transaction);

      uphold.createTransaction(req.body.transaction, cb);
   },

   cards: (req, res, uphold, cb) => {
      uphold.cards(cb);
   }
};
