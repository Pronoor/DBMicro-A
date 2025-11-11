const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions || {}
  }
);

const db = {};

// Import models
db.User = require('./user.model')(sequelize);
db.Application = require('./application.model')(sequelize);
db.Role = require('./role.model')(sequelize);
db.Permission = require('./permission.model')(sequelize);
db.UserRole = require('./userRole.model')(sequelize);
db.RolePermission = require('./rolePermission.model')(sequelize);
db.UserSession = require('./userSession.model')(sequelize);
db.UserAppPreference = require('./userAppPreference.model')(sequelize);
db.PasswordResetToken = require('./passwordResetToken.model')(sequelize);
db.AppResource = require('./appResource.model')(sequelize);
db.AuditLog = require('./auditLog.model')(sequelize);
db.ResourceAccessLog = require('./resourceAccessLog.model')(sequelize);

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
