const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jwt-simple');

const { user: User } = require('../models');
const { auth: authConfig } = require('../config');

const params = {
    secretOrKey: authConfig.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const jwtStrategy = new JwtStrategy(params, (payload, done) => {
    User.findByPk(payload.id).then(user => {
        if (!user) done(null, false);
        done(null, user);
    });
});

passport.use(jwtStrategy);

module.exports.jwtEncode = (payload) => {
    return jwt.encode(payload, authConfig.jwt.secret);
};

module.exports.passport = passport;