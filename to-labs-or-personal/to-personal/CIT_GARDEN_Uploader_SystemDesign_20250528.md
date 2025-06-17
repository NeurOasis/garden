# CIT_GARDEN_Uploader_SystemDesign_20250528.md

## 🎯 System Overview

```
Project: GARDEN Smart File Uploader MVP
Current Version: v1.0 (System Design)
Date: 20250528
Status: Design Phase - Ready for Implementation
Repository: https://github.com/scottloeb/garden-projects.git
Target: Vercel deployment for production use
```

## 🚨 **CRITICAL WORKFLOW GAPS BEING SOLVED**

### **Problem Statement:**
Current GARDEN development suffers from three critical interruption patterns:
1. **Delayed deliveries** - Files requested from Dan/others get lost or misplaced
2. **New user confusion** - No clear path for non-technical users to contribute files
3. **Mid-conversation artifacts** - CITs and tools created in chat never make it to project knowledge

### **Business Impact:**
- Lost work due to conversation limits
- Duplicate effort across multiple chats
- Context loss between development sessions
- Collaboration friction with team members

## 🎯 **MVP CORE REQUIREMENTS**

### **Smart File Placement Engine**
**Input:** File upload + optional description
**Process:** Claude-powered analysis determines:
- Correct directory placement
- Proper filename following GARDEN conventions
- Required metadata or context
**Output:** File committed to appropriate GitHub location

### **Three Critical User Journeys**

#### **Journey 1: Dan File Request Recovery**
```
SCENARIO: Scott asked Dan for a file, Dan delivers it later, Scott forgets context

WORKFLOW:
1. Dan uploads file to uploader
2. System asks: "What was this file requested for?"
3. Claude matches to recent conversation context
4. Suggests: contexts/CIT_Dan_Personal_20250528.md
5. Dan confirms placement
6. File auto-commits to GitHub
7. Scott gets notification/can refresh Claude knowledge
```

#### **Journey 2: New User Onboarding**
```
SCENARIO: New team member needs to contribute without GitHub knowledge

WORKFLOW:
1. User uploads file (any format)
2. System detects: No user context found
3. Guides collection of minimal context:
   - Name/role
   - File purpose
   - Where they think it belongs
4. Claude analyzes and suggests optimal placement
5. Creates user context stub if needed
6. Files both user context and uploaded file
```

#### **Journey 3: Mid-Conversation Artifact Rescue**
```
SCENARIO: Claude creates CIT/tool, conversation interrupted, need quick save

WORKFLOW - DESKTOP:
1. Drag artifact file to uploader
2. Auto-detects type (CIT, tool, documentation)
3. Suggests filename using GARDEN conventions
4. One-click commit to GitHub
5. Optional: Refresh Claude project knowledge

WORKFLOW - MOBILE:
1. Save artifact to Files app (despite weird naming)
2. Open uploader in browser
3. Upload the weirdly-named file
4. System ignores filename, reads content for type detection
5. Suggests proper name/location
6. Commits to staging area
7. Next Claude session detects staged files for processing
```

## 🏗️ **TECHNICAL ARCHITECTURE**

### **Core Components**

#### **1. Smart File Analyzer**
```javascript
// Core analysis engine
const FileAnalyzer = {
  detectType: (filename, content) => {
    // CIT detection: starts with "# CIT_"
    // Tool detection: .html files with NodePad patterns
    // Context detection: personal workflow patterns
    // Documentation: README, guides, etc.
  },
  
  suggestPlacement: (type, content, userContext) => {
    // contexts/ for CITs
    // toolshed/ for utilities
    // personal-contexts/ for user-specific
    // findings/ for archaeology results
  },
  
  generateFilename: (type, content, userHint) => {
    // CIT_ProjectName_YYYYMMDD.md
    // tool-name.html
    // Personal_Username_YYYYMMDD.md
  }
}
```

#### **2. GitHub Integration Layer**
```javascript
// Direct GitHub commits via API
const GitHubManager = {
  authenticateUser: () => {}, // GitHub OAuth
  createCommit: (path, content, message) => {},
  createPR: (branch, title, description) => {}, // For review workflow
  notifyUsers: (commitInfo) => {} // Optional notifications
}
```

