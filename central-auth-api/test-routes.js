const testRoutes = async () => {
  const axios = require('axios');
  const baseURL = 'http://localhost:3000/api/v1';

  console.log('🧪 Testing API Routes...\n');

  const routes = [
    { method: 'GET', path: '/', name: 'Health Check' },
    { method: 'GET', path: '/health', name: 'Detailed Health' },
    { method: 'POST', path: '/auth/register', name: 'Register (will fail - expected)' },
    { method: 'POST', path: '/auth/login', name: 'Login (will fail - expected)' },
    { method: 'GET', path: '/roles', name: 'Get Roles (needs auth)' },
    { method: 'GET', path: '/permissions', name: 'Get Permissions (needs auth)' },
    { method: 'GET', path: '/applications', name: 'Get Applications (needs auth)' },
    { method: 'GET', path: '/sessions', name: 'Get Sessions (needs auth)' },
    { method: 'POST', path: '/password/forgot-password', name: 'Forgot Password' }
  ];

  for (const route of routes) {
    try {
      const response = await axios({
        method: route.method,
        url: `${baseURL}${route.path}`,
        validateStatus: () => true // Don't throw on any status
      });

      const status = response.status;
      const isNotFound = status === 404;
      const symbol = isNotFound ? '❌' : '✅';
      const statusText = isNotFound ? 'NOT FOUND' : status;

      console.log(`${symbol} ${route.method.padEnd(6)} ${route.path.padEnd(30)} - ${statusText} - ${route.name}`);
    } catch (error) {
      console.log(`❌ ${route.method.padEnd(6)} ${route.path.padEnd(30)} - ERROR - ${route.name}`);
    }
  }

  console.log('\n✅ = Route exists (even if returns 401/400)');
  console.log('❌ = Route returns 404 (not found)\n');
};

if (require.main === module) {
  // Check if axios is installed
  try {
    require('axios');
    testRoutes();
  } catch (e) {
    console.log('⚠️  Install axios to test routes: npm install axios');
    console.log('Or test manually with: curl http://localhost:3000/api/v1/roles');
  }
}

module.exports = { testRoutes };