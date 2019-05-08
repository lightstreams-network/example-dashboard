const bcrypt = require('bcrypt');
const { DateTime } = require('luxon');
const { user: User } = require('src/models');
const Web3 = require('src/services/web3');
const debug = require('debug')('app:user');

const profileSCService = require('src/smartcontracts/profile');

class UserServiceError extends Error {

}

module.exports.UserServiceError = UserServiceError;

module.exports.createUser = async ({ username, password, ethAddress }) => {
  const now = DateTime.utc().toSQL();
  const profile = await profileSCService.createProfile(await Web3(), { username, holder: ethAddress});

  const attrs = {
    username: username,
    password: bcrypt.hashSync(password, 10),
    eth_address: ethAddress,
    dashboard_address: profile.profileAddress,
    profile_address: profile.dashboardAddress,
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