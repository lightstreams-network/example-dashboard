'use strict';

let request = require('request');
const http = require('http');
//request.debug = true;
const btoa = require('btoa');

/**
 * Docusign node sdk - pass in a config object to initialise
 * @param {string} config.host - optional Uphold API domain, will default to "account.docusign.com"
 * @param {string} config.key - application API key (Client ID)
 * @param {string} config.secret - application secret
 * @param {string} config.scope - comma separated list of permissions to request
 * @param {string} config.pat - Uphold API Personal Access Token
 * @param {string} config.bearer - Uphold API token
 */
module.exports = function(config) {

   config.host = config.host || 'account.docusign.com';

   function responseHandler(err, res, body, callback) {
      var error = null;
      try {
         body = JSON.parse(body);
      } catch(e) {
         /*console.log('Error for body:');
         console.log(body);*/
         error = new Error(e);
         return callback(error, body);
      }

      if(body.errors || body.error || parseInt(res.statusCode) >= 400) {
         var message = body.errors || body.error || res.statusMessage;
         // morph error object into a string
         if(typeof message === 'object') {
            var tempMessage = '';
            Object.keys(message).forEach(function(prop) {
               tempMessage += prop + ': ' + message[prop].code;
            });
            message = res.statusMessage +' - '+ tempMessage;
         }
         error = new Error(message);
         error.status = res.statusCode;
      }

      return callback(error, body);
   }

   function sendRequest(options, callback) {
      options.url = options.url || 'https://' + config.host + '/' + options.resource;
      options.method = options.method || 'GET';
      options.headers = options.headers || {};
      options.headers['content-type'] = 'application/x-www-form-urlencoded';

      if(!options.auth) {
         if(config.bearer) options.auth = { bearer: config.bearer };
      }

      request(options, function(err, res, body) {
         return responseHandler(err, res, body, callback);
      });
   }

   function processRequest(req, res, next, url) {
      var httpOptions = {
         hostname: 'https://demo.docusign.net',
         path: url,
         //port: port,
         method: 'GET',
         auth: config.bearer,
         headers: {Authorization: 'bearer'}
      };

      let options = {
         url: 'https://' + config.host + '/' + url,
         method: 'GET',
         auth: { bearer: config.bearer }
      };

      //url = 'https://' + config.host + '/' + url;

      //request.get(url, options).pipe(res);
      request(options, (err, res, body) => {

         // Response say Content-Type: image/png, but body does not seem to be so
         var fs = require('fs');
         fs.writeFile("image.txt", body,  "binary", function(err) {
            if(err) {
               console.log(err);
            } else {
               console.log("The file was saved!");
            }
         });
         let base64data = new Buffer(body, 'binary').toString('base64');
         next(null, base64data);
      });
   }

   return {

      // AUTHENTICATION

      /**
       * Retrieve the auth URL where the user can give application permissions
       * @param {string} scope - comma separated list of permissions to request, will default to config.scope
       * @param {string} state - a secure random string, will be automatically provided if none is given
       * @returns {Object}
       */
      buildAuthURL: function(scope, redirectUri, state) {
         scope = scope || config.scope;
         state = state || require('crypto').randomBytes(48).toString('hex');
         let responseType = 'code';

         let url = `https://${config.host}/oauth/auth?` +
            `response_type=${responseType}&` +
            `scope=${scope}&` +
            `client_id=${config.key}&` +
            `state=${state}&` +
            `redirect_uri=${redirectUri}`;
         return {
            'url': url,
            'state': state,
            'scope': scope
         };
      },

      /**
       * Exchange a temporary code for a bearer token.
       * @param {string} code - code provided from the Uphold auth URL
       * @param callback - responds with an object containing access_token & expires_in
       */
      createToken: function(code, callback) {
         console.log('key + secret');
         let keyStr = config.key + ':' + config.secret;
         console.log(keyStr);
         let key = btoa(keyStr);
         let auth = 'Basic ' + key;
         console.log(auth);
         console.log('code:');
         console.log(code);
         return sendRequest({
            resource: '/oauth/token',
            method: 'POST',
            headers: {
               'Authorization': auth
            },
            form: {
               'code': code,
               'grant_type': 'authorization_code'
            }
         }, callback);
      },

      user: function(callback) {
         return sendRequest({ resource: '/oauth/userinfo' }, callback);
      },

      templates: function(accountId, callback) {
         let url = `restapi/v2/accounts/${accountId}/templates`;
         return sendRequest({ resource: url }, callback);
      },

      getDocumentPageImage: function (req, res, next, accountId, envelopeId, documentId, pageNumber, callback) {
         let url = `restapi/v2/accounts/${accountId}/envelopes/${envelopeId}/documents/${documentId}/pages/${pageNumber}/page_image`;

         processRequest(req, res, next, url);
      }
   };
};
