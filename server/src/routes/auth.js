const express = require('express');
const router = express.Router();
const _ = require('lodash');
const debug = require('debug')('app:server');

const Session = require('src/services/session');
const { badInputResponse, jsonResponse } = require('src/lib/responses');
const { extractRequestAttrs, validateRequestAttrs } = require('src/lib/request');
const ProfileService = require('src/services/profile');
const DashboardService = require('src/services/dashboard');
const gateway = require('src/services/gateway').gateway();

router.post('/signup', async (req, res, next) => {
  const query = ['username', 'password'];
  try {
    validateRequestAttrs(req, query);
  } catch ( err ) {
    next(badInputResponse(err.message));
    return;
  }

  try {
    const attrs = extractRequestAttrs(req, query);
    const existingUser = await DashboardService.retrieveUserByUsername(attrs.username);
    if (existingUser) {
      throw new Error(`User ${attrs.username} already exists`);
    }
    const { account: ethAddress } = await gateway.user.signUp(attrs.password);
    const profileAddress = await ProfileService.createUser(ethAddress, attrs.password);
    await DashboardService.createUserDashboard({
      username: attrs.username,
      ethAddress,
      profileAddress
    });
    const user = await DashboardService.retrieveUserByUsername(attrs.username);
    const { token } = await gateway.user.signIn(user.ethAddress, attrs.password);
    user.lethToken = token;
    const authToken = Session.jwtEncode({
      username: attrs.username,
      password: attrs.password,
      lethToken: token
    });
    res.send(jsonResponse({ token: authToken, user }));
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  const query = ['username', 'password'];
  try {
    validateRequestAttrs(req, query);
  } catch ( err ) {
    next(badInputResponse(err.message));
    return;
  }

  try {
    const attrs = extractRequestAttrs(req, query);
    const user = await DashboardService.retrieveUserByUsername(attrs.username);
    if (!user) {
      throw new Error(`User ${attrs.username} was not found`);
    }
    const { token } = await gateway.user.signIn(user.ethAddress, attrs.password);
    // user.password = attrs.password; // @TODO Encrypt password based on session token
    user.lethToken = token;
    const authToken = Session.jwtEncode({
      username: attrs.username,
      password: attrs.password,
      lethToken: token
    });
    res.send(jsonResponse({ token: authToken, user }))
  } catch ( err ) {
    debug(err);
    next(err);
  }
});

module.exports = router;
