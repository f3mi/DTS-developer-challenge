# Backend Documentation

## Overview

The backend of the Task Management System is built with Node.js and Express, providing a RESTful API for task management. It follows a modern API-oriented architecture with clear separation of concerns, implementing the data and business logic layers of the application. The system includes user authentication, task CRUD operations, and data persistence using PostgreSQL.

## Architectural Pattern

The application follows a modified **API-oriented architecture**, drawing from traditional MVC concepts:

- **Models**: Define data structures, relationships, and business logic
  - Implemented with Sequelize ORM
  - Handle data validation and integrity
  - Define relationships between entities (User, Task)

- **Controllers**: Handle HTTP requests and responses
  - Process incoming requests
  - Interact with models to retrieve and manipulate data
  - Return appropriate responses to clients
  - Implement business logic for features

- **Routes**: Define API endpoints and map them to controllers
  - Organize endpoints by resource
  - Apply middleware for authentication and validation
  - Structure API in a RESTful manner

This separation of concerns makes the codebase more maintainable, testable, and easier to extend with new features.

## Tech Stack

- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web framework for Node.js
- **PostgreSQL**: Relational database
- **Sequelize**: ORM for database interactions
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing
- **Jest**: Testing framework
- **SuperTest**: HTTP testing library

## Project Structure

```
backend/
├── config/              # Configuration files
├── controllers/         # Route handlers (API logic)
├── middleware/          # Custom middleware
│   ├── auth.js          # Authentication middleware
│   └── validators.js    # Request validation
├── models/              # Database models 
├── routes/              # API routes
├── utils/               # Utility functions
├── migrations/          # Database migrations
├── seeders/             # Seed data
├── tests/               # Test files
│   ├── mocks/           # Mock data for tests
│   ├── controllers/     # Controller unit tests
│   ├── middleware/      # Middleware unit tests
│   ├── integration/     # API integration tests
│   └── setup.js         # Test configuration
├── .env.example         # Environment variables template
└── server.js            # Application entry point
```

## Environment Variables

``` bash
cp .env.example .env
```

The following environment variables should be set in a `.env` file:

```
NODE_ENV=development
PORT=3000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
BCRYPT_SALT_ROUNDS=10

DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_management
DB_USER=postgres
DB_PASSWORD=your_password

TEST_DB_NAME=task_management_test

CORS_ORIGIN=http://localhost:5173
``` 

## Running the Backend

The backend serves as an API only - there is no server-side rendering or view templates.
It is designed to work in conjunction with the Vue.js frontend (documented separately in [frontend.md](./frontend.md)).

To set up and run the backend:

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create and configure environment variables
cp .env.example .env
# Edit the .env file with your database credentials and settings

# Create the database (if it doesn't exist yet)
# Using PostgreSQL command line or a GUI tool like pgAdmin
createdb task_management

# Run database migrations first - this creates the tables
npm run migration
# Or use the Sequelize CLI directly:
# npx sequelize-cli db:migrate

# Seed the database with sample data (AFTER running migrations)
npm run seed:ordered  # Recommended method to ensure proper seeding order
# Note: Running seeders before migrations will cause errors!

# Start the development server
npm run dev          # Runs on http://localhost:3000 by default

# For production
npm start
```

### Troubleshooting Seeders

If you encounter errors like `relation "Tasks" does not exist` when running seeders, it means the database tables haven't been created yet. Always run migrations before attempting to seed the database:

```bash
# First create tables with migrations
npm run migration

# Then seed the database
npm run seed:ordered
```

If issues persist, you may need to drop and recreate the database:

```bash
# Drop the database (WARNING: This deletes all data)
dropdb task_management

# Create a fresh database
createdb task_management

# Run migrations and then seeders
npm run migration
npm run seed:ordered
```

## Database Schema

### User Model

| Field      | Type    | Description            |
|------------|---------|------------------------|
| id         | Integer | Primary key            |
| name       | String  | User's name            |
| email      | String  | User's email (unique)  |
| password   | String  | Hashed password        |
| role       | String  | User role (user/admin) |
| created_at | Date    | Account creation date  |
| updated_at | Date    | Last update timestamp  |

### Task Model

| Field       | Type    | Description                       |
|-------------|---------|-----------------------------------|
| id          | Integer | Primary key                       |
| title       | String  | Task title                        |
| description | Text    | Task description (optional)       |
| status      | Enum    | Task status (pending/in-progress/completed) |
| due_date    | Date    | Task due date                     |
| user_id     | Integer | Foreign key to User               |
| created_at  | Date    | Task creation date                |
| updated_at  | Date    | Last update timestamp             |

## Authentication

The system uses JSON Web Tokens (JWT) for authentication:

1. User registers or logs in
2. Server validates credentials and issues a JWT
3. Client includes the JWT in the `Authorization` header for subsequent requests
4. Server validates the token for protected routes

### Implementation Details

- Tokens expire after 24 hours
- Passwords are hashed using bcrypt before storage
- Protected routes use the `protect` middleware

## Middleware

### auth.js

Provides authentication-related middleware:

- `protect`: Verifies JWT and attaches user information to the request
- `isAdmin`: Authorization based on user role

### validators.js

Provides request validation middleware:

- `registerValidator`: Validates user registration requests
- `loginValidator`: Validates login requests
- `taskValidators`: Validates task-related requests

## Controllers

### authController.js

Handles user authentication:

- `register`: Creates a new user account
- `login`: Authenticates a user and issues a JWT
- `getCurrentUser`: Returns the current user's profile

### taskController.js

Handles task operations:

- `getTasks`: Returns all tasks for the authenticated user
- `getTaskById`: Returns a specific task
- `createTask`: Creates a new task
- `updateTask`: Updates an existing task
- `deleteTask`: Deletes a task

## Error Handling

The API implements consistent error handling:

- Validation errors return 400 Bad Request with validation details
- Authentication errors return 401 Unauthorized
- Not found errors return 404 Not Found
- Server errors return 500 Internal Server Error

## Security Measures

- Password hashing to protect user credentials
- JWT-based authentication
- Input validation to prevent injection attacks
- CORS configuration to restrict access
- Rate limiting to prevent brute force attacks
- Environment variables for sensitive information

## API Testing

The backend implements a comprehensive testing strategy to ensure code quality and reliability:

### Test Types

1. **Unit Tests**: Testing individual components in isolation
   - Controller function tests
   - Middleware function tests
   - Model method tests
   
2. **Integration Tests**: Testing API endpoints with database interactions
   - Authentication flow tests
   - Task management flow tests
   - Error handling tests

3. **Mock-Based Testing**: Using mock data and dependencies
   - Mock database models and their methods
   - Mock request/response objects
   - Mock authentication tokens

### Testing Tools

- **Jest**: Primary testing framework
- **SuperTest**: HTTP assertion library for API testing
- **Mock Data**: Predefined test data in `mocks` directory

### Test Structure

- Tests are grouped by component type (controllers, middleware, etc.)
- Each test file focuses on a specific component
- Test setup and teardown functions manage the test environment
- Database operations use transactions for isolation

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with verbose output
npm run test:verbose
```

