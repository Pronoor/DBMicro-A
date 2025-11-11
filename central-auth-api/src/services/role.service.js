const db = require('../models');

class RoleService {
  async getAllRoles(filters = {}) {
    const where = {};
    
    if (filters.isSystemRole !== undefined) {
      where.isSystemRole = filters.isSystemRole;
    }

    const roles = await db.Role.findAll({
      where,
      include: [{
        model: db.Permission,
        as: 'permissions',
        through: { attributes: [] }
      }],
      order: [['createdAt', 'DESC']]
    });

    return roles;
  }

  async getRoleById(roleId) {
    const role = await db.Role.findByPk(roleId, {
      include: [{
        model: db.Permission,
        as: 'permissions',
        through: { attributes: ['constraints', 'createdAt'] }
      }]
    });

    if (!role) {
      throw new Error('Role not found');
    }

    return role;
  }

  async createRole(roleData) {
    const { roleName, description, permissionsConfig } = roleData;

    // Check if role already exists
    const existingRole = await db.Role.findOne({ where: { roleName } });
    if (existingRole) {
      throw new Error('Role already exists');
    }

    const role = await db.Role.create({
      roleName,
      description,
      isSystemRole: false,
      permissionsConfig
    });

    return role;
  }

  async updateRole(roleId, updateData) {
    const role = await db.Role.findByPk(roleId);

    if (!role) {
      throw new Error('Role not found');
    }

    if (role.isSystemRole) {
      throw new Error('Cannot modify system role');
    }

    await role.update(updateData);
    return role;
  }

  async deleteRole(roleId) {
    const role = await db.Role.findByPk(roleId);

    if (!role) {
      throw new Error('Role not found');
    }

    if (role.isSystemRole) {
      throw new Error('Cannot delete system role');
    }

    await role.destroy();
    return true;
  }

  async assignPermissionToRole(roleId, permissionId, constraints = {}) {
    const role = await db.Role.findByPk(roleId);
    const permission = await db.Permission.findByPk(permissionId);

    if (!role) throw new Error('Role not found');
    if (!permission) throw new Error('Permission not found');

    const [rolePermission, created] = await db.RolePermission.findOrCreate({
      where: { roleId, permissionId },
      defaults: { constraints }
    });

    if (!created) {
      await rolePermission.update({ constraints });
    }

    return rolePermission;
  }

  async removePermissionFromRole(roleId, permissionId) {
    const rolePermission = await db.RolePermission.findOne({
      where: { roleId, permissionId }
    });

    if (!rolePermission) {
      throw new Error('Permission not assigned to role');
    }

    await rolePermission.destroy();
    return true;
  }
}

module.exports = new RoleService();
