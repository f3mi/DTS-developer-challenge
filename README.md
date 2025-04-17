# DTS Developer Challenge – Task Management System

A full-stack application for managing caseworker tasks, developed as part of the HMCTS DTS Developer Technical Test. This system allows users to create, view, update, and delete tasks, with a simple and user-friendly interface.

## 🔍 Project Overview

Caseworkers at HMCTS require a system to manage their daily tasks efficiently. This project includes:

- A backend API to perform full CRUD operations.
- A frontend interface for interacting with tasks.
- Validation, error handling, unit tests, and database integration.
- User authentication and session management.
- Interactive dashboard with real-time task metrics.

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT for authentication
- Jest (for unit testing)

### Frontend
- Vue.js 3
- Pinia (state management)
- Vue Router
- Axios
- Chart.js for data visualization
- CSS with custom theming system (light/dark mode)

---

## 📦 Features

### Backend API
- ✅ Create a task (with title, optional description, status, and due date/time)
- 📄 Retrieve all tasks or by ID
- 🔁 Update task status and details
- ❌ Delete a task
- 🔐 User authentication with JWT
- ⚠️ Input validation and structured error handling
- 🧪 Unit tests for API endpoints
- 🔒 Protected routes with middleware

### Frontend Application
- 📝 Create, view, update, and delete tasks
- 🎯 Update task status dynamically
- 📊 Dashboard with task metrics and reports
- 📆 Calendar view for task management
- 🔄 Task filtering and search capabilities
- 🌗 Dark/light theme support with system preference detection
- 🔔 Toast notification system
- 📱 Responsive design for all devices
- ⏱️ Idle timer for automatic logout after inactivity
- 📈 Chart visualization for task statistics
- 🔍 Advanced search and filtering options

---

## 📚 Documentation

For more detailed information, please refer to the documentation:

- [API Documentation](docs/api.md) - Complete REST API endpoints reference
- [Frontend Documentation](docs/frontend.md) - Frontend architecture and components
- [Backend Documentation](docs/backend.md) - Backend architecture and database schema
- [Deployment Guide](docs/deployment.md) - Instructions for deploying the application

---

## 🧪 Running the Application

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL (v12 or higher)
- Git

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Edit database credentials accordingly
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all  # Optional: adds sample data
npm run dev  # Starts the server on localhost:3000 
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env  # Set API URL if different from default
npm run dev  # Starts the frontend on localhost:5173
```

### Running Tests
```bash
cd backend
npm run test
```

---

## 🔒 Authentication

The system uses JWT-based authentication:

- Register with a name, email, and password
- Login with email and password
- Automatic session expiry after 24 hours
- Idle timer to automatically log out inactive users after 60 seconds
- Password hashing for secure storage
- Protected routes requiring valid authentication

---

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

The layout automatically adapts to different screen sizes, ensuring a consistent user experience across all devices.

---

## 🎨 Theming System

The application includes a comprehensive theming system:
- Light and dark mode support
- System preference detection
- User preference persistence
- Seamless theme switching without page reload
- Consistent color scheme across all components

---

## 🧑‍💻 Development Workflow

1. Clone the repository: `git clone https://github.com/f3mi/DTS-developer-challenge.git`
2. Set up the backend and frontend as described above
3. Start both servers for development
4. Make changes to the codebase
5. Run tests to ensure functionality
6. Commit changes following the conventional commit format

---

## 🔄 Security Features

The application includes several security features:
- JWT-based authentication
- Password hashing with bcrypt
- Automatic session timeout
- Input validation to prevent injection attacks
- CORS configuration
- Secured API endpoints
- Input sanitization

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and commit (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgements

- HMCTS Digital & Technology Services
- The Vue.js team
- The Node.js community
- All open-source contributors

---

## 📊 Project Status

This project was developed as part of a technical test and is currently maintained for demonstration purposes.



