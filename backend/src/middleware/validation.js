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
    name: Joi.string().max(100).optional(),
    bio: Joi.string().max(500).optional(),
    location: Joi.string().max(100).optional(),
    interests: Joi.string().max(500).optional(),
    skills: Joi.string().max(500).optional(),
    experience: Joi.string().max(1000).optional(),
    education: Joi.string().max(500).optional(),
    social_links: Joi.string().max(500).optional(),
    projects: Joi.string().max(1000).optional()
  }),

  update: Joi.object({
    name: Joi.string().max(100).optional(),
    bio: Joi.string().max(500).optional(),
    location: Joi.string().max(100).optional(),
    interests: Joi.string().max(500).optional(),
    skills: Joi.string().max(500).optional(),
    experience: Joi.string().max(1000).optional(),
    education: Joi.string().max(500).optional(),
    social_links: Joi.string().max(500).optional(),
    projects: Joi.string().max(1000).optional()
  })
};

// Validation middleware factory
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
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