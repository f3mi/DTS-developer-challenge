# Task Management System Diagrams

This directory contains wireframes and data models for the Task Management System project, created using Mermaid diagram syntax.

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

## Converting to Professional Diagrams

To convert these Mermaid diagrams to high-fidelity mockups and professional diagrams:

1. Use the tools recommended in section 8 of the Product Requirements Document
2. Export the diagrams from Mermaid Live Editor as a starting point
3. Import into Figma, Adobe XD, or other design tools
4. Enhance with proper styling, colors, and interactive elements
5. Save the resulting files in the appropriate directories following naming conventions

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