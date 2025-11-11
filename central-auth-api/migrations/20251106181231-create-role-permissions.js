'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('role_permissions', {
      role_permission_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'roles', key: 'role_id' },
        onDelete: 'CASCADE'
      },
      permission_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'permissions', key: 'permission_id' },
        onDelete: 'CASCADE'
      },
      constraints: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.addIndex('role_permissions', ['role_id']);
    await queryInterface.addIndex('role_permissions', ['permission_id']);
    await queryInterface.addConstraint('role_permissions', {
      fields: ['role_id', 'permission_id'],
      type: 'unique',
      name: 'unique_role_permission'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('role_permissions');
  }
};

