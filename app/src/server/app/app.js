'use strict';

/**
 * Dependencies
 */
let path = require('path');
let i18n = require('i18n');
let cors = require('cors');
let morgan = require('morgan');
let express = require('express');
let bodyParser = require('body-parser');
let compression = require('compression');
const expressSession = require('express-session');
let cookieParser = require('cookie-parser');
let router = require('./services/router');
let staticFiles = require('./services/static-files');
let tokens = require('./services/tokens');
let db = require('./services/db');
let auth = require('./services/auth');
let config = require('./config');

/**
 * Error handling middleware
 */
let normalizeError = require('./error/middleware/normalize-error');
let logError = require('./error/middleware/log-error');
let storeError = require('./error/middleware/store-error');
let processError = require('./error/middleware/process-error');
let sendError = require('./error/middleware/send-error');

/**
 * Configuration
 */
const I18N_LOCALES = config.I18N_LOCALES;
const I18N_DEFAULT_LOCALE = config.I18N_DEFAULT_LOCALE;
const TOKEN_TYPES = config.TOKEN_TYPES;
const TOKEN_DEFAULT_ISSUER = config.TOKEN_DEFAULT_ISSUER;
const TOKEN_DEFAULT_AUDIENCE = config.TOKEN_DEFAULT_AUDIENCE;
const APP_BASE_URL = config.APP_BASE_URL;
const SERVER_LATENCY = config.SERVER_LATENCY;
const SERVER_LATENCY_MIN = config.SERVER_LATENCY_MIN;
const SERVER_LATENCY_MAX = config.SERVER_LATENCY_MAX;
const SERVER_SESSION_SECRET = config.SERVER_SESSION_SECRET;

const PUBLIC_PATH = config.PUBLIC_PATH;
const ASSETS_PATH = config.ASSETS_PATH;
const APP_PATH = config.APP_PATH;

//Configure i18n
i18n.configure({
   directory: 'src/server/app/locales',
   locales: I18N_LOCALES,
   defaultLocale: I18N_DEFAULT_LOCALE,
   objectNotation: true,
   api: {
      '__': 't'
   }
});


//Initialize express app
let app = express();

//Setup database
db(app);


app.use(expressSession(
   {
      secret: SERVER_SESSION_SECRET,
      resave: false,
      saveUninitialized: false
   }
));

 //Setup tokens
 tokens.setDefaults({
 issuer: TOKEN_DEFAULT_ISSUER,
 audience: TOKEN_DEFAULT_AUDIENCE
 });
 tokens.register(TOKEN_TYPES);

 /*//CORS
 app.use(cors({
 origin: APP_BASE_URL,
 //NOTE: needed for cross domain cookies to work
 credentials: true
 }));*/

//CORS middleware
var allowCrossDomain = (req, res, next) => {
   let allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://0.0.0.0:3000', 'http://0.0.0.0:3001', 'http://0.0.0.0:3002', 'http://0.0.0.0:3003'];
   let origin = req.headers.origin;
   if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
   }
   res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
   res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, Access-Control-Allow-Origin');

   next();
};

app.use(allowCrossDomain);

//Compression
app.use(compression({
   level: 3,
   filter(req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
   }
}));

//Logger
app.use(morgan('dev'));

//Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
   extended: true
}));

//Add cookie parser middleware
//app.use(cookieParser());

//Parse application/json
app.use(bodyParser.json());
app.use(bodyParser.json({
   type: 'application/vnd.api+json'
}));

//Use i18n
app.use(i18n.init);


//Simulate latency
if (SERVER_LATENCY) {
   let latency = require('express-simulate-latency')({
      min: SERVER_LATENCY_MIN,
      max: SERVER_LATENCY_MAX
   });
   app.use(latency);
}

//Set static folders
app.use('/public', express.static(PUBLIC_PATH));
app.use('/assets', express.static(ASSETS_PATH));
app.get('/main*',
   function (req, res) {
      res.sendFile(path.join(APP_PATH, req.url));
   }
);
app.get('/polyfills*',
   function (req, res) {
      res.sendFile(path.join(APP_PATH, req.url));
   }
);
app.get('/vendor*',
   function (req, res) {
      res.sendFile(path.join(APP_PATH, req.url));
   }
);

//Load authentication
auth(app);

//Load router
router(app);

//Serve static files
staticFiles(app);

//Error handlers
app.use([
   normalizeError,
   logError,
   storeError,
   processError,
   sendError
]);

module.exports = app;
