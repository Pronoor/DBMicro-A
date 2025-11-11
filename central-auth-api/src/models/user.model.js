const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'user_id'
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash'
    },
    firstName: {
      type: DataTypes.STRING(100),
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING(100),
      field: 'last_name'
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      field: 'phone_number'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_verified'
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
      field: 'email_verified_at'
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      field: 'last_login_at'
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['username'] },
      { fields: ['is_active'] },
      { using: 'gin', fields: ['metadata'] }
    ]
  });

  User.associate = (models) => {
    User.hasMany(models.UserSession, { foreignKey: 'userId', as: 'sessions' });
    User.hasMany(models.UserRole, { foreignKey: 'userId', as: 'userRoles' });
    User.hasMany(models.UserAppPreference, { foreignKey: 'userId', as: 'appPreferences' });
    User.hasMany(models.PasswordResetToken, { foreignKey: 'userId', as: 'resetTokens' });
    User.hasMany(models.AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
    
    User.belongsToMany(models.Role, { 
      through: models.UserRole, 
      foreignKey: 'userId',
      otherKey: 'roleId',
      as: 'roles' 
    });
  };

  User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.passwordHash;
    return values;
  };

  return User;
};

