# GARDEN Bug Tracker Integration

## 🐛 Bug Tracking System

**Purpose**: Track issues, bugs, and feature requests across GARDEN ecosystem

## Bug Report Template

```markdown
## Bug ID: #[AUTO-INCREMENT]
**Date**: [YYYY-MM-DD]
**Reporter**: [User]
**Component**: [Tool/API/Core]
**Priority**: [P0/P1/P2/P3]
**Status**: [Open/In Progress/Fixed/Closed]

### Description
[Clear description of the issue]

### Reproduction Steps
1. [Step 1]
2. [Step 2]
3. [Expected vs Actual]

### Environment
- Tool/API Version: 
- Browser/OS:
- Error Messages:

### Fix Applied
[Description of fix if resolved]
```

## Current Bugs

### Bug #001: GARDEN API CORS/Fetch Error
**Date**: 2025-06-01
**Reporter**: Scott
**Component**: Explorer/Sunflower APIs
**Priority**: P1
**Status**: Open

**Description**: Claude gets "Failed to fetch" when calling GARDEN APIs directly

**Reproduction**:
1. Ask Claude "tell me about nodepad"
2. Claude attempts API call
3. Returns "Failed to fetch" error

**Environment**:
- API Version: 1.0.0
- Error: Failed to fetch https://garden-tools-service.vercel.app/api/explorer

**Potential Fixes**:
- [ ] Update CORS headers in API
- [ ] Check API key authentication
- [ ] Test if Claude environment supports fetch
- [ ] Consider proxy approach

---

## Integration with Backlog

Bugs should automatically create backlog items:

```json
{
  "id": "BUG-001",
  "title": "Fix GARDEN API CORS/Fetch Error",
  "priority": "P1",
  "category": "bug",
  "affects": ["explorer-api", "sunflower-api"],
  "blockedBy": [],
  "backlogLink": "#54"
}
```
