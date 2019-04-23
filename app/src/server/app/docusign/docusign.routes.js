'use strict';

const moment = require('moment');
const config = require('../config');
const subroute = require('../services/sub-route');
const docusignSdk = require('./docusign-sdk-factory');
const docusign = require('./docusign.ctrl');

module.exports = function(app) {
   let route = new subroute.SubRoute(app, '/docusign');

   let operations = {
      authenticate: {
         get: docusign.authenticate
      },
      token: {
         noauth: docusign.token
      },
      logout: {
         get: docusign.logout
      },
      user: {
         get: docusign.user
      },
      templates: {
         post: docusign.templates
      },
      pageImage: {
         post: docusign.getDocumentPageImage
      }
   };

   let sdk = new docusignSdk.DocusignSdkFactory();
   route.create(operations, sdk);
};
