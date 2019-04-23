'use strict';

/**
 * Dependencies
 */
let chalk = require('chalk');
let ValidationError = require('./type/client/validation');

/**
 * Module export
 */
module.exports = function(error) {

  //Log stack if present
  if (error.stack) {
    return console.log(chalk.red(error.stack));
  }

  //Log error name and code
  console.log(chalk.red(
    error.name + (error.message ? (': ' + error.message) : '')
  ));

  //Log validation error data
  if (error instanceof ValidationError && error.data && error.data.fields) {
    let fields = error.data.fields;
    for (let field in fields) {
      if (fields.hasOwnProperty(field)) {
        console.log(chalk.red('  - ', field + ':', fields[field].message));
      }
    }
  }
};
