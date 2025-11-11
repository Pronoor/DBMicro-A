const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserAppPreference = sequelize.define('UserAppPreference', {
    preferenceId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'preference_id'
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'user_id'
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
    preferences: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    appSpecificData: {
      type: DataTypes.JSONB,
      defaultValue: {},
      field: 'app_specific_data'
    },
    lastAccessedAt: {
      type: DataTypes.DATE,
      field: 'last_accessed_at'
    }
  }, {
    tableName: 'user_app_preferences',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['app_id'] },
      { unique: true, fields: ['user_id', 'app_id'] }
    ]
  });

  UserAppPreference.associate = (models) => {
    UserAppPreference.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    UserAppPreference.belongsTo(models.Application, { foreignKey: 'appId', as: 'application' });
  };

  return UserAppPreference;
};

