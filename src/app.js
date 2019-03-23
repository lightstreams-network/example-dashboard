const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const cors = require('cors');
const passportSession = require('src/services/session').passport();

// const passport = require('passport');
// const basicAuth = require('./middleware/auth/basic')(passport);
// const jwtAuth = require('./middleware/auth/jwt')(passport);
const { notFoundHandler, errorHandler } = require('src/middleware/errors');

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
app.use(passportSession.initialize());
app.use(passportSession.session()); //persistent login session


app.use('/', require('./routes'));

// catch 404 and forward to error handler
app.use(notFoundHandler);

// error handler
app.use(errorHandler);

module.exports = app;
