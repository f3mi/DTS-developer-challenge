# Dashboard Wireframe - Task Management System

This wireframe demonstrates the dashboard layout for the Task Management System using Mermaid diagram syntax.

## Dashboard Layout

```mermaid
graph TD
    subgraph Dashboard
        subgraph Header
            Logo["LOGO"] --- NavBar
            NavBar["Dashboard | Tasks | Logout"] --- UserName["User: [Name]"]
        end
        
        subgraph MainContent
            subgraph TopRow
                TaskSummary["Task Summary<br/>• Total: 12<br/>• Completed: 4<br/>• In Progress: 5<br/>• Not Started: 3"]
            end
            
            subgraph MiddleRow
                TasksByStatus["Tasks by Status<br/>[PIE CHART]"]
            end
            
            subgraph BottomRow
                AllTasks["All Tasks<br/>Table with:<br/>• Task Title<br/>• Status<br/>• Due Date<br/>• Actions"]
            end
        end
        
        subgraph ActionButtons
            CreateTaskBtn["+ Create New Task"]
        end
    end
```

## Interactive Elements

```mermaid
flowchart TD
    A[Dashboard Load] --> B{User Action}
    B -->|Click Task| C[Open Task Details]
    B -->|Create Task| D[Open Task Form]
    B -->|Delete Task| E[Confirm Delete]
    B -->|Update Status| F[Save New Status]
    C --> G[Edit Task]
    G -->|Save| H[Update Dashboard]
```

## Mobile View Adaptation

```mermaid
flowchart TD
    subgraph MobileHeader
        Logo["LOGO"] --- UserInfo["User: [Name]"]
    end
    
    subgraph MobileNav
        DashboardLink["Dashboard"] --- TasksLink["Tasks"] --- LogoutLink["Logout"]
    end
    
    subgraph MobileContent
        Summary["Task Summary"] --> StatusChart["Status Chart"] --> TaskList["Task List"]
    end
    
    subgraph MobileActions
        CreateTask["+ New Task"]
    end
```

## Notes for Implementation

1. The dashboard should load with task summary statistics at the top
2. Status chart should use consistent colors for each status type
3. Task list should support basic sorting by column
4. All interactive elements should have hover states for desktop
5. Mobile view should stack elements vertically for better readability 