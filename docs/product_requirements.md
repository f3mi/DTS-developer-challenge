# Task Management System - Product Requirements Document

## 1. Introduction

### 1.1 Purpose
This document outlines the requirements for the Task Management System designed for HMCTS caseworkers to efficiently manage their daily tasks. It serves as the definitive source of requirements for development teams, stakeholders, and product managers.

### 1.2 Scope
The Task Management System will provide a comprehensive solution for caseworkers to create, view, update, and delete tasks. It includes user authentication, task management features, dashboards with metrics, and reporting capabilities.

### 1.3 Definitions
- **Task**: A discrete unit of work that needs to be completed by a caseworker
- **User**: HMCTS caseworker who will use the system
- **Dashboard**: Visual overview of tasks and metrics
- **Status**: Current state of a task (e.g., Not Started, In Progress, Completed)

## 2. Product Overview

### 2.1 Product Perspective
The Task Management System is a standalone application but may integrate with other HMCTS systems in the future. It consists of a web-based frontend interface and a backend API with database storage.

### 2.2 User Classes and Characteristics
- **Caseworkers**: Primary users who manage daily tasks
- **Supervisors**: May have additional permissions to view team tasks and metrics
- **System Administrators**: Manage user accounts and system settings

### 2.3 Operating Environment
- Web-based application accessible via modern browsers
- Responsive design for desktop, tablet, and mobile devices
- Compatible with standard operating systems (Windows, macOS, Linux)

### 2.4 Design and Implementation Constraints
- Must comply with HMCTS security standards
- Must be accessible according to WCAG 2.1 AA standards
- Must support high availability and resilience

## 3. Functional Requirements

### 3.1 User Authentication
- **REQ-1.1**: Users must register with name, email, and password
- **REQ-1.2**: Users must log in with email and password
- **REQ-1.3**: System must implement JWT-based authentication
- **REQ-1.4**: Sessions must expire after 24 hours of inactivity
- **REQ-1.5**: System must log out inactive users after 60 seconds

### 3.2 Task Management
- **REQ-2.1**: Users must be able to create tasks with title, description, status, and due date/time
- **REQ-2.2**: Users must be able to view a list of all their tasks
- **REQ-2.3**: Users must be able to view task details
- **REQ-2.4**: Users must be able to update task properties
- **REQ-2.5**: Users must be able to delete tasks
- **REQ-2.6**: System must validate all task inputs
- **REQ-2.7**: System must provide confirmation for critical actions (e.g., deletion)

### 3.3 Task Filtering and Search
- **REQ-3.1**: Users must be able to filter tasks by status
- **REQ-3.2**: Users must be able to filter tasks by due date range
- **REQ-3.3**: Users must be able to search tasks by title and description
- **REQ-3.4**: System must provide sort options for task lists

### 3.4 Dashboard and Reporting
- **REQ-4.1**: System must provide a dashboard showing task metrics
- **REQ-4.2**: Dashboard must display tasks by status (visual chart)
- **REQ-4.3**: Dashboard must display tasks by due date (calendar view)
- **REQ-4.4**: Dashboard must update in real-time when task data changes

### 3.5 User Interface
- **REQ-5.1**: System must implement responsive design for all device sizes
- **REQ-5.2**: System must provide both light and dark themes
- **REQ-5.3**: System must detect and apply user's system theme preference
- **REQ-5.4**: System must provide visual feedback for all user actions
- **REQ-5.5**: System must implement toast notifications for important events

## 4. Non-functional Requirements

### 4.1 Performance
- **REQ-6.1**: System must load initial page within 2 seconds
- **REQ-6.2**: System must respond to user interactions within 500ms
- **REQ-6.3**: API endpoints must respond within 1 second
- **REQ-6.4**: System must support at least 100 concurrent users

### 4.2 Security
- **REQ-7.1**: All passwords must be hashed using bcrypt
- **REQ-7.2**: All API endpoints must validate input to prevent injection attacks
- **REQ-7.3**: System must implement CORS protection
- **REQ-7.4**: System must sanitize all user inputs
- **REQ-7.5**: Protected routes must require valid authentication

### 4.3 Reliability
- **REQ-8.1**: System must have 99.9% uptime
- **REQ-8.2**: System must implement error handling for all operations
- **REQ-8.3**: System must provide appropriate error messages to users
- **REQ-8.4**: System must log errors for troubleshooting

