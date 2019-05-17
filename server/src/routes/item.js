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

const DashboardService = require('src/services/dashboard');
const ProfileService = require('src/services/profile');

const session = require('src/services/session').passport();
const gateway = require('src/services/gateway').gateway();


router.post('/add', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  const query = ['file', 'title', 'description'];
  try {
    validateRequestAttrs(req, query);
  } catch ( err ) {
    next(badInputResponse(err.message));
    return;
  }

  try {
    const attrs = extractRequestAttrs(req, query);
    const itemId = await ProfileService.uploadNewItem(req.user, req.user.password, {
      title: attrs.title,
      description: attrs.description,
      file: attrs.file
    });
    const item = await ProfileService.retrieveRemoteItem(req.user, itemId);
    res.json(jsonResponse(item));
    res.send();
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

router.get('/list', session.authenticate('jwt', { session: false }), async (req, res, next) => {

  try {
    const items = await ProfileService.retrieveRemoteItemList(req.user);
    const itemRequests = await DashboardService.getItemRequestsData(req.user);
    const responseData = items.map((item) => {
      item.requests = itemRequests[item.id];
      return item;
    });
    res.json(jsonResponse(responseData));
    res.send();
  } catch ( err ) {
    debug(err);
    next(err);
  }
});


router.get('/info', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  const query = ['item_id'];
  try {
    validateRequestAttrs(req, query);
  } catch ( err ) {
    next(badInputResponse(err.message));
    return;
  }

  try {
    const attrs = extractRequestAttrs(req, query);
    const item = await ProfileService.retrieveRemoteItem(req.user, attrs.item_id);
    res.json(jsonResponse(item));
    res.send();
  } catch ( err ) {
    debug(err);
    next(err);
  }
});


router.get('/download', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  const query = ['item_id'];
  try {
    validateRequestAttrs(req, query);
  } catch ( err ) {
    next(badInputResponse(err.message));
    return;
  }

  try {
    const attrs = extractRequestAttrs(req, query);
    const item = await ProfileService.retrieveRemoteItem(req.user, attrs.item_id);
    if (!item.meta) {
      throw new Error(`Item with id ${attrs.item_id} was not found`);
    }

    const rawGwRes = await gateway.storage.fetch(item.meta, req.user.lethToken, true);
    res.setHeader('Content-Disposition', rawGwRes.headers.get('Content-Disposition'));
    res.setHeader('Content-Type', rawGwRes.headers.get('Content-Type'));
    rawGwRes.body.pipe(res);
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

module.exports = router;