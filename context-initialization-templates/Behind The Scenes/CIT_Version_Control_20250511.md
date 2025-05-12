# CIT_Version_Control_20250511

## Project Information

```
Project: Version Control (VC)
Current Version: v1.1
Date: 20250511
Goal: Standardize naming and version control across all projects
```

## File Naming Conventions

### Context Initialization Templates
All Context Initialization Templates (CITs) will follow this naming convention:
- Format: "CIT_ProjectName_YYYYMMDD.md"
- Examples:
  - `CIT_VC_20250511.md`
  - `CIT_SailPlan_20250511.md`
  - `CIT_GARDEN_20250410.md`

CITs should not include version numbers as they represent the current state of context as of a specific date.

### Project Files (Version-Controlled Documents)
All project files will follow this naming convention:
- Format: "ProjectName_Description with spaces_vX.Y_YYYYMMDD.md"
- Examples:
  - `SailPlan_Project Guide_v1.0_20250426.md`
  - `GARDEN_Technical Specification_v1.2_20250405.md`
  - `Actions_QuickRef_Concise_v1.3_20250510.md`

Version numbering:
- X.0 (like v1.0, v2.0): Complete releases or major revisions
- X.Y (like v1.1, v1.2): Interim updates or minor revisions

### Non-Project Files (General Documents)
All general documents will follow this naming convention:
- Format: "YYYYMMDD_Description with spaces.md"
- Examples:
  - `20250426_Meeting Notes.md`
  - `20250405_Quick Reference Guide.md`
  - `20250410_Project Ideas.md`

### Source-Based Documents
For documents from external sources:
- Format: "YYYYMMDD_Source_DocumentType_Description.md"
- Examples:
  - `20250426_Vendor_Invoice_Project Materials.md`
  - `20250405_Client_Feedback_Initial Prototype.md`
  - `20250410_Partner_Agreement_Phase Two.md`

## File Format Standards

### Default to Markdown
- Use markdown (.md) as the default format for all documentation
- Prefer markdown over .txt for better readability and formatting
- Use proper markdown features (headers, lists, code blocks, tables) to improve document structure
- Only use other formats (docx, xlsx, pdf) when specific features are required that markdown cannot provide

### Markdown Best Practices
- Use headers to create clear document structure (# for title, ## for sections, etc.)
- Use code blocks (```) for code, command examples, and terminal output
- Use tables for structured data comparisons
- Use lists for sequential steps or related items
- Use blockquotes (>) for important notes or callouts
- Include a table of contents for longer documents

## Document & Print Standards

### Digital Documents
- Use responsive design that adapts to different screen sizes
- Minimum font size of 16px for body text on screens
- Maintain proper line length (50-75 characters per line)
- Use semantic structure (headings, lists, emphasis)

### Printed Materials
- **Quick Reference Cards**: Use 4x6 index cards (landscape orientation)
- **Standard Documents**: Use 8.5x11 letter size with 1" margins
- Minimum 12pt font size for printed body text
- Maintain minimum 4.5:1 contrast ratio for all text
- Use sans-serif fonts for better readability

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
- v1.1 (20250511): Added document and print standards with 4x6 index card specifications
- v1.0 (20250426): Updated naming conventions for CITs and project files
- v0.2 (20250401): Initial creation
```

## Collaboration Instructions
- All contributors will follow these naming conventions for all artifacts
- If multiple artifacts are created in one session, they will maintain consistent naming
- Version numbers will increment appropriately across conversations
- Create a new version rather than overwriting existing content
- Context Initialization Templates (CITs) should be updated with new dates rather than versions
- Always use markdown for documentation unless specific features require another format

## Update History
- 20250511: Added document and print standards with 4x6 index card specifications
- 20250426: Updated naming convention for CITs to remove version numbers
- 20250401: Initial version of the template