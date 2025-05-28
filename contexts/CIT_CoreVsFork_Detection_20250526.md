# CIT_CoreVsFork_Detection_20250526.md

## 🎯 Core vs Fork Decision Framework

```
Project: GARDEN Core Development Routing System
Current Version: v1.0 (Core Developer Decision Framework)
Date: 20250526
Status: Active framework for core vs fork routing decisions
Audience: Core developers only (Scott, Dan)
```

## 🧭 **CORE DEVELOPMENT CRITERIA**

### **✅ BELONGS IN CORE:**
- **GARDEN Philosophy & Framework:** Core principles, cognitive alignment patterns
- **Infrastructure Components:** Module generators, toolshed utilities, core standards
- **Cross-Project Systems:** User identification, CIT templates, backlog management
- **Foundation Technologies:** NodePad 4.0.0 framework, deployment infrastructure
- **Documentation Systems:** Version history, archaeology tools, core CITs

### **🔧 CORE DEVELOPMENT INDICATORS:**
- Benefits multiple GARDEN applications
- Establishes patterns other developers will use
- Framework or infrastructure component
- Abstract concepts applicable across domains
- Meta-tools (tools that create tools)

## 🌿 **FORK DEVELOPMENT CRITERIA**

### **🚫 REQUIRES FORK:**
- **Domain-Specific Applications:** Recipe management, sailing tools, family schedules
- **Personal Projects:** Individual user contexts, family-specific tools
- **Single-Purpose Tools:** Budget tracking, coffee recipes, expense management
- **Business-Specific Solutions:** Client work, consulting deliverables
- **Experimental Concepts:** Unproven ideas, personal explorations

### **🔀 FORK DEVELOPMENT INDICATORS:**
- Serves specific user group or domain
- Personal or family-specific functionality
- Business or client-specific requirements
- Experimental or proof-of-concept stage
- Would add >20% to core repository size

## 🤖 **CLAUDE ROUTING LOGIC**

### **AUTOMATIC CORE ROUTING:**
```
IF request involves:
- GARDEN philosophy or core principles
- Cross-project infrastructure
- CIT system or documentation framework
- Module generators or toolshed
- User identification or routing systems
THEN: Proceed with core development
```

### **AUTOMATIC FORK ROUTING:**
```
IF request involves:
- Specific domain applications (recipes, sailing, family)
- Personal contexts or individual user tools
- Business-specific implementations
- >3 CITs for single non-framework project
- Project knowledge >20% of conversation
THEN: Require fork creation before proceeding
```

## 📋 **FORK CREATION INSTRUCTIONS TEMPLATE**

When fork is required, Claude provides these exact instructions **BEFORE** answering the development request:

```
🚨 FORK REQUIRED - NON-CORE DEVELOPMENT DETECTED

This request appears to be for [DOMAIN]-specific development rather than core GARDEN framework.

BEFORE I can help with development, please create a focused repository:

**Option A: New Fork (Recommended)**
1. Andrew: Fork scottloeb/garden → [project-name]
2. Andrew: Transfer to NeuroOasis organization  
3. Scott: Clone and clean using CIT_NeuroOasis_Forking_Workflow
4. Upload cleaned project as new Claude project knowledge

**Option B: Existing Fork**
- Upload existing [domain] repository as project knowledge
- Start new Claude conversation with focused context

**Why This Matters:**
- Keeps core GARDEN lean and focused
- Enables longer development conversations
- Provides focused context for your project
- Supports collaboration without core bloat

Would you like me to provide exact commands for Option A, or shall I wait until you've set up the appropriate repository?
```

## 🎯 **CORE DEVELOPER OVERRIDE**

### **Scott or Dan Override Authority:**
Core developers can override fork routing by explicitly stating:
- "This belongs in core because [framework justification]"
- "Add to core infrastructure for [cross-project benefit]"
- "Core development justified by [reusability reason]"

### **Override Documentation Requirement:**
All overrides must include:
- Justification for core inclusion
- Expected benefit to other GARDEN projects
- Framework or infrastructure designation

## 🔍 **EDGE CASES & EXAMPLES**

### **✅ CORE EXAMPLES:**
- **Star Trek UI Framework:** Applies to multiple NodePad applications
- **Cross-Device Persistence:** Infrastructure for all GARDEN tools
- **Collaboration Tools:** Framework for multi-user development
- **Template System:** Pattern for creating new GARDEN applications

### **🔀 FORK EXAMPLES:**
- **Recipe Rolodx Enhancement:** Domain-specific application development
- **Family Schedule Tools:** Personal/family-specific functionality
- **Coffee Recipe Project:** Single-domain application
- **Client Business Tools:** Business-specific implementations

### **🤔 BORDERLINE CASES:**
- **Spoon Theory NodePad:** Educational tool → Fork (domain-specific)
- **Home Assistant Integration:** Infrastructure → Core evaluation needed
- **Advanced Analytics:** Framework component → Core if abstract, Fork if specific

## 🛡️ **SAFETY & CONTEXT PRESERVATION**

### **Pre-Fork Development Safety:**
- All development decisions documented in version history
- CITs preserved for both core and fork repositories
- No work lost during fork creation process

### **Context Handoff Process:**
- Relevant CITs copied to fork repository
- Development history preserved in version control
- Core references updated to point to fork

## 📝 **Version History**

```
20250526: v1.0 - Initial core vs fork decision framework for core developers
```

## 🤖 **Note for Claude**

This CIT provides the decision framework for routing development requests:

**For Core Developers (Scott, Dan):**
- Use this framework to make routing decisions
- Override capability with justification required
- Infrastructure and framework focus for core

**For All Users:**
- Automatic routing based on request analysis
- Clear fork instructions before non-core development
- Context preservation during repository transitions

**Implementation:**
- Check every development request against these criteria
- Provide fork instructions for non-core requests
- Document all routing decisions in version history
