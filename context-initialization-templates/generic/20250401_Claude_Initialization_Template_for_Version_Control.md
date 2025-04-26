# Context Initialization Template

## Project Information

```
Project: [Project Name]
Current Version: v1.0
Date: YYYYMMDD (today's date)
Goal: [Brief description of project goal]
```

## File Naming Conventions

### Project Files (Version-Controlled Documents)
All project files will follow this naming convention:
- Format: "Description with spaces_vX.Y_YYYYMMDD.extension"
- Examples:
  - `Project Guide_v1.0_20250401.md`
  - `Technical Specification_v1.2_20250405.docx`
  - `Implementation Plan_v2.0_20250415.xlsx`

Version numbering:
- X.0 (like v1.0, v2.0): Complete releases
- X.Y (like v1.1, v1.2): Interim updates

### Non-Project Files (General Documents)
All general documents will follow this naming convention:
- Format: "YYYYMMDD_Description with spaces.extension"
- Examples:
  - `20250401_Meeting Notes.docx`
  - `20250405_Quick Reference Guide.pdf`
  - `20250410_Project Ideas.txt`

### Source-Based Documents
For documents from external sources:
- Format: "YYYYMMDD_Source_DocumentType_Description.extension"
- Examples:
  - `20250401_Vendor_Invoice_Project Materials.pdf`
  - `20250405_Client_Feedback_Initial Prototype.docx`
  - `20250410_Partner_Agreement_Phase Two.pdf`

## Version Retention Policy
- During work on a major version (e.g., v1.0):
  - Retain all interim versions (v0.1, v0.2, etc.)
- After releasing a new major version (e.g., v2.0):
  - Keep the previous major release (v1.0)
  - Delete older interim versions (v0.x series)
  - Begin tracking new interim versions (v2.1, v2.2, etc.)
- After releasing another major version (e.g., v3.0):
  - Keep the previous major release (v2.0)
  - Delete older interim versions (v1.x series)
  - Continue pattern for future versions

This policy balances complete history of recent work, preservation of major milestones, and efficient use of storage space.

## Deliverables Tracking
```
Document Name: [Will follow project naming convention]
Current Status: [Draft/Review/Final]
Next Version Due: [Date]
Change Log:
- v1.0 (YYYYMMDD): Initial creation
```

## Collaboration Instructions
- Claude will follow these naming conventions for all artifacts
- If multiple artifacts are created in one session, they will maintain consistent naming
- Version numbers will increment appropriately across conversations
- Claude will create a new version rather than overwriting existing content

## Example Applied to This Project
```
Current File: Project Initialization Template_v1.0_20250401.md
Purpose: Standardize project interactions and file naming
Next Steps: 
1. Implement template for upcoming project
2. Create Project Guide_v1.0_[date] as first deliverable
3. Maintain version control as project evolves
```