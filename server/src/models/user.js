module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: { type: DataTypes.STRING, unique: true },
    eth_address: { type: DataTypes.STRING, unique: true },
    leth_token: DataTypes.STRING,
    profile_address: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING
  }, {
    tableName: 'user',
    underscored: true
  });

  User.prototype.toJSON = function toJSON() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };

  User.findOneByUsername = (username) => {
    return User.findOne({ where: { username } });
  };

  return User;
};
