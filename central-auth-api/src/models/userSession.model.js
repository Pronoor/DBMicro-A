const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserSession = sequelize.define('UserSession', {
    sessionId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'session_id'
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
    sessionToken: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
      field: 'session_token'
    },
    refreshToken: {
      type: DataTypes.STRING(500),
      field: 'refresh_token'
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      field: 'ip_address'
    },
    userAgent: {
      type: DataTypes.TEXT,
      field: 'user_agent'
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at'
    },
    lastActivityAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'last_activity_at'
    }
  }, {
    tableName: 'user_sessions',
    underscored: true,
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['app_id'] },
      { fields: ['session_token'] },
      { fields: ['expires_at'] }
    ]
  });

  UserSession.associate = (models) => {
    UserSession.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    UserSession.belongsTo(models.Application, { foreignKey: 'appId', as: 'application' });
  };

  return UserSession;
};
