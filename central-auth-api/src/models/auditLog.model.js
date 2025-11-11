const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AuditLog = sequelize.define('AuditLog', {
    logId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'log_id'
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'user_id'
    },
    appId: {
      type: DataTypes.UUID,
      references: {
        model: 'applications',
        key: 'app_id'
      },
      field: 'app_id'
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    resourceType: {
      type: DataTypes.STRING(100),
      field: 'resource_type'
    },
    resourceId: {
      type: DataTypes.STRING(255),
      field: 'resource_id'
    },
    oldValues: {
      type: DataTypes.JSONB,
      field: 'old_values'
    },
    newValues: {
      type: DataTypes.JSONB,
      field: 'new_values'
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      field: 'ip_address'
    }
  }, {
    tableName: 'audit_logs',
    underscored: true,
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['app_id'] },
      { fields: ['action'] },
      { fields: ['created_at'] }
    ]
  });

  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    AuditLog.belongsTo(models.Application, { foreignKey: 'appId', as: 'application' });
  };

  return AuditLog;
};
