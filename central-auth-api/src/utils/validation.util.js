const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

// Common validation schemas
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .message('Password must contain uppercase, lowercase, number and special character'),
    firstName: Joi.string().max(100),
    lastName: Joi.string().max(100),
    phoneNumber: Joi.string().max(20)
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    appKey: Joi.string().required()
  }),

  updateUser: Joi.object({
    firstName: Joi.string().max(100),
    lastName: Joi.string().max(100),
    phoneNumber: Joi.string().max(20),
    metadata: Joi.object()
  }),

  createRole: Joi.object({
    roleName: Joi.string().required(),
    description: Joi.string(),
    permissionsConfig: Joi.object()
  }),

  assignRole: Joi.object({
    userId: Joi.string().uuid().required(),
    roleId: Joi.string().uuid().required(),
    expiresAt: Joi.date()
  })
};

module.exports = {
  validateRequest,
  schemas
};

