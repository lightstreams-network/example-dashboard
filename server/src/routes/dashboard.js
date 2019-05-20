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
    res.send(jsonResponse(nextRootData));
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

router.get('/profile/get', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  const query = ['username'];

  try {
    const attrs = extractRequestAttrs(req, query);
    let user;
    if (attrs.username) {
      user = await DashboardService.retrieveUserByUsername(attrs.username);
    } else {
      user = req.user;
    }

    const items = await ProfileService.retrieveRemoteItemList(user);
    const itemRequests = await DashboardService.getItemRequestsData(req.user);
    const fullItems = items.map((item) => {
      item.events = itemRequests[item.id];
      item.username = user.username;
      return item;
    });
    const profilePictureData = await DashboardService.getProfilePictureData(user);
    res.send(jsonResponse({
      profilePicture: profilePictureData,
      username: user.username,
      ethAddress: user.ethAddress,
      items: fullItems
    }));
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

router.get('/profile/get-all', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  const query = ['username'];

  try {
    const attrs = extractRequestAttrs(req, query);
    let user;
    if (attrs.username) {
      user = await DashboardService.retrieveUserByUsername(attrs.username);
    } else {
      user = req.user;
    }

    const rootData = await DashboardService.retrieveUserRootData(user);
    res.send(jsonResponse(rootData));
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

router.get('/profile/request-access', session.authenticate('jwt', { session: false }), async (req, res, next) => {
  const query = ['username'];
  try {
    validateRequestAttrs(req, query);
  } catch ( err ) {
    next(badInputResponse(err.message));
    return;
  }

  try {
    const attrs = extractRequestAttrs(req, query);
    let user = await DashboardService.retrieveUserByUsername(attrs.username);
    if (!user.username) {
      throw new Error(`User ${attrs.username} was not found`);
    }
    const profilePictureData = await DashboardService.getProfilePictureData(user);
    if (!profilePictureData.itemId) {
      throw new Error(`User ${attrs.username} does not have profile`);
    }
    const itemRequest = await DashboardService.createNewItemPermissionRequest(req.user, {fromUsername: attrs.username}, profilePictureData.itemId, 'pending');
    res.send(jsonResponse(itemRequest));
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

module.exports = router;