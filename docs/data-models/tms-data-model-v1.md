# Data Model Diagram - Task Management System

This document contains the Entity-Relationship diagrams for the Task Management System database using Mermaid diagram syntax.

## Entity Relationship Diagram

```mermaid
erDiagram
    USER {
        int id PK
        string name
        string email
        string password_hash
        datetime created_at
        datetime updated_at
    }
    
    TASK_STATUS {
        int id PK
        string name
        string description
        string color
    }
    
    PRIORITY {
        int id PK
        string name
        int level
        string color
    }
    
    TASK {
        int id PK
        string title
        string description
        int status_id FK
        datetime due_date
        int user_id FK
        int priority_id FK
        datetime created_at
        datetime updated_at
    }
    
    ACTIVITY {
        int id PK
        int task_id FK
        int user_id FK
        string action
        datetime created_at
    }
    
    NOTIFICATION {
        int id PK
        int user_id FK
        int task_id FK
        string message
        boolean is_read
        datetime created_at
    }
    
    USER ||--o{ TASK : "creates"
    TASK_STATUS ||--o{ TASK : "classifies"
    PRIORITY ||--o{ TASK : "prioritizes"
    TASK ||--o{ ACTIVITY : "generates"
    USER ||--o{ ACTIVITY : "performs"
    TASK ||--o{ NOTIFICATION : "triggers"
    USER ||--o{ NOTIFICATION : "receives"
```

## Database Schema Visualization

```mermaid
classDiagram
    class User {
        +int id
        +string name
        +string email
        +string password_hash
        +datetime created_at
        +datetime updated_at
    }
    
    class TaskStatus {
        +int id
        +string name
        +string description
        +string color
    }
    
    class Priority {
        +int id
        +string name
        +int level
        +string color
    }
    
    class Task {
        +int id
        +string title
        +string description
        +int status_id
        +datetime due_date
        +int user_id
        +int priority_id
        +datetime created_at
        +datetime updated_at
        +getByUser()
        +updateStatus()
        +markComplete()
    }
    
    class Activity {
        +int id
        +int task_id
        +int user_id
        +string action
        +datetime created_at
        +logAction()
    }
    
    class Notification {
        +int id
        +int user_id
        +int task_id
        +string message
        +boolean is_read
        +datetime created_at
        +markAsRead()
    }
    
    User "1" --> "*" Task
    TaskStatus "1" --> "*" Task
    Priority "1" --> "*" Task
    Task "1" --> "*" Activity
    User "1" --> "*" Activity
    Task "1" --> "*" Notification
    User "1" --> "*" Notification
```

## Physical Data Model Relationships

```mermaid
graph LR
    subgraph Tables
        Users[(Users)]
        TaskStatuses[(Task Statuses)]
        Priorities[(Priorities)]
        Tasks[(Tasks)]
        Activities[(Activities)]
        Notifications[(Notifications)]
    end
    
    Users -->|PK: id| Tasks
    Users -->|PK: id| Activities
    Users -->|PK: id| Notifications
    TaskStatuses -->|PK: id| Tasks
    Priorities -->|PK: id| Tasks
    Tasks -->|PK: id| Activities
    Tasks -->|PK: id| Notifications
```

## Database Seeding Sequence

```mermaid
flowchart TD
    A[Start DB Setup] --> B[Create Tables]
    B --> C[Seed TaskStatuses]
    B --> D[Seed Priorities]
    C --> E[Seed Users]
    D --> E
    E --> F[Seed Tasks]
    F --> G[Seed Activities]
    F --> H[Seed Notifications]
```

## Implementation Notes

1. All foreign key relationships should include `ON DELETE CASCADE` where appropriate
2. Indexes should be created on frequently queried columns: task.user_id, task.status_id, task.due_date
3. The TaskStatus and Priority tables should be seeded with initial values during deployment
4. Consider adding a unique constraint on the User.email field to prevent duplicate accounts 