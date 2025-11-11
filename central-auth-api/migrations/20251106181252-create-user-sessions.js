'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_sessions', {
      session_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
        onDelete: 'CASCADE'
      },
      app_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'applications', key: 'app_id' },
        onDelete: 'CASCADE'
      },
      session_token: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true
      },
      refresh_token: Sequelize.STRING(500),
      ip_address: Sequelize.STRING(45),
      user_agent: Sequelize.TEXT,
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      last_activity_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.addIndex('user_sessions', ['user_id']);
    await queryInterface.addIndex('user_sessions', ['app_id']);
    await queryInterface.addIndex('user_sessions', ['session_token']);
    await queryInterface.addIndex('user_sessions', ['expires_at']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('user_sessions');
  }
};