### 4.4 Maintainability
- **REQ-9.1**: Code must follow consistent style guidelines
- **REQ-9.2**: System must have comprehensive test coverage
- **REQ-9.3**: System must implement structured error logging
- **REQ-9.4**: Documentation must be provided for all API endpoints

### 4.5 Usability
- **REQ-10.1**: UI must follow consistent design patterns
- **REQ-10.2**: System must be accessible according to WCAG 2.1 AA standards
- **REQ-10.3**: System must provide clear feedback for user actions
- **REQ-10.4**: System must include help documentation

## 5. Technical Requirements

### 5.1 Frontend
- **REQ-11.1**: Must be developed using Vue.js 3 with Composition API
- **REQ-11.2**: Must use Pinia for state management
- **REQ-11.3**: Must use Vue Router for navigation
- **REQ-11.4**: Must use Axios for API communication
- **REQ-11.5**: Must use Chart.js for data visualization

### 5.2 Backend
- **REQ-12.1**: Must be developed using Node.js and Express.js
- **REQ-12.2**: Must use PostgreSQL for data storage
- **REQ-12.3**: Must use Sequelize ORM for database operations
- **REQ-12.4**: Must implement RESTful API endpoints
- **REQ-12.5**: Must use JWT for authentication

### 5.3 DevOps
- **REQ-13.1**: Must include CI/CD pipeline configuration
- **REQ-13.2**: Must include database migration scripts
- **REQ-13.3**: Must include seed data for testing and demos
- **REQ-13.4**: Must include comprehensive documentation for deployment

## 6. Future Enhancements

### 6.1 Potential Future Features
- Task prioritization system
- Team collaboration and task assignment
- Email/push notifications for task deadlines
- Advanced reporting and analytics
- Integration with other HMCTS systems
- Mobile application

## 7. Appendices

### 7.1 User Personas
- **Persona 1**: Junior Caseworker (limited experience, needs intuitive interface)
- **Persona 2**: Senior Caseworker (experienced, needs efficiency and advanced features)
- **Persona 3**: Team Supervisor (needs oversight of team tasks and workload)

### 7.2 User Stories
1. As a caseworker, I want to create tasks quickly so that I can efficiently manage my workload
2. As a caseworker, I want to see tasks organized by due date so that I can prioritize my work
3. As a caseworker, I want to filter tasks by status so that I can focus on specific work categories
4. As a supervisor, I want to view team metrics so that I can monitor workload distribution
5. As a caseworker, I want to search for specific tasks so that I can quickly find relevant information

### 7.3 Wireframes

#### Dashboard View
```
+-------------------------------------------------------+
|  LOGO      Dashboard | Tasks | Calendar | Profile  [🔍] |
+-------------------------------------------------------+
|                                                       |
|  TASK SUMMARY                    TASKS BY STATUS      |
|  +---------------+               +---------------+    |
|  | Total: 24     |               |    PIE CHART  |    |
|  | Completed: 12 |               |               |    |
|  | Overdue: 3    |               |               |    |
|  +---------------+               +---------------+    |
|                                                       |
|  UPCOMING DEADLINES                                   |
|  +---------------------------------------------------+|
|  | TASK TITLE           | STATUS      | DUE DATE    ||
|  |---------------------|-------------|-------------||
|  | Case review #1234   | In Progress | Today, 5PM  ||
|  | Submit court forms  | Not Started | Tomorrow    ||
|  | Client meeting prep | In Progress | In 2 days   ||
|  +---------------------------------------------------+|
|                                                       |
|  TASKS BY DUE DATE                                    |
|  +---------------------------------------------------+|
|  |                  CALENDAR VIEW                    ||
|  |                                                   ||
|  |  [Shows tasks distributed across calendar days]   ||
|  |                                                   ||
|  +---------------------------------------------------+|
+-------------------------------------------------------+
```

