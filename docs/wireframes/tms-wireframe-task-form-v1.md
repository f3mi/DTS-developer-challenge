# Task Form Wireframe - Task Management System

This wireframe demonstrates the task creation and edit form for the Task Management System using Mermaid diagram syntax.

## Task Form Layout

```mermaid
graph TD
    subgraph TaskForm["Task Form"]
        Header["CREATE/EDIT TASK"]
        
        subgraph FormFields
            TitleField["Title*
            [                                              ]"]
            
            DescField["Description
            [                                              ]
            [                                              ]
            [                                              ]"]
            
            subgraph FieldRow1
                StatusField["Status*
                [Not Started ▼]"]
                
                DueDateField["Due Date*
                [Date Picker]"]
            end
        end
        
        subgraph ActionButtons
            CancelBtn["[Cancel]"]
            SaveBtn["[Save Task]"]
        end
    end
```

## Form Validation Flow

```mermaid
stateDiagram-v2
    [*] --> FormDisplay
    FormDisplay --> Validation: User clicks Save
    
    state Validation {
        [*] --> CheckFields
        CheckFields --> Valid: All required fields filled
        CheckFields --> Invalid: Missing required fields
        Invalid --> ShowErrors: Display error messages
        ShowErrors --> CheckFields: User updates fields
        Valid --> [*]: Proceed to save
    }
    
    Validation --> SaveTask: Valid Form
    Validation --> FormDisplay: Invalid Form
    SaveTask --> Success: Task saved
    SaveTask --> Error: Save failed
    Success --> Redirect: Return to Tasks list
    Error --> FormDisplay: Show error message
    Redirect --> [*]
```

## Mobile Adaptation

```mermaid
graph TD
    subgraph MobileTaskForm
        MobileHeader["CREATE/EDIT TASK"]
        
        subgraph MobileFields["Form Fields (Stacked)"]
            MobileTitle["Title*
            [                    ]"]
            
            MobileDesc["Description
            [                    ]
            [                    ]"]
            
            MobileStatus["Status*
            [Not Started ▼]"]
            
            MobileDueDate["Due Date*
            [Date Picker]"]
        end
        
        subgraph MobileActions
            MobileCancel["Cancel"]
            MobileSave["Save Task"]
        end
    end
```

## Implementation Notes

1. All required fields should be clearly marked with an asterisk (*)
2. Form validation should verify that Title and Status are provided
3. Date picker should default to current date
4. Error messages should appear below the invalid fields
5. Mobile view should use the full width of the screen
6. Save button should be disabled until all required fields are completed 