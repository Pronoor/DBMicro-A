const db = require('../models');
const { successResponse, errorResponse } = require('../utils/response.util');

/**
 * @swagger
 * /permissions:
 *   get:
 *     tags: [Permissions]
 *     summary: Get all permissions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: resourceType
 *         schema:
 *           type: string
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permissions retrieved successfully
 */
const getAllPermissions = async (req, res) => {
  try {
    const where = {};
    
    if (req.query.resourceType) {
      where.resourceType = req.query.resourceType;
    }
    
    if (req.query.action) {
      where.action = req.query.action;
    }

    const permissions = await db.Permission.findAll({
      where,
      order: [['resourceType', 'ASC'], ['action', 'ASC']]
    });

    return successResponse(res, 200, 'Permissions retrieved successfully', permissions);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @swagger
 * /permissions/{id}:
 *   get:
 *     tags: [Permissions]
 *     summary: Get permission by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Permission retrieved successfully
 */
const getPermissionById = async (req, res) => {
  try {
    const permission = await db.Permission.findByPk(req.params.id);

    if (!permission) {
      return errorResponse(res, 404, 'Permission not found');
    }

    return successResponse(res, 200, 'Permission retrieved successfully', permission);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @swagger
 * /permissions:
 *   post:
 *     tags: [Permissions]
 *     summary: Create new permission
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionName
 *               - resourceType
 *               - action
 *             properties:
 *               permissionName:
 *                 type: string
 *                 example: documents.create
 *               resourceType:
 *                 type: string
 *                 example: document
 *               action:
 *                 type: string
 *                 example: create
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Permission created successfully
 */
const createPermission = async (req, res) => {
  try {
    const { permissionName, resourceType, action, description } = req.body;

    // Check if permission already exists
    const existing = await db.Permission.findOne({ where: { permissionName } });
    if (existing) {
      return errorResponse(res, 400, 'Permission already exists');
    }

    const permission = await db.Permission.create({
      permissionName,
      resourceType,
      action,
      description
    });

    return successResponse(res, 201, 'Permission created successfully', permission);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

/**
 * @swagger
 * /permissions/{id}:
 *   delete:
 *     tags: [Permissions]
 *     summary: Delete permission
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 */
const deletePermission = async (req, res) => {
  try {
    const permission = await db.Permission.findByPk(req.params.id);

    if (!permission) {
      return errorResponse(res, 404, 'Permission not found');
    }

    await permission.destroy();
    return successResponse(res, 200, 'Permission deleted successfully');
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

module.exports = {
  getAllPermissions,
  getPermissionById,
  createPermission,
  deletePermission
};
