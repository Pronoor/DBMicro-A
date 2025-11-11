module.exports = {
  ROLES: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest'
  },
  
  PERMISSIONS: {
    USERS_CREATE: 'users.create',
    USERS_READ: 'users.read',
    USERS_UPDATE: 'users.update',
    USERS_DELETE: 'users.delete',
    APPS_MANAGE: 'apps.manage',
    RESOURCES_CREATE: 'resources.create',
    RESOURCES_READ: 'resources.read',
    RESOURCES_UPDATE: 'resources.update',
    RESOURCES_DELETE: 'resources.delete'
  },
  
  TOKEN_TYPES: {
    ACCESS: 'access',
    REFRESH: 'refresh',
    PASSWORD_RESET: 'password_reset'
  },
  
  AUDIT_ACTIONS: {
    LOGIN: 'login',
    LOGOUT: 'logout',
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    VIEW: 'view',
    ACCESS_DENIED: 'access_denied'
  }
};
