require('dotenv').config();
const app = require('./app');
const db = require('./src/models');

const PORT = process.env.PORT || 3000;

// Test database connection
db.sequelize
  .authenticate()
  .then(() => {
    console.log('✓ Database connection established successfully');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`✓ Server is running on port ${PORT}`);
      console.log(`✓ API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`✓ Health Check: http://localhost:${PORT}/api/v1`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch(err => {
    console.error('✗ Unable to connect to database:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  db.sequelize.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  db.sequelize.close();
  process.exit(0);
});