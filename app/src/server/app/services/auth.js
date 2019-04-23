'use strict';

const path = require('path');
const glob = require('glob');
const passport = require('passport');
const chalk = require('chalk');
const config = require('../config');

module.exports = function (app) {
   //Passport initialization
   app.use(passport.initialize());

   //Load authentication strategies
   console.log('Loading authentication strategies...');
   glob.sync('./src/server/app/auth/strategies/**/*.js')
       .forEach(strategyPath => {
          console.log(chalk.grey(' - %s'), strategyPath.replace('./src/server/app/', ''));
          require(path.resolve(strategyPath))();
       });
};
