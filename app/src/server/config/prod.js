'use strict';

/**
 * Get package info and server port
 */
const path = require('path');
const nconf = require('nconf');
const BASE_PATH = path.resolve(path.join(__dirname, '../../../'));
let pkg = require(path.join(BASE_PATH, 'package.json'));

nconf.argv().env().file('keys.json');

const BASE_URL = nconf.get('BASE_URL');

/**
 * Environment configuration (prod)
 */
module.exports = {

   //App
   APP_NAME: pkg.name,
   APP_VERSION: pkg.version,
   APP_BASE_URL: nconf.get('BASE_URL'),
   APP_PATH: path.join(BASE_PATH, 'dist'),
   PUBLIC_PATH: path.join(BASE_PATH, 'dist/assets'),
   ASSETS_PATH: path.join(BASE_PATH, 'dist/assets'),
   DLL_PATH: path.join(__dirname, '../../dist/app/dll'),

   //API
   API_VERSION: 1,
   API_BASE_URL: BASE_URL,
   //API_BASE_URL: 'http://localhost:8080',
   API_BASE_PATH: '/api/v1',

   //Server
   SERVER_PORT: process.env.PORT || 8080,
   SERVER_HTTPS: true,
   SERVER_LATENCY: false,
   SERVER_LATENCY_MIN: 0,
   SERVER_LATENCY_MAX: 0,
   SERVER_PUBLIC_INDEX: './dist/index.html',
   SERVER_SESSION_SECRET: process.env.SERVER_SESSION_SECRET || 'xxxx',

   //Database
   DB_URI: `${nconf.get('mongoHost')}/${nconf.get('mongoDatabase')}`,
   DB_DEBUG: true,
   DB_USER: nconf.get('mongoUser'),
   DB_PASS: nconf.get('mongoPass'),

   //Registry
   REGISTRY_URL: nconf.get('REGISTRY_URL'),

   // Passport Local Auth
   AUTH_SECRET: 'xxxxx',
   AUTH_TOKENTIME_SECS: 120,

   // LinkedIn
   LINKEDIN_API_KEY: nconf.get('LINKEDIN_API_KEY'),
   LINKEDIN_SECRET_KEY: nconf.get('LINKEDIN_SECRET_KEY'),
   LINKEDIN_CALLBACK_URL: `${BASE_URL}/api/v1/auth/linkedin/callback`,

   // Uphold
   UPHOLD_LIB: 'uphold-sdk-node',
   UPHOLD_APP_KEY: nconf.get('UPHOLD_KEY'),
   UPHOLD_APP_SECRET: nconf.get('UPHOLD_SECRET'),

   // Docusign
   DOCUSIGN_LIB: './docusign-sdk',
   DOCUSIGN_URL: 'account-d.docusign.com',
   DOCUSIGN_APP_KEY: 'e8955f08-09d7-41b5-b909-a3523d81ab03',
   DOCUSIGN_APP_SECRET: '0c4e7b51-b569-43e4-ad3b-71b0cb737c6f',

   // IPFS
   IPFS_LIB: './ipfs-sdk',

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
         secret: 'prod',
         expiration: 3600
      },
      refresh: {
         secret: 'prod',
         expiration: 30 * 24 * 3600
      },
      verifyEmail: {
         secret: 'prod',
         expiration: 48 * 3600
      },
      resetPassword: {
         secret: 'prod',
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
