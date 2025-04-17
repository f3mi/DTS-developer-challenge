# DTS Developer Challenge – Task Management System

A full-stack application for managing caseworker tasks, developed as part of the HMCTS DTS Developer Technical Test. This system allows users to create, view, update, and delete tasks, with a simple and user-friendly interface.

## 🔍 Project Overview

Caseworkers at HMCTS require a system to manage their daily tasks efficiently. This project includes:

- A backend API to perform full CRUD operations.
- A frontend interface for interacting with tasks.
- Validation, error handling, unit tests, and database integration.

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- Jest (for unit testing)

### Frontend
- Vue.js
- Axios
- Bootstrap
- Tailwind

---

## 📦 Features

### Backend API
- ✅ Create a task (with title, optional description, status, and due date/time)
- 📄 Retrieve all tasks or by ID
- 🔁 Update task status
- ❌ Delete a task
- ⚠️ Input validation and structured error handling
- 🧪 Unit tests for API endpoints
- 📘 API documentation via comments or Swagger (if applicable)

### Frontend Application
- 📝 Create, view, update, and delete tasks
- 🎯 Update task status dynamically
- 📋 Clean and user-friendly task list
- 🚫 Error alerts for validation issues

---

## 🧪 Running the Application

### Prerequisites
- Node.js and npm
- PostgreSQL
- Git
- Vue3.js

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Edit database credentials accordingly
npm run migrations
npm run seeders
npm run dev  # Starts the server on localhost:3000 
```


### Frontend Setup

```bash
cd frontend
npm install
npm run dev  # Starts the frontend on localhost:5173
```

### Running Test
```bash
npm run test
```



