'use strict';

const path = require('path');
const express = require('express');
const connect = require('connect-ensure-login');
const config = require('../config');
const authCtrl = require('../auth/auth.ctrl');
const passport = require('passport');

const APP_PATH = config.APP_PATH;
const PUBLIC_PATH = config.PUBLIC_PATH;
const ASSETS_PATH = config.ASSETS_PATH;
const DLL_PATH = config.DLL_PATH;
var formidable = require('formidable');
var fs = require('fs');

module.exports = function(app) {

   console.log('app path: ' + APP_PATH);
   console.log('assets path: ' + ASSETS_PATH);
   console.log('public path: ' + PUBLIC_PATH);

   const indexFileName = 'index.html';
   const loginFileName = 'login.html';

   //app.use('/public', express.static(PUBLIC_PATH));
   //app.use('/assets', ensureAuthenticated);
   //app.use('/assets', express.static(ASSETS_PATH));
   //app.use('/', ensureAuthenticated, express.static(APP_PATH));

   app.get('/login',
      (req, res) => {
         res.sendFile(path.join(PUBLIC_PATH, loginFileName));
      }
   );

   app.get('/', ensureAuthenticated,
      function (req, res) {
         if (!req.isAuthenticated()) {
            let session = req.session;
            console.log("New user: ")
            console.log("device:", req.query.device);
            console.log("account:", req.query.account);
            console.log("callback:", req.query.callback);

            session.device = req.query.device;
            session.eth_account = req.query.account;
            session.callbackUrl = req.query.callback;
            return res.redirect('/login');
         }
         res.sendFile(path.join(APP_PATH, indexFileName), {user: req.user});
      }
   );

    app.get('/contract-design', authCtrl.ensureAuthenticated,
        function (req, res) {
            res.sendFile(path.join(APP_PATH, indexFileName), {user: req.user});
        }
    );

    app.get('/uphold-pay', authCtrl.ensureAuthenticated,
        function (req, res) {
            res.sendFile(path.join(APP_PATH, indexFileName), {user: req.user});
        }
    );


    function ensureAuthenticated(req, res, next) {
        passport.authenticate('url', {
            session: false
        }, (err, user) => {

            //Error given?
            if (err || !user) {
               console.log('user is not authenticated to receive requested url');
               return next(err, false)
            }

            //Set user in request
            req.user = user;
            next();
        })(req, res, next);
    }
}
