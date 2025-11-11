const { errorResponse } = require('../utils/response.util');
const db = require('../models');
const { Op } = require('sequelize');

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return errorResponse(res, 401, 'Authentication required');
      }

      // Get user roles with permissions
      const userRoles = await db.UserRole.findAll({
        where: {
          userId: req.user.userId,
          [Op.or]: [
            { expiresAt: null },
            { expiresAt: { [Op.gt]: new Date() } }
          ]
        },
        include: [{
          model: db.Role,
          as: 'role',
          include: [{
            model: db.Permission,
            as: 'permissions',
            through: { attributes: [] }
          }]
        }]
      });

      // Check if user has required permission
      const hasPermission = userRoles.some(userRole =>
        userRole.role.permissions.some(
          permission => permission.permissionName === requiredPermission
        )
      );

      if (!hasPermission) {
        // Log access denial
        await db.AuditLog.create({
          userId: req.user.userId,
          appId: req.session?.appId,
          action: 'access_denied',
          resourceType: 'permission',
          newValues: { required_permission: requiredPermission },
          ipAddress: req.ip
        });

        return errorResponse(res, 403, 'Insufficient permissions');
      }

      next();
    } catch (error) {
      return errorResponse(res, 500, 'Permission check failed', error.message);
    }
  };
};

const checkRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return errorResponse(res, 401, 'Authentication required');
      }

      const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

      const userRoles = await db.UserRole.findAll({
        where: {
          userId: req.user.userId,
          [Op.or]: [
            { expiresAt: null },
            { expiresAt: { [Op.gt]: new Date() } }
          ]
        },
        include: [{
          model: db.Role,
          as: 'role'
        }]
      });

      const hasRole = userRoles.some(userRole =>
        rolesArray.includes(userRole.role.roleName)
      );

      if (!hasRole) {
        return errorResponse(res, 403, 'Insufficient role privileges');
      }

      next();
    } catch (error) {
      return errorResponse(res, 500, 'Role check failed', error.message);
    }
  };
};

module.exports = {
  checkPermission,
  checkRole
};

