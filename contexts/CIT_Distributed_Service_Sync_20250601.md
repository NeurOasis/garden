# CIT_Distributed_Service_Sync_20250601.md

## Distributed Service Synchronization Framework

### Purpose
Detect when changes in GARDEN core require updates to externally deployed services.

### Service Mapping

#### Current Distributed Services
```yaml
garden-tools-service:
  repository: NeurOasis/garden-tools-service
  deployment: Vercel
  components:
    - Explorer API (from /explorer/)
    - Sunflower API (from /sunflower/)
    - Pattern detection libraries
  dependencies:
    - Core pattern definitions
    - Tool relationship mappings
    - API authentication methods
```

### Change Detection Matrix

#### 1. Core → Service Dependencies
```
WHEN core/explorer/* changes:
  → UPDATE garden-tools-service/api/explorer.py
  → REDEPLOY Vercel functions

WHEN core/sunflower/* changes:
  → UPDATE garden-tools-service/api/sunflower.py
  → REDEPLOY Vercel functions

WHEN core/contexts/tools-manifest.md changes:
  → VERIFY API endpoints still valid
  → UPDATE service documentation
```

#### 2. Breaking Change Detection
```
MONITOR FOR:
- API contract changes
- Authentication method updates
- Data structure modifications
- Deprecated endpoints

ALERT WHEN:
- Core changes would break service
- Service needs migration
- Version mismatch detected
```

#### 3. Sync Requirements
```
AUTOMATED CHECKS:
- API endpoint health monitoring
- Version compatibility verification
- Schema alignment validation
- Authentication method consistency
```

### Synchronization Protocol

1. **Change Analysis**
   ```bash
   # When core changes detected
   IF changes_affect_service(commit):
     generate_service_update_plan()
     notify_deployment_needed()
   ```

2. **Update Workflow**
   ```
   1. Identify affected services
   2. Generate update patches
   3. Test compatibility
   4. Deploy updates
   5. Verify service health
   ```

3. **Version Coordination**
   ```yaml
   core_version: 2.0.0
   services:
     garden-tools-service: 
       compatible_with: "core >= 2.0.0"
       last_sync: "2025-06-01"
   ```

### Proactive Alerts

Claude should alert when:
- "Core change detected that affects garden-tools-service"
- "Explorer modifications require service update"
- "API contract change needs deployment"
- "Service out of sync with core - update needed"

### Migration Tracking

```markdown
## Service Migration Log

### 2025-06-01: Explorer/Sunflower → garden-tools-service
- Moved from: core/explorer/, core/sunflower/
- Deployed to: Vercel serverless functions
- API endpoints: /api/explorer, /api/sunflower
- Dependencies: Must sync when core patterns change
```

### Continuous Integration

**GitHub Actions Workflow:**
```yaml
on:
  push:
    paths:
      - 'explorer/**'
      - 'sunflower/**'
      - 'contexts/tools-manifest.md'
      
jobs:
  check-service-sync:
    - Analyze changes
    - Determine service impact
    - Create sync PR if needed
    - Notify deployment required
```

---

*This CIT ensures distributed GARDEN services stay synchronized with core repository changes.*
