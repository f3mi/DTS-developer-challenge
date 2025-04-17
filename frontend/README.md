# HMCTS Task Management System - Frontend

This is the frontend application for the HMCTS Task Management System, built with Vue.js 3, Pinia for state management, and a custom CSS theming system with light/dark mode support.

## ✨ Features

- **Task Management:**
  - Create, view, update, and delete tasks
  - Update task status dynamically
  - Filter tasks by status, date range, and search term
  - View task details and edit task information

- **Dashboard:**
  - Overview of task metrics
  - Task completion rates
  - Due date distributions
  - Interactive charts and reports

- **Calendar View:**
  - Visual display of tasks by date
  - Task management directly from calendar interface
  - Month navigation and date selection

- **Reports:**
  - Task analytics with Chart.js visualizations
  - Progress tracking and trend analysis
  - Exportable task statistics

- **User Experience:**
  - Responsive design for all devices
  - Dark/light theme with system preference detection
  - Toast notification system
  - Idle timer for automatic logout after 60 seconds of inactivity

## 🛠️ Technologies Used

- **Vue.js 3** - Frontend framework with Composition API
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Chart.js** - Data visualization
- **CSS** - Custom theming system with CSS variables

## 🏗️ Project Structure

```
frontend/
├── public/             # Static files
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable UI components
│   │   ├── AppHeader.vue
│   │   ├── Sidebar.vue
│   │   ├── TaskCard.vue
│   │   └── NotificationToast.vue
│   ├── views/          # Page components
│   │   ├── Dashboard.vue
│   │   ├── Tasks.vue
│   │   ├── TaskDetails.vue
│   │   ├── Calendar.vue
│   │   ├── Reports.vue
│   │   ├── Login.vue
│   │   └── Register.vue
│   ├── stores/         # Pinia stores
│   │   ├── auth.ts     # Authentication state
│   │   ├── tasks.ts    # Task management
│   │   ├── theme.ts    # Theme management
│   │   └── notification.ts # Toast notifications
│   ├── router/         # Vue Router configuration
│   ├── utils/          # Utility functions
│   │   └── idleTimer.ts # User activity tracking
│   ├── App.vue         # Root component
│   └── main.js         # Application entry point
├── .env.example        # Environment variables template
└── vite.config.js      # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Backend API running (default: http://localhost:3000)

### Installation

```bash
# Clone the repository
git clone https://github.com/hmcts/dts-developer-challenge.git

# Navigate to frontend directory
cd dts-developer-challenge/frontend

# Install dependencies
npm install

# Copy environment file and configure if needed
cp .env.example .env
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

```bash
# Build optimized version
npm run build
```

The built files will be in the `dist/` directory.

### Linting

```bash
# Run ESLint
npm run lint
```

## 📚 Core Features

### Authentication System

The application includes a complete authentication system:
- User registration
- Login with email/password
- JWT token management
- Automatic session timeout
- Secure route protection

### Task Management

Tasks are managed through a Pinia store (`src/stores/tasks.ts`):
- `fetchTasks()` - Get all tasks with optional filtering
- `getTaskById(id)` - Get a specific task
- `createTask(task)` - Create a new task
- `updateTask(id, updates)` - Update a task
- `deleteTask(id)` - Delete a task

### Theming System

The application supports light and dark themes:
- Theme toggle in the sidebar
- System preference detection
- Theme persistence in local storage
- CSS variables for consistent theming
- Smooth transitions between themes

### Idle Timer

For security, the application includes an idle timer:
- Automatically logs out users after 60 seconds of inactivity
- Displays a warning 15 seconds before logout
- Tracks user interactions (mouse, keyboard)
- Provides option to continue session
- Configurable timeout duration

### Toast Notifications

A custom notification system provides feedback:
- Success notifications for completed actions
- Error notifications with details
- Warning and information notifications
- Auto-dismissing after 3 seconds
- Manual dismiss option

## 📱 Responsive Design

The application is fully responsive:
- Desktop-optimized layout
- Tablet-friendly interface
- Mobile-responsive design
- Collapsible sidebar on small screens
- Touch-friendly controls

## 🧪 Testing

```bash
# Run unit tests
npm run test:unit

# Run end-to-end tests
npm run test:e2e
```

## 🤝 Contributing

See the main repository README for contribution guidelines.

## 📝 License

This project is licensed under the MIT License - see the main repository LICENSE file for details.

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
