const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Application = sequelize.define('Application', {
    appId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'app_id'
    },
    appName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'app_name'
    },
    appKey: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'app_key'
    },
    appSecret: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'app_secret'
    },
    description: {
      type: DataTypes.TEXT
    },
    config: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    tableName: 'applications',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['app_key'] }
    ]
  });

  Application.associate = (models) => {
    Application.hasMany(models.UserSession, { foreignKey: 'appId', as: 'sessions' });
    Application.hasMany(models.UserAppPreference, { foreignKey: 'appId', as: 'userPreferences' });
    Application.hasMany(models.AppResource, { foreignKey: 'appId', as: 'resources' });
    Application.hasMany(models.AuditLog, { foreignKey: 'appId', as: 'auditLogs' });
  };

  return Application;
};

