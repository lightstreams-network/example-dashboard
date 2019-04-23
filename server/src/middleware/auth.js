
const { auth: authConfig } = require('src/config');
const passportJwt = require('passport-jwt');
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const { user: User } = require('../../models');

const params = {
    secretOrKey: authConfig.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const jwtStrategy = new JwtStrategy(params, (payload, done) => {
    User.findById(payload.id).then(user => {
        if (!user) done(null, false);
        done(null, user);
    });
});

module.exports = (passport) => {
    passport.use(jwtStrategy);
};