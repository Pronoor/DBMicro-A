'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { v4: uuidv4 } = require('uuid');
    
    // Get super_admin role
    const [superAdminRole] = await queryInterface.sequelize.query(
      "SELECT role_id FROM roles WHERE role_name = 'super_admin'"
    );
    
    // Get all permissions
    const [permissions] = await queryInterface.sequelize.query(
      "SELECT permission_id FROM permissions"
    );
    
    // Assign all permissions to super_admin
    const rolePermissions = permissions.map(p => ({
      role_permission_id: uuidv4(),
      role_id: superAdminRole[0].role_id,
      permission_id: p.permission_id,
      constraints: JSON.stringify({}),  // Convert to string
      created_at: new Date()
    }));
    
    await queryInterface.bulkInsert('role_permissions', rolePermissions);
    
    // Assign basic permissions to user role
    const [userRole] = await queryInterface.sequelize.query(
      "SELECT role_id FROM roles WHERE role_name = 'user'"
    );
    
    const [basicPermissions] = await queryInterface.sequelize.query(
      "SELECT permission_id FROM permissions WHERE permission_name IN ('users.read', 'resources.read')"
    );
    
    const userRolePermissions = basicPermissions.map(p => ({
      role_permission_id: uuidv4(),
      role_id: userRole[0].role_id,
      permission_id: p.permission_id,
      constraints: JSON.stringify({}),  // Convert to string
      created_at: new Date()
    }));
    
    await queryInterface.bulkInsert('role_permissions', userRolePermissions);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('role_permissions', null, {});
  }
};