#### Task List View
```
+-------------------------------------------------------+
|  LOGO      Dashboard | Tasks | Calendar | Profile  [🔍] |
+-------------------------------------------------------+
|  + NEW TASK        FILTERS: [Status ▼] [Due Date ▼]   |
|                                                       |
|  +---------------------------------------------------+|
|  | ☐ | TASK TITLE           | STATUS      | DUE DATE ||
|  |---|---------------------|-------------|------------||
|  | ☐ | Case review #1234   | In Progress | Today     ||
|  |---|---------------------|-------------|------------||
|  | ☐ | Submit court forms  | Not Started | Tomorrow  ||
|  |---|---------------------|-------------|------------||
|  | ☐ | Client meeting prep | In Progress | In 2 days ||
|  |---|---------------------|-------------|------------||
|  | ☑ | Update case notes   | Completed   | Yesterday ||
|  +---------------------------------------------------+|
|                                                       |
|  PAGINATION: < 1 2 3 ... >                           |
+-------------------------------------------------------+
```

#### Task Creation/Edit Form
```
+-------------------------------------------------------+
|  LOGO      Dashboard | Tasks | Calendar | Profile      |
+-------------------------------------------------------+
|  CREATE NEW TASK                                      |
|  +---------------------------------------------------+|
|  | Title*:                                           ||
|  | [                                              ]  ||
|  |                                                   ||
|  | Description:                                      ||
|  | [                                              ]  ||
|  | [                                              ]  ||
|  | [                                              ]  ||
|  |                                                   ||
|  | Status*:                  Due Date/Time*:         ||
|  | [Not Started ▼]           [Date Picker][Time  ]   ||
|  |                                                   ||
|  | Priority:                                         ||
|  | [Medium ▼]                                        ||
|  |                                                   ||
|  |                                                   ||
|  |                 [Cancel] [Save Task]              ||
|  +---------------------------------------------------+|
+-------------------------------------------------------+
```

#### Mobile Task List View
```
+----------------------+
| LOGO    [☰] [🔍]     |
+----------------------+
| + NEW TASK           |
|                      |
| FILTERS: [Status ▼]  |
|                      |
| +--------------------+
| | Case review #1234  |
| | In Progress        |
| | Due: Today, 5PM    |
| +--------------------+
|                      |
| +--------------------+
| | Submit court forms |
| | Not Started        |
| | Due: Tomorrow      |
| +--------------------+
|                      |
| +--------------------+
| | Client meeting     |
| | In Progress        |
| | Due: In 2 days     |
| +--------------------+
|                      |
| < 1 2 3 ... >        |
+----------------------+
```

#### Login Screen
```
+----------------------+
|                      |
|        LOGO          |
|                      |
| Task Management      |
|      System          |
|                      |
| +------------------+ |
| | Email:           | |
| | [             ]  | |
| |                  | |
| | Password:        | |
| | [             ]  | |
| +------------------+ |
|                      |
| [     Login      ]   |
|                      |
| [Register Account]   |
|                      |
| [Forgot Password?]   |
|                      |
+----------------------+
```

### 7.4 Data Model

#### Entity Relationship Diagram
```
+---------------+       +-------------------+       +---------------+
|     User      |       |       Task        |       |   TaskStatus  |
+---------------+       +-------------------+       +---------------+
| id (PK)       |       | id (PK)           |       | id (PK)       |
| name          |       | title             |       | name          |
| email         |       | description       |       | description   |
| password_hash |       | status_id (FK)    |<------|               |
| created_at    |       | due_date          |       |               |
| updated_at    |       | user_id (FK)      |<-+    |               |
+---------------+       | priority_id (FK)  |<-|----+---------------+
        |               | created_at        |  |    |   Priority    |
        |               | updated_at        |  |    +---------------+
        +-------------->|                   |  |    | id (PK)       |
                        +-------------------+  |    | name          |
                                               |    | level         |
                        +-------------------+  |    +---------------+
                        |    Activity      |  |
                        +-------------------+  |
                        | id (PK)           |  |
                        | task_id (FK)      |<-+
                        | user_id (FK)      |<-+
                        | action            |  |
                        | created_at        |  |
                        +-------------------+  |
                                               |
                        +-------------------+  |
                        |   Notification    |  |
                        +-------------------+  |
                        | id (PK)           |  |
                        | user_id (FK)      |<-+
                        | task_id (FK)      |<-+
                        | message           |
                        | is_read           |
                        | created_at        |
                        +-------------------+
```

#### Database Schema

