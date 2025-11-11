# Central Authentication API

> **Multi-Application Single Sign-On (SSO) System with Role-Based Access Control**

A production-ready Node.js REST API providing centralized authentication, authorization, and user management for multiple applications with a single sign-on experience.

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v13+-blue.svg)](https://www.postgresql.org/)
[![Express](https://img.shields.io/badge/Express-v4.18-lightgrey.svg)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Testing the API](#-testing-the-api)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Features

- ✅ **Single Sign-On (SSO)** - Users log in once, access all connected applications
- ✅ **JWT Authentication** - Secure token-based authentication with refresh tokens
- ✅ **Role-Based Access Control (RBAC)** - Granular permissions system
- ✅ **Multi-Application Support** - Connect unlimited applications seamlessly
- ✅ **Password Management** - Forgot password, reset, and change password flows
- ✅ **Session Management** - Track and manage active sessions across devices
- ✅ **Flexible Schema** - JSONB columns for easy extension without migrations
- ✅ **Complete Audit Trail** - Track all user activities and changes
- ✅ **Interactive API Documentation** - Swagger UI with "Try it out" functionality
- ✅ **Rate Limiting** - Protection against abuse and DDoS attacks
- ✅ **Security Hardened** - Helmet.js, CORS, password hashing with bcrypt

---

## 🛠 Tech Stack

- **Runtime:** Node.js v14+
- **Framework:** Express.js
- **Database:** PostgreSQL 13+
- **ORM:** Sequelize
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Joi
- **Documentation:** Swagger (OpenAPI 3.0)
- **Security:** Helmet.js, bcryptjs
- **Logging:** Morgan

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.x or higher) - [Download](https://nodejs.org/)
- **npm** (v6.x or higher) - Comes with Node.js
- **PostgreSQL** (v13.x or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

Verify installations:

```bash
node --version    # Should show v14.x or higher
npm --version     # Should show v6.x or higher
psql --version    # Should show PostgreSQL 13.x or higher
```

---

## 📥 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Pronoor/DBMicro-A.git
cd central-auth-api
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- express, cors, helmet
- sequelize, pg, pg-hstore
- bcryptjs, jsonwebtoken
- joi, swagger-jsdoc, swagger-ui-express
- and more...

### Step 3: Create Environment File

```bash
cp .env.example .env
```

Edit `.env` file with your configuration (see [Configuration](#-configuration) section below).

---

## ⚙️ Configuration

Edit the `.env` file with your settings:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=central_auth_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars
JWT_REFRESH_EXPIRES_IN=7d

# API Configuration
API_PREFIX=/api/v1
CORS_ORIGIN=*

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ Important Security Notes:**
- Change `JWT_SECRET` and `JWT_REFRESH_SECRET` to strong random strings in production
- Use environment-specific secrets, never commit `.env` to version control
- Set `CORS_ORIGIN` to your specific domain in production

---

## 🗄️ Database Setup

### Step 1: Create PostgreSQL Database

**Option A - Using psql:**

```bash
psql -U postgres
```

```sql
CREATE DATABASE central_auth_db;
\q
```

**Option B - Using command line:**

```bash
createdb central_auth_db -U postgres
```

### Step 2: Run Database Migrations

Migrations create all database tables with proper structure:

```bash
npm run migrate
```

**Expected Output:**
```
Sequelize CLI [Node: 14.x.x, CLI: 6.x.x, ORM: 6.x.x]

== 20250101000001-create-users: migrating =======
== 20250101000001-create-users: migrated (0.123s)

== 20250101000002-create-applications: migrating =======
== 20250101000002-create-applications: migrated (0.098s)

... (10 more migrations)

✓ All migrations completed successfully
```

This creates 12 tables:
- `users` - User accounts
- `applications` - Registered applications
- `roles` - User roles
- `permissions` - Granular permissions
- `user_roles` - Role assignments
- `role_permissions` - Permission assignments
- `user_sessions` - Active sessions
- `user_app_preferences` - User preferences
- `password_reset_tokens` - Password reset tokens
- `app_resources` - Application resources
- `audit_logs` - Audit trail
- `resource_access_logs` - Resource access tracking

### Step 3: Seed Initial Data

Seeders populate the database with initial data:

```bash
npm run seed
```

**Expected Output:**
```
== 20250101000001-seed-roles: migrating =======
== 20250101000001-seed-roles: migrated (0.045s)

== 20250101000002-seed-permissions: migrating =======
== 20250101000002-seed-permissions: migrated (0.032s)

== 20250101000003-seed-role-permissions: migrating =======
== 20250101000003-seed-role-permissions: migrated (0.028s)

== 20250101000004-seed-demo-users: migrating =======
== 20250101000004-seed-demo-users: migrated (0.156s)

✓ All seeders completed successfully
```

**What gets seeded:**
- ✅ 4 default roles (super_admin, admin, user, guest)
- ✅ 9 default permissions (users.create, users.read, etc.)
- ✅ 2 demo users (admin and regular user)
- ✅ 1 demo application

### Verify Database Setup

```bash
# Connect to database
psql -U postgres -d central_auth_db

# List all tables
\dt

# Check users
SELECT email, username FROM users;

# Check roles
SELECT role_name, description FROM roles;

# Exit
\q
```

---

## 🚀 Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

**Expected Output:**
```
✓ Database connection established successfully
✓ Server is running on port 3000
✓ API Documentation: http://localhost:3000/api-docs
✓ Health Check: http://localhost:3000/api/v1
✓ Environment: development
```

---

## 📚 API Documentation

### Interactive Swagger Documentation

Once the server is running, access the interactive API documentation:

🔗 **Swagger UI:** http://localhost:3000/api-docs

### What is Swagger?

Swagger provides interactive API documentation where you can:
- ✅ View all available endpoints organized by category
- ✅ See detailed request/response schemas
- ✅ **Try out endpoints directly** in the browser
- ✅ View example requests and responses
- ✅ Test authentication flows

### Using Swagger UI

1. **Open** http://localhost:3000/api-docs in your browser
2. **Explore** categories: Authentication, Users, Roles, Applications, etc.
3. **Click** on any endpoint to expand details
4. **Click** "Try it out" button
5. **Fill** in required parameters
6. **Execute** to see the response

**For authenticated endpoints:**
1. First login via `/auth/login` endpoint
2. Copy the `accessToken` from response
3. Click **"Authorize"** button at top of page
4. Paste token in format: `Bearer your-token-here`
5. Click **"Authorize"** to save
6. Now you can test protected endpoints

### API Categories

The API is organized into 8 main categories:

1. **Health Check** - API status and health endpoints
2. **Authentication** - Register, login, logout, token refresh
3. **Password Management** - Password reset and change
4. **Users** - User CRUD operations and role management
5. **Roles** - Role management and permission assignment
6. **Permissions** - Permission CRUD operations
7. **Applications** - Application registration for SSO
8. **Sessions** - Session tracking and management

---


### Demo Credentials

Use these credentials for testing:

**Super Admin:**
```
Email: admin@example.com
Password: Admin@123
App Key: demo-app-key-2025
```

**Regular User:**
```
Email: user@example.com
Password: User@123
App Key: demo-app-key-2025
```

### All Available Endpoints

| Category | Method | Endpoint | Auth | Description |
|----------|--------|----------|------|-------------|
| **Health** | GET | `/` | ❌ | API info |
| **Health** | GET | `/health` | ❌ | Health status |
| **Auth** | POST | `/auth/register` | ❌ | Register user |
| **Auth** | POST | `/auth/login` | ❌ | Login |
| **Auth** | POST | `/auth/logout` | ✅ | Logout |
| **Auth** | POST | `/auth/refresh` | ❌ | Refresh token |
| **Auth** | GET | `/auth/me` | ✅ | Get profile |
| **Password** | POST | `/password/forgot-password` | ❌ | Request reset |
| **Password** | POST | `/password/verify-reset-token` | ❌ | Verify token |
| **Password** | POST | `/password/reset-password` | ❌ | Reset password |
| **Password** | POST | `/password/change-password` | ✅ | Change password |
| **Users** | GET | `/users` | ✅ | List users |
| **Users** | GET | `/users/:id` | ✅ | Get user |
| **Users** | PUT | `/users/:id` | ✅ | Update user |
| **Users** | DELETE | `/users/:id` | ✅ | Delete user |
| **Users** | POST | `/users/:id/roles` | ✅ | Assign role |
| **Users** | DELETE | `/users/:id/roles/:roleId` | ✅ | Remove role |
| **Roles** | GET | `/roles` | ✅ | List roles |
| **Roles** | GET | `/roles/:id` | ✅ | Get role |
| **Roles** | POST | `/roles` | ✅ | Create role |
| **Roles** | PUT | `/roles/:id` | ✅ | Update role |
| **Roles** | DELETE | `/roles/:id` | ✅ | Delete role |
| **Roles** | POST | `/roles/:id/permissions` | ✅ | Assign permission |
| **Roles** | DELETE | `/roles/:id/permissions/:permId` | ✅ | Remove permission |
| **Permissions** | GET | `/permissions` | ✅ | List permissions |
| **Permissions** | POST | `/permissions` | ✅ | Create permission |
| **Applications** | GET | `/applications` | ✅ | List apps |
| **Applications** | POST | `/applications` | ✅ | Create app |
| **Applications** | PUT | `/applications/:id` | ✅ | Update app |
| **Applications** | DELETE | `/applications/:id` | ✅ | Delete app |
| **Applications** | POST | `/applications/:id/regenerate-secret` | ✅ | Regenerate secret |
| **Sessions** | GET | `/sessions` | ✅ | List sessions |
| **Sessions** | DELETE | `/sessions/:id` | ✅ | Terminate session |
| **Sessions** | POST | `/sessions/terminate-all` | ✅ | Logout all |

---

## 📜 Available Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run database migrations
npm run migrate

# Undo last migration
npm run migrate:undo

# Run database seeders
npm run seed

# Undo all seeders
npm run seed:undo

# Reset database (undo migrations, run migrations, run seeds)
npm run db:reset
```

---

## 🔐 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | development | Environment (development/production/test) |
| `PORT` | 3000 | Server port |
| `DB_HOST` | localhost | PostgreSQL host |
| `DB_PORT` | 5432 | PostgreSQL port |
| `DB_NAME` | central_auth_db | Database name |
| `DB_USER` | postgres | Database user |
| `DB_PASSWORD` | - | Database password |
| `JWT_SECRET` | - | **Required** - JWT signing secret (min 32 chars) |
| `JWT_EXPIRES_IN` | 1h | Access token expiration |
| `JWT_REFRESH_SECRET` | - | **Required** - Refresh token secret |
| `JWT_REFRESH_EXPIRES_IN` | 7d | Refresh token expiration |
| `API_PREFIX` | /api/v1 | API URL prefix |
| `CORS_ORIGIN` | * | CORS allowed origins |
| `RATE_LIMIT_WINDOW_MS` | 900000 | Rate limit window (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | 100 | Max requests per window |

---

## 🐛 Troubleshooting

### Issue: Database connection failed

**Solution:**
```bash
# Check if PostgreSQL is running
sudo service postgresql status  # Linux
brew services list              # macOS

# Verify database exists
psql -U postgres -l | grep central_auth_db

# Test connection
psql -h localhost -U postgres -d central_auth_db
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Find process using port
lsof -i :3000              # macOS/Linux
netstat -ano | findstr :3000   # Windows

# Kill the process or change PORT in .env
PORT=3001
```

### Issue: Migration errors

**Solution:**
```bash
# Check migration status
npx sequelize-cli db:migrate:status

# Reset and retry
npm run migrate:undo
npm run migrate
```

### Issue: JWT token invalid

**Solution:**
- Ensure `JWT_SECRET` is set in `.env`
- Token must be prefixed with `Bearer ` in Authorization header
- Check token hasn't expired (default 1 hour)

### Issue: Swagger not loading

**Solution:**
```bash
# Verify swagger dependencies
npm ls swagger-jsdoc swagger-ui-express

# Check server logs for errors
npm run dev
```

### Issue: Permission denied errors

**Solution:**
- Login with admin account (admin@example.com)
- Check user has required role assigned
- Verify role has required permissions

---

## 🔒 Security Best Practices

1. **Change default credentials** immediately after first setup
2. **Use strong JWT secrets** (minimum 32 characters, random)
3. **Enable HTTPS** in production
4. **Set CORS_ORIGIN** to specific domain(s) in production
5. **Rotate JWT secrets** periodically
6. **Monitor audit logs** regularly
7. **Keep dependencies updated** (`npm audit`)
8. **Use environment variables** for sensitive data
9. **Enable rate limiting** (already configured)
10. **Implement 2FA** for admin accounts (future enhancement)

---

## 📖 Additional Resources

- **API Documentation:** http://localhost:3000/api-docs
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **Sequelize Documentation:** https://sequelize.org/docs/
- **JWT.io:** https://jwt.io/ (for decoding tokens)
- **Express.js Documentation:** https://expressjs.com/

---

## 📝 License

This project is licensed under the MIT License.

---

## 🤝 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Email: hsh.devhub@gmail.com
- Documentation: http://localhost:3000/api-docs

---

## 🎉 You're All Set!

Your Central Authentication API is now ready to use!

**Next Steps:**
1. ✅ Access Swagger UI: http://localhost:3000/api-docs
2. ✅ Test endpoints using demo credentials
3. ✅ Integrate with your applications
4. ✅ Customize roles and permissions as needed
5. ✅ Deploy to production

**Happy coding! 🚀**