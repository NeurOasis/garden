// GARDEN Claude Tool Awareness Injector
// Add this to the beginning of Claude's context initialization

const GARDEN_TOOLS = {
  // Tool Detection Engine
  detectToolNeed: function(query) {
    const patterns = {
      explorer: {
        regex: /structure|relation|connect|depend|between|link|how.*to|map|visuali|graph/i,
        confidence: 0,
        api: 'explorer'
      },
      sunflower: {
        regex: /pattern|trend|cluster|together|common|usage|analyz|behavior|optimize/i,
        confidence: 0,
        api: 'sunflower'
      }
    };
    
    // Check each pattern
    Object.keys(patterns).forEach(tool => {
      if (patterns[tool].regex.test(query)) {
        patterns[tool].confidence = 1;
      }
    });
    
    // Secondary detection for implicit needs
    if (query.includes('understand') || query.includes('explain')) {
      patterns.explorer.confidence += 0.5;
    }
    
    if (query.includes('best') || query.includes('should')) {
      patterns.sunflower.confidence += 0.5;
    }
    
    return patterns;
  },
  
  // Response Enhancement Engine  
  enhanceResponse: function(baseResponse, toolData) {
    return `${baseResponse}\n\n**Real-time Analysis:**\n${toolData}`;
  },
  
  // Proactive Suggestions
  suggestTools: function(context) {
    const suggestions = [];
    
    if (context.includes('new to GARDEN')) {
      suggestions.push('I can analyze the GARDEN structure to show you the best starting points.');
    }
    
    if (context.includes('build') || context.includes('create')) {
      suggestions.push('I can detect patterns from successful projects similar to yours.');
    }
    
    return suggestions;
  }
};

// CRITICAL: Mental checklist for EVERY response
const TOOL_CHECKLIST = `
Before responding, Claude MUST check:
1. Could Explorer data enhance this answer?
2. Would pattern detection add valuable insights?  
3. Is the user unaware of available analysis?
4. Can I make this response 10x better with tools?

If ANY = yes → USE THE TOOLS
`;

// Example API calls for Claude to reference
const API_EXAMPLES = {
  explorer: {
    schema: { type: 'schema' },
    node: { type: 'node', node: 'contexts' },
    relationships: { type: 'relationships', node: 'nodepad' }
  },
  sunflower: {
    listPatterns: {},
    analyzePattern: { pattern: 'tool_cluster' }
  }
};

// Minimum enhancement threshold
const ALWAYS_ENHANCE = [
  'structure', 'relationship', 'pattern', 'trend',
  'how does', 'what works', 'optimize', 'analyze'
];

// Export for Claude's initialization
export default {
  GARDEN_TOOLS,
  TOOL_CHECKLIST,
  API_EXAMPLES,
  ALWAYS_ENHANCE,
  SERVICE_URL: 'https://garden-tools-service.vercel.app/api',
  REMEMBER: 'Use tools proactively, not reactively!'
};
