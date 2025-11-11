'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_app_preferences', {
      preference_id: {
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
      preferences: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      app_specific_data: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      last_accessed_at: Sequelize.DATE,
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.addIndex('user_app_preferences', ['user_id']);
    await queryInterface.addIndex('user_app_preferences', ['app_id']);
    await queryInterface.addConstraint('user_app_preferences', {
      fields: ['user_id', 'app_id'],
      type: 'unique',
      name: 'unique_user_app'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('user_app_preferences');
  }
};
