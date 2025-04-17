# Frontend Documentation

## Overview

The frontend of the Task Management System is built with Vue.js 3 and follows a component-based architecture. The application provides a responsive and intuitive user interface for managing tasks.

## Tech Stack

- **Vue.js 3**: Frontend framework
- **Vue Router**: Client-side routing
- **Pinia**: State management
- **Axios**: HTTP requests

## Project Structure

```
frontend/
├── public/             # Static files
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable UI components
│   ├── views/          # Page components
│   ├── stores/         # Pinia stores
│   ├── router/         # Vue Router configuration
│   ├── utils/          # Utility functions
│   │   └── idleTimer.ts # User activity tracking
│   ├── App.vue         # Root component
│   └── main.js         # Application entry point
├── .env.example        # Environment variables template
└── vite.config.js      # Vite configuration
```

## Key Components

### App.vue

The root component that initializes the application, including:
- Authentication state management
- Theme handling (light/dark mode)
- Idle timer for user session management
- Toast notifications

### Core Components

| Component | Description |
|-----------|-------------|
| `AppHeader.vue` | Application header with navigation, search, and user profile |
| `Sidebar.vue` | Navigation sidebar with theme toggle |
| `TaskCard.vue` | Displays task information with actions |
| `NotificationToast.vue` | Toast notification system |

### Views

| View | Route | Description |
|------|-------|-------------|
| `Dashboard.vue` | `/` | Overview with task statistics and reports |
| `Tasks.vue` | `/tasks` | Main task management interface |
| `TaskDetails.vue` | `/tasks/:id` | Detailed view of a single task |
| `Calendar.vue` | `/calendar` | Calendar view of tasks |
| `Reports.vue` | `/reports` | Task analytics and reporting |
| `Login.vue` | `/login` | User login |
| `Register.vue` | `/register` | User registration |

## State Management

The application uses Pinia for state management with the following stores:

### Auth Store (`stores/auth.ts`)

Manages user authentication, including:
- Login/Registration
- Token storage and validation
- Current user information

### Task Store (`stores/tasks.ts`)

Manages task data, including:
- Fetching tasks from the API
- Creating, updating, and deleting tasks
- Task filtering and selection

### Theme Store (`stores/theme.ts`)

Manages application theming:
- Light/dark mode selection
- System preference detection
- Theme persistence

### Notification Store (`stores/notification.ts`)

Manages toast notifications:
- Success, error, warning, and info notifications
- Notification timers and dismissal

## Idle Timer System

The application implements an idle timer to enhance security by automatically logging out inactive users:

### Implementation (`utils/idleTimer.ts`)

- **Purpose**: Automatically logs out users after a period of inactivity to protect user data
- **Default Timeout**: 60 seconds of inactivity (configurable)
- **Warning Period**: 15 seconds before logout (configurable)
- **Activity Tracking**: Monitors user interactions (mouse movements, clicks, keystrokes)
- **Reset Behavior**: Timer resets on any user activity
- **Expiry Handling**: Logs out the user and redirects to login page with a timeout reason

### Integration

- The idle timer is initialized in `App.vue` for authenticated users
- It's automatically started when a user logs in
- It's automatically stopped when a user logs out
- A watcher in `App.vue` manages the timer state when authentication changes

### User Experience

- Users receive a warning notification before being logged out
- The warning includes an option to continue the session
- If no action is taken, the user is automatically logged out
- The login page displays a message explaining the timeout reason

### Configuration

The idle timer is configurable with the following options:
- `timeout`: Duration of inactivity before logout (milliseconds)
- `warningTime`: Time before timeout to show warning (milliseconds)
- `onIdle`: Callback function when idle timeout is reached
- `onWarning`: Callback function when warning time is reached
- `idleMessage`: Custom message to display during warning phase

## Theming System

The application supports light and dark themes:

- CSS variables define the color palette
- The `ThemeSwitcher` component toggles between themes
- System preference detection with `prefers-color-scheme` media query
- Theme choice is stored in local storage

## Form Validation

Forms use client-side validation with the following features:
- Required field validation
- Email format validation
- Password strength requirements
- Date validation for task due dates

## Error Handling

- API errors are caught and displayed to the user
- Form validation errors shown inline
- Network connectivity issues detected
- Unauthorized access handling with redirect to login

## Responsiveness

The UI is responsive with:
- Flexible layouts using CSS Grid and Flexbox
- Mobile-first design approach
- Collapsible sidebar for small screens
- Adapted input controls for touch devices

## Accessibility Features

- Semantic HTML structure
- ARIA attributes where necessary
- Keyboard navigation support
- Sufficient color contrast ratios
- Focus management

## Performance Optimizations

- Lazy-loading of routes
- Pagination for large data sets
- Debounced search inputs
- Cached API responses where appropriate 