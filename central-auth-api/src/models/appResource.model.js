const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AppResource = sequelize.define('AppResource', {
    resourceId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'resource_id'
    },
    appId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'applications',
        key: 'app_id'
      },
      field: 'app_id'
    },
    resourceType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'resource_type'
    },
    resourceName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'resource_name'
    },
    resourceData: {
      type: DataTypes.JSONB,
      defaultValue: {},
      field: 'resource_data'
    },
    accessRules: {
      type: DataTypes.JSONB,
      defaultValue: {},
      field: 'access_rules'
    }
  }, {
    tableName: 'app_resources',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['app_id'] },
      { fields: ['resource_type'] },
      { using: 'gin', fields: ['resource_data'] }
    ]
  });

  AppResource.associate = (models) => {
    AppResource.belongsTo(models.Application, { foreignKey: 'appId', as: 'application' });
    AppResource.hasMany(models.ResourceAccessLog, { foreignKey: 'resourceId', as: 'accessLogs' });
  };

  return AppResource;
};

