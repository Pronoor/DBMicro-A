const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');
const { auditLog } = require('../middlewares/audit.middleware');
const { PERMISSIONS } = require('../config/constants');
const Joi = require('joi');
const { validateRequest } = require('../utils/validation.util');

// Validation schemas
const createRoleSchema = Joi.object({
  roleName: Joi.string().required(),
  description: Joi.string().allow(''),
  permissionsConfig: Joi.object().default({})
});

const updateRoleSchema = Joi.object({
  description: Joi.string().allow(''),
  permissionsConfig: Joi.object()
});

const assignPermissionSchema = Joi.object({
  permissionId: Joi.string().uuid().required(),
  constraints: Joi.object().default({})
});

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management and RBAC
 */

router.get(
  '/',
  authenticate,
  checkPermission(PERMISSIONS.USERS_READ),
  roleController.getAllRoles
);

router.get(
  '/:id',
  authenticate,
  checkPermission(PERMISSIONS.USERS_READ),
  roleController.getRoleById
);

router.post(
  '/',
  authenticate,
  checkPermission(PERMISSIONS.USERS_CREATE),
  validateRequest(createRoleSchema),
  auditLog('create', 'role'),
  roleController.createRole
);

router.put(
  '/:id',
  authenticate,
  checkPermission(PERMISSIONS.USERS_UPDATE),
  validateRequest(updateRoleSchema),
  auditLog('update', 'role'),
  roleController.updateRole
);

router.delete(
  '/:id',
  authenticate,
  checkPermission(PERMISSIONS.USERS_DELETE),
  auditLog('delete', 'role'),
  roleController.deleteRole
);

router.post(
  '/:id/permissions',
  authenticate,
  checkPermission(PERMISSIONS.USERS_UPDATE),
  validateRequest(assignPermissionSchema),
  auditLog('assign_permission', 'role'),
  roleController.assignPermission
);

router.delete(
  '/:id/permissions/:permissionId',
  authenticate,
  checkPermission(PERMISSIONS.USERS_UPDATE),
  auditLog('remove_permission', 'role'),
  roleController.removePermission
);

module.exports = router;
