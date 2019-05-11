const bcrypt = require('bcrypt');
const { DateTime } = require('luxon');
const { user: User } = require('src/models');
const Web3 = require('src/services/web3');
const { sendPhtTo } = require('src/services/web3');
const debug = require('debug')('app:user');

const profileSCService = require('src/smartcontracts/profile');
const gateway = require('src/services/gateway').gateway();

class UserServiceError extends Error {}

module.exports.UserServiceError = UserServiceError;

module.exports.createUser = async ({ username, password }) => {
  const now = DateTime.utc().toSQL();
  const web3 = await Web3();
  const { account: ethAddress } = await gateway.user.signUp(password);
  debug(`New wallet requested to leth: ${ethAddress}`);
  const amountInPht = 0.5;
  sendPhtTo(web3, ethAddress, amountInPht);
  const profileAddress = await profileSCService.createProfile(web3, { from: ethAddress, password });

  const attrs = {
    username: username,
    password: bcrypt.hashSync(password, 10),
    eth_address: ethAddress,
    dashboard_address: null,
    profile_address: profileAddress,
    created_at: now,
    modified_at: now,
  };

  debug(`User added: ${JSON.stringify(attrs)}`);
  return User.create(attrs);
};


module.exports.verifyUser = async (username, password) => {
  const user = await User.findOneByUsername(username);
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
  const user = await User.findOneByUsername(username);
  if (!user) {
    throw new UserServiceError(`User ${username} is not found`);
  }

  return await user.update(values);
};

module.exports.searchUserByUsername = async (username) => {
  const user = await User.findOneByUsername(username);
  if (!user) {
    throw new UserServiceError(`User ${username} is not found`);
  }

  return user;
};