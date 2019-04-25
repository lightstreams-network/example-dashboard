/**
 * User: ggarrido
 * Date: 24/04/19 14:49
 * Copyright 2019 (c) Lightstreams, Granada
 */

const { createUser } = require('src/services/user');
const gateway = require('src/services/gateway').gateway();

function generate_random_string(string_length) {
  let random_string = '';
  let random_ascii;
  for ( let i = 0; i < string_length; i++ ) {
    random_ascii = Math.floor((Math.random() * 25) + 97);
    random_string += String.fromCharCode(random_ascii)
  }
  return random_string
}

module.exports.sessionHandler = async (req, res, next) => {
  if (!req.session.user) {
    const pwd = generate_random_string(7);
    const { account } = await gateway.user.signUp(pwd);
    user = await createUser({
      username: generate_random_string(7),
      password: pwd,
      ethAddress: account
    });
    req.session.user = user;
  }

  next();
};