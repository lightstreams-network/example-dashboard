/**
 * User: ggarrido
 * Date: 4/02/19 15:10
 * Copyright 2019 (c) Lightstreams, Palma
 */

const express = require('express');
const router = express.Router();
const debug = require('debug')('app:server');
const { user: User } = require('src/models');

const { extractRequestAttrs, validateRequestAttrs } = require('src/lib/request');
const { badInputResponse, jsonResponse } = require('src/lib/responses');

const DashboardService = require('src/services/dashboard');

const session = require('src/services/session').passport();

router.post('/request-access', async (req, res, next) => {
  const query = ['user_id', 'meta'];
  try {
    validateRequestAttrs(req, query);
  } catch ( err ) {
    next(badInputResponse(err.message));
    return;
  }

  try {
    const attrs = extractRequestAttrs(req, query);
    const user = await User.findByPk(attrs.user_id);
    const event = await DashboardService.requestItemAccess(user, attrs.meta);
    await DashboardService.updateUsersDataFromEvent(event);
    res.json(jsonResponse(event));
    res.send();
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

router.post('/deny-request', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  const query = ['user_id', 'item_id', 'request_id'];
  try {
    validateRequestAttrs(req, query);
  } catch ( err ) {
    next(badInputResponse(err.message));
    return;
  }

  try {
    const attrs = extractRequestAttrs(req, query);
    const event = await DashboardService.denyRequestItemAccess(req.user, attrs.item_id, attrs.request_id);
    await DashboardService.updateUsersDataFromEvent(event);
    res.json(jsonResponse(event));
    res.send();
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

router.post('/revoke-access', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  const query = ['beneficiary_id', 'item_id'];
  try {
    validateRequestAttrs(req, query);
  } catch ( err ) {
    next(badInputResponse(err.message));
    return;
  }

  try {
    const attrs = extractRequestAttrs(req, query);
    const beneficiaryUser = await User.findByPk(attrs.beneficiary_id);
    if (!beneficiaryUser) {
      throw new Error(`User '${beneficiaryUserId}' not found`)
    }
    const event = await DashboardService.revokeAccess(req.user, attrs.item_id, beneficiaryUser);
    await DashboardService.updateUsersDataFromEvent(event);
    res.json(jsonResponse({
      revoked: 'ALL',
      beneficiary: beneficiaryUser.eth_address,
      event: event
    }));
    res.send();
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

router.post('/grant-access', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  const query = ['beneficiary_id', 'item_id'];
  try {
    validateRequestAttrs(req, query);
  } catch ( err ) {
    next(badInputResponse(err.message));
    return;
  }

  try {
    const attrs = extractRequestAttrs(req, query);
    const beneficiaryUser = await User.findByPk(attrs.beneficiary_id);
    if (!beneficiaryUser) {
      throw new Error(`User '${beneficiaryUserId}' not found`)
    }
    const event = await DashboardService.grantReadAccess(req.user, attrs.item_id, beneficiaryUser);
    await DashboardService.updateUsersDataFromEvent(event);
    res.json(jsonResponse({
      granted: 'READ',
      beneficiary: beneficiaryUser.eth_address,
      event: event
    }));
    res.send();
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

router.get('/list', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const events = await DashboardService.getEvents(req.user);
    res.json(jsonResponse(events));
    res.send();
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

module.exports = router;