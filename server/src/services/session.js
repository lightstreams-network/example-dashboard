const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const session = require('express-session');
const DashboardService = require('src/services/dashboard');
const debug = require('debug')('app:session');

const jwt = require('jwt-simple');
const { authCfg } = require('src/lib/config');

let passportSession;

module.exports.jwtEncode = (payload) => {
  return jwt.encode(payload, authCfg.jwtSecret);
};

module.exports.passport = () => {
  if (typeof passportSession !== 'undefined') {
    return passportSession;
  }

  passportSession = require('passport');

  const params = {
    secretOrKey: authCfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  };

  const jwtStrategy = new JwtStrategy(params, async (payload, done) => {
    if(!payload.username) {
      debug(`Invalid token`);
      done(null, false);
    }

    try {
      const user = await DashboardService.retrieveUserByUsername(payload.username);
      done(null, {
        ...user,
        ...payload
      });
    } catch(e) {
      debug(e);
      done(null, false);
    }
  });

  passportSession.use(jwtStrategy);
  return passportSession;
};

module.exports.session = () => {
  return session({
    secret: authCfg.jwtSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  });
};

module.exports.saveUserSession = (req, user, token) => {
  req.session.user = user;
  req.session.token = token;
  req.session.save();
};

module.exports.authenticated = (req, res, next) => {
  let token;
  const authHeader = req.headers['Authorization'] || req.headers['authorization'];
  if (authHeader && authHeader.startsWith("Bearer ") || authHeader.startsWith("bearer ")) {
    token = authHeader.substring(7, authHeader.length);
  }

  if (req.session && req.session.token === token)
    return next();
  else
    // next(unauthorizedResponse());
    // res.send();
    return res.sendStatus(401);
};

