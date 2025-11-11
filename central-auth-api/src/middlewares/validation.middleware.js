const { validateRequest, schemas } = require('../utils/validation.util');

module.exports = {
  validateRegister: validateRequest(schemas.register),
  validateLogin: validateRequest(schemas.login),
  validateUpdateUser: validateRequest(schemas.updateUser),
  validateCreateRole: validateRequest(schemas.createRole),
  validateAssignRole: validateRequest(schemas.assignRole)
};
