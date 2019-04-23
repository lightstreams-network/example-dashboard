'use strict';

const mongoose = require('mongoose');
const async = require('async');
const config = require('../config');
const Account = mongoose.model('accounts');
const crypt = require('crypto');
const request = require('request');

export class ProfileController {
   get(req, res, service, cb) {
      let profile = req.user.profile;
      cb(null, profile);
   }

   update(req, res, service, cb) {
      if (!req.body.profile) {
         return cb('No profile specified in body.');
      }
      console.log('profile:');
      let profile = req.body.profile;
      console.log(profile);

      delete profile.username;

      let user = req.user;
      user.profile = profile;

      Account.update(user.id, user, (err, user) => {
         if (err) {
            console.log('unable to update user profile');
            return cb(err, null);
         }

         cb();
      });
   }

   getDevices(req, res, service, cb) {
      cb(null, req.user.devices);
   }

   addDevice(req, res, service, cb) {
      if (!req.body.device) {
         return cb('No device specified in body.');
      }

      Account.addDevice(req.user.id, req.body.device, cb);
   }

   getSignatures(req, res, service, cb) {
      cb(null, req.user.signatures);
   }

   getSignature(req, res, service, cb) {
      let signatureId = req.params.id;
      if (!signatureId) {
         return cb('No signatureId parameter in requested url.');
      }

      let signature: any = {};
      let streams = [];
      streams.push(next => {
         Account.findSignature(signatureId, next);
      });

      streams.push((data, next) => {
         if (!data) {
            return cb('Could not find signtureId: ' + signatureId);
         }
         signature = data.toObject();
         delete signature._id;

         Account.findUserBySignature(signatureId, next);
      });

      async.waterfall(streams, (err, account) => {
         if (err) {
            return cb(err);
         }
         if (!account || !account.profile) {
            return cb('Could not find profile for signtureId: ' + signatureId);
         }

         let profile = account.profile;
         signature.name = `${profile.firstName} ${profile.lastName}`;

         let clientIPs = account.devices.map(d => d.ipAddress);

         cb(null, {signature, clientIPs});
      });

   }

   addSignature(req, res, service, cb) {
      let publicKey = req.body.publicKey;
      let type = req.body.type;

      if (!publicKey) {
         return cb('No publicKey specified in body.');
      }

      if (!type) {
         return cb('No type specified in body.');
      }

      let signature: any = {type, publicKey};

      let options = {
         url: config.REGISTRY_URL + '/key',
         method: 'POST',
         headers: {
            'content-type': 'application/json'
         },
         body: JSON.stringify(signature)
      };

      let signatureGenCount = 0;
      let generateSignatureId = (type: string, cb) => {
         let signatureId = service.randomAsciiString(8);
         signatureGenCount++;

         if (signatureGenCount > 5) {
            return cb('Could not generate a signature after 5 attempts');
         }

         Account.findUserBySignature(signatureId, (err, account) => {
            if (err) {
               return cb(err);
            }

            if (account) {
               return generateSignatureId(type, cb);
            }

            cb(null, signatureId);
         });
      };

      let streams = [];
      streams.push(next => {
         console.log('sending request to registry-web:');
         console.log(options.body);
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

      streams.push((next) => {
         console.log("generating signature");
         generateSignatureId(type, next);
      });

      streams.push((signatureId, next) => {
         console.log("signature ID: " + signatureId);
         signature.signatureId = signatureId;
         Account.addSignature(req.user.id, signature, next);
      });


      async.waterfall(streams, (err) => {
         if (err) {
            console.log("Error:");
            console.log(err);
            return cb(err);
         }

         console.log("Success:");
         console.log(signature);
         cb(null, signature);
      });
   }

   generateSignatureId(type: string, cb) {
      let signatureId = crypt.randomBytes(1).toString('hex');

      let context = this;
      Account.findSignature(signatureId, (err, account) => {
         if (err) {
            return cb(err);
         }

         if (account) {
            return context.generateSignatureId(type, cb);
         }

         cb(null, signatureId);
      });
   }

   getBalance(req, res, service, cb) {
       let account = req.params.account;
       if (!account) {
           return cb('No account parameter in requested url.');
       }

       let options = {
           url: config.REGISTRY_URL + '/accountBalance/' + account,
           method: 'GET',
           headers: {
               'content-type': 'application/json'
           },
       };

       request(options, (err, resp, body) => {
           if (err) {
               console.log('request error:');
               console.log(err);
               return cb(err);
           }

           let error = null;
           try {
               console.log("received response:");
               console.log(body);
               body = JSON.parse(body);
               error = body.error;
           } catch (e) {
               error = 'An error occurred when attempting to get balance for account ' + account;
           }
           if (error) {
               console.log('error:');
               console.log(error);
               return cb(error);
           }

           cb(null, {balance: body.balance});
       });

   }
}
