'use strict';

const config = require('../config');
const subroute = require('../services/sub-route');
const profile = require('./profile.ctrl');
const profileSvc = require('./profile.service');

module.exports = function(app) {
   let route = new subroute.SubRoute(app, '/profile');
   let controller = new profile.ProfileController();
   let service = new profileSvc.ProfileService();

   let operations = {
      me: {
         get: controller.get,
         patch: controller.update
      },
      signatures: {
         get: controller.getSignatures,
         post: controller.addSignature
      },
      'signatures/:id': {
         get: controller.getSignature,
      },
      devices: {
         get: controller.getDevices,
         post: controller.addDevice
      },
      'account/:account': {
         noauth: controller.getBalance
      }
   };

   let factory = {
      create: () => service
   };

   route.create(operations, factory);
};

