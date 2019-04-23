'use strict';

/**
 * Dependencies
 */
const path = require('path');
const BASE_PATH = path.resolve(path.join(__dirname, '../../../../../'));
const passport = require('passport');
const mongoose = require('mongoose');
const LinkedInStrategy = require('passport-linkedin');
const Account = mongoose.model('accounts');
const async = require('async');
const config = require(path.join(BASE_PATH, 'src/server/app/config'));
const InternalError = require(path.join(BASE_PATH, 'src/server/app/error/type/internal'));

/**
 * Local strategy
 */
module.exports = function () {
   passport.use(new LinkedInStrategy({
         consumerKey: config.LINKEDIN_API_KEY,
         consumerSecret: config.LINKEDIN_SECRET_KEY,
         callbackURL: config.LINKEDIN_CALLBACK_URL,
         profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline',
            'picture-url', 'public-profile-url', 'location', 'industry', 'num-connections']
      },
      function (token, tokenSecret, profile, done) {
         let streams = [];

         streams.push(next => {
            Account.findUserByLinkedInId(profile.id, next);
         });

         streams.push((user, next) => {
            if (!user) {
               if (!profile.emails || profile.emails.length === 0
                     || !profile.emails[0].value || profile.emails[0].value.length === 0) {
                  let error = new InternalError("linked profile has no email address");
                  return next(error, null);
               }
               let email = profile.emails[0].value;
               return Account.findOrCreate(email, next);
            }
            next(null, user);
         });

         streams.push((user, next) => {
            user.profile = {
               firstName: profile.name && profile.name.givenName || '',
               lastName: profile.name && profile.name.familyName || '',
               pictureUrl: profile._json && profile._json.pictureUrl || ''
            };

            user.linkedIn = {
               id: profile.id,
               headline: profile._json && profile._json.headline || '',
               industry: profile._json && profile._json.industry || '',
               numConnections: profile._json && profile._json.numConnections || 0,
               pictureUrl: profile._json && profile._json.pictureUrl || '',
               publicProfileUrl: profile._json && profile._json.publicProfileUrl || ''
            };

            Account.update(user.id, user, next);
         });

         async.waterfall(streams, (err, user) => {
            return done(err, user);
         });
      }
   ));
};
