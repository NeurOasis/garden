# 🔍 GARDEN Tool Audit Template v1.0

## Purpose
This template provides a systematic approach to discovering, documenting, and understanding tools in the GARDEN ecosystem. Each tool should be audited using this template to create both human-readable documentation and Claude-usable CITs.

---

## 📋 Tool Audit Template

### 1. Basic Information
```yaml
Tool Name: [filename or clear identifier]
Location: [full path from garden root]
File Type: [.html, .py, .js, etc.]
File Size: [in KB]
Last Modified: [date]
Current Status: [ ] Active [ ] Unknown [ ] Deprecated [ ] Broken
```

### 2. Discovery Analysis
```yaml
Purpose (What I Think It Does):
- [Initial hypothesis based on name/location]
- [Observable features or UI elements]
- [Apparent functionality]

First Impression:
- [ ] Immediately useful
- [ ] Needs investigation
- [ ] Possibly obsolete
- [ ] Core functionality
- [ ] Fork candidate

Dependencies Detected:
- External libraries: [list any imports/includes]
- Other GARDEN tools: [cross-references]
- Data files: [required inputs]
```

### 3. Functional Testing
```yaml
Can It Run Standalone? [ ] Yes [ ] No [ ] Unknown

Test Results:
- Opened in browser: [what happened]
- Command line execution: [if applicable]
- Error messages: [capture any errors]
- Missing dependencies: [what's needed]

Functionality Verified:
- [ ] Tool loads successfully
- [ ] Basic features work
- [ ] Can perform primary function
- [ ] Produces expected output
```

### 4. Code Analysis
```yaml
Code Complexity: [ ] Simple (<100 lines) [ ] Medium (100-500) [ ] Complex (500+)

Architecture Pattern:
- [ ] Single-file (like NodePad)
- [ ] Multi-file with dependencies
- [ ] Framework-based (React, Flask, etc.)
- [ ] Script/utility
- [ ] Data processor

Key Functions/Features:
1. [Main functionality]
2. [Secondary features]
3. [Hidden capabilities]

Compression Potential:
- Current size: [X KB]
- Estimated compressed: [Y KB]
- Compression strategy: [MOCI, minification, refactoring]
```

### 5. Documentation Status
```yaml
Existing Documentation:
- [ ] README file
- [ ] Inline comments
- [ ] CIT reference
- [ ] Help text/UI
- [ ] None found

Documentation Quality:
- [ ] Comprehensive
- [ ] Basic/adequate
- [ ] Minimal
- [ ] Non-existent
```

### 6. Value Assessment
```yaml
User Value (1-5): [rating]
- Who would use this: [target users]
- What problem it solves: [clear statement]
- Better alternatives exist: [ ] Yes [ ] No

Technical Value (1-5): [rating]
- Code quality: [assessment]
- Maintainability: [assessment]
- Innovation level: [assessment]

Strategic Value (1-5): [rating]
- Fits GARDEN philosophy: [ ] Yes [ ] No [ ] Maybe
- Enables other tools: [ ] Yes [ ] No
- Unique capability: [ ] Yes [ ] No
```

### 7. Categorization Decision
```yaml
Recommended Placement:
- [ ] Core (universal utility)
- [ ] Fork (specialized use)
- [ ] Archive (historical value)
- [ ] Delete (no value)

Reasoning:
[Explain the categorization decision]

Migration Actions:
- [ ] Needs documentation before decision
- [ ] Ready to move as-is
- [ ] Requires refactoring first
- [ ] Bundle with related tools
```

### 8. CIT Generation Notes
```yaml
CIT Priority: [ ] Critical [ ] Important [ ] Nice-to-have [ ] Not needed

Key Information for CIT:
- Primary purpose: [one sentence]
- User mental model: [how users think about it]
- Critical parameters: [what must be configured]
- Common workflows: [typical usage patterns]

MOCI Compression Notes:
- Information density: [ ] High [ ] Medium [ ] Low
- Redundancy level: [ ] High [ ] Medium [ ] Low
- Compression strategy: [specific approach]
```

### 9. Next Actions
```yaml
Immediate Actions:
- [ ] Create basic documentation
- [ ] Write CIT
- [ ] Test core functionality
- [ ] Move to appropriate location

Future Enhancements:
- [ ] Refactor for clarity
- [ ] Add missing features
- [ ] Integrate with other tools
- [ ] Create examples
```

---

## 🚀 Quick Audit Process

For rapid discovery, use this shortened process:

1. **Quick Scan** (30 seconds)
   - What's the filename?
   - Can it open/run?
   - What does it appear to do?

2. **Value Check** (1 minute)
   - Is this useful to anyone?
   - Does it work?
   - Core or fork?

3. **Document** (2 minutes)
   - One paragraph description
   - Basic categorization
   - Next action

---

## 📊 Audit Summary Format

After auditing multiple tools, create a summary:

```markdown
## Directory: [path]
Total Tools Found: [X]
Documented: [Y]
Categorized: Core [A] | Fork [B] | Archive [C] | Delete [D]

Key Discoveries:
1. [Most valuable tool found]
2. [Surprising functionality]
3. [Integration opportunities]

Priority Actions:
1. [Most urgent documentation need]
2. [Quick wins for activation]
3. [Tools needing decisions]
```

---

## 🎯 Success Metrics

A successful audit achieves:
- ✅ Every tool has a one-paragraph description
- ✅ Clear core vs. fork categorization
- ✅ Identified tools ready for immediate use
- ✅ Documented tools needing work
- ✅ No more "mystery" files

---

*Use this template to systematically discover and document the Hidden Garden. Each completed audit brings us closer to full GARDEN understanding and optimal organization.*