#### **3. Context Memory System**
```javascript
// Remembers recent requests and context
const ContextMemory = {
  storeRequest: (requester, description, timestamp) => {},
  matchUpload: (fileContent, uploadContext) => {},
  suggestFromHistory: (userInput) => {}
}
```

#### **4. Mobile Workflow Handler**
```javascript
// Handles iOS share sheet weirdness
const MobileHandler = {
  parseWeirdFilename: (filename) => {
    // Handle "share xx.xx" pattern
    // Extract real filename from content
  },
  stageFile: (file, analysis) => {
    // Stage for desktop processing
    // Create notification for next session
  }
}
```

### **Data Structures**

#### **File Analysis Result**
```json
{
  "detectedType": "CIT|tool|personal|documentation",
  "suggestedPath": "contexts/CIT_ProjectName_20250528.md",
  "confidence": 0.95,
  "requiredMetadata": ["project", "date", "status"],
  "matchedRequest": {
    "requester": "scott",
    "description": "Dan's personal context",
    "timestamp": "2025-05-28T10:30:00Z"
  }
}
```

#### **User Context Stub**
```json
{
  "username": "dan",
  "role": "collaborator",
  "githubHandle": "dan-username",
  "contextPath": "contexts/CIT_Personal_Dan_20250528.md",
  "permissions": ["contexts", "toolshed"],
  "created": "2025-05-28T10:30:00Z"
}
```

## 🎨 **USER INTERFACE DESIGN**

### **Main Upload Interface**
```
┌─ GARDEN Smart Uploader ─────────────────────────┐
│                                                 │
│  📁 Drop files here or click to browse         │
│  ┌─────────────────────────────────────────┐   │
│  │                                         │   │
│  │         [Drag & Drop Zone]              │   │
│  │                                         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  💬 What is this file for? (optional)          │
│  ┌─────────────────────────────────────────┐   │
│  │ Dan's personal context CIT...           │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [🔍 Analyze File] [📤 Quick Upload]           │
│                                                 │
└─────────────────────────────────────────────────┘
```

