import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Food Rescue API',
      version: '1.0.0',
      description: 'API para conectar donantes de alimentos con beneficiarios. Sistema de gestión de donaciones en tiempo real con WebSocket.',
      contact: {
        name: 'Food Rescue Team',
        email: 'support@foodrescue.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.foodrescue.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User ID'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            firstName: {
              type: 'string',
              description: 'First name'
            },
            lastName: {
              type: 'string',
              description: 'Last name'
            },
            userType: {
              type: 'string',
              enum: ['DONOR', 'BENEFICIARY'],
              description: 'Type of user'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Donation: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            productName: {
              type: 'string',
              description: 'Name of the donated product'
            },
            quantity: {
              type: 'number',
              description: 'Quantity of the product'
            },
            unit: {
              type: 'string',
              description: 'Unit of measurement (kg, litros, unidades, etc.)'
            },
            status: {
              type: 'string',
              enum: ['AVAILABLE', 'ASSIGNED', 'DELIVERED'],
              description: 'Status of the donation'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        City: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'City code (3 letters)',
              example: 'UIO'
            },
            name: {
              type: 'string',
              description: 'City name',
              example: 'Quito'
            }
          }
        },
        PeakHour: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            day: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
              }
            },
            startTime: {
              type: 'string',
              example: '08:00'
            },
            endTime: {
              type: 'string',
              example: '10:00'
            },
            note: {
              type: 'string',
              maxLength: 100
            }
          }
        },
        Notification: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            message: {
              type: 'string'
            },
            type: {
              type: 'string'
            },
            isRead: {
              type: 'boolean'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        },
        ErrorResponse: {
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
            data: {
              type: 'object',
              nullable: true
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Endpoints para autenticación y gestión de sesiones'
      },
      {
        name: 'Cities',
        description: 'Endpoints para consultar ciudades'
      },
      {
        name: 'Donations',
        description: 'Endpoints para gestionar donaciones'
      },
      {
        name: 'Peak Hours',
        description: 'Endpoints para gestionar horarios pico (solo donantes)'
      },
      {
        name: 'Notifications',
        description: 'Endpoints para gestionar notificaciones'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
