# Task Management System Diagrams

This directory contains wireframes and data models for the Task Management System project, created using Mermaid diagram syntax.

## Diagram Overview

The diagrams in this directory represent the actual implemented features of the Task Management System, including:

1. **Basic Task Management**
   - Task creation with title, description, status, and due date
   - Task listing and filtering
   - Status updates and deletion

2. **User Authentication**
   - Login and registration
   - Session management

3. **Dashboard**
   - Task summary statistics
   - Status distribution visualization

## Viewing the Diagrams

### Option 1: GitHub Rendering
If you're viewing these files on GitHub, the Mermaid diagrams will render automatically in the markdown files.

### Option 2: Mermaid Live Editor
For interactive editing and better visualization:

1. Copy the Mermaid diagram code from any of the `.md` files
2. Visit the [Mermaid Live Editor](https://mermaid.live/)
3. Paste the code into the editor
4. View and modify the diagram as needed
5. Export as SVG, PNG, or other formats

### Option 3: VS Code Extension
For local viewing:

1. Install the "Markdown Preview Mermaid Support" extension in VS Code
2. Open any of the `.md` files containing diagrams
3. Use the "Markdown: Open Preview" command to view the rendered diagrams

## Directory Structure

```
docs/
├── wireframes/               # UI design diagrams
│   ├── tms-wireframe-dashboard-v1.md
│   └── tms-wireframe-task-form-v1.md
│
├── data-models/              # Database design diagrams
│   └── tms-data-model-v1.md
│
└── product_requirements.md   # Main PRD with guidelines
```

## Database Structure

The actual implemented database includes:
- Users table (authentication and user information)
- Tasks table (task details and assignments)
- TaskStatuses table (predefined status options)

The relationships are:
- One user can have many tasks
- Each task has one status

## User Interface Implementation

The implemented UI includes:
- Dashboard with task statistics
- Task list with filtering
- Simple task creation form
- Basic responsive design

## Converting to Professional Diagrams

To convert these Mermaid diagrams to high-fidelity mockups:

1. Use the tools recommended in section 8 of the Product Requirements Document
2. Export the diagrams from Mermaid Live Editor as a starting point
3. Import into Figma, Adobe XD, or other design tools
4. Enhance with proper styling, colors, and interactive elements

## Naming Conventions

- Wireframe files: `tms-wireframe-[screen-name]-[version].[ext]`
- Data model files: `tms-data-model-[version].[ext]`
- Diagram image exports: `tms-[diagram-type]-[name]-[version].[png/svg/pdf]`

## Contributing to Diagrams

When updating or adding new diagrams:

1. Create a new version rather than modifying existing files
2. Document changes between versions
3. Ensure all diagrams follow the design guidelines in the PRD
4. Update this README if new diagram types are added

## Exporting for Documentation

For including in other documentation:

1. Export diagrams as PNG or SVG files
2. Place in a `/docs/images` directory
3. Reference in documentation using relative paths
4. Consider adding a date or version in the filename for tracking 