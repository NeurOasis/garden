#!/usr/bin/env node

/**
 * GARDEN Version Audit Script
 * 
 * Systematically scans the entire GARDEN repository for version references
 * and identifies inconsistencies, outdated versions, and components needing updates.
 * 
 * Usage: node tools/version-audit.js
 * Output: Console report + JSON data + Markdown summary
 */

const fs = require('fs');
const path = require('path');

class GARDENVersionAuditor {
    constructor(rootPath) {
        this.rootPath = rootPath;
        this.findings = {
            nodepad: [],
            moduleGenerator: [],
            citVersions: [],
            genericVersions: [],
            inconsistencies: []
        };
        
        // Version patterns to detect
        this.patterns = {
            nodepad: /NodePad\s*(?:v?(\d+\.\d+\.\d+)|(\d+\.\d+))/gi,
            moduleGeneratorOld: /ModuleGenerator\s*[vV]?([12])/gi,
            moduleGeneratorNew: /ModuleGenerator_(?:Gen(\d+(?:\.\d+)?)|Gen(\d+))/gi,
            citVersions: /CIT_\w+_(\d{8})/gi,
            semanticVersions: /v?(\d+\.\d+\.\d+)/gi,
            graphSynth: /GraphSynth\s*(?:v?(\d+\.\d+))/gi
        };
    }

    async scanRepository() {
        console.log('🔍 GARDEN Version Audit Starting...\n');
        
        await this.scanDirectory(this.rootPath);
        this.analyzeFindings();
        this.generateReports();
        
        console.log('\n✅ Version audit complete!');
        console.log('📊 Reports generated:');
        console.log('   - version-audit-summary.json');
        console.log('   - version-audit-report.md');
    }