### **Analysis Results Interface**
```
┌─ File Analysis Results ─────────────────────────┐
│                                                 │
│  📄 CIT_Personal_Dan_20250528.md               │
│  ├─ Type: Personal Context CIT                 │
│  ├─ Suggested Location: contexts/              │
│  ├─ Confidence: 95%                            │
│  └─ Matched Request: "Dan's personal context"  │
│                                                 │
│  📝 Required Information:                      │
│  ┌─────────────────────────────────────────┐   │
│  │ User Role: [Collaborator ▼]             │   │
│  │ GitHub Username: [dan-username]         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [✅ Commit to GitHub] [📝 Edit Details]       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### **Mobile Staging Interface**
```
┌─ Mobile Staging ─────────────────────────────────┐
│                                                  │
│  📱 File uploaded from mobile device            │
│  ├─ Original: "share CIT_Something.md"          │
│  ├─ Detected: Personal Context CIT              │
│  └─ Suggested: CIT_Personal_User_20250528.md    │
│                                                  │
│  🎯 Staging for desktop processing              │
│  This file will be available for Claude to      │
│  process when project knowledge is refreshed.   │
│                                                  │
│  [📋 Stage File] [🖥️ Process Now]               │
│                                                  │
└──────────────────────────────────────────────────┘
```

## 🔄 **IMPLEMENTATION PHASES**

### **Phase 1: MVP Core (This Session)**
- ✅ File upload interface
- ✅ Basic type detection (CIT vs tool vs other)
- ✅ Simple placement logic (contexts/ vs toolshed/)
- ✅ GitHub API integration for commits
- ✅ Mobile file staging area
- ✅ Deploy to Vercel

### **Phase 2: Smart Analysis (Next Sprint)**
- Context memory system
- Request matching logic
- Advanced filename generation
- User context management
- Conflict resolution

### **Phase 3: Full Automation (Future)**
- Auto-refresh Claude project knowledge
- Advanced mobile integration
- Team notifications
- Analytics and usage tracking

## 🛠️ **TECHNICAL IMPLEMENTATION NOTES**

### **GitHub API Requirements**
- OAuth integration for user authentication
- Repository access permissions
- Commit creation with proper attribution
- Branch management for review workflow

### **File Processing Pipeline**
1. **Upload** → Receive file and metadata
2. **Analyze** → Detect type, suggest placement
3. **Validate** → Confirm with user, collect missing info
4. **Commit** → Push to GitHub with proper commit message
5. **Notify** → Update staging area or trigger notifications

### **Mobile Considerations**
- iOS share sheet filename weirdness handling
- Staging area for files that need desktop processing
- Offline capability for file uploads
- Progressive enhancement for mobile browsers

### **Security & Permissions**
- GitHub OAuth for secure repository access
- User permission validation before commits
- File content validation (no malicious uploads)
- Rate limiting and abuse prevention

## 📊 **SUCCESS METRICS**

### **Primary KPIs**
- **Artifact Loss Reduction:** 0% of CITs/tools lost to conversation limits
- **Collaboration Friction:** <30 seconds for Dan to upload any file
- **Mobile Workflow:** 100% of mobile artifacts successfully staged
- **Context Preservation:** 0% duplicate work across conversations

### **User Experience Metrics**
- Time from file creation to GitHub commit
- Number of steps required for different user types
- Error rate and resolution success
- User satisfaction with placement suggestions

## 🚨 **RISK MITIGATION**

### **Technical Risks**
- **GitHub API rate limits:** Implement caching and batching
- **File size limits:** Define maximum file sizes and compression
- **Authentication failures:** Fallback to staging area
- **Network failures:** Offline queue with retry logic

### **User Experience Risks**
- **Wrong file placement:** Review workflow for critical files
- **Lost context:** Comprehensive logging and recovery options
- **Permission conflicts:** Clear error messages and resolution paths

## 📋 **DEVELOPMENT BACKLOG**

### **Immediate (This Session)**
1. Create basic upload interface
2. Implement file type detection
3. Build GitHub integration
4. Create staging area functionality
5. Deploy MVP to Vercel

### **Short-term (Next Sprint)**
1. Enhanced type detection with content analysis
2. Context memory system
3. Request matching logic
4. User context management
5. Mobile optimization

### **Medium-term (Next Quarter)**
1. Advanced AI analysis for placement
2. Team collaboration features
3. Analytics and reporting
4. Integration with other GARDEN tools
5. API for programmatic uploads

## 🔄 **INTEGRATION POINTS**

### **Existing GARDEN Systems**
- **CIT Framework:** Auto-detect and properly name CITs
- **Toolshed:** Integration with NodePad and utilities
- **Personal Contexts:** User identification and routing
- **Archaeology:** Integration with findings and discoveries
- **Backlog Management:** Link uploads to backlog items

### **External Integrations**
- **GitHub:** Primary repository management
- **Vercel:** Hosting and deployment
- **Claude:** Project knowledge refresh integration
- **Mobile Browsers:** iOS/Android compatibility

## 📝 **VERSION HISTORY**

```
20250528: v1.0 - Initial system design for GARDEN Smart Uploader MVP
```

## 🤖 **Note for Claude**

This CIT captures the complete system design for the GARDEN Smart Uploader MVP. Key priorities:

1. **Solve real workflow pain points** - Dan file delivery, new user onboarding, mid-conversation rescues
2. **Mobile workflow support** - Handle iOS share sheet weirdness, staging area
3. **Smart placement** - Auto-detect file types and suggest appropriate locations
4. **GitHub integration** - Direct commits to maintain GARDEN ecosystem

**Implementation Focus:**
- Start with MVP core functionality
- Deploy to Vercel for immediate use
- Build on existing GARDEN patterns and conventions
- Ensure mobile compatibility from day one

**Critical Success Factor:** Must handle interruption scenarios gracefully - this tool itself should never cause lost work or context.