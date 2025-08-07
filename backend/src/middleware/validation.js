const Joi = require('joi');

// Validation schemas
const authSchemas = {
  register: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.alphanum': 'Username must contain only alphanumeric characters',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters',
        'any.required': 'Username is required'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'Password is required'
      })
  }),

  login: Joi.object({
    username: Joi.string().required().messages({
      'any.required': 'Username is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  })
};

const profileSchemas = {
  create: Joi.object({
    firstName: Joi.string().max(50).allow('', null).optional(),
    lastName: Joi.string().max(50).allow('', null).optional(),
    bio: Joi.string().max(500).allow('', null).optional(),
    location: Joi.string().max(100).allow('', null).optional(),
    interests: Joi.string().max(500).allow('', null).optional(),
    skills: Joi.string().max(500).allow('', null).optional(),
    experience: Joi.string().max(1000).allow('', null).optional(),
    education: Joi.string().max(500).allow('', null).optional(),
    social: Joi.string().max(500).allow('', null).optional(),
    projects: Joi.string().max(1000).allow('', null).optional()
  }),

  update: Joi.object({
    firstName: Joi.string().max(50).allow('', null).optional(),
    lastName: Joi.string().max(50).allow('', null).optional(),
    bio: Joi.string().max(500).allow('', null).optional(),
    location: Joi.string().max(100).allow('', null).optional(),
    interests: Joi.string().max(500).allow('', null).optional(),
    skills: Joi.string().max(500).allow('', null).optional(),
    experience: Joi.string().max(1000).allow('', null).optional(),
    education: Joi.string().max(500).allow('', null).optional(),
    social: Joi.string().max(500).allow('', null).optional(),
    projects: Joi.string().max(1000).allow('', null).optional()
  })
};

// Validation middleware factory
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    // Convert empty strings to null for optional fields
    const sanitizedData = {};
    Object.keys(req[property]).forEach(key => {
      const value = req[property][key];
      sanitizedData[key] = value === '' ? null : value;
    });

    const { error, value } = schema.validate(sanitizedData, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errorMessages
      });
    }

    // Replace request data with validated data
    req[property] = value;
    next();
  };
};

module.exports = {
  validate,
  authSchemas,
  profileSchemas
}; 