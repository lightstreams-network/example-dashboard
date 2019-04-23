'use strict';

const config = require('../config');
const subroute = require('../services/sub-route');
const contractSvc = require('./contract.service');
const contractCtrl = require('./contract.ctrl');

module.exports = function(app) {
   let route = new subroute.SubRoute(app, '/contract');
   let controller = new contractCtrl.ContractController();
   let service = new contractSvc.ContractService();

   let operations = {
      ':metaAddr': {
         get: controller.get,
      },
      new: {
         post: controller.create
      },
      'new-content': {
         post: controller.createContent
         //'post-noauth': controller.createContent
      },
      nonce: {
         post: controller.getNonce,
      },
      transact: {
         post: controller.transact
      },
      call: {
         post: controller.call
      },
      'permissions/:metaAddr': {
         post: controller.grantPermission
      }
   };

   route.create(operations, {create: () => service});
};
