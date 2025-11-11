const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ResourceAccessLog = sequelize.define('ResourceAccessLog', {
    accessLogId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'access_log_id'
    },
    resourceId: {
      type: DataTypes.UUID,
      references: {
        model: 'app_resources',
        key: 'resource_id'
      },
      field: 'resource_id'
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'user_id'
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    isAllowed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_allowed'
    },
    denialReason: {
      type: DataTypes.STRING(255),
      field: 'denial_reason'
    },
    accessedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'accessed_at'
    }
  }, {
    tableName: 'resource_access_logs',
    underscored: true,
    timestamps: false,
    indexes: [
      { fields: ['resource_id'] },
      { fields: ['user_id'] },
      { fields: ['accessed_at'] }
    ]
  });

  ResourceAccessLog.associate = (models) => {
    ResourceAccessLog.belongsTo(models.AppResource, { foreignKey: 'resourceId', as: 'resource' });
    ResourceAccessLog.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return ResourceAccessLog;
};