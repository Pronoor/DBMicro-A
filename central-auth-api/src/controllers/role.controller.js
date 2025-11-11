const roleService = require('../services/role.service');
const { successResponse, errorResponse } = require('../utils/response.util');

/**
 * @swagger
 * /roles:
 *   get:
 *     tags: [Roles]
 *     summary: Get all roles
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isSystemRole
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
 */
const getAllRoles = async (req, res) => {
  try {
    const filters = {
      isSystemRole: req.query.isSystemRole
    };
    const roles = await roleService.getAllRoles(filters);
    return successResponse(res, 200, 'Roles retrieved successfully', roles);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     tags: [Roles]
 *     summary: Get role by ID
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
 *         description: Role retrieved successfully
 */
const getRoleById = async (req, res) => {
  try {
    const role = await roleService.getRoleById(req.params.id);
    return successResponse(res, 200, 'Role retrieved successfully', role);
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

/**
 * @swagger
 * /roles:
 *   post:
 *     tags: [Roles]
 *     summary: Create new role
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleName
 *             properties:
 *               roleName:
 *                 type: string
 *               description:
 *                 type: string
 *               permissionsConfig:
 *                 type: object
 *     responses:
 *       201:
 *         description: Role created successfully
 */
const createRole = async (req, res) => {
  try {
    const role = await roleService.createRole(req.body);
    return successResponse(res, 201, 'Role created successfully', role);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     tags: [Roles]
 *     summary: Update role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               permissionsConfig:
 *                 type: object
 *     responses:
 *       200:
 *         description: Role updated successfully
 */
const updateRole = async (req, res) => {
  try {
    const role = await roleService.updateRole(req.params.id, req.body);
    return successResponse(res, 200, 'Role updated successfully', role);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     tags: [Roles]
 *     summary: Delete role
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
 *         description: Role deleted successfully
 */
const deleteRole = async (req, res) => {
  try {
    await roleService.deleteRole(req.params.id);
    return successResponse(res, 200, 'Role deleted successfully');
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

/**
 * @swagger
 * /roles/{id}/permissions:
 *   post:
 *     tags: [Roles]
 *     summary: Assign permission to role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionId
 *             properties:
 *               permissionId:
 *                 type: string
 *                 format: uuid
 *               constraints:
 *                 type: object
 *     responses:
 *       200:
 *         description: Permission assigned successfully
 */
const assignPermission = async (req, res) => {
  try {
    const { permissionId, constraints } = req.body;
    const rolePermission = await roleService.assignPermissionToRole(
      req.params.id,
      permissionId,
      constraints
    );
    return successResponse(res, 200, 'Permission assigned successfully', rolePermission);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

/**
 * @swagger
 * /roles/{id}/permissions/{permissionId}:
 *   delete:
 *     tags: [Roles]
 *     summary: Remove permission from role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Permission removed successfully
 */
const removePermission = async (req, res) => {
  try {
    await roleService.removePermissionFromRole(req.params.id, req.params.permissionId);
    return successResponse(res, 200, 'Permission removed successfully');
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignPermission,
  removePermission
};
