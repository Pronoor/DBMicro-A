module.exports = {
  up: async (queryInterface) => {
    const { v4: uuidv4 } = require('uuid');
    
    await queryInterface.bulkInsert('permissions', [
      { 
        permission_id: uuidv4(), 
        permission_name: 'users.create', 
        resource_type: 'user', 
        action: 'create', 
        description: 'Create new users', 
        created_at: new Date() 
      },
      { 
        permission_id: uuidv4(), 
        permission_name: 'users.read', 
        resource_type: 'user', 
        action: 'read', 
        description: 'View user information', 
        created_at: new Date() 
      },
      { 
        permission_id: uuidv4(), 
        permission_name: 'users.update', 
        resource_type: 'user', 
        action: 'update', 
        description: 'Update user information', 
        created_at: new Date() 
      },
      { 
        permission_id: uuidv4(), 
        permission_name: 'users.delete', 
        resource_type: 'user', 
        action: 'delete', 
        description: 'Delete users', 
        created_at: new Date() 
      },
      { 
        permission_id: uuidv4(), 
        permission_name: 'apps.manage', 
        resource_type: 'application', 
        action: 'manage', 
        description: 'Manage applications', 
        created_at: new Date() 
      },
      { 
        permission_id: uuidv4(), 
        permission_name: 'resources.create', 
        resource_type: 'resource', 
        action: 'create', 
        description: 'Create resources', 
        created_at: new Date() 
      },
      { 
        permission_id: uuidv4(), 
        permission_name: 'resources.read', 
        resource_type: 'resource', 
        action: 'read', 
        description: 'View resources', 
        created_at: new Date() 
      },
      { 
        permission_id: uuidv4(), 
        permission_name: 'resources.update', 
        resource_type: 'resource', 
        action: 'update', 
        description: 'Update resources', 
        created_at: new Date() 
      },
      { 
        permission_id: uuidv4(), 
        permission_name: 'resources.delete', 
        resource_type: 'resource', 
        action: 'delete', 
        description: 'Delete resources', 
        created_at: new Date() 
      }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
