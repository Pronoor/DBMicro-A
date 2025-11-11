const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permission.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');
const { auditLog } = require('../middlewares/audit.middleware');
const { PERMISSIONS } = require('../config/constants');
const Joi = require('joi');
const { validateRequest } = require('../utils/validation.util');

// Validation schemas
const createPermissionSchema = Joi.object({
  permissionName: Joi.string().required(),
  resourceType: Joi.string().required(),
  action: Joi.string().required(),
  description: Joi.string().allow('')
});

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: Permission management
 */

router.get(
  '/',
  authenticate,
  checkPermission(PERMISSIONS.USERS_READ),
  permissionController.getAllPermissions
);

router.get(
  '/:id',
  authenticate,
  checkPermission(PERMISSIONS.USERS_READ),
  permissionController.getPermissionById
);

router.post(
  '/',
  authenticate,
  checkPermission(PERMISSIONS.USERS_CREATE),
  validateRequest(createPermissionSchema),
  auditLog('create', 'permission'),
  permissionController.createPermission
);

router.delete(
  '/:id',
  authenticate,
  checkPermission(PERMISSIONS.USERS_DELETE),
  auditLog('delete', 'permission'),
  permissionController.deletePermission
);

module.exports = router;
