# CIT_ToolStrategies.md

## Document Info
**Current Version:** v1.0.0  
**Last Updated:** June 15, 2025  
**Status:** Active  
**Scope:** Version strategies and evolution tracking for GARDEN toolshed components  

## 🛠️ NodePad Framework Strategy

### **Current Approach: Living Standard**
**Current Implementation:** NodePad 5.1.0+ with modular architecture  
**Version Tracking:** Regular assessment of latest framework capabilities  
**Stability Priority:** Use proven stable versions for production deployments  

### **Monthly Actions:**
- Check for new NodePad releases or updates
- Update CIT_GARDEN Section 3 with current version
- Test compatibility with existing GARDEN tools
- Update quick reference materials

### **Reference Pattern:**
```markdown
#### NodePad Framework (Living Standard)
**Current Implementation:** NodePad 5.1.0+ with modular architecture
**Version Tracking:** Regular assessment of latest framework capabilities
**Stability Priority:** Use proven stable versions for production deployments
```

## 🔧 ModuleGenerator Evolution Strategy

### **Current Approach: Generation-Based Naming**
- **ModuleGenerator_Gen1:** Production-stable code generation (use for all production)
- **GraphSynth 2.0:** Revolutionary intelligent middleware (development stage)
- **Archive:** ModuleGenerator_Gen1.5 experimental (archived in garden-archive)

### **Version Control Rules:**
```bash
# Production References
ModuleGenerator_Gen1 ✅ (stable, supported)

# Future References  
GraphSynth 2.0 ✅ (clear future direction)

# Deprecated References (Flag for Update)
ModuleGenerator V1 ❌ (update to Gen1)
ModuleGenerator V2 ❌ (archive as Gen1.5)
ModuleGenerator v1 ❌ (update to Gen1)
```

## 🔄 Universal Version Audit Tool

### **Tool Location:** `toolshed/universal-version-audit.js`
**Purpose:** Automated detection of outdated version references across entire GARDEN ecosystem

### **Usage:**
```bash
cd ~/Desktop/GitHub/neuroasis/garden
node toolshed/universal-version-audit.js
```

### **What It Detects:**
- NodePad version references (4.0.0 → 5.1.0+)
- ModuleGenerator naming (V1/V2 → Gen1/GraphSynth)
- CIT version patterns and inconsistencies
- Framework and API version mismatches
- Generic version patterns across all files

### **Outputs:**
- Console report with priority items
- JSON data for automation
- Markdown report for documentation
- Specific file locations needing updates

### **Monthly Tool Assessment Process:**
1. **Week 1:** Run universal-version-audit and review findings
2. **Week 2:** Update tool references in documentation
3. **Week 3:** Test tool compatibility with existing workflows
4. **Week 4:** Archive deprecated tool versions

## 🗂️ Tool Archive Strategy

### **What Gets Archived:**
- Experimental tool features not ready for production
- Superseded tool versions when stable replacements exist
- Research prototypes that informed but didn't become production tools
- Historical tool approaches that were replaced

### **Archive Process for Tools:**
1. Move experimental/superseded tool content to `garden-archive/tools/`
2. Update archive README with clear explanation
3. Update toolshed documentation to remove references
4. Run version audit to catch remaining tool references

## ⚠️ Tool Strategy Anti-Patterns

### **❌ NEVER:**
- Reference outdated tool versions without checking current status
- Leave "V1/V2" naming when generation-based naming is clearer
- Keep experimental tool code in main toolshed
- Update tool versions without testing compatibility

### **🚨 RED FLAGS:**
- **Multiple version numbers for same tool** in different files
- **Broken links** to tool-specific resources
- **Experimental tool features** described as production-ready
- **Outdated tool capability descriptions** not matching current implementations

---

## Version History

### v1.0.0 - June 15, 2025
- **Created:** Extracted tool strategies from version control CIT
- **Added:** NodePad living standard approach and ModuleGenerator generation naming
- **Added:** Tool-specific version audit and archive processes
- **Scope:** Centralized strategy for all GARDEN toolshed components
- **Impact:** Clear separation of tool strategies from general version control

---

*This CIT focuses exclusively on tool strategies and evolution - follows MECE principle with no dependencies*
