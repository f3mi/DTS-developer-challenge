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
