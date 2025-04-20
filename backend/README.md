# Task Management API – DTS Developer Challenge

This is the backend API for the Task Management System developed for the HMCTS DTS Developer Technical Test. It allows caseworkers to manage tasks efficiently through a RESTful API.

## 🔧 Features

- Full CRUD operations for task management
- User authentication with JWT and password hashing
- Secure API endpoints with middleware protection
- Database integration with PostgreSQL and Sequelize ORM
- Input validation and structured error handling
- Comprehensive error responses
- Unit testing with Jest
- Modular code structure with MVC pattern

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT for authentication
- Bcrypt for password hashing
- Jest (Testing)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Navigate to the `backend/` folder
3. Install dependencies:

```bash
npm install
```

### Configuration

1. Create a PostgreSQL database for the application
2. Copy `.env.example` to `.env` and update the database configuration:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=task_management
   DB_USER=your_db_username
   DB_PASSWORD=your_db_password
   JWT_SECRET=your_jwt_secret
   ```

3. Set up the database and run migrations:

```bash
npx sequelize-cli db:migrate
```

4. (Optional) Seed the database with sample data:

```bash
npx sequelize-cli db:seed:all
```

This will create sample users and tasks for testing purposes.

### Running the API

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

For production:

```bash
npm start
```

### Running Tests

Execute the test suite:

```bash
npm test
```

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Request body: `{ name, email, password }`
  - Response: `{ user, token }`

- `POST /api/auth/login` - Log in a user
  - Request body: `{ email, password }`
  - Response: `{ user, token }`

- `GET /api/auth/me` - Get current user profile (requires authentication)
  - Response: `{ user }`

### Tasks

- `GET /api/tasks` - Get all tasks for the authenticated user
  - Query parameters: 
    - `status` (optional): Filter by status
    - `search` (optional): Search in title/description
    - `startDate` (optional): Filter by due date range (start)
    - `endDate` (optional): Filter by due date range (end)
  - Response: `{ tasks }`

- `GET /api/tasks/:id` - Get a single task by ID
  - Response: `{ task }`

- `POST /api/tasks` - Create a new task
  - Request body: `{ title, description, status, dueDate }`
  - Response: `{ task }`

- `PUT /api/tasks/:id` - Update a task
  - Request body: `{ title?, description?, status?, dueDate? }`
  - Response: `{ task }`

- `PATCH /api/tasks/:id/status` - Update task status only
  - Request body: `{ status }`
  - Response: `{ task }`

- `DELETE /api/tasks/:id` - Delete a task
  - Response: `{ message: 'Task deleted successfully' }`

## 🗄️ Data Models

### User

- `id` - Integer (Primary Key, Auto-increment)
- `name` - String (Required)
- `email` - String (Required, Unique)
- `password` - String (Required, Hashed)
- `createdAt` - DateTime
- `updatedAt` - DateTime

### Task

- `id` - Integer (Primary Key, Auto-increment)
- `title` - String (Required)
- `description` - Text (Optional)
- `status` - Enum ('pending', 'in-progress', 'completed') (Default: 'pending')
- `dueDate` - DateTime (Required)
- `userId` - Integer (Foreign Key to User)
- `createdAt` - DateTime
- `updatedAt` - DateTime

For a more detailed view of the data model, refer to the [Data Model Diagram](../docs/data-models/tms-data-model-v1.md).

## 📋 Requirements and Planning

The backend API is developed based on requirements defined in the Product Requirements Document:

- [Product Requirements Document](../docs/product_requirements.md)
- [Wireframes](../docs/wireframes/)
- [Data Models](../docs/data-models/)

These documents outline the complete system specifications, user requirements, and design guidelines.

## 🔒 Authentication & Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes with middleware
- Input validation to prevent injection attacks
- Proper error handling and sanitized error responses

## 📁 Project Structure

```
backend/
├── config/             # Configuration files (database, etc.)
├── controllers/        # Request handlers
├── middleware/         # Custom middleware (auth, validation, etc.)
├── migrations/         # Sequelize migrations
├── models/             # Sequelize models
├── routes/             # API route definitions
├── seeders/            # Database seed files
├── tests/              # Unit and integration tests
├── utils/              # Utility functions
├── app.js              # Express application setup
└── server.js           # Server entry point
```

## 🔄 Environment Variables

The following environment variables can be configured:

- `PORT` - The port the server runs on (default: 3000)
- `NODE_ENV` - Environment ('development', 'test', 'production')
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret for JWT token generation
- `JWT_EXPIRES_IN` - Token expiration time (default: '24h')

## 🚨 Error Handling

The API uses structured error responses, including:
```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": {} // Optional additional information
  }
}
```

## 🤝 Contributing

See the main repository README for contribution guidelines.