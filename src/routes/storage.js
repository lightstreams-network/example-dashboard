/**
 * User: ggarrido
 * Date: 4/02/19 15:10
 * Copyright 2019 (c) Lightstreams, Palma
 */

const express = require('express');
const router = express.Router();
const debug = require('debug')('app:server');

const { extractRequestAttrs, validateRequestAttrs } = require('src/lib/request');
const { badInputResponse, jsonResponse } = require('src/lib/responses');

const passport = require('src/services/session').passport();
const gateway = require('src/services/gateway').gateway();

router.post('/upload-file', passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const query = ['file', 'password'];
    try {
      validateRequestAttrs(req, query);
    } catch ( err ) {
      next(badInputResponse(err.message));
      return;
    }

    try {
      const attrs = extractRequestAttrs(req, query);
      const reqStream = await gateway.storage.addProxy(req.user.eth_address, attrs.password, attrs.file);
      reqStream
        .on('uploadProgress', progress => {
          console.log(`Uploading: ${progress.transferred} KB`);
          if (progress.percent === 1) {
            console.log("Upload completed");
          }
        })
        .pipe(res);
    } catch (err) {
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