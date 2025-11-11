const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RolePermission = sequelize.define('RolePermission', {
    rolePermissionId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'role_permission_id'
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
    permissionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'permissions',
        key: 'permission_id'
      },
      field: 'permission_id'
    },
    constraints: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    tableName: 'role_permissions',
    underscored: true,
    timestamps: true,
    createdAt: true,
    updatedAt: false,
    indexes: [
      { fields: ['role_id'] },
      { fields: ['permission_id'] },
      { unique: true, fields: ['role_id', 'permission_id'] }
    ]
  });

  RolePermission.associate = (models) => {
    RolePermission.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
    RolePermission.belongsTo(models.Permission, { foreignKey: 'permissionId', as: 'permission' });
  };

  return RolePermission;
};

