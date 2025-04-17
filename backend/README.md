# Task Management API – DTS Developer Challenge

This is the backend API for the Task Management System developed for the HMCTS DTS Developer Technical Test. It allows caseworkers to manage tasks efficiently through a RESTful API.

## 🔧 Features

- Create, retrieve, update, and delete tasks
- Store data using PostgreSQL
- Input validation and structured error handling
- Unit testing with Jest
- Modular code structure with MVC pattern

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- Jest (Testing)

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the `backend/` folder
3. Install dependencies:

```bash
npm install
```

### Configuration

1. Create a PostgreSQL database for the application
2. Copy `.env.example` to `.env` and update the database configuration
3. Set up the database and run migrations:

```bash
npm run migrate
```

4. (Optional) Seed the database with sample data:

```bash
npm run seed
```

This will create sample users and tasks for testing purposes.

### Database Setup

1. Create a PostgreSQL database for the application:
   ```bash
   createdb task_management
   ```

2. Copy `.env.example` to `.env` and update the database configuration:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=task_management
   DB_USER=your_db_username
   DB_PASSWORD=your_db_password
   ```

3. Run the migrations to set up the database schema:
   ```bash
   npm run migrate
   ```

4. (Optional) Seed the database with sample users and tasks:
   ```bash
   npm run seed
   ```

### Migrations and Models

The application uses Sequelize as the ORM with the following models:

1. **User Model**
   - Stores user information and authentication details
   - Fields: id, name, email, password, role

2. **Task Model**
   - Stores task information associated with users
   - Fields: id, title, description, status, dueDate, userId

Migrations are managed with sequelize-cli and can be found in the `migrations` folder:
- `20230501000000-create-users.js` - Creates the users table
- `20230501000001-create-tasks.js` - Creates the tasks table with foreign key to users

## API Endpoints

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
  - Response: `{ tasks }`

- `GET /api/tasks/:id` - Get a single task by ID
  - Response: `{ task }`

- `POST /api/tasks` - Create a new task
  - Request body: `{ title, description, status, dueDate }`
  - Response: `{ task }`

- `PUT /api/tasks/:id` - Update a task
  - Request body: `{ title?, description?, status?, dueDate? }`
  - Response: `{ task }`

- `DELETE /api/tasks/:id` - Delete a task
  - Response: `{ message: 'Task deleted successfully' }`

## Models

### User

- `id` - Integer (Primary Key)
- `name` - String (Required)
- `email` - String (Required, Unique)
- `password` - String (Required)
- `role` - String (Default: 'user')

### Task

- `id` - Integer (Primary Key)
- `title` - String (Required)
- `description` - Text (Optional)
- `status` - Enum ('pending', 'in-progress', 'completed') (Default: 'pending')
- `dueDate` - DateTime (Required)
- `userId` - Integer (Foreign Key to User)