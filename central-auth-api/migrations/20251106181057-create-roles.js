'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roles', {
      role_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      role_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      description: Sequelize.TEXT,
      is_system_role: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      permissions_config: {
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

    await queryInterface.addIndex('roles', ['role_name']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('roles');
  }
};

