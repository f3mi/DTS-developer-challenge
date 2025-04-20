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
                
                DueDateField["Due Date/Time*
                [Date Picker][Time]"]
            end
            
            subgraph FieldRow2
                PriorityField["Priority
                [Medium ▼]"]
                
                AssigneeField["Assignee
                [Self ▼]"]
            end
            
            subgraph AttachmentSection
                AttachLabel["Attachments (Optional)"]
                UploadBtn["[+ Add File]"]
                FileList["No files attached"]
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
            
            MobileDueTime["Time
            [Time Picker]"]
            
            MobilePriority["Priority
            [Medium ▼]"]
            
            MobileAssignee["Assignee
            [Self ▼]"]
            
            MobileAttach["Attachments
            [+ Add File]"]
        end
        
        subgraph MobileActions
            MobileCancel["Cancel"]
            MobileSave["Save Task"]
        end
    end
```

## Form Interaction States

```mermaid
flowchart TD
    A[Empty Form] --> B{User Action}
    B -->|Fill Required Fields| C[Form Valid]
    B -->|Skip Required Fields| D[Form Invalid]
    B -->|Add Attachment| E[Attachment Added]
    B -->|Cancel| F[Discard Changes]
    
    C -->|Submit| G[Processing]
    D -->|Submit| H[Show Validation Errors]
    H --> B
    G -->|Success| I[Show Success Message]
    G -->|Failure| J[Show Error Message]
    J --> B
    
    subgraph InteractionHints
        K[Required Fields: * indicator]
        L[Form Validation: Real-time feedback]
        M[Error Messages: Below invalid fields]
        N[Success Message: Toast notification]
    end
```

## Implementation Notes

1. All required fields should be clearly marked with an asterisk (*)
2. Form validation should occur in real-time as users complete fields
3. The form should maintain state if submission fails to prevent data loss
4. Consider implementing auto-save functionality for long form entries
5. Mobile view should use full width but maintain the same validation logic
6. Prioritize high-contrast field outlines and clear error messages for accessibility 