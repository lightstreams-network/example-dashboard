module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('event', {
    user_id: { type: DataTypes.INTEGER },
    uuid: { type: DataTypes.STRING }, // refers to `item.meta`
    type: { type: DataTypes.STRING }, // ["request", "accept", "deny"]
    payload: { type: DataTypes.JSON },
  }, {
    tableName: 'event',
    underscored: true
  });

  Event.prototype.toJSON = function toJSON() {
    return Object.assign({}, this.get());
  };

  Event.filterByUserId = (userId) => {
    return Event.findAll({ where: { user_id: userId }, order: [['created_at', 'ASC']] });
  };

  Event.filterByUuid = (uuid) => {
    return Event.findAll({ where: { uuid: uuid }, order: [['created_at', 'ASC']] });
  };

  return Event;
};

module.exports.TYPE = {
  REQUEST: 'request',
  ACCEPT: 'accept',
  DENY: 'deny',
};
