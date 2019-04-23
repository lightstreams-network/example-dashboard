'use strict';

/**
 * Dependencies
 */
let path = require('path');
let glob = require('glob');
let chalk = require('chalk');
let mongoose = require('mongoose');
let config = require('../config');

/**
 * Configure mongoose
 */
mongoose.Promise = require('bluebird');
mongoose.plugin(require('../plugins/mongoose/to-json-plugin'));

/**
 * Settings
 */
const DB_URI = config.DB_URI;
const DB_USER = config.DB_USER;
const DB_PASS = config.DB_PASS;
const DB_DEBUG = config.DB_DEBUG;

/**
 * Helper to check if an ID is an object ID
 */
mongoose.isObjectId = function(id) {
  return (id instanceof mongoose.Types.ObjectId);
};

/**
 * Add string to object ID method
 */
String.prototype.toObjectId = function() {
  return new mongoose.Types.ObjectId(this.toString());
};

/**
 * Error handler
 */
function dbErrorHandler(err) {
  console.log(chalk.red('Database error:'));
  console.log(chalk.red(err.stack ? err.stack : err));
  process.exit(-1);
}

/**
 * Export
 */
module.exports = function(app, options) {

  //Merge options
  options = Object.assign({
    user: DB_USER,
    pass: DB_PASS,
    debug: DB_DEBUG
  }, options);

  console.log('db:');
  console.log(options);

  //Set debugging on or off
  mongoose.set('debug', options.debug);

  //Connect to database
  console.log('Connecting to database', chalk.magenta(DB_URI), '...');
  let db = mongoose.connect(DB_URI, options);

  //Handle connection events
  mongoose.connection.on('error', dbErrorHandler);
  mongoose.connection.on('connected', () => {
    console.log(chalk.green('Database connected @'), chalk.magenta(DB_URI));
  });

  //Load models
  console.log('Loading model files...');
  glob.sync('./src/server/app/**/*.model.js').forEach(modelPath => {
    console.log(chalk.grey(' - %s'), modelPath.replace('./src/server/app/', ''));
    require(path.resolve(modelPath));
  });

  //Loading within app?
  if (app) {
    app.db = db;
  }

  //Return the database instance
  return db;
};
