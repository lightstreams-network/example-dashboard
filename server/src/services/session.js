const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jwt-simple');

const { user: User } = require('../models');

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

  const jwtStrategy = new JwtStrategy(params, (payload, done) => {
    User.findByPk(payload.id).then(user => {
      if (!user) done(null, false);
      done(null, user);
    });
  });

  passportSession.use(jwtStrategy);
  return passportSession;
};