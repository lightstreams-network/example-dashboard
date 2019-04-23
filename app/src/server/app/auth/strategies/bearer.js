'use strict';

/**
 * Dependencies
 */
let passport = require('passport');
let mongoose = require('mongoose');
let BearerStrategy = require('passport-http-bearer').Strategy;
let InvalidTokenError = require('../../error/type/client/invalid-token');
let tokens = require('../../services/tokens');
let Account = mongoose.model('accounts');

/**
 * Bearer strategy
 */
module.exports = function () {
    passport.use(new BearerStrategy((accessToken, cb) => {
        tokens.validate('access', accessToken)
            .then(tokens.getId)
            .then(id => Account.findById(id))
            .then(user => {
                if (!user) {
                    throw new InvalidTokenError('No matching user found');
                }

                return cb(null, user);

                /*
                user.session = {
                    token: accessToken
                };

                Account.update(user.id, user, (err, user) => {
                    if (err) {
                        console.log('unable to save token.');
                        return res.send(500);
                    }

                    return cb(null, user);
                });
                */
            })
            .catch(cb);
    }));
};
