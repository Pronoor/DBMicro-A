'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('permissions', {
      permission_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      permission_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      resource_type: Sequelize.STRING(100),
      action: Sequelize.STRING(50),
      description: Sequelize.TEXT,
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.addIndex('permissions', ['resource_type', 'action']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('permissions');
  }
};
