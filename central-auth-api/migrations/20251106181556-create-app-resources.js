'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('app_resources', {
      resource_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      app_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'applications', key: 'app_id' },
        onDelete: 'CASCADE'
      },
      resource_type: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      resource_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      resource_data: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      access_rules: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
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

    await queryInterface.addIndex('app_resources', ['app_id']);
    await queryInterface.addIndex('app_resources', ['resource_type']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('app_resources');
  }
};
