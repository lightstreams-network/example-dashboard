module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('item', {
    item_id: { type: DataTypes.INTEGER, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    title: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    meta: { type: DataTypes.STRING, unique: true },
    acl: { type: DataTypes.STRING },
  }, {
    tableName: 'item',
    underscored: true
  });

  Item.prototype.toJSON = function toJSON() {
    return Object.assign({}, this.get());
  };

  Item.findOneByMeta = (meta) => {
    return Item.findOne({ where: { meta: meta } });
  };

  Item.findByUserId = (userId) => {
    return Item.find({ where: { user_id: userId } });
  };

  Item.getMaxItemId = (userId) => {
    return Item.max('item_id', { where: { user_id: userId } });
  };

  return Item;
};
