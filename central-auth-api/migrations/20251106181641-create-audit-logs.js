'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('audit_logs', {
      log_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        references: { model: 'users', key: 'user_id' },
        onDelete: 'SET NULL'
      },
      app_id: {
        type: Sequelize.UUID,
        references: { model: 'applications', key: 'app_id' },
        onDelete: 'SET NULL'
      },
      action: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      resource_type: Sequelize.STRING(100),
      resource_id: Sequelize.STRING(255),
      old_values: Sequelize.JSONB,
      new_values: Sequelize.JSONB,
      ip_address: Sequelize.STRING(45),
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.addIndex('audit_logs', ['user_id']);
    await queryInterface.addIndex('audit_logs', ['app_id']);
    await queryInterface.addIndex('audit_logs', ['action']);
    await queryInterface.addIndex('audit_logs', ['created_at']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('audit_logs');
  }
};
