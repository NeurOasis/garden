# GARDEN Version Audit Script Usage Guide

## Quick Start

1. **Save the script** as `version-audit.js` in your GARDEN repo root
2. **Run monthly audit:**
   ```bash
   node version-audit.js
   ```
3. **Check generated reports:**
   - `version-audit-report.json` (detailed data)
   - `version-audit-report.md` (readable summary)

## Command Line Options

```bash
# Scan current directory
node version-audit.js

# Scan specific repository path
node version-audit.js --repo-path ~/Desktop/GitHub/neuroasis/garden

# Run from anywhere
node /path/to/version-audit.js --repo-path /path/to/garden
```

## What It Finds

### Version Patterns Detected:
- **NodePad versions**: `NodePad 5.1.0`, `NodePad v4.0.0`
- **Module Generator**: `ModuleGenerator v2`, `Module Generator v1`
- **CIT versions**: `CIT_Something_v1.2`, `Version: 2.3.1`
- **Date versions**: `CIT_ProjectName_20250525`
- **Framework versions**: `Framework v3.1`
- **API versions**: `API v2.1`
- **Generic versions**: `v1.2.3`, `version 2.1`

### File Types Scanned:
- `.md`, `.txt`, `.js`, `.html`, `.json`, `.yaml`, `.py`
- Skips: `.git`, `node_modules`, `dist`, `build`, `.vercel`

## Sample Output

```
🔍 Starting GARDEN Version Audit...
📁 Scanning repository: /Users/scott/Desktop/GitHub/neuroasis/garden

📊 GARDEN VERSION AUDIT REPORT
==================================================

📈 SUMMARY:
   Files scanned: 47
   Components found: 5
   Version inconsistencies: 2

🔧 COMPONENT VERSIONS:

   NodePad:
     Latest: 5.1.0
     Total versions found: 3
     Files affected: 8
     ⚠️  Outdated versions: 4.0.0, 4.1.0

   ModuleGenerator:
     Latest: 2
     Total versions found: 2
     Files affected: 4
     ⚠️  Outdated versions: 1

⚠️  VERSION INCONSISTENCIES:

   NodePad:
     Versions in use: 4.0.0, 4.1.0, 5.1.0
     Latest identified: 5.1.0
     Files affected: 8
     ❌ 4.0.0 found in:
        contexts/CIT_GARDEN_20250525.md:45 - "NodePad 4.0.0 Framework"
        README.md:12 - "Built with NodePad 4.0.0"

🎯 RECOMMENDED ACTIONS:

   1. Update NodePad references:
      From: 4.0.0, 4.1.0
      To: 5.1.0
      Files with 4.0.0:
        - contexts/CIT_GARDEN_20250525.md:45
        - README.md:12
```

## Monthly Workflow

### 1. Run the Audit
```bash
cd ~/Desktop/GitHub/neuroasis/garden
node version-audit.js
```

### 2. Review the Reports
- Check console output for immediate issues
- Review `version-audit-report.md` for detailed findings
- Examine `version-audit-report.json` for programmatic processing

### 3. Update Outdated References
For each action item:
1. Open the file at the specified line
2. Update the version number
3. Consider whether the content needs broader updates
4. Test if the reference is still accurate

### 4. Track Changes
- Commit version updates with clear messages
- Note any content that needs deeper revision
- Update documentation to reflect current capabilities

## Advanced Usage

### Custom Patterns
Edit the `versionPatterns` array in the script to add specific patterns for your components:

```javascript
// Add custom patterns
/YourComponent\s+v?(\d+\.\d+\.\d+)/gi,
/SpecialTool\s+(\d+\.\d+)/gi,
```

### Automated Monthly Check
Create a monthly cron job:
```bash
# Add to crontab (runs 1st of each month at 9 AM)
0 9 1 * * cd ~/Desktop/GitHub/neuroasis/garden && node version-audit.js
```

### Integration with Git
```bash
# Create version audit branch
git checkout -b version-audit-$(date +%Y%m%d)
node version-audit.js
# Review and commit changes
git add version-audit-report.*
git commit -m "Monthly version audit - $(date +%Y-%m-%d)"
```

## What to Do with Results

### High Priority Updates:
- **NodePad versions**: Critical for technical accuracy
- **API versions**: Important for integration guidance
- **Framework versions**: Essential for development instructions

### Medium Priority Updates:
- **Module Generator versions**: Important for technical decisions
- **CIT versions**: Consider consolidation vs keeping history

### Low Priority Updates:
- **Date-based versions**: Often intentionally historical
- **Generic versions**: May be examples rather than references

### Content Review Triggers:
When updating versions, also check if:
- Features described still exist in new version
- Examples are still accurate
- Links and references are still valid
- Performance claims are still true

## Troubleshooting

### Script Won't Run:
```bash
# Check Node.js installation
node --version

# Make script executable (if needed)
chmod +x version-audit.js
```

### No Results Found:
- Check if you're in the right directory
- Verify file extensions are included in `scanExtensions`
- Add custom patterns for your specific components

### Too Many False Positives:
- Refine the version patterns in the script
- Add components to skip in `extractComponentName` function
- Adjust patterns to be more specific

## Monthly Checklist

- [ ] Run version audit script
- [ ] Review generated reports
- [ ] Update outdated version references
- [ ] Check if updated content is still accurate
- [ ] Test any changed technical instructions
- [ ] Commit changes with clear messages
- [ ] Archive old reports (keep last 3 months)

This systematic approach ensures your GARDEN documentation stays current and technically accurate!