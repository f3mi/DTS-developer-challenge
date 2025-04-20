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
        string color
    }
    
    TASK {
        int id PK
        string title
        string description
        int status_id FK
        datetime due_date
        int user_id FK
        datetime created_at
        datetime updated_at
    }
    
    USER ||--o{ TASK : "creates"
    TASK_STATUS ||--o{ TASK : "classifies"
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
        +string color
    }
    
    class Task {
        +int id
        +string title
        +string description
        +int status_id
        +datetime due_date
        +int user_id
        +datetime created_at
        +datetime updated_at
        +getByUser()
        +updateStatus()
        +markComplete()
    }
    
    User "1" --> "*" Task
    TaskStatus "1" --> "*" Task
```

## Physical Data Model Relationships

```mermaid
graph LR
    subgraph Tables
        Users[(Users)]
        TaskStatuses[(Task Statuses)]
        Tasks[(Tasks)]
    end
    
    Users -->|PK: id| Tasks
    TaskStatuses -->|PK: id| Tasks
```

## Database Seeding Sequence

```mermaid
flowchart TD
    A[Start DB Setup] --> B[Create Tables]
    B --> C[Seed TaskStatuses]
    C --> E[Seed Users]
    E --> F[Seed Tasks]
```

## Implementation Notes

1. All foreign key relationships should include `ON DELETE CASCADE` where appropriate
2. Indexes should be created on frequently queried columns: task.user_id, task.status_id, task.due_date 
3. The TaskStatus table should be seeded with initial values during deployment
4. Consider adding a unique constraint on the User.email field to prevent duplicate accounts

## Initial Seed Data

**Task Statuses:**
- Not Started
- In Progress
- Completed 