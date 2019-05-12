const express = require('express');
const router = express.Router();
const _ = require('lodash');
const debug = require('debug')('app:server');
const { Sequelize } = require('src/models');
const { badInputResponse, unauthorizedResponse, jsonResponse } = require('src/lib/responses');
const { extractRequestAttrs, validateRequestAttrs } = require('src/lib/request');
const { jwtEncode } = require('src/services/session');
const { verifyUser, createUser, updateUser, searchUserByUsername, UserServiceError } = require('src/services/user');
const { createUserDashboard } = require('src/services/dashboard');
const gateway = require('src/services/gateway').gateway();

router.post('/sign-up', async (req, res, next) => {
  const query = ['username', 'password'];
  try {
    validateRequestAttrs(req, query);
  } catch ( err ) {
    next(badInputResponse(err.message));
    return;
  }

  try {
    const attrs = extractRequestAttrs(req, query);
    // const user = await createUser({
    //   username: attrs.username,
    //   password: attrs.password
    // });
    const user = await searchUserByUsername(attrs.username);

    await createUserDashboard(user);
    res.send(jsonResponse({ user }));
  } catch ( err ) {
    if (err instanceof Sequelize.ValidationError) {
      const sequelizeValidationError = new Error(err.errors[0].message);
      sequelizeValidationError.status = 400;
      return next(sequelizeValidationError);
    }

    debug(err);
    next(err);
  }
});

router.post('/sign-in', async (req, res, next) => {
  const query = ['username', 'password'];
  try {
    validateRequestAttrs(req, query);
  } catch ( err ) {
    next(badInputResponse(err.message));
    return;
  }

  try {
    const attrs = extractRequestAttrs(req, query);
    const user = await verifyUser(attrs.username, attrs.password);
    const { token } = await gateway.user.signIn(user.eth_address, attrs.password);
    // @TODO: replace by session
    const nextUser = await updateUser(attrs.username, {
      leth_token: token
    });
    const authToken = jwtEncode({ id: user.id });
    res.json(jsonResponse({ token: authToken, user: nextUser }));
  } catch ( err ) {
    if (err instanceof UserServiceError) {
      next(unauthorizedResponse(err.message));
      return;
    }
    if (err instanceof Sequelize.ValidationError) {
      const sequelizeValidationError = new Error(err.errors[0].message);
      sequelizeValidationError.status = 400;
      return next(sequelizeValidationError);
    }

    debug(err);
    next(err);
  }
});

module.exports = router;
