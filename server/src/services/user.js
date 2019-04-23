const bcrypt = require('bcrypt');
const { DateTime } = require('luxon');
const { user: User } = require('src/models');

class UserServiceError extends Error {

}

module.exports.UserServiceError = UserServiceError;

    module.exports.createUser = ({ username, password, ethAddress }) => {
    const now = DateTime.utc().toSQL();
    const attrs = {
        username: username,
        password: bcrypt.hashSync(password, 10),
        eth_address: ethAddress,
        created_at: now,
        modified_at: now,
    };

    return User.create(attrs);
};

module.exports.verifyUser = async (username, password ) => {
    const user = await User.findOneByUsername(username);
    if (!user) {
        throw new UserServiceError(`User ${username} is not found`);
    }

    let passwordIsValid;
    try {
        passwordIsValid = bcrypt.compareSync(password, user.password);
    } catch(err) {
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