// ================================================================
// FILE: src/app.js - UPDATED WITH ENVIRONMENT-AWARE HELMET CONFIG
// ================================================================
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const routes = require('./src/routes');

const app = express();

// ================================================================
// Security middleware with environment-aware configuration
// ================================================================
if (process.env.NODE_ENV === 'production') {
  // Production: Use all security headers
  app.use(helmet({
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    }
  }));
} else {
  // Development: Relaxed security for easier testing
  app.use(helmet({
    crossOriginOpenerPolicy: false, // Disable to avoid localhost warnings
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false, // Disable CSP for Swagger UI in dev
  }));
}

// ================================================================
// CORS Configuration
// ================================================================
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

// ================================================================
// Rate Limiting
// ================================================================
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for health checks
  skip: (req) => req.path === '/api/v1/' || req.path === '/api/v1/health'
});

// Apply rate limiting only to API routes
app.use('/api', limiter);

// ================================================================
// Body Parser
// ================================================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ================================================================
// Logging
// ================================================================
if (process.env.NODE_ENV !== 'test') {
  // Use different logging formats based on environment
  const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(morgan(logFormat));
}

// ================================================================
// Swagger Documentation
// ================================================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Central Auth API Documentation',
  swaggerOptions: {
    persistAuthorization: true, // Remember auth token
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true
  }
}));

// ================================================================
// API Routes
// ================================================================
app.use(process.env.API_PREFIX || '/api/v1', routes);

// ================================================================
// 404 Handler
// ================================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// ================================================================
// Global Error Handler
// ================================================================
app.use((err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      error: err 
    })
  });
});

module.exports = app;