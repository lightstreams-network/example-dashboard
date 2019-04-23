'use strict';

/**
 * Dependencies
 */
let path = require('path');
let glob = require('glob');
let chalk = require('chalk');
let express = require('express');
let config = require('../config');

/**
 * Configuration
 */
const API_BASE_PATH = config.API_BASE_PATH;
const SERVER_PUBLIC_INDEX = config.SERVER_PUBLIC_INDEX;

/**
 * Export
 */
module.exports = function(app) {

  //Create API sub router
  let api = express.Router();

  //Load API routes
  console.log('Loading API routes...');
  glob.sync('./src/server/app/**/*.routes.js').forEach(routePath => {
    console.log(chalk.grey(' - %s'), routePath.replace('./src/server/app/', ''));
    require(path.resolve(routePath))(api);
  });

  //Use the API router
  app.use(API_BASE_PATH, api);

  /*//Send all other GET requests to the index.html file if needed
  if (SERVER_PUBLIC_INDEX) {
    app.get('/!*', (req, res) => {
      res.sendFile(path.resolve(SERVER_PUBLIC_INDEX));
    });
  }*/
};
