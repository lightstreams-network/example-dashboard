// PROVISIONAL: Only for POC version
module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define('faucet', {
        to_address: { type: DataTypes.STRING, unique: true },
        amount: DataTypes.STRING,
        succeeded: { type: DataTypes.BOOLEAN, allowNull: true }
    }, {
        tableName: 'faucet',
        underscored: true
    });

    Model.findByToAddress = function findByEmail(ethAddress) {
        return Model.findAll({ where: { to_address: ethAddress } });
    };

    return Model;
};
