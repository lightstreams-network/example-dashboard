'use strict';

const express = require('express');
const config = require('../config');
const subroute = require('../services/sub-route');
const upholdSdk = require('./uphold-sdk-factory');
const uphold = require('./uphold.ctrl');

module.exports = function(app) {
   let route = new subroute.SubRoute(app, '/uphold');

   let operations = {
      authenticate: {
         get: uphold.authenticate
      },
      token: {
         noauth: uphold.token
      },
      logout: {
         get: uphold.logout
      },
      user: {
         get: uphold.user
      },
      cards: {
         get: uphold.cards
      },
      transaction: {
         post: uphold.transaction
      }
   };

   let sdk = new upholdSdk.UpholdSdkFactory();
   route.create(operations, sdk);
};

