# CIT_Documentation_Workflow_20250526.md

## 🎯 "Document as We Go" Framework

```
Project: Real-time Documentation Workflow for GARDEN Development
Current Version: v1.0 (Foundation workflow)
Date: 20250526
Status: Active framework for all GARDEN development
Applies to: Core repository + all forked projects
```

## 🧠 **PHILOSOPHY: DOCUMENTATION AS DEVELOPMENT**

### **Core Principle:**
Documentation isn't a separate activity - it's an integral part of development that happens simultaneously, not afterward.

### **Why This Matters:**
- **Cognitive Switching Efficiency** - New collaborators orient quickly
- **Context Preservation** - Critical decisions don't exist only in conversations
- **Evolution Tracking** - Rationale and decision history preserved
- **Real Collaboration** - Multiple developers can contribute without confusion

## 📋 **MANDATORY DOCUMENTATION ACTIONS**

### **🔄 EVERY COMMIT MUST INCLUDE:**

#### **Structural Changes:**
```bash
# If you modify repository structure:
✅ Update README.md with new structure
✅ Update relevant CITs
✅ Add version history entry
✅ Commit all documentation changes with code
```

#### **Feature Additions:**
```bash
# If you add new functionality:
✅ Update relevant CIT with feature description
✅ Add usage examples or instructions
✅ Update README if it affects navigation
✅ Version history entry for significant features
```

#### **Decision Making:**
```bash
# If you make architectural or strategic decisions:
✅ Document decision rationale in relevant CIT
✅ Update version history with decision impact
✅ Cross-reference related CITs if applicable
✅ Include decision in commit message
```

## 🤖 **CLAUDE'S DOCUMENTATION ENFORCEMENT**

### **Claude Must Always:**
- **Before Development:** Check if documentation updates are needed
- **During Development:** Suggest documentation alongside code changes  
- **After Development:** Verify documentation completeness before finishing
- **Every Response:** Include documentation updates in development responses

### **Documentation Prompts for Users:**
```
🚨 DOCUMENTATION REQUIRED
This change affects [AREA] and requires documentation updates:

📝 Required Updates:
- [ ] README.md - [specific section]
- [ ] [Relevant CIT] - [specific addition]
- [ ] Version history - [decision/change entry]

Would you like me to:
1. Provide exact documentation updates with your code changes?
2. Create the documentation as artifacts for you to commit?
3. Include documentation in the development artifacts?
```

## 📊 **DOCUMENTATION TYPES & TARGETS**

### **🏠 README.md Updates Required For:**
- New tools or utilities added to toolshed
- Changes to repository structure or organization
- New collaboration workflows or processes
- Changes to getting started or navigation instructions
- Updates to current state or active development sections

### **📝 CIT Updates Required For:**
- Feature additions to existing applications
- Process or workflow modifications
- Strategic or architectural decisions
- User context enhancements
- Cross-project integration changes

### **📈 Version History Updates Required For:**
- Any change that affects user workflow
- Architectural or strategic decisions
- Major bug fixes or improvements
- New features or tools
- Repository structure changes

## 🔧 **IMPLEMENTATION TEMPLATES**

### **Commit Message Template:**
```
🎯 [ACTION]: [Brief description]

✅ CHANGES: [Technical changes made]
✅ DOCS: [Documentation updates included]
✅ IMPACT: [How this affects users/workflow]
🎯 PURPOSE: [Why this change was made]
```

### **Documentation Update Checklist:**
```
For this change, I need to update:
□ README.md - [specific section and reason]
□ [Relevant CIT] - [what information to add]
□ Version history - [decision or change to document]
□ Other affected documentation - [cross-references]

Documentation artifacts created:
□ Updated README section
□ Updated CIT content  
□ Version history entry
□ Commit with both code and documentation
```

## 🎯 **FORK INHERITANCE REQUIREMENTS**

### **Every Fork Must Maintain:**
- **Updated README** relevant to the fork's focus
- **Documentation workflow** adapted to the project domain
- **Version history** tracking the fork's evolution
- **Real-time updates** with every development session

### **Fork-Specific Adaptations:**
- **Domain Context** - Replace GARDEN core references with project focus
- **User Orientation** - Project-specific getting started instructions
- **Decision Tracking** - Project-specific architectural choices
- **Collaboration Model** - Fork-specific team and workflow information

## ⚠️ **ANTI-PATTERNS TO AVOID**

### **❌ NEVER:**
- Make structural changes without documentation updates
- Add features without updating relevant CITs
- Make decisions without documenting rationale
- Commit code without corresponding documentation
- Leave documentation as "we'll do it later"

### **🚨 RED FLAGS:**
- **"It's just a small change"** - Small changes compound into confusion
- **"We'll document it next session"** - Context gets lost between sessions
- **"The code is self-documenting"** - Others need orientation and rationale
- **"It's obvious what this does"** - Not obvious to new collaborators

## 🎯 **SUCCESS METRICS**

### **✅ Documentation Success Indicators:**
- New collaborators can orient in <5 minutes
- README accurately reflects current repository state
- All architectural decisions have documented rationale
- Version history tells coherent evolution story
- No critical information exists only in conversation history

### **📊 Quality Checks:**
- README last updated within 7 days of structural changes
- CITs reflect current functionality and processes
- Version history entries correlate with major commits
- Documentation artifacts accompany all development artifacts

## 🔄 **CONTINUOUS IMPROVEMENT**

### **Regular Documentation Audits:**
- **Weekly:** Check README accuracy against current state
- **Monthly:** Review CIT completeness and currency
- **Quarterly:** Version history coherence and decision tracking
- **As Needed:** Update documentation workflows based on team feedback

### **Evolution Tracking:**
- Document what documentation approaches work best
- Track cognitive switching costs and orientation efficiency
- Measure time to productivity for new collaborators
- Adapt documentation patterns based on actual usage

## 📝 **Version History**

```
20250526: v1.0 - Initial documentation workflow framework for GARDEN development
```

## 🤖 **Note for Claude**

This CIT establishes mandatory documentation practices:

**For Every Development Session:**
- Check what documentation updates are needed
- Include documentation artifacts with development
- Verify documentation completeness before finishing
- Prompt user for missing documentation requirements

**For All Repositories (Core + Forks):**
- Maintain real-time documentation accuracy
- Preserve decision rationale and evolution tracking
- Enable efficient collaboration and onboarding
- Prevent context loss between conversations

**Implementation Priority:**
- Documentation updates are mandatory, not optional
- Include in every development response
- Make it easy by providing exact documentation text
- Enforce consistently across all GARDEN development