    async scanDirectory(dirPath) {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stat = fs.statSync(fullPath);
            
            // Skip hidden files and git directory
            if (item.startsWith('.') || item === 'node_modules') continue;
            
            if (stat.isDirectory()) {
                await this.scanDirectory(fullPath);
            } else if (this.isTextFile(item)) {
                await this.scanFile(fullPath);
            }
        }
    }

    isTextFile(filename) {
        const textExtensions = ['.md', '.txt', '.js', '.py', '.html', '.css', '.json', '.yml', '.yaml'];
        return textExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    }

    async scanFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            const relativePath = path.relative(this.rootPath, filePath);
            
            lines.forEach((line, index) => {
                this.checkNodePadVersions(line, relativePath, index + 1);
                this.checkModuleGeneratorVersions(line, relativePath, index + 1);
                this.checkCITVersions(line, relativePath, index + 1);
                this.checkGenericVersions(line, relativePath, index + 1);
            });
        } catch (error) {
            console.warn(`⚠️  Could not read file: ${filePath}`);
        }
    }

    checkNodePadVersions(line, file, lineNum) {
        let match;
        while ((match = this.patterns.nodepad.exec(line)) !== null) {
            const version = match[1] || match[2];
            this.findings.nodepad.push({
                file,
                line: lineNum,
                content: line.trim(),
                version,
                needsUpdate: this.isOutdatedNodePad(version)
            });
        }
    }

    checkModuleGeneratorVersions(line, file, lineNum) {
        // Check for old V1/V2 naming
        let match;
        while ((match = this.patterns.moduleGeneratorOld.exec(line)) !== null) {
            this.findings.moduleGenerator.push({
                file,
                line: lineNum,
                content: line.trim(),
                oldNaming: `V${match[1]}`,
                suggestedUpdate: match[1] === '1' ? 'Gen1' : 'Archive as Gen1.5',
                needsUpdate: true
            });
        }
        
        // Check for new Gen naming
        while ((match = this.patterns.moduleGeneratorNew.exec(line)) !== null) {
            const gen = match[1] || match[2];
            this.findings.moduleGenerator.push({
                file,
                line: lineNum,
                content: line.trim(),
                generation: `Gen${gen}`,
                needsUpdate: false
            });
        }
    }

    checkCITVersions(line, file, lineNum) {
        let match;
        while ((match = this.patterns.citVersions.exec(line)) !== null) {
            this.findings.citVersions.push({
                file,
                line: lineNum,
                content: line.trim(),
                date: match[1],
                needsReview: this.isOldCITDate(match[1])
            });
        }
    }

    checkGenericVersions(line, file, lineNum) {
        let match;
        while ((match = this.patterns.semanticVersions.exec(line)) !== null) {
            // Skip if already caught by more specific patterns
            if (line.includes('NodePad') || line.includes('ModuleGenerator')) continue;
            
            this.findings.genericVersions.push({
                file,
                line: lineNum,
                content: line.trim(),
                version: match[1]
            });
        }
    }

    isOutdatedNodePad(version) {
        // Consider anything below 5.1.0 as outdated
        const [major, minor] = version.split('.').map(Number);
        return major < 5 || (major === 5 && minor < 1);
    }

    isOldCITDate(dateStr) {
        // Flag CIT versions older than 30 days for review
        const citDate = new Date(
            dateStr.substring(0, 4),
            dateStr.substring(4, 6) - 1,
            dateStr.substring(6, 8)
        );
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        return citDate < thirtyDaysAgo;
    }

    analyzeFindings() {
        // Detect inconsistencies
        const nodePadVersions = [...new Set(this.findings.nodepad.map(f => f.version))];
        if (nodePadVersions.length > 1) {
            this.findings.inconsistencies.push({
                type: 'NodePad version inconsistency',
                versions: nodePadVersions,
                recommendation: 'Standardize on NodePad 5.1.0+ living standard'
            });
        }

        // Check for old ModuleGenerator naming
        const oldNaming = this.findings.moduleGenerator.filter(f => f.needsUpdate);
        if (oldNaming.length > 0) {
            this.findings.inconsistencies.push({
                type: 'ModuleGenerator naming inconsistency',
                count: oldNaming.length,
                recommendation: 'Update V1/V2 naming to Gen1/GraphSynth 2.0'
            });
        }
    }

    generateReports() {
        this.generateConsoleReport();
        this.generateJSONReport();
        this.generateMarkdownReport();
    }

    generateConsoleReport() {
        console.log('📊 GARDEN VERSION AUDIT RESULTS');
        console.log('================================\n');
        
        // NodePad findings
        const outdatedNodePad = this.findings.nodepad.filter(f => f.needsUpdate);
        if (outdatedNodePad.length > 0) {
            console.log(`🚨 OUTDATED NODEPAD VERSIONS (${outdatedNodePad.length} found):`);
            outdatedNodePad.forEach(f => {
                console.log(`   ${f.file}:${f.line} - NodePad ${f.version} → Should be 5.1.0+`);
            });
            console.log();
        }

        // ModuleGenerator findings
        const oldModuleGen = this.findings.moduleGenerator.filter(f => f.needsUpdate);
        if (oldModuleGen.length > 0) {
            console.log(`🔄 MODULE GENERATOR NAMING UPDATES (${oldModuleGen.length} found):`);
            oldModuleGen.forEach(f => {
                console.log(`   ${f.file}:${f.line} - ${f.oldNaming} → ${f.suggestedUpdate}`);
            });
            console.log();
        }

        // Inconsistencies
        if (this.findings.inconsistencies.length > 0) {
            console.log(`⚠️  INCONSISTENCIES DETECTED:`);
            this.findings.inconsistencies.forEach(inc => {
                console.log(`   ${inc.type}: ${inc.recommendation}`);
            });
            console.log();
        }

        // Summary
        const totalIssues = outdatedNodePad.length + oldModuleGen.length + this.findings.inconsistencies.length;
        if (totalIssues === 0) {
            console.log('✅ NO VERSION ISSUES DETECTED - Repository is clean!');
        } else {
            console.log(`📋 SUMMARY: ${totalIssues} version issues need attention`);
        }
    }

    generateJSONReport() {
        const report = {
            auditDate: new Date().toISOString(),
            summary: {
                nodePadIssues: this.findings.nodepad.filter(f => f.needsUpdate).length,
                moduleGeneratorIssues: this.findings.moduleGenerator.filter(f => f.needsUpdate).length,
                inconsistencies: this.findings.inconsistencies.length,
                totalIssues: this.findings.nodepad.filter(f => f.needsUpdate).length + 
                           this.findings.moduleGenerator.filter(f => f.needsUpdate).length + 
                           this.findings.inconsistencies.length
            },
            findings: this.findings
        };

        fs.writeFileSync(
            path.join(this.rootPath, 'version-audit-summary.json'),
            JSON.stringify(report, null, 2)
        );
    }

    generateMarkdownReport() {
        let markdown = `# GARDEN Version Audit Report\n\n`;
        markdown += `**Audit Date:** ${new Date().toLocaleDateString()}\n\n`;
        
        // Summary
        const totalIssues = this.findings.nodepad.filter(f => f.needsUpdate).length + 
                           this.findings.moduleGenerator.filter(f => f.needsUpdate).length + 
                           this.findings.inconsistencies.length;
        
        markdown += `## Executive Summary\n\n`;
        if (totalIssues === 0) {
            markdown += `✅ **Repository Status:** CLEAN - No version issues detected\n\n`;
        } else {
            markdown += `⚠️ **Issues Found:** ${totalIssues} version references need attention\n\n`;
        }

        // Detailed findings
        if (this.findings.nodepad.filter(f => f.needsUpdate).length > 0) {
            markdown += `## NodePad Version Updates Needed\n\n`;
            this.findings.nodepad.filter(f => f.needsUpdate).forEach(f => {
                markdown += `- **${f.file}:${f.line}** - NodePad ${f.version} → Should be 5.1.0+\n`;
                markdown += `  \`${f.content}\`\n\n`;
            });
        }

        if (this.findings.moduleGenerator.filter(f => f.needsUpdate).length > 0) {
            markdown += `## ModuleGenerator Naming Updates Needed\n\n`;
            this.findings.moduleGenerator.filter(f => f.needsUpdate).forEach(f => {
                markdown += `- **${f.file}:${f.line}** - ${f.oldNaming} → ${f.suggestedUpdate}\n`;
                markdown += `  \`${f.content}\`\n\n`;
            });
        }

        if (this.findings.inconsistencies.length > 0) {
            markdown += `## Inconsistencies Detected\n\n`;
            this.findings.inconsistencies.forEach(inc => {
                markdown += `- **${inc.type}**\n`;
                markdown += `  Recommendation: ${inc.recommendation}\n\n`;
            });
        }

        markdown += `## Next Steps\n\n`;
        markdown += `1. Review each flagged file and update version references\n`;
        markdown += `2. Test updated references for accuracy\n`;
        markdown += `3. Re-run audit to verify fixes: \`node tools/version-audit.js\`\n`;
        markdown += `4. Commit updates with proper documentation\n`;

        fs.writeFileSync(
            path.join(this.rootPath, 'version-audit-report.md'),
            markdown
        );
    }
}

// Run the audit
if (require.main === module) {
    const auditor = new GARDENVersionAuditor(process.cwd());
    auditor.scanRepository().catch(console.error);
}

module.exports = GARDENVersionAuditor;
