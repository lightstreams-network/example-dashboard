module.exports = (sequelize, DataTypes) => {
  const ShelveItem = sequelize.define('shelveItem', {
    item_id: { type: DataTypes.INTEGER, primaryKey: true },
    title: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    file: { type: DataTypes.STRING, unique: true },
    cover: { type: DataTypes.STRING },
    acl: { type: DataTypes.STRING },
    owner: { type: DataTypes.STRING },
    price: { type: DataTypes.FLOAT }
  }, {
    tableName: 'shelve_item',
    underscored: true
  });

  ShelveItem.prototype.toJSON = function toJSON() {
    return Object.assign({}, this.get());
  };

  ShelveItem.findOneByFileHash = (fileHash) => {
    return ShelveItem.findOne({ where: { file: fileHash } });
  };

  ShelveItem.getMaxItemId = () => {
    return ShelveItem.max('item_id');
  };

  return ShelveItem;
};
