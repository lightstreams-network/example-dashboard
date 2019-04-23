'use strict';

const moment = require('moment');
const mongoose = require('mongoose');
const async = require('async');
const config = require('../config');
const Account = mongoose.model('accounts');

const DOCUSIGN_URL= config.DOCUSIGN_URL;
const DOCUSIGN_APP_KEY = config.DOCUSIGN_APP_KEY;
const DOCUSIGN_APP_SECRET = config.DOCUSIGN_APP_SECRET;
const API_BASE_URL = config.API_BASE_URL;
const API_BASE_PATH = config.API_BASE_PATH;
const DOCUSIGN_LIB = config.DOCUSIGN_LIB;

module.exports = {
   authenticate: (req, res, docusign, cb) => {

      const user = req.user;

      docusign = require(DOCUSIGN_LIB)({
         key: DOCUSIGN_APP_KEY,
         secret: DOCUSIGN_APP_SECRET,
         host: DOCUSIGN_URL
      });

      let scope = 'signature';
      let token_redirect = API_BASE_URL + API_BASE_PATH + '/docusign/token';
      let auth = docusign.buildAuthURL(scope, token_redirect);

      // store the state to validate against
      if (!user.docusign) {
         user.docusign = {};
      }

      user.docusign.auth_state = auth.state;
      user.docusign.redirect = req.query.redirect;
      Account.update(user.id, user, (err, user) => {
         if (err) {
            console.log('docusign authentication: unable to update user');
            return res.send(401);
         }

         console.log('docusign authenticate url:');
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
         Account.findUserByDocusignState(req.query.state, (err, user) => {
            if (err) {
               console.log('docusign authentication: state does not equal expected authentication state.');
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

         let Docusign = require('./docusign-sdk')({
            key: DOCUSIGN_APP_KEY,
            secret: DOCUSIGN_APP_SECRET,
            host: DOCUSIGN_URL
         });

         Docusign.createToken(req.query.code, (err, token) => {
            if(err) {
               console.log(err);
               console.log('docusign authentication: unable to create token');
               return next(err, null);
            }

            console.log('token created:');
            console.log(token);

            // store the token for later use
            user.docusign.token = token;

            next(null, user);
         });

      });

      // Update user
      streams.push((user, next) => {
         Account.update(user.id, user, (err, user) => {
            if (err) {
               console.log(err);
               console.log('docusign authentication: unable to save token');
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
         let url = `${user.docusign.redirect}&token=${access_token}`;

         res.redirect(url);
      });
   },

   logout: (req, res, docusign, cb) => {

      const user = req.user;
      if (user.docusign && user.docusign.token) {
         console.log('deleting token.');
         user.docusign.token = undefined;
         user.docusign.auth_state = undefined;
         console.log('user.docusign:');
         console.log(user.docusign);
      }

      Account.update(user.id, user, (err, user) => {
         if (err) {
            console.log(err);
            console.log('docusign authentication: unable to save user on logout');
            return cb(err);
         }

         console.log('docusign: user logged out.');

         cb(null, user);
      });
   },

   user: (req, res, docusign, cb) => {
      if(!docusign) {
         cb('user is not authenticated');
         return;
      }

      docusign.user((err, docusign_user) => {
         if (err) {
            console.log(err);
            console.log('docusign authentication: unable to get user');
            return cb(err);
         }

         cb(null, docusign_user);
      });
   },

   templates: (req, res, docusign, cb) => {
      let accountId = req.body.accountId;
      docusign.templates(accountId, cb);
   },

   getDocumentPageImage: (req, res, docusign, cb) => {
      let accountId = req.body.accountId;
      let envelopeId = req.body.envelopeId;
      let documentId = req.body.documentId;
      let pageNumber = req.body.pageNumber;
      docusign.getDocumentPageImage(req, res, cb, accountId, envelopeId, documentId, pageNumber);
   }
};
