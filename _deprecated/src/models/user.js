module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        email: { type: DataTypes.STRING, unique: true },
        eth_address: { type: DataTypes.STRING, unique: true },
        leth_token: DataTypes.STRING,
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

    User.findByEmail = (email) => {
        return User.findOne({ where: { email } });
    };

    return User;
};
