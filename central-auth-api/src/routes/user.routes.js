const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');
const { validateUpdateUser, validateAssignRole } = require('../middlewares/validation.middleware');
const { auditLog } = require('../middlewares/audit.middleware');
const { PERMISSIONS } = require('../config/constants');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

router.get(
  '/',
  authenticate,
  checkPermission(PERMISSIONS.USERS_READ),
  userController.getAllUsers
);

router.get(
  '/:id',
  authenticate,
  checkPermission(PERMISSIONS.USERS_READ),
  userController.getUserById
);

router.put(
  '/:id',
  authenticate,
  checkPermission(PERMISSIONS.USERS_UPDATE),
  validateUpdateUser,
  auditLog('update', 'user'),
  userController.updateUser
);

router.delete(
  '/:id',
  authenticate,
  checkPermission(PERMISSIONS.USERS_DELETE),
  auditLog('delete', 'user'),
  userController.deleteUser
);

router.post(
  '/:id/roles',
  authenticate,
  checkPermission(PERMISSIONS.USERS_UPDATE),
  validateAssignRole,
  auditLog('assign_role', 'user'),
  userController.assignRole
);

router.delete(
  '/:id/roles/:roleId',
  authenticate,
  checkPermission(PERMISSIONS.USERS_UPDATE),
  auditLog('remove_role', 'user'),
  userController.removeRole
);

module.exports = router;
