const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserRole = sequelize.define('UserRole', {
    userRoleId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'user_role_id'
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
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'role_id'
      },
      field: 'role_id'
    },
    assignedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'assigned_at'
    },
    expiresAt: {
      type: DataTypes.DATE,
      field: 'expires_at'
    },
    assignedBy: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'user_id'
      },
      field: 'assigned_by'
    }
  }, {
    tableName: 'user_roles',
    underscored: true,
    timestamps: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['role_id'] },
      { fields: ['expires_at'] },
      { unique: true, fields: ['user_id', 'role_id'] }
    ]
  });

  UserRole.associate = (models) => {
    UserRole.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    UserRole.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
    UserRole.belongsTo(models.User, { foreignKey: 'assignedBy', as: 'assigner' });
  };

  return UserRole;
};
