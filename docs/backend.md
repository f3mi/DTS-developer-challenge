# Backend Documentation

## Overview

The backend of the Task Management System is built with Node.js and Express, providing a RESTful API for task management. It includes user authentication, task CRUD operations, and data persistence using PostgreSQL.

## Tech Stack

- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web framework for Node.js
- **PostgreSQL**: Relational database
- **Sequelize**: ORM for database interactions
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing
- **Jest**: Testing framework

## Project Structure

```
backend/
├── config/              # Configuration files
├── controllers/         # Route handlers
├── middleware/          # Custom middleware
│   ├── auth.js          # Authentication middleware
│   └── validators.js    # Request validation
├── models/              # Database models
├── routes/              # API routes
├── utils/               # Utility functions
├── migrations/          # Database migrations
├── seeders/             # Seed data
├── tests/               # Test files
├── .env.example         # Environment variables template
└── server.js            # Application entry point
```

## Database Schema

### User Model

| Field      | Type    | Description            |
|------------|---------|------------------------|
| id         | Integer | Primary key            |
| name       | String  | User's name            |
| email      | String  | User's email (unique)  |
| password   | String  | Hashed password        |
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
- `requireRole`: (Optional) Authorization based on user roles

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

## Testing

The backend includes comprehensive tests:

- Unit tests for individual components
- Integration tests for API endpoints
- Authentication test cases
- Validation test cases

### Running Tests

```bash
npm run test
```

## Environment Variables

The following environment variables should be set in a `.env` file:

```
NODE_ENV=development
PORT=3000
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_management
DB_USER=postgres
DB_PASSWORD=your_password
``` 