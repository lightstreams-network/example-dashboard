'use strict';

/**
 * Dependencies
 */
const express = require('express');
const passport = require('passport');

/**
 * Auth routes
 */
module.exports = function (app) {

   //Get controllers and middleware
   let authCtrl = require('./auth.ctrl');
   let ensureAuthenticated = authCtrl.ensureAuthenticated;

   //Create new router
   let router = express.Router();

   //Define routes
   router.post('/login', passport.authenticate(
      'local', {
         session: false,
         scope: []
      }), authCtrl.serialize, authCtrl.redirectToApp);

   // router.get('/verify', ensureAuthenticated, authCtrl.verify);
   // router.get('/forget', authCtrl.forget);
   router.post('/token', authCtrl.generateAPIToken);
   router.post('/validate', authCtrl.validate);

   // Register router
   app.use('/auth', router);

   app.get('/auth/linkedin',
      passport.authenticate('linkedin'));

   // LinkedIn
   app.get('/auth/linkedin/callback',
      passport.authenticate('linkedin', {
         session: false,
         scope: ['r_basicprofile', 'r_emailaddress'],
         failureRedirect: '/login'
      }), authCtrl.addDevice, authCtrl.transferEther, authCtrl.redirectToApp);
};
