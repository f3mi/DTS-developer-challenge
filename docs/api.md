# Task Management System API Documentation

This document outlines the REST API endpoints available in the Task Management System.

## Base URL

All API endpoints are relative to: `http://localhost:3000/api/`

## Authentication

Most endpoints require authentication. Include the JWT token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

API errors follow this format:

```json
{
  "error": "Error message"
}
```

For validation errors:

```json
{
  "errors": [
    {
      "field": "Field name",
      "msg": "Error message"
    }
  ]
}
```

## API Endpoints

### Authentication

#### Register User

- **URL**: `/auth/register`
- **Method**: `POST`
- **Authentication**: None
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "name": "Your Name",
    "email": "your.email@example.com",
    "password": "yourpassword"
  }
  ```
- **Response**:
  ```json
  {
    "token": "JWT_TOKEN",
    "user": {
      "id": 1,
      "name": "Your Name",
      "email": "your.email@example.com"
    }
  }
  ```

#### Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Authentication**: None
- **Description**: Login with email and password
- **Request Body**:
  ```json
  {
    "email": "your.email@example.com",
    "password": "yourpassword"
  }
  ```
- **Response**:
  ```json
  {
    "token": "JWT_TOKEN",
    "user": {
      "id": 1,
      "name": "Your Name",
      "email": "your.email@example.com"
    }
  }
  ```

#### Get Current User

- **URL**: `/auth/me`
- **Method**: `GET`
- **Authentication**: Required
- **Description**: Get currently authenticated user's profile
- **Response**:
  ```json
  {
    "user": {
      "id": 1,
      "name": "Your Name",
      "email": "your.email@example.com"
    }
  }
  ```

### Tasks

#### Get All Tasks

- **URL**: `/tasks`
- **Method**: `GET`
- **Authentication**: Required
- **Description**: Get all tasks for the authenticated user
- **Response**:
  ```json
  {
    "tasks": [
      {
        "id": 1,
        "title": "Task Title",
        "description": "Task Description",
        "status": "pending",
        "dueDate": "2023-10-15T10:00:00.000Z",
        "createdAt": "2023-10-01T10:00:00.000Z",
        "updatedAt": "2023-10-01T10:00:00.000Z",
        "userId": 1
      }
    ]
  }
  ```

#### Get Task by ID

- **URL**: `/tasks/:id`
- **Method**: `GET`
- **Authentication**: Required
- **Description**: Get a single task by ID
- **URL Parameters**: `id=[integer]` - Task ID
- **Response**:
  ```json
  {
    "task": {
      "id": 1,
      "title": "Task Title",
      "description": "Task Description",
      "status": "pending",
      "dueDate": "2023-10-15T10:00:00.000Z",
      "createdAt": "2023-10-01T10:00:00.000Z",
      "updatedAt": "2023-10-01T10:00:00.000Z",
      "userId": 1
    }
  }
  ```

#### Create Task

- **URL**: `/tasks`
- **Method**: `POST`
- **Authentication**: Required
- **Description**: Create a new task
- **Request Body**:
  ```json
  {
    "title": "Task Title",
    "description": "Task Description", // Optional
    "status": "pending", // "pending", "in-progress", or "completed"
    "dueDate": "2023-10-15T10:00:00.000Z"
  }
  ```
- **Response**:
  ```json
  {
    "task": {
      "id": 1,
      "title": "Task Title",
      "description": "Task Description",
      "status": "pending",
      "dueDate": "2023-10-15T10:00:00.000Z",
      "createdAt": "2023-10-01T10:00:00.000Z",
      "updatedAt": "2023-10-01T10:00:00.000Z",
      "userId": 1
    }
  }
  ```

#### Update Task

- **URL**: `/tasks/:id`
- **Method**: `PUT`
- **Authentication**: Required
- **Description**: Update an existing task
- **URL Parameters**: `id=[integer]` - Task ID
- **Request Body**: Any of the following fields (all optional)
  ```json
  {
    "title": "Updated Task Title",
    "description": "Updated Task Description",
    "status": "in-progress",
    "dueDate": "2023-10-16T10:00:00.000Z"
  }
  ```
- **Response**:
  ```json
  {
    "task": {
      "id": 1,
      "title": "Updated Task Title",
      "description": "Updated Task Description",
      "status": "in-progress",
      "dueDate": "2023-10-16T10:00:00.000Z",
      "createdAt": "2023-10-01T10:00:00.000Z",
      "updatedAt": "2023-10-02T10:00:00.000Z",
      "userId": 1
    }
  }
  ```

#### Delete Task

- **URL**: `/tasks/:id`
- **Method**: `DELETE`
- **Authentication**: Required
- **Description**: Delete a task
- **URL Parameters**: `id=[integer]` - Task ID
- **Response**:
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```

## Validation Rules

### Task Creation & Update

- **title**: Required, string, minimum 3 characters, maximum 100 characters
- **description**: Optional, string, maximum 500 characters
- **status**: Required, must be one of: "pending", "in-progress", "completed"
- **dueDate**: Required, must be a valid date in ISO format 