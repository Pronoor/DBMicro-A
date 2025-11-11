const fs = require('fs');
const path = require('path');

const requiredFiles = {
  'Config Files': [
    'src/config/database.js',
    'src/config/swagger.js',
    'src/config/constants.js'
  ],
  'Models': [
    'src/models/index.js',
    'src/models/user.model.js',
    'src/models/application.model.js',
    'src/models/role.model.js',
    'src/models/permission.model.js',
    'src/models/userRole.model.js',
    'src/models/rolePermission.model.js',
    'src/models/userSession.model.js',
    'src/models/userAppPreference.model.js',
    'src/models/passwordResetToken.model.js',
    'src/models/appResource.model.js',
    'src/models/auditLog.model.js',
    'src/models/resourceAccessLog.model.js'
  ],
  'Controllers': [
    'src/controllers/auth.controller.js',
    'src/controllers/user.controller.js',
    'src/controllers/password.controller.js',
    'src/controllers/role.controller.js',
    'src/controllers/application.controller.js',
    'src/controllers/permission.controller.js',
    'src/controllers/session.controller.js'
  ],
  'Services': [
    'src/services/auth.service.js',
    'src/services/user.service.js',
    'src/services/password.service.js',
    'src/services/role.service.js',
    'src/services/application.service.js'
  ],
  'Middlewares': [
    'src/middlewares/auth.middleware.js',
    'src/middlewares/permission.middleware.js',
    'src/middlewares/validation.middleware.js',
    'src/middlewares/audit.middleware.js'
  ],
  'Routes': [
    'src/routes/index.js',
    'src/routes/auth.routes.js',
    'src/routes/user.routes.js',
    'src/routes/password.routes.js',
    'src/routes/role.routes.js',
    'src/routes/permission.routes.js',
    'src/routes/application.routes.js',
    'src/routes/session.routes.js'
  ],
  'Utils': [
    'src/utils/jwt.util.js',
    'src/utils/password.util.js',
    'src/utils/response.util.js',
    'src/utils/validation.util.js'
  ],
  'Root Files': [
    'src/app.js',
    'server.js',
    '.env',
    'package.json',
    '.sequelizerc'
  ]
};

console.log('🔍 Verifying Project Setup...\n');

let missingFiles = [];
let foundFiles = 0;
let totalFiles = 0;

Object.keys(requiredFiles).forEach(category => {
  console.log(`\n📁 ${category}:`);
  requiredFiles[category].forEach(file => {
    totalFiles++;
    const exists = fs.existsSync(path.join(process.cwd(), file));
    if (exists) {
      console.log(`  ✅ ${file}`);
      foundFiles++;
    } else {
      console.log(`  ❌ ${file} - MISSING`);
      missingFiles.push(file);
    }
  });
});

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Summary: ${foundFiles}/${totalFiles} files found`);

if (missingFiles.length > 0) {
  console.log('\n❌ Missing Files:');
  missingFiles.forEach(file => console.log(`   - ${file}`));
  console.log('\n💡 Create these files from the artifacts provided.');
} else {
  console.log('\n✅ All required files are present!\n');
  console.log('Next steps:');
  console.log('  1. npm install');
  console.log('  2. npm run migrate');
  console.log('  3. npm run seed');
  console.log('  4. npm run dev');
}

console.log('\n' + '='.repeat(60) + '\n');

