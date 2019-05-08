const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const formData = require("express-form-data");
const os = require("os");
const cors = require('cors');

const { notFoundHandler, errorHandler } = require('src/middleware/errors');
const { syncItems } = require('src/services/shelves');

const app = express();
require('http').Server(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger(process.env.NODE_ENV === 'development' ? 'dev' : 'prod'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: '*', // @TODO Restrict rule
    credentials: true,
}));

// if (process.env.USE_SESSION) {
//   app.set('trust proxy', 1); // trust first proxy
//   app.use(session({
//     secret: process.env.JWT_SECRET,
//     resave: true,
//     saveUninitialized: true,
//     cookie: { }
//   }));
//   app.use(sessionHandler);
// }

const passportSession = require('src/services/session').passport();
app.use(passportSession.initialize());
app.use(passportSession.session()); //persistent login session

// parse data with connect-multiparty.
app.use(formData.parse({
  uploadDir: os.tmpdir(),
  autoClean: true
}));
// clear from the request and delete all empty files (size == 0)
app.use(formData.format());
// change file objects to stream.Readable
app.use(formData.stream());
// union body and files
app.use(formData.union());

app.use('/', require('./routes'));

// catch 404 and forward to error handler
app.use(notFoundHandler);

// error handler
app.use(errorHandler);

// setInterval(() => {
//   syncItems();
// }, 60000);
// syncItems();

module.exports = app;
