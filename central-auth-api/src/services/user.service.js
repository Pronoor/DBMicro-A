const db = require('../models');
const { hashPassword } = require('../utils/password.util');
const { Op } = require('sequelize');

class UserService {
  async getAllUsers(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const where = {};
    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    if (filters.isVerified !== undefined) {
      where.isVerified = filters.isVerified;
    }
    if (filters.search) {
      where[Op.or] = [
        { email: { [Op.iLike]: `%${filters.search}%` } },
        { username: { [Op.iLike]: `%${filters.search}%` } },
        { firstName: { [Op.iLike]: `%${filters.search}%` } },
        { lastName: { [Op.iLike]: `%${filters.search}%` } }
      ];
    }

    const { count, rows } = await db.User.findAndCountAll({
      where,
      attributes: { exclude: ['passwordHash'] },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      users: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async getUserById(userId) {
    const user = await db.User.findByPk(userId, {
      attributes: { exclude: ['passwordHash'] },
      include: [
        {
          model: db.Role,
          as: 'roles',
          through: { attributes: [] }
        }
      ]
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateUser(userId, updateData) {
    const user = await db.User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (updateData.password) {
      updateData.passwordHash = await hashPassword(updateData.password);
      delete updateData.password;
    }

    await user.update(updateData);
    return user;
  }

  async deleteUser(userId) {
    const user = await db.User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    await user.destroy();
    return true;
  }

  async assignRole(userId, roleId, expiresAt = null, assignedBy = null) {
    const user = await db.User.findByPk(userId);
    const role = await db.Role.findByPk(roleId);

    if (!user) throw new Error('User not found');
    if (!role) throw new Error('Role not found');

    const [userRole, created] = await db.UserRole.findOrCreate({
      where: { userId, roleId },
      defaults: { expiresAt, assignedBy }
    });

    if (!created) {
      await userRole.update({ expiresAt, assignedBy });
    }

    return userRole;
  }

  async removeRole(userId, roleId) {
    const userRole = await db.UserRole.findOne({
      where: { userId, roleId }
    });

    if (!userRole) {
      throw new Error('Role assignment not found');
    }

    await userRole.destroy();
    return true;
  }
}

module.exports = new UserService();