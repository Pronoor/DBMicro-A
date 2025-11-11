'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('applications', {
      app_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      app_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      app_key: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      app_secret: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: Sequelize.TEXT,
      config: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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

    await queryInterface.addIndex('applications', ['app_key']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('applications');
  }
};
