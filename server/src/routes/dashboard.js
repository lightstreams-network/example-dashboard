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

const ProfileService = require('src/services/profile');
const DashboardService = require('src/services/dashboard');

const session = require('src/services/session').passport();
const gateway = require('src/services/gateway').gateway();


router.post('/profile/set-picture', session.authenticate('jwt', { session: false }), async (req, res, next) => {
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
    const nextRootData = await DashboardService.setProfilePictureData(req.user, item);
    res.json(jsonResponse(nextRootData));
    res.send();
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

router.get('/profile/get-picture', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  const query = ['username'];

  try {
    const attrs = extractRequestAttrs(req, query);
    let user;
    if (attrs.username) {
      user = await DashboardService.retrieveUserByUsername(attrs.username);
    } else {
      user = req.user;
    }

    const profilePictureData = await DashboardService.getProfilePictureData(user);
    res.json(jsonResponse(profilePictureData));
    res.send();
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

module.exports = router;