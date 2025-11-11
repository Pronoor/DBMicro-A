'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    const bcrypt = require('bcryptjs');
    const { v4: uuidv4 } = require('uuid');
    
    const adminUserId = uuidv4();
    const regularUserId = uuidv4();
    
    // Create demo users
    await queryInterface.bulkInsert('users', [
      {
        user_id: adminUserId,
        email: 'admin@example.com',
        username: 'admin',
        password_hash: await bcrypt.hash('Admin@123', 10),
        first_name: 'Admin',
        last_name: 'User',
        is_active: true,
        is_verified: true,
        email_verified_at: new Date(),
        metadata: JSON.stringify({ department: 'IT', employee_id: 'E001' }),  // Convert to string
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: regularUserId,
        email: 'user@example.com',
        username: 'user',
        password_hash: await bcrypt.hash('User@123', 10),
        first_name: 'Regular',
        last_name: 'User',
        is_active: true,
        is_verified: true,
        email_verified_at: new Date(),
        metadata: JSON.stringify({ department: 'Sales', employee_id: 'E002' }),  // Convert to string
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    
    // Assign roles
    const [superAdminRole] = await queryInterface.sequelize.query(
      "SELECT role_id FROM roles WHERE role_name = 'super_admin'"
    );
    
    const [userRole] = await queryInterface.sequelize.query(
      "SELECT role_id FROM roles WHERE role_name = 'user'"
    );
    
    await queryInterface.bulkInsert('user_roles', [
      {
        user_role_id: uuidv4(),
        user_id: adminUserId,
        role_id: superAdminRole[0].role_id,
        assigned_at: new Date()
      },
      {
        user_role_id: uuidv4(),
        user_id: regularUserId,
        role_id: userRole[0].role_id,
        assigned_at: new Date()
      }
    ]);
    
    // Create demo application
    const appId = uuidv4();
    await queryInterface.bulkInsert('applications', [
      {
        app_id: appId,
        app_name: 'Demo App',
        app_key: 'demo-app-key-2025',
        app_secret: await bcrypt.hash('demo-secret', 10),
        description: 'Demo application for testing',
        config: JSON.stringify({ features: ['sso', 'api'], max_upload_size: 10485760 }),  // Convert to string
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('user_roles', null, {});
    await queryInterface.bulkDelete('applications', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};