#!/usr/bin/env node

/**
 * GARDEN Version Audit Script
 * 
 * Scans entire GitHub repository for version references and identifies:
 * - Latest versions of each component
 * - Outdated version references that need updating
 * - Inconsistent version usage across files
 * 
 * Usage: node version-audit.js [--repo-path /path/to/repo]
 */

const fs = require('fs');
const path = require('path');

class VersionAuditor {
    constructor(repoPath = '.') {
        this.repoPath = repoPath;
        this.results = {
            components: new Map(),
            files: new Map(),
            inconsistencies: [],
            summary: {}
        };
        
        // Common version patterns to search for
        this.versionPatterns = [
            // NodePad versions
            /NodePad\s+v?(\d+\.\d+\.\d+)/gi,
            /NodePad\s+(\d+\.\d+\.\d+)/gi,
            
            // Module Generator versions  
            /ModuleGenerator\s*v?(\d+)/gi,
            /Module\s*Generator\s*v?(\d+)/gi,
            
            // CIT versions in filenames and content
            /CIT_.*?_v?(\d+\.\d+)/gi,
            /Version:\s*v?(\d+\.\d+(?:\.\d+)?)/gi,
            /Current\s*Version:\s*v?(\d+\.\d+(?:\.\d+)?)/gi,
            
            // Generic version patterns
            /v(\d+\.\d+\.\d+)/gi,
            /version\s+(\d+\.\d+(?:\.\d+)?)/gi,
            
            // Framework versions
            /Framework\s+v?(\d+\.\d+(?:\.\d+)?)/gi,
            
            // API versions
            /API\s+v?(\d+\.\d+(?:\.\d+)?)/gi,
            
            // Date-based versions (YYYYMMDD pattern)
            /(?:CIT_|MOCI_).*?_(\d{8})/gi
        ];
        
        // File types to scan
        this.scanExtensions = ['.md', '.txt', '.js', '.html', '.json', '.yaml', '.yml', '.py'];
        
        // Directories to skip
        this.skipDirs = ['.git', 'node_modules', '.next', 'dist', 'build', '.vercel'];
    }
    
    /**
     * Main audit function
     */
    async audit() {
        console.log('🔍 Starting GARDEN Version Audit...');
        console.log(`📁 Scanning repository: ${path.resolve(this.repoPath)}`);
        
        // Scan all files
        await this.scanDirectory(this.repoPath);
        
        // Analyze results
        this.analyzeVersions();
        
        // Generate report
        this.generateReport();
        
        return this.results;
    }
    
