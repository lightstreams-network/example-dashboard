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

const { uploadNewItem, retrieveRemoteItemInfo, retrieveRemoteItemList } = require('src/services/dashboard');

const session = require('src/services/session').passport();
const gateway = require('src/services/gateway').gateway();


router.post('/add-item', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  const query = ['file', 'title', 'description', 'password'];
  try {
    validateRequestAttrs(req, query);
  } catch ( err ) {
    next(badInputResponse(err.message));
    return;
  }

  try {
    const attrs = extractRequestAttrs(req, query);
    const itemId = await uploadNewItem(req.user, attrs.password, {
      title: attrs.title,
      description: attrs.description,
      file: attrs.file
    });
    const item = await retrieveRemoteItemInfo(req.user, itemId);
    res.json(jsonResponse(item));
    res.send();
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

router.get('/list-items', session.authenticate('jwt', { session: false }), async (req, res, next) => {

  try {
    const item = await retrieveRemoteItemList(req.user);
    res.json(jsonResponse(item));
    res.send();
  } catch ( err ) {
    debug(err);
    next(err);
  }
});


router.get('/get-item-info', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  const query = ['item_id'];
  try {
    validateRequestAttrs(req, query);
  } catch ( err ) {
    next(badInputResponse(err.message));
    return;
  }

  try {
    const attrs = extractRequestAttrs(req, query);
    const item = await retrieveRemoteItemInfo(req.user, attrs.item_id);
    res.json(jsonResponse(item));
    res.send();
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

// router.post('/purchase', session.authenticate('jwt', { session: false }), async (req, res, next) => {
//   const query = ['item_id', 'password'];
//   try {
//     validateRequestAttrs(req, query);
//   } catch ( err ) {
//     next(badInputResponse(err.message));
//     return;
//   }
//
//   try {
//     const attrs = extractRequestAttrs(req, query);
//     const web3 = await Web3();
//     const item = await shelvesSC.retrieveItemById(web3, attrs.item_id);
//     if (!item.file) {
//       throw new Error(`Item with id ${attrs.item_id} was not found`);
//     }
//     await shelvesSC.purchase(web3, {
//       owner: req.user.eth_address,
//       password: attrs.password,
//     }, {
//       itemId: attrs.item_id,
//       amountInPht: item.priceInPht
//     });
//     res.json(jsonResponse({
//       purchased: true
//     }));
//     res.send();
//   } catch ( err ) {
//     debug(err);
//     next(err);
//   }
// });

router.get('/download-item-content', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  const query = ['item_id'];
  try {
    validateRequestAttrs(req, query);
  } catch ( err ) {
    next(badInputResponse(err.message));
    return;
  }

  try {
    const attrs = extractRequestAttrs(req, query);
    const item = await retrieveRemoteItemInfo(req.user, attrs.item_id);
    if (!item.meta) {
      throw new Error(`Item with id ${attrs.item_id} was not found`);
    }

    const reqStream = await gateway.storage.fetchProxy(item.meta, req.user.leth_token);
    reqStream
      .on('downloadProgress', progress => {
        debug(`Transferring: ${progress.transferred} KB`);
        if (progress.percent === 1) {
          debug("Transfer completed");
        }
      })
      .pipe(res);
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

module.exports = router;