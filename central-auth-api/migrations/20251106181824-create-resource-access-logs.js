'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('resource_access_logs', {
      access_log_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      resource_id: {
        type: Sequelize.UUID,
        references: { model: 'app_resources', key: 'resource_id' },
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.UUID,
        references: { model: 'users', key: 'user_id' },
        onDelete: 'SET NULL'
      },
      action: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      is_allowed: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      denial_reason: Sequelize.STRING(255),
      accessed_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.addIndex('resource_access_logs', ['resource_id']);
    await queryInterface.addIndex('resource_access_logs', ['user_id']);
    await queryInterface.addIndex('resource_access_logs', ['accessed_at']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('resource_access_logs');
  }
};
