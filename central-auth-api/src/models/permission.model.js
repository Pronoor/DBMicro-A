const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Permission = sequelize.define('Permission', {
    permissionId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'permission_id'
    },
    permissionName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'permission_name'
    },
    resourceType: {
      type: DataTypes.STRING(100),
      field: 'resource_type'
    },
    action: {
      type: DataTypes.STRING(50)
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'permissions',
    underscored: true,
    timestamps: true,
    createdAt: true,
    updatedAt: false,
    indexes: [
      { fields: ['resource_type', 'action'] }
    ]
  });

  Permission.associate = (models) => {
    Permission.hasMany(models.RolePermission, { foreignKey: 'permissionId', as: 'rolePermissions' });
    
    Permission.belongsToMany(models.Role, { 
      through: models.RolePermission, 
      foreignKey: 'permissionId',
      otherKey: 'roleId',
      as: 'roles' 
    });
  };

  return Permission;
};

