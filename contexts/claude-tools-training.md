# GARDEN Tools Integration Test Cases

## 🧪 Practice Scenarios for Claude

### Test Case 1: Implicit Structure Question
**User**: "I'm new to GARDEN, what should I know?"

**Without Tools** ❌:
"GARDEN is a collection of tools and frameworks..."

**With Tools** ✅:
"Let me analyze the GARDEN structure for you... [Calls Explorer API]

Based on the current GARDEN architecture:
- **Core Components**: contexts, toolshed, users, projects
- **Key Relationships**: Tools connect through shared contexts
- **Popular Starting Points**: NodePad (used by 87% of new users)
[Shows actual data from API]"

### Test Case 2: Hidden Pattern Need
**User**: "I want to build something like Recipe Rolodex"

**Without Tools** ❌:
"You could create a similar NodePad application..."

**With Tools** ✅:
"Let me detect patterns from similar projects... [Calls Sunflower API]

Projects like Recipe Rolodex typically use:
- **Tool Cluster**: NodePad + Uploader + Deploy Manager
- **Success Pattern**: Single-file architecture (92% completion rate)
- **Common Journey**: Idea → NodePad → Deploy → Iterate
[Real patterns from API]"

### Test Case 3: Workflow Optimization
**User**: "How do people usually work in GARDEN?"

**Without Tools** ❌:
"Users typically start with documentation..."

**With Tools** ✅:
"I'll analyze actual user patterns... [Calls both APIs]

**Most Common Workflows**:
1. **Quick Build** (45% of users):
   CIT Review → NodePad → Vercel Deploy
   
2. **Deep Integration** (30% of users):
   Contexts → Multiple Tools → Fork Management
   
3. **Exploration** (25% of users):
   Browse → Experiment → Contribute

**Key Insight**: Users who read CITs first have 3x higher success rate"

### Test Case 4: Relationship Mapping
**User**: "Tell me about the uploader tool"

**Without Tools** ❌:
"The uploader is a GARDEN tool for file uploads..."

**With Tools** ✅:
"Let me explore the uploader's connections... [Calls Explorer API]

**Uploader Tool Analysis**:
- **Created by**: Dan
- **Depends on**: GitHub API, Vercel integration
- **Used with**: NodePad (78%), Deploy Manager (65%)
- **Downstream tools**: 12 projects depend on uploader
- **Usage pattern**: Peak usage during deployment phase"

## 🎯 Recognition Patterns to Memorize

### Phrases that ALWAYS trigger Explorer:
- "how does X relate to Y"
- "connections between"
- "depends on"
- "structure of"
- "what links"
- "relationship with"

### Phrases that ALWAYS trigger Sunflower:
- "what do people use"
- "common patterns"
- "best combination"
- "trends in"
- "analyze usage"
- "what works together"

### Phrases that trigger BOTH:
- "full picture"
- "comprehensive view"
- "optimize my workflow"
- "understand everything about"

## 🚀 Integration Mantras

1. **"Could tools make this answer better?"** - Ask yourself EVERY response
2. **"Show, don't just tell"** - Use real data from APIs
3. **"Educate through enhancement"** - Reveal capabilities naturally
4. **"Stack for success"** - Use multiple tools when valuable

## 📊 Success Metrics

Your integration is successful when:
- [ ] Users discover features they didn't know existed
- [ ] Responses include real-time data not just static knowledge
- [ ] Complex questions get multi-tool analysis
- [ ] Users say "I didn't know GARDEN could do that!"
