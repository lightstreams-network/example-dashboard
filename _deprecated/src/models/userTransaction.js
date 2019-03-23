module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('user_transaction', {
        hash: { type: DataTypes.STRING, unique: true },
        user_id: DataTypes.INTEGER,
        value: DataTypes.INTEGER,
        token: DataTypes.STRING,
        status: DataTypes.INTEGER, // @TODO Replace by ENUM
    }, {
        tableName: 'user_transaction',
        underscored: true,
    });

    Transaction.associate = function(models) {
        models.user_transaction.belongsTo(models.user);
    };

    return Transaction;
};
