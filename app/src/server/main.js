'use strict';

/**
 * Dependencies
 */
let path = require('path');
let chalk = require('chalk');

/**
 * Fix CWD if run from scripts path
 */
let cwd = process.cwd().split(path.sep);
if (cwd.length && cwd[cwd.length - 1] === 'scripts') {
  cwd.pop();
  process.chdir(cwd.join(path.sep));
}

/**
 * Configuration
 */
let config = require('./app/config');
const ENV = config.ENV;
const APP_NAME = config.APP_NAME;
const SERVER_PORT = config.SERVER_PORT;
const SERVER_HTTPS = config.SERVER_HTTPS;

/**
 * Error handler
 */
function expressErrorHandler(err) {
  if (err.errno === 'EADDRINUSE') {
    console.log(chalk.red('Web server port %s is already in use'), SERVER_PORT);
  }
  else {
    console.log(chalk.red('Web server error:'));
    console.log(chalk.red(err));
  }
  process.exit(-1);
}

/**
 * Log
 */
console.log('Running application', chalk.magenta(APP_NAME),
  'in the', chalk.magenta(ENV), 'environment');

/**
 * Initialize express application
 */
console.log('Starting Express server...');
let app = require('./app/app');
let server = app.listen(SERVER_PORT, function() {

  //Skip if no address
  if (!this.address()) {
    return;
  }

  //Determine address
  let host = this.address().address.replace('::', 'localhost');
  let port = this.address().port;
  let protocol = SERVER_HTTPS ? 'https://' : 'http://';
  let address = protocol + host + ':' + port;

  //Output success message
  console.log(chalk.green('Express server started @ '), chalk.magenta(address));
});
server.on('error', expressErrorHandler);

/**
 * Expose app
 */
module.exports = app;
