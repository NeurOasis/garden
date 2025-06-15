# CIT_VersionControl.md

## Document Info
**Current Version:** v1.0.0  
**Last Updated:** June 15, 2025  
**Status:** Active  
**Scope:** File naming conventions, versioning methodology, and version tracking for all GARDEN content  

## 🧠 Core Principle: MECE Structure

**MECE (Mutually Exclusive, Collectively Exhaustive)** is fundamental to GARDEN organization:

- **CITs are independent:** No dependencies between CIT files - each stands alone
- **Projects don't overlap:** Clear boundaries between all projects
- **Tools don't overlap:** Each tool has distinct purpose and scope
- **Clear boundaries everywhere:** If overlap exists, restructure or combine

*If content needs to reference another area, either combine the documents or clearly separate the domains.*

## 📁 File Naming Conventions

### **CIT Files**
**Format:** `CIT_ProjectName.md`
**Examples:** 
- `CIT_VersionControl.md`
- `CIT_GARDEN.md` 
- `CIT_NodePadDevelopment.md`

### **Project Files**
**Format:** `ProjectName_Description.md`
**Examples:**
- `SailPlan_ProjectGuide.md`
- `GARDEN_TechnicalSpecification.md`
- `Actions_QuickReference.md`

### **Naming Guidelines for Claude Artifacts**
When saving artifacts to local storage:
- **Follow the naming convention** - don't let Claude create random filenames
- **Use descriptive but concise names** - avoid overly long descriptions
- **Match the content type** - CIT_ for contexts, ProjectName_ for project documents
- **Be consistent** - same project should use same ProjectName prefix

## 📊 Version Tracking System

### **Header Format (Required)**
```markdown
## Document Info
**Current Version:** v1.2.0  
**Last Updated:** [Date]  
**Status:** [Active/Draft/Archived]  
**Scope:** [What this document covers]  
```

### **Footer Format (Required)**
```markdown
---

## Version History

### v1.2.0 - [Date]
- **Changed:** [What was modified]
- **Added:** [What was new]
- **Removed:** [What was deleted]
- **Fixed:** [What was corrected]
- **Impact:** [How this affects users/workflow]

### v1.1.0 - [Date]
[Previous version details...]
```

## 🔢 Version Numbering Rules

**Semantic Versioning:** `vMAJOR.MINOR.PATCH`

- **MAJOR (X.0.0):** Fundamental changes to methodology, scope, or breaking changes
- **MINOR (X.Y.0):** New sections, significant additions, or important refinements  
- **PATCH (X.Y.Z):** Small fixes, clarifications, or minor updates

**Version History Detail Level:**
- Track what feels significant at the time
- Major changes get detailed explanations
- Minor fixes can be brief
- Archive old patch details after major releases if desired

## 📂 Document & File Standards

**Default Format:** Markdown (.md) for all documentation
**Exceptions:** Only when specific features require other formats

**Digital Requirements:**
- Responsive design for all screen sizes
- 16px minimum font size for accessibility
- Semantic structure with proper headings

**Print Requirements (when applicable):**
- 4x6 index cards (landscape orientation)
- 12pt minimum font size
- ADA compliant contrast ratios

## 🗂️ Archive Strategy

**Main Repository:** Contains only current/active versions
**Archive Repository:** `garden-archive` - Contains superseded versions

**Archive Structure:**
```
garden-archive/
├── CIT_Name/
│   ├── v1.0.0_20250526.md
│   ├── v1.1.0_20250530.md
│   └── README.md (why archived, when superseded)
└── ProjectName/
    ├── v1.0.0_20250401.md
    └── README.md
```

**Migration Process:**
1. Update files gradually as we work on them
2. When updating: rename file → update header → add version history  
3. Move old version to archive repository with documentation
4. Update any references to use new filename

## ✅ Status Definitions

**Active:** Currently used and referenced in development/operations
- Content is current and accurate
- Being actively maintained and updated
- Safe to reference and follow guidance

**Draft:** Being developed but not yet ready for operational use
- Content may be incomplete or experimental
- Under active development or review
- Should not be referenced for operational decisions

**Archived:** No longer current but preserved for historical reference
- Superseded by newer approaches or no longer relevant
- Moved to separate Archive repository
- Maintained for context but not actively used

## 🎯 Implementation Guidelines

**When Creating New Documents:**
- Choose appropriate naming convention (CIT_ vs ProjectName_)
- Include proper header with version info
- Ensure MECE compliance (no dependencies on other documents)
- Start with v1.0.0 for first complete version

**When Updating Existing Documents:**
- Increment version number appropriately
- Update header with new version and date
- Add detailed version history entry
- Consider if scope or dependencies have changed

**When Archiving Documents:**
- Move to archive repository with clear documentation
- Update any references in active documents
- Ensure replacement or successor is clearly identified

---

## Version History

### v1.0.0 - June 15, 2025
- **Created:** Initial version control methodology with MECE principle
- **Added:** File naming conventions without date-based filenames
- **Added:** Header/footer version tracking with semantic versioning
- **Added:** Archive strategy and status definitions
- **Scope:** Complete version management framework for GARDEN ecosystem
- **Impact:** Establishes systematic version control eliminating reference errors

---

*This document follows MECE principle - it stands alone and covers version control completely without dependencies on other CITs.*