**Users Table**
```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Task_Statuses Table**
```
CREATE TABLE task_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    color VARCHAR(20) DEFAULT '#CCCCCC'
);
```

**Priorities Table**
```
CREATE TABLE priorities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    level INTEGER NOT NULL,
    color VARCHAR(20) DEFAULT '#CCCCCC'
);
```

**Tasks Table**
```
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status_id INTEGER REFERENCES task_statuses(id),
    due_date TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    priority_id INTEGER REFERENCES priorities(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Activities Table**
```
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Notifications Table**
```
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Initial Seed Data

**Task Statuses:**
- Not Started
- In Progress
- Under Review
- Completed
- On Hold

**Priorities:**
- Low (level 1)
- Medium (level 2)
- High (level 3)
- Urgent (level 4)

## 8. Diagrammatic Presentation Guidelines

To create professional diagrams for wireframes and data models rather than using text-based representations, the following tools and approaches are recommended:

### 8.1 Wireframing Tools

#### Recommended Software
- **Figma**: Collaborative interface design tool with real-time editing
  - Create interactive prototypes
  - Share design systems
  - Cloud-based with team collaboration features
  - URL: https://www.figma.com/

- **Adobe XD**: UX/UI design and prototyping tool
  - Create interactive prototypes
  - Design system support
  - Integration with Adobe Creative Cloud
  - URL: https://www.adobe.com/products/xd.html

- **Balsamiq**: Low-fidelity wireframing tool
  - Quick sketching capabilities
  - Focus on structure rather than visual design
  - Suitable for early-stage design
  - URL: https://balsamiq.com/

#### Wireframe Export Formats
- PNG/JPG for static images
- PDF for documentation
- Interactive HTML prototypes
- Design specs for developer handoff

### 8.2 Data Modeling Tools

#### Recommended Software
- **Lucidchart**: Cloud-based diagramming tool
  - Specialized ER diagram templates
  - Real-time collaboration
  - Integration with development tools
  - URL: https://www.lucidchart.com/

- **Draw.io (diagrams.net)**: Free diagramming tool
  - Open-source and browser-based
  - Integration with cloud storage platforms
  - Extensive shape libraries for ER diagrams
  - URL: https://www.diagrams.net/

- **Vertabelo**: Database design tool
  - Physical data model creation
  - SQL generation
  - Reverse engineering from existing databases
  - URL: https://www.vertabelo.com/

#### Data Model Export Formats
- PNG/SVG for documentation
- SQL scripts for database implementation
- XML/JSON for tool interoperability
- PDF for comprehensive documentation

### 8.3 Implementation Guidelines

1. **Wireframe Implementation**
   - Create high-fidelity mockups for key screens identified in section 7.3
   - Develop interactive prototypes for main user flows
   - Export assets in formats suitable for development handoff
   - Store wireframe files in the `/docs/wireframes/` directory

2. **Data Model Implementation**
   - Create formal ER diagrams based on the model in section 7.4
   - Generate SQL scripts from the diagram tools
   - Document relationships with cardinality and constraints
   - Store data model files in the `/docs/data-models/` directory

3. **Naming Conventions**
   - Wireframe files: `tms-wireframe-[screen-name]-[version].ext`
   - Data model files: `tms-data-model-[version].ext`
   - SQL scripts: `tms-schema-[version].sql`

4. **Version Control**
   - Maintain design history with versioned files
   - Document major changes between versions
   - Align diagram versions with software releases

## 9. Actual Implementation Details

This section describes what has actually been implemented in the current version of the Task Management System.

### 9.1 Implemented Features

#### User Authentication
- User registration with name, email, and password
- User login with email and password
- JWT-based authentication
- Session timeout

#### Task Management
- Create tasks with title, description, status, and due date
- View list of all tasks
- Update task status
- Delete tasks
- Basic input validation

#### User Interface
- Dashboard with task statistics
- Task list view with basic filtering
- Simple responsive design

### 9.2 Implemented Data Model

#### Users Table
```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Task_Statuses Table
```
CREATE TABLE task_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20) DEFAULT '#CCCCCC'
);
```

#### Tasks Table
```
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status_id INTEGER REFERENCES task_statuses(id),
    due_date TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 9.3 Technical Implementation

#### Frontend
- Vue.js 3 with Composition API
- Basic state management
- Vue Router for navigation
- Axios for API communication

#### Backend
- Node.js with Express.js
- PostgreSQL database
- Sequelize ORM
- JWT for authentication
- RESTful API endpoints

### 9.4 Future Development

The features described in earlier sections of this document represent the complete vision for the system. The current implementation includes the core functionality, with additional features planned for future releases. 