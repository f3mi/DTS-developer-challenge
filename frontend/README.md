# HMCTS Task Management System - Frontend

This is the frontend for the HMCTS Task Management System, built with Vue.js 3 and Bootstrap.

## Features

The frontend application allows caseworkers to:

- Create new tasks with title, description, status, and due date
- View all tasks in a user-friendly interface
- Update the status of existing tasks
- Delete tasks when they are no longer needed

## Requirements

The frontend expects a backend API running on `http://localhost:3000/api`. Make sure the backend is running before starting the frontend application.

## Component Structure

- `App.vue` - Main application component that integrates TaskForm and TaskList
- `TaskForm.vue` - Component for creating new tasks
- `TaskList.vue` - Component for displaying and managing existing tasks
- `TaskService.js` - Service for handling API calls to the backend

## Technologies Used

- Vue.js 3 - Frontend framework
- Bootstrap 5 & Tailwind CSS - UI components and styling
- Axios - HTTP client for API requests
- Pinia - State Management


## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## API Integration

The frontend application integrates with the backend API for managing tasks. The integration is handled through the following stores:

### Task Store

The task store (`src/stores/tasks.ts`) provides the following methods for interacting with the API:

- `fetchTasks()` - Fetches all tasks for the authenticated user
- `getTaskById(id)` - Gets a task by ID, first checking the local state and then fetching from API if needed
- `createTask(task)` - Creates a new task
- `updateTask(id, updates)` - Updates an existing task
- `deleteTask(id)` - Deletes a task

All API requests include the authentication token provided by the Auth Store.

### Authentication Integration

Tasks are associated with the authenticated user. When a user logs in, their tasks are fetched and displayed in the application. Task operations (create, update, delete) require authentication.
