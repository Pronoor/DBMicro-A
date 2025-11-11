const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('Role', {
    roleId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'role_id'
    },
    roleName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'role_name'
    },
    description: {
      type: DataTypes.TEXT
    },
    isSystemRole: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_system_role'
    },
    permissionsConfig: {
      type: DataTypes.JSONB,
      defaultValue: {},
      field: 'permissions_config'
    }
  }, {
    tableName: 'roles',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['role_name'] }
    ]
  });

  Role.associate = (models) => {
    Role.hasMany(models.UserRole, { foreignKey: 'roleId', as: 'userRoles' });
    Role.hasMany(models.RolePermission, { foreignKey: 'roleId', as: 'rolePermissions' });
    
    Role.belongsToMany(models.User, { 
      through: models.UserRole, 
      foreignKey: 'roleId',
      otherKey: 'userId',
      as: 'users' 
    });
    Role.belongsToMany(models.Permission, { 
      through: models.RolePermission, 
      foreignKey: 'roleId',
      otherKey: 'permissionId',
      as: 'permissions' 
    });
  };

  return Role;
};
