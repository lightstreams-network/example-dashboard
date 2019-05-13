const bcrypt = require('bcrypt');
const { DateTime } = require('luxon');
const { user: Profile } = require('src/models');
const Web3 = require('src/services/web3');
const debug = require('debug')('app:user');
const { requestFunding } = require('src/services/faucet');
const profileSCService = require('src/smartcontracts/profile');
const gateway = require('src/services/gateway').gateway();

class UserServiceError extends Error {}

module.exports.UserServiceError = UserServiceError;

module.exports.createUser = async (ethAddress, password) => {
  const web3 = await Web3();

  await requestFunding(ethAddress, 1);
  return await profileSCService.createProfile(web3, { from: ethAddress, password });
};


module.exports.verifyUser = async (username, password) => {
  const user = await Profile.findOneByUsername(username);
  if (!user) {
    throw new UserServiceError(`User ${username} is not found`);
  }

  let passwordIsValid;
  try {
    passwordIsValid = bcrypt.compareSync(password, user.password);
  } catch ( err ) {
    throw new UserServiceError(`Invalid password`);
  }

  if (!passwordIsValid) {
    throw new UserServiceError(`Password does not match`);
  }

  return user;
};

module.exports.updateUser = async (username, values) => {
  const user = await Profile.findOneByUsername(username);
  if (!user) {
    throw new UserServiceError(`User ${username} is not found`);
  }

  await user.update(values);
  return user;
};

module.exports.searchUserByUsername = async (username) => {
  const user = await Profile.findOneByUsername(username);
  if (!user) {
    throw new UserServiceError(`User ${username} is not found`);
  }

  return user;
};