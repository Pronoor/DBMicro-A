const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');
const { auditLog } = require('../middlewares/audit.middleware');
const { PERMISSIONS } = require('../config/constants');
const Joi = require('joi');
const { validateRequest } = require('../utils/validation.util');

// Validation schemas
const createApplicationSchema = Joi.object({
  appName: Joi.string().required(),
  description: Joi.string().allow(''),
  config: Joi.object().default({})
});

const updateApplicationSchema = Joi.object({
  description: Joi.string().allow(''),
  config: Joi.object(),
  isActive: Joi.boolean()
});

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Application management for multi-app SSO
 */

router.get(
  '/',
  authenticate,
  checkPermission(PERMISSIONS.APPS_MANAGE),
  applicationController.getAllApplications
);

router.get(
  '/:id',
  authenticate,
  checkPermission(PERMISSIONS.APPS_MANAGE),
  applicationController.getApplicationById
);

router.post(
  '/',
  authenticate,
  checkPermission(PERMISSIONS.APPS_MANAGE),
  validateRequest(createApplicationSchema),
  auditLog('create', 'application'),
  applicationController.createApplication
);

router.put(
  '/:id',
  authenticate,
  checkPermission(PERMISSIONS.APPS_MANAGE),
  validateRequest(updateApplicationSchema),
  auditLog('update', 'application'),
  applicationController.updateApplication
);

router.delete(
  '/:id',
  authenticate,
  checkPermission(PERMISSIONS.APPS_MANAGE),
  auditLog('delete', 'application'),
  applicationController.deleteApplication
);

router.post(
  '/:id/regenerate-secret',
  authenticate,
  checkPermission(PERMISSIONS.APPS_MANAGE),
  auditLog('regenerate_secret', 'application'),
  applicationController.regenerateSecret
);

module.exports = router;

