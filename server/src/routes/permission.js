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

const session = require('src/services/session').passport();

router.post('/request-access', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  const query = ['username', 'item_id'];
  try {
    validateRequestAttrs(req, query);
  } catch ( err ) {
    next(badInputResponse(err.message));
    return;
  }

  try {
    const attrs = extractRequestAttrs(req, query);
    const destUser = await DashboardService.retrieveUserByUsername(attrs.username);
    const itemRequest = await DashboardService.createNewItemPermissionRequest(destUser, { fromUsername: req.user.username }, attrs.item_id, 'pending');
    res.json(jsonResponse(itemRequest));
    res.send();
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

router.post('/deny-request', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  const query = ['username', 'item_id'];
  try {
    validateRequestAttrs(req, query);
  } catch ( err ) {
    next(badInputResponse(err.message));
    return;
  }

  try {
    const attrs = extractRequestAttrs(req, query);
    await DashboardService.denyPermissionRequest(req.user, attrs.username, attrs.item_id);
    res.json(jsonResponse({
      denied: true
    }));
    res.send();
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

router.post('/revoke-access', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  const query = ['username', 'item_id'];
  try {
    validateRequestAttrs(req, query);
  } catch ( err ) {
    next(badInputResponse(err.message));
    return;
  }

  try {
    const attrs = extractRequestAttrs(req, query);
    await DashboardService.revokeAccess(req.user, attrs.username, attrs.item_id);
    res.json(jsonResponse({
      revoked: true,
    }));
    res.send();
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

router.post('/grant-access', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  const query = ['username', 'item_id'];
  try {
    validateRequestAttrs(req, query);
  } catch ( err ) {
    next(badInputResponse(err.message));
    return;
  }

  try {
    const attrs = extractRequestAttrs(req, query);
    await DashboardService.grantReadAccess(req.user, attrs.username, attrs.item_id);
    res.json(jsonResponse({
      read: true,
    }));
    res.send();
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

// router.get('/list', session.authenticate('jwt', { session: false }), async (req, res, next) => {
//   try {
//     const events = await DashboardService.getEvents(req.user);
//     res.json(jsonResponse(events));
//     res.send();
//   } catch ( err ) {
//     debug(err);
//     next(err);
//   }
// });

module.exports = router;