    /**
     * Recursively scan directory for files
     */
    async scanDirectory(dirPath) {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            
            // Handle broken symlinks and missing files gracefully
            let stat;
            try {
                stat = fs.statSync(fullPath);
            } catch (error) {
                // Skip broken symlinks and inaccessible files
                console.warn(`⚠️  Skipping inaccessible path: ${fullPath}`);
                continue;
            }
            
            if (stat.isDirectory()) {
                // Skip certain directories
                if (this.skipDirs.includes(item)) {
                    continue;
                }
                await this.scanDirectory(fullPath);
            } else if (stat.isFile()) {
                // Check if file extension should be scanned
                const ext = path.extname(item).toLowerCase();
                if (this.scanExtensions.includes(ext)) {
                    await this.scanFile(fullPath);
                }
            }
        }
    }
    
    /**
     * Scan individual file for version references
     */
    async scanFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const relativePath = path.relative(this.repoPath, filePath);
            
            const fileVersions = {
                path: relativePath,
                versions: [],
                lineNumbers: new Map()
            };
            
            // Split content into lines for line number tracking
            const lines = content.split('\n');
            
            // Check each pattern
            for (const pattern of this.versionPatterns) {
                let match;
                const regex = new RegExp(pattern.source, pattern.flags);
                
                while ((match = regex.exec(content)) !== null) {
                    const fullMatch = match[0];
                    const version = match[1];
                    const matchIndex = match.index;
                    
                    // Find line number
                    const lineNumber = this.getLineNumber(content, matchIndex);
                    
                    // Determine component name
                    const component = this.extractComponentName(fullMatch, relativePath);
                    
                    const versionInfo = {
                        component,
                        version,
                        fullMatch,
                        lineNumber,
                        context: lines[lineNumber - 1]?.trim() || ''
                    };
                    
                    fileVersions.versions.push(versionInfo);
                    
                    // Track line numbers for each version
                    if (!fileVersions.lineNumbers.has(version)) {
                        fileVersions.lineNumbers.set(version, []);
                    }
                    fileVersions.lineNumbers.get(version).push(lineNumber);
                    
                    // Add to component tracking
                    this.addToComponentTracking(component, version, relativePath, lineNumber, fullMatch);
                }
            }
            
            if (fileVersions.versions.length > 0) {
                this.results.files.set(relativePath, fileVersions);
            }
            
        } catch (error) {
            console.warn(`⚠️  Could not read file ${filePath}: ${error.message}`);
        }
    }
    
    /**
     * Get line number from character index
     */
    getLineNumber(content, index) {
        return content.substring(0, index).split('\n').length;
    }
    
    /**
     * Extract component name from match context
     */
    extractComponentName(fullMatch, filePath) {
        const lowerMatch = fullMatch.toLowerCase();
        const lowerPath = filePath.toLowerCase();
        
        // NodePad detection
        if (lowerMatch.includes('nodepad')) {
            return 'NodePad';
        }
        
        // Module Generator detection
        if (lowerMatch.includes('modulegenerator') || lowerMatch.includes('module generator')) {
            return 'ModuleGenerator';
        }
        
        // CIT detection
        if (lowerMatch.includes('cit') || lowerPath.includes('cit_')) {
            return 'CIT';
        }
        
        // Framework detection
        if (lowerMatch.includes('framework')) {
            return 'Framework';
        }
        
        // API detection
        if (lowerMatch.includes('api')) {
            return 'API';
        }
        
        // Date-based versions (likely CIT dates)
        if (/\d{8}/.test(fullMatch)) {
            return 'CIT-Date';
        }
        
        // Default to generic version
        return 'Unknown';
    }
    
    /**
     * Add version info to component tracking
     */
    addToComponentTracking(component, version, filePath, lineNumber, fullMatch) {
        if (!this.results.components.has(component)) {
            this.results.components.set(component, {
                versions: new Map(),
                files: new Set(),
                latest: null,
                outdated: []
            });
        }
        
        const componentData = this.results.components.get(component);
        componentData.files.add(filePath);
        
        if (!componentData.versions.has(version)) {
            componentData.versions.set(version, []);
        }
        
        componentData.versions.get(version).push({
            file: filePath,
            line: lineNumber,
            match: fullMatch
        });
    }
    
    /**
     * Analyze version data to find latest and outdated versions
     */
    analyzeVersions() {
        for (const [component, data] of this.results.components) {
            const versions = Array.from(data.versions.keys());
            
            if (component === 'CIT-Date') {
                // For date versions, find the latest date
                const sortedDates = versions
                    .filter(v => /^\d{8}$/.test(v))
                    .sort((a, b) => b.localeCompare(a)); // Descending date order
                
                if (sortedDates.length > 0) {
                    data.latest = sortedDates[0];
                    data.outdated = sortedDates.slice(1);
                }
            } else {
                // For semantic versions, sort by version number
                const sortedVersions = versions
                    .filter(v => /^\d+\.\d+(\.\d+)?$/.test(v))
                    .sort(this.compareVersions.bind(this))
                    .reverse(); // Highest version first
                
                if (sortedVersions.length > 0) {
                    data.latest = sortedVersions[0];
                    data.outdated = sortedVersions.slice(1);
                }
                
                // Include non-semantic versions as potentially outdated
                const nonSemantic = versions.filter(v => !/^\d+\.\d+(\.\d+)?$/.test(v) && !/^\d{8}$/.test(v));
                data.outdated = [...data.outdated, ...nonSemantic];
            }
            
            // Find inconsistencies (multiple versions used across files)
            if (data.versions.size > 1) {
                this.results.inconsistencies.push({
                    component,
                    versions: Array.from(data.versions.keys()),
                    latest: data.latest,
                    fileCount: data.files.size
                });
            }
        }
    }
    
    /**
     * Compare semantic versions
     */
    compareVersions(a, b) {
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);
        
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const aPart = aParts[i] || 0;
            const bPart = bParts[i] || 0;
            
            if (aPart !== bPart) {
                return aPart - bPart;
            }
        }
        
        return 0;
    }
    
    /**
     * Generate comprehensive report
     */
    generateReport() {
        console.log('\n📊 GARDEN VERSION AUDIT REPORT');
        console.log('=' .repeat(50));
        
        // Summary statistics
        const totalFiles = this.results.files.size;
        const totalComponents = this.results.components.size;
        const totalInconsistencies = this.results.inconsistencies.length;
        
        console.log(`\n📈 SUMMARY:`);
        console.log(`   Files scanned: ${totalFiles}`);
        console.log(`   Components found: ${totalComponents}`);
        console.log(`   Version inconsistencies: ${totalInconsistencies}`);
        
        // Component breakdown
        console.log(`\n🔧 COMPONENT VERSIONS:`);
        for (const [component, data] of this.results.components) {
            console.log(`\n   ${component}:`);
            console.log(`     Latest: ${data.latest || 'Unknown'}`);
            console.log(`     Total versions found: ${data.versions.size}`);
            console.log(`     Files affected: ${data.files.size}`);
            
            if (data.outdated.length > 0) {
                console.log(`     ⚠️  Outdated versions: ${data.outdated.join(', ')}`);
            }
        }
        
        // Inconsistencies detail
        if (this.results.inconsistencies.length > 0) {
            console.log(`\n⚠️  VERSION INCONSISTENCIES:`);
            for (const inconsistency of this.results.inconsistencies) {
                console.log(`\n   ${inconsistency.component}:`);
                console.log(`     Versions in use: ${inconsistency.versions.join(', ')}`);
                console.log(`     Latest identified: ${inconsistency.latest}`);
                console.log(`     Files affected: ${inconsistency.fileCount}`);
                
                // Show specific file locations
                const componentData = this.results.components.get(inconsistency.component);
                for (const [version, locations] of componentData.versions) {
                    if (version !== inconsistency.latest) {
                        console.log(`     ❌ ${version} found in:`);
                        locations.forEach(loc => {
                            console.log(`        ${loc.file}:${loc.line} - "${loc.match}"`);
                        });
                    }
                }
            }
        }
        
        // Action items
        console.log(`\n🎯 RECOMMENDED ACTIONS:`);
        
        let actionCount = 1;
        for (const [component, data] of this.results.components) {
            if (data.outdated.length > 0) {
                console.log(`\n   ${actionCount}. Update ${component} references:`);
                console.log(`      From: ${data.outdated.join(', ')}`);
                console.log(`      To: ${data.latest}`);
                
                // Show specific files that need updating
                data.outdated.forEach(outdatedVersion => {
                    const locations = data.versions.get(outdatedVersion) || [];
                    if (locations.length > 0) {
                        console.log(`      Files with ${outdatedVersion}:`);
                        locations.forEach(loc => {
                            console.log(`        - ${loc.file}:${loc.line}`);
                        });
                    }
                });
                actionCount++;
            }
        }
        
        if (actionCount === 1) {
            console.log(`   ✅ No version updates needed - all components using latest versions!`);
        }
        
        // Save detailed report to file
        this.saveDetailedReport();
    }
    
    /**
     * Save detailed JSON report for further analysis
     */
    saveDetailedReport() {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
        
        const reportData = {
            timestamp: new Date().toISOString(),
            repoPath: this.repoPath,
            summary: {
                filesScanned: this.results.files.size,
                componentsFound: this.results.components.size,
                inconsistencies: this.results.inconsistencies.length
            },
            components: Object.fromEntries(
                Array.from(this.results.components.entries()).map(([name, data]) => [
                    name,
                    {
                        latest: data.latest,
                        versions: Object.fromEntries(data.versions),
                        files: Array.from(data.files),
                        outdated: data.outdated
                    }
                ])
            ),
            inconsistencies: this.results.inconsistencies,
            actionItems: this.generateActionItems()
        };
        
        // Save to findings directory with date stamp
        const findingsDir = path.join(this.repoPath, 'findings');
        const jsonPath = path.join(findingsDir, `version-audit-report_${dateStr}.json`);
        const markdownPath = path.join(findingsDir, `version-audit-report_${dateStr}.md`);
        
        fs.writeFileSync(jsonPath, JSON.stringify(reportData, null, 2));
        
        console.log(`\n💾 Detailed report saved to: ${jsonPath}`);
        
        // Also create a markdown summary
        this.generateMarkdownReport(reportData, markdownPath);
    }
    
    /**
     * Generate action items for programmatic processing
     */
    generateActionItems() {
        const actions = [];
        
        for (const [component, data] of this.results.components) {
            if (data.outdated.length > 0) {
                data.outdated.forEach(outdatedVersion => {
                    const locations = data.versions.get(outdatedVersion) || [];
                    locations.forEach(loc => {
                        actions.push({
                            component,
                            action: 'update_version',
                            file: loc.file,
                            line: loc.line,
                            currentVersion: outdatedVersion,
                            targetVersion: data.latest,
                            originalMatch: loc.match
                        });
                    });
                });
            }
        }
        
        return actions;
    }
    
    /**
     * Generate markdown report for documentation
     */
    generateMarkdownReport(data, markdownPath) {
        let markdown = `# GARDEN Version Audit Report\n\n`;
        markdown += `**Generated:** ${new Date(data.timestamp).toLocaleString()}\n`;
        markdown += `**Repository:** ${data.repoPath}\n\n`;
        
        markdown += `## Summary\n\n`;
        markdown += `- **Files Scanned:** ${data.summary.filesScanned}\n`;
        markdown += `- **Components Found:** ${data.summary.componentsFound}\n`;
        markdown += `- **Version Inconsistencies:** ${data.summary.inconsistencies}\n\n`;
        
        markdown += `## Component Versions\n\n`;
        for (const [component, info] of Object.entries(data.components)) {
            markdown += `### ${component}\n\n`;
            markdown += `- **Latest Version:** ${info.latest || 'Unknown'}\n`;
            markdown += `- **Total Versions:** ${Object.keys(info.versions).length}\n`;
            markdown += `- **Files Affected:** ${info.files.length}\n`;
            
            if (info.outdated.length > 0) {
                markdown += `- **⚠️ Outdated Versions:** ${info.outdated.join(', ')}\n`;
            }
            markdown += `\n`;
        }
        
        if (data.actionItems.length > 0) {
            markdown += `## Action Items\n\n`;
            data.actionItems.forEach((action, index) => {
                markdown += `${index + 1}. **${action.component}** in \`${action.file}:${action.line}\`\n`;
                markdown += `   - Update: \`${action.currentVersion}\` → \`${action.targetVersion}\`\n`;
                markdown += `   - Match: \`${action.originalMatch}\`\n\n`;
            });
        }
        
        fs.writeFileSync(markdownPath, markdown);
        
        console.log(`📄 Markdown report saved to: ${markdownPath}`);
    }
}

// CLI execution
if (require.main === module) {
    const args = process.argv.slice(2);
    let repoPath = '.';
    
    // Parse command line arguments
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--repo-path' && i + 1 < args.length) {
            repoPath = args[i + 1];
            i++; // Skip next argument
        }
    }
    
    const auditor = new VersionAuditor(repoPath);
    
    auditor.audit()
        .then(() => {
            console.log('\n✅ Version audit completed successfully!');
        })
        .catch(error => {
            console.error('\n❌ Version audit failed:', error);
            process.exit(1);
        });
}

module.exports = VersionAuditor;