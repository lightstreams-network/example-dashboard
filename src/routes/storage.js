/**
 * User: ggarrido
 * Date: 4/02/19 15:10
 * Copyright 2019 (c) Lightstreams, Palma
 */

const express = require('express');
const router = express.Router();
const streams = require('memory-streams');
const debug = require('debug')('app:server');

const { extractRequestAttrs, validateRequestAttrs } = require('src/lib/request');
const { badInputResponse, jsonResponse } = require('src/lib/responses');
const Web3 = require('src/services/web3');

const passport = require('src/services/session').passport();
const gateway = require('src/services/gateway').gateway();
const shelvesSC = require('src/smartcontracts/shelves');

router.post('/upload-file', passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const query = ['file', 'password', 'title', 'priceInPht'];
    try {
      validateRequestAttrs(req, query);
    } catch ( err ) {
      next(badInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const reqStream = await gateway.storage.addProxy(req.user.eth_address, attrs.password, attrs.file);
      const resStream = new streams.WritableStream();

      resStream.on('finish', async () => {
        const gwRes = JSON.parse(resStream.toString());
        if (gwRes.error) {
          res.json(jsonResponse(gwRes, 'Failed to upload file'));
          res.send();
          return;
        }

        try {
          // Granting admin access to Shelves SC of the new file
          await gateway.acl.grant(gwRes.acl, req.user.eth_address, attrs.password, shelvesSC.address(), 'admin');
          // Adding file to shelves
          const bookId = await shelvesSC.stackBook(await Web3(), {
            owner: req.user.eth_address,
            pwd: attrs.password
          }, {
            title: attrs.title,
            priceInPht: attrs.priceInPht,
            file: gwRes.meta,
            acl: gwRes.acl
          });

          res.json(jsonResponse({
            bookId: bookId
          }));
          res.send();
        } catch ( err ) {
          debug(err);
          next(err);
        }
      });

      await reqStream.on('uploadProgress', progress => {
        console.log(`Uploading: ${progress.transferred} Bytes`);
        if (progress.percent === 1) {
          console.log("Upload completed");
        }
      }).on('error', err => {
        debug(err);
        next(err);
      }).pipe(resStream);
    } catch ( err ) {
      debug(err);
      next(err);
    }
  });

router.post('/fetch-file', async (req, res, next) => {
  const query = ['meta', 'token'];
  try {
    validateRequestAttrs(req, query);
  } catch ( err ) {
    next(badInputResponse(err.message));
    return;
  }

  try {
    const attrs = extractRequestAttrs(req, query);
    const reqStream = await gwApi.storage.fetchProxy(attrs.meta, attrs.token);
    reqStream
      .on('downloadProgress', progress => {
        console.log(`Transferring: ${progress.transferred} KB`);
        if (progress.percent === 1) {
          console.log("Transfer completed");
        }
      })
      .pipe(res);
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

module.exports = router;