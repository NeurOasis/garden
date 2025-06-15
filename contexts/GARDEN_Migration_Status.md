# GARDEN File Migration Status
*Version Control Implementation - June 15, 2025*

## Migration Strategy
Per new version control policy, files are being migrated from dated filenames to stable names as they are updated.

## Archive Repository Location
**Correct Archive Location**: `/neuroasis/garden-archive/` (separate repository)
**Incorrect Location**: `garden/archive/` should be REMOVED from main garden

## Current Migration Status

### ✅ Migrated to Stable Names
- `CIT_VersionControl.md` - Version control methodology (no dependencies)
- `CIT_GARDEN_20250525_ORIGINAL.md` → Archived to garden-archive (superseded by current CIT_GARDEN)

### 🔄 Pending Migration (Update as Worked On)
**Contexts Directory:**
- `CIT_ActionOrganizer_20250511.md` → `CIT_ActionOrganizer.md`
- `CIT_BudgetNodePad_20250523.md` → `CIT_BudgetNodePad.md`
- `CIT_Comprehensive_Audit_Plan_20250526.md` → `CIT_ComprehensiveAudit.md`
- `CIT_CoreVsFork_Detection_20250526.md` → `CIT_CoreVsForkDetection.md`
- `CIT_Distributed_Service_Sync_20250601.md` → `CIT_DistributedServiceSync.md`
- `CIT_Documentation_Workflow_20250526.md` → `CIT_DocumentationWorkflow.md`
- `CIT_GARDEN_Accomplishments_20250525.md` → `CIT_GARDENAccomplishments.md`
- `CIT_GARDEN_Archaeology_Methodology_20250526.md` → `CIT_GARDENArchaeology.md`
- `CIT_Personal_Scott_20250529.md` → `CIT_PersonalScott.md`
- `CIT_Printable_Artifact_Standards_20250530.md` → `CIT_PrintableArtifacts.md`
- `CIT_Project_Deployment_Manager_20250525.md` → `CIT_ProjectDeployment.md`
- `CIT_Scheduling_Algorithms_20250530.md` → `CIT_SchedulingAlgorithms.md`
- `CIT_Testing_Comparison_20250529.md` → `CIT_TestingComparison.md`
- `CIT_Tool_Awareness_Sync_20250601.md` → `CIT_ToolAwarenessSync.md`

**Behind The Scenes:**
- `CIT_CoreStandards_20250526.md` → `CIT_CoreStandards.md`
- `CIT_FileAccess_Configuration_20250529.md` → `CIT_FileAccessConfiguration.md`
- `CIT_GARDEN_20250525.md` → `CIT_GARDEN.md` *(main framework document)*
- `CIT_GARDEN_Uploader_SystemDesign_20250528.md` → `CIT_GARDENUploader.md`
- `CIT_NeuroOasis_Forking_Workflow_20250526.md` → `CIT_NeuroOasisForking.md`
- `CIT_meta-cit-framework_20250519.md` → `CIT_MetaCITFramework.md`

**Internal:**
- `CIT_Corporate_Strategy_20250615.md` → `CIT_CorporateStrategy.md`

## Migration Process
1. **When updating any CIT**: Rename file to stable name
2. **Add version headers**: Include Document Info block with version/date  
3. **Add version history**: Include footer with change log
4. **Archive old version**: Move dated version to archive with same path structure
5. **Update references**: Search and replace any hardcoded file references

## MOCI Files  
MOCI files maintain current structure - they are companion files to CITs and follow CIT naming once CIT is migrated.

## Archive Structure
All archived files maintain the same directory structure in the separate garden-archive repository:
- `garden-archive/contexts/` mirrors `contexts/`
- `garden-archive/contexts/behindTheScenes/` mirrors `contexts/behindTheScenes/`
- etc.

**Important**: The main garden repository should NOT contain an `archive/` directory.

---
*This document tracks progress toward stable filename ecosystem*  
*Next Update: As files are migrated during normal work*
