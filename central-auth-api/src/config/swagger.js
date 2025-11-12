const swaggerJsdoc = require('swagger-jsdoc');

// Helper function to get server URL
const getServerUrl = () => {
  // Priority 1: Environment variable (explicit)
  if (process.env.API_BASE_URL) {
    return `${process.env.API_BASE_URL}/api/v1`;
  }
  
  // Priority 2: Check environment
  if (process.env.NODE_ENV === 'production') {
    // Production - you should set API_BASE_URL
    return 'https://yourdomain.com/api/v1';
  }
  
  // Priority 3: Development/Local
  const port = process.env.PORT || 3000;
  return `http://localhost:${port}/api/v1`;
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Central Authentication API',
      version: '1.0.0',
      description: 'Multi-Application Central Authentication & Authorization API with Single Sign-On (SSO)',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: getServerUrl(),
        description: process.env.NODE_ENV === 'production' 
          ? 'Production Server' 
          : 'Development Server'
      }
    ],
    tags: [
      {
        name: 'Health Check',
        description: 'API health and status endpoints'
      },
      {
        name: 'Authentication',
        description: 'User authentication endpoints (register, login, logout)'
      },
      {
        name: 'Password Management',
        description: 'Password reset and change operations'
      },
      {
        name: 'Users',
        description: 'User management and profile operations'
      },
      {
        name: 'Roles',
        description: 'Role-Based Access Control (RBAC) management'
      },
      {
        name: 'Permissions',
        description: 'Permission management for fine-grained access control'
      },
      {
        name: 'Applications',
        description: 'Application registration and management for SSO'
      },
      {
        name: 'Sessions',
        description: 'Session management and device tracking'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token obtained from /auth/login endpoint'
        },
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'Application API Key for server-to-server authentication'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            userId: { 
              type: 'string', 
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000'
            },
            email: { 
              type: 'string', 
              format: 'email',
              example: 'user@example.com'
            },
            username: { 
              type: 'string',
              example: 'johndoe'
            },
            firstName: { 
              type: 'string',
              example: 'John'
            },
            lastName: { 
              type: 'string',
              example: 'Doe'
            },
            phoneNumber: { 
              type: 'string',
              example: '+1234567890'
            },
            isActive: { 
              type: 'boolean',
              example: true
            },
            isVerified: { 
              type: 'boolean',
              example: true
            },
            metadata: { 
              type: 'object',
              example: { department: 'Engineering', employee_id: 'E001' }
            },
            createdAt: { 
              type: 'string', 
              format: 'date-time',
              example: '2025-01-01T00:00:00.000Z'
            },
            updatedAt: { 
              type: 'string', 
              format: 'date-time',
              example: '2025-01-01T00:00:00.000Z'
            }
          }
        },
        Role: {
          type: 'object',
          properties: {
            roleId: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440001'
            },
            roleName: {
              type: 'string',
              example: 'admin'
            },
            description: {
              type: 'string',
              example: 'Application administrator'
            },
            isSystemRole: {
              type: 'boolean',
              example: true
            },
            permissionsConfig: {
              type: 'object',
              example: {}
            }
          }
        },
        Permission: {
          type: 'object',
          properties: {
            permissionId: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440002'
            },
            permissionName: {
              type: 'string',
              example: 'users.create'
            },
            resourceType: {
              type: 'string',
              example: 'user'
            },
            action: {
              type: 'string',
              example: 'create'
            },
            description: {
              type: 'string',
              example: 'Create new users'
            }
          }
        },
        Application: {
          type: 'object',
          properties: {
            appId: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440003'
            },
            appName: {
              type: 'string',
              example: 'Demo App'
            },
            appKey: {
              type: 'string',
              example: 'demo-app-key-2025'
            },
            description: {
              type: 'string',
              example: 'Demo application for testing'
            },
            config: {
              type: 'object',
              example: { features: ['sso', 'api'], max_upload_size: 10485760 }
            },
            isActive: {
              type: 'boolean',
              example: true
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { 
              type: 'boolean', 
              example: false 
            },
            message: { 
              type: 'string',
              example: 'Error message'
            },
            error: { 
              type: 'string',
              example: 'Detailed error description'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation successful'
            },
            data: {
              type: 'object'
            }
          }
        }
      },
      responses: {
        Unauthorized: {
          description: 'Unauthorized - Invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Invalid or expired token'
              }
            }
          }
        },
        Forbidden: {
          description: 'Forbidden - Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Insufficient permissions'
              }
            }
          }
        },
        NotFound: {
          description: 'Not Found - Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Resource not found'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation Error - Invalid input',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Validation failed' },
                  errors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        field: { type: 'string' },
                        message: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;