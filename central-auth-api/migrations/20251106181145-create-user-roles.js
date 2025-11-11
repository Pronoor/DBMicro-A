'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_roles', {
      user_role_id: {
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
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'roles', key: 'role_id' },
        onDelete: 'CASCADE'
      },
      assigned_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      expires_at: Sequelize.DATE,
      assigned_by: {
        type: Sequelize.UUID,
        references: { model: 'users', key: 'user_id' },
        onDelete: 'SET NULL'
      }
    });

    await queryInterface.addIndex('user_roles', ['user_id']);
    await queryInterface.addIndex('user_roles', ['role_id']);
    await queryInterface.addIndex('user_roles', ['expires_at']);
    await queryInterface.addConstraint('user_roles', {
      fields: ['user_id', 'role_id'],
      type: 'unique',
      name: 'unique_user_role'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('user_roles');
  }
};
