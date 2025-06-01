# CIT_Tool_Awareness_Sync_20250601.md

## Tool Awareness Synchronization Framework

### Purpose
Proactively detect when GARDEN's tool ecosystem changes and Claude's awareness needs updating.

### Detection Triggers

#### 1. New Tool Detection
```
MONITOR:
- /toolshed/ additions
- New HTML/JS files with tool patterns
- Repository forks with tool characteristics
- Python applications in subdirectories

ALERT WHEN:
- New tool files appear without corresponding CIT
- Tool manifest missing new entries
- API endpoints added without integration docs
```

#### 2. Tool Modification Detection
```
MONITOR:
- Existing tool functionality changes
- API endpoint modifications
- New features requiring awareness updates
- Deprecated functionality

ALERT WHEN:
- Tool capabilities change significantly
- New API methods added
- Integration patterns modified
```

#### 3. Tool Migration Detection
```
MONITOR:
- Tools moved between repositories
- Core → Service migrations (like Explorer/Sunflower)
- Fork → Core promotions

ALERT WHEN:
- Tool location changes
- Access patterns need updating
- API endpoints migrate
```

### Sync Protocol

1. **Weekly Audit**
   ```
   - List all tools in GARDEN ecosystem
   - Compare with Claude's tool manifest
   - Identify gaps and mismatches
   - Generate sync recommendations
   ```

2. **Change Detection**
   ```
   - Git commit analysis for tool-related changes
   - File pattern matching for new tools
   - API endpoint verification
   - Integration test results
   ```

3. **Update Workflow**
   ```
   - Generate tool awareness updates
   - Update MANDATORY_GARDEN_API_CALLS.md
   - Refresh tools-manifest.md
   - Update integration examples
   ```

### Integration Points

**Files to Monitor:**
- `/toolshed/tools-manifest.md`
- `/contexts/MANDATORY_GARDEN_API_CALLS.md`
- `/contexts/garden-tools-quickref.md`
- Service repository API definitions

**Update Triggers:**
- New tool commits
- Tool relocation
- API changes
- Feature additions

### Proactive Reminders

When Claude detects:
- Unfamiliar tool references → "New tool detected - update awareness?"
- Failed API calls → "Tool endpoint may have changed - verify?"
- Missing integrations → "Tool exists but not in awareness - add?"

---

*This CIT ensures Claude's tool awareness stays synchronized with GARDEN's evolving ecosystem.*
