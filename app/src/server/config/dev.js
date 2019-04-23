'use strict';

/**
 * Get package info and server port
 */
const path = require('path');
const BASE_PATH = path.resolve(path.join(__dirname, '../../../'));
let pkg = require(path.join(BASE_PATH, 'package.json'));

/**
 * Environment configuration (dev)
 */
module.exports = {

   //App
   APP_NAME: pkg.name,
   APP_VERSION: pkg.version,
   APP_BASE_URL: 'http://localhost:3000',
   APP_PATH: path.join(BASE_PATH, 'dist'),
   PUBLIC_PATH: path.join(BASE_PATH, 'src/assets'),
   ASSETS_PATH: path.join(BASE_PATH, 'src/assets'),
   DLL_PATH: path.join(__dirname, '../client/dll'),

   //API
   API_VERSION: 1,
   API_BASE_URL: 'http://localhost:3000',
   API_BASE_PATH: '/api/v1',

   //Server
   SERVER_PORT: process.env.PORT || 8080,
   SERVER_HTTPS: false,
   SERVER_LATENCY: true,
   SERVER_LATENCY_MIN: 500,
   SERVER_LATENCY_MAX: 1000,
   SERVER_PUBLIC_INDEX: '',
   SERVER_SESSION_SECRET: 'xxxx',

   //Database
   DB_URI: 'mongodb://localhost/lightstreams',
   DB_DEBUG: true,
   DB_USER: '',
   DB_PASS: '',

   //Registry
   REGISTRY_URL: 'http://localhost:4000',

   // Passport Local Auth
   AUTH_SECRET: 'xxxxx',
   AUTH_TOKENTIME_SECS: 120,

   // LinkedIn
   LINKEDIN_API_KEY: '7787dd8d5316jd',
   LINKEDIN_SECRET_KEY: '2gVo6AVqyMRs1hbr',
   LINKEDIN_CALLBACK_URL: 'http://localhost:3005/api/v1/auth/linkedin/callback',

   // Uphold
   UPHOLD_LIB: './uphold-sdk-test',
   UPHOLD_APP_KEY: 'xxx',
   UPHOLD_APP_SECRET: 'xxx',

   // Docusign
   DOCUSIGN_LIB: './docusign-sdk',
   DOCUSIGN_URL: 'account-d.docusign.com',
   DOCUSIGN_APP_KEY: 'e8955f08-09d7-41b5-b909-a3523d81ab03',
   DOCUSIGN_APP_SECRET: '0c4e7b51-b569-43e4-ad3b-71b0cb737c6f',

   //Internationalization
   I18N_LOCALES: ['en'],
   I18N_DEFAULT_LOCALE: 'en',

   //Email identities
   EMAIL_IDENTITY_NOREPLY: 'My Application <no-reply@my-application.com>',
   EMAIL_IDENTITY_ADMIN: 'Admin <admin@my-application.com>',

   //Authentication
   REFRESH_TOKEN_COOKIE_MAX_AGE: 30 * 24 * 3600, //seconds
   REFRESH_TOKEN_COOKIE_SECURE: false,
   SECURE_STATUS_EXPIRATION: 300, //seconds

   //Tokens
   TOKEN_DEFAULT_AUDIENCE: 'http://my-application.com/app',
   TOKEN_DEFAULT_ISSUER: 'http://my-application.com/api',
   TOKEN_TYPES: {
      access: {
         secret: 'test',
         expiration: 3600
      },
      refresh: {
         secret: 'test',
         expiration: 30 * 24 * 3600
      },
      verifyEmail: {
         secret: 'test',
         expiration: 48 * 3600
      },
      resetPassword: {
         secret: 'test',
         expiration: 24 * 3600
      }
   },

   //Sendgrid
   SENDGRID_API_KEY: '',

   //Cryptography
   BCRYPT_ROUNDS: 10,

   //User
   USER_PASSWORD_MIN_LENGTH: 6,
   USER_AVATAR_MAX_FILE_SIZE: 512 * 1024 //bytes
};
