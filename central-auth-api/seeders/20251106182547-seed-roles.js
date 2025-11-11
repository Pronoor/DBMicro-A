'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    const { v4: uuidv4 } = require('uuid');
    
    await queryInterface.bulkInsert('roles', [
      {
        role_id: uuidv4(),
        role_name: 'super_admin',
        description: 'Full system access with all permissions',
        is_system_role: true,
        permissions_config: JSON.stringify({}),  // Convert to string
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: uuidv4(),
        role_name: 'admin',
        description: 'Application administrator',
        is_system_role: true,
        permissions_config: JSON.stringify({}),  // Convert to string
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: uuidv4(),
        role_name: 'user',
        description: 'Standard user with basic permissions',
        is_system_role: true,
        permissions_config: JSON.stringify({}),  // Convert to string
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        role_id: uuidv4(),
        role_name: 'guest',
        description: 'Limited access user',
        is_system_role: true,
        permissions_config: JSON.stringify({}),  // Convert to string
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
