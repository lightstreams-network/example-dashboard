'use strict';

const moment = require('moment');
const mongoose = require('mongoose');
const async = require('async');
const config = require('../config');
const Account = mongoose.model('accounts');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const request = require('request');

export class ContractController {
   /*
   getNonce(req, res, service, cb) {
      let signatureId = req.params.signatureId;
      if (!signatureId) {
         return cb('No signatureId parameter specified.');
      }

      service.getNonce(signatureId, cb);
   }
   */

   getNonce(req, res, service, cb) {
      service.getNonce(req.body, cb);
   }

   get(req, res, service, cb) {
      let metaAddr = req.params.metaAddr;
      if (!metaAddr) {
         return cb('No metaAddr parameter in request.');
      }

      service.getContract(metaAddr, req.user, cb);
   }

   create(req, res, service, cb) {
      console.log("Create contract request");

      let owner = req.body.header && req.body.header.owner || null;
      let counterparty = req.body.header && req.body.header.counterparty || null;

      if (!owner || !owner.signatureId) {
         return cb('No owner.signatureId specified in body.');
      }

      if (!counterparty || !counterparty.signatureId) {
         return cb('No counterparty.signatureId specified in body.');
      }

      let streams = [];
      streams.push(next => {
         service.getSignature(owner.signatureId, next);
      });

      streams.push((signature, next) => {
         owner.publicKey = signature.publicKey;
         service.getSignature(counterparty.signatureId, next);
      });

      streams.push((signature, next) => {
         counterparty.publicKey = signature.publicKey;

         req.body.issuer = owner;
         req.body.owner = owner;
         req.body.counterparty = counterparty;

         service.createContract(req.body, next);
      });

      async.waterfall(streams, cb);
   }

   createContent(req, res, service, cb) {
      console.log("Create content request");

      let owner = req.body.header && req.body.header.owner || null;
      let counterparty = req.body.header && req.body.header.counterparty || null;

      if (!owner || !owner.account) {
         return cb('No owner.account specified in body.');
      }

      if (!counterparty || !counterparty.account) {
         return cb('No counterparty.account specified in body.');
      }

      req.body.issuer = owner;
      req.body.owner = owner;
      req.body.counterparty = counterparty;
      service.createContract(req.body, cb);
   }

   transact(req, res, service, cb) {
      service.transact(req.body, cb);
   }

   call(req, res, service, cb) {
      service.call(req.body, cb);
   }

   grantPermission(req, res, service, cb) {
      let metaAddr = req.params.metaAddr;
      if (!metaAddr) {
         return cb('No metaAddr parameter in request.');
      }

      service.grantPermission(metaAddr, req.user, req.body, cb);
   }
}
