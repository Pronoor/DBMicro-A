const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PasswordResetToken = sequelize.define('PasswordResetToken', {
    tokenId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'token_id'
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
    token: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at'
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_used'
    }
  }, {
    tableName: 'password_reset_tokens',
    underscored: true,
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['token'] },
      { fields: ['expires_at'] }
    ]
  });

  PasswordResetToken.associate = (models) => {
    PasswordResetToken.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return PasswordResetToken;
};
