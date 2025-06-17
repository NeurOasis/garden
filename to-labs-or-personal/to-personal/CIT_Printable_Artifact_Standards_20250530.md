# CIT_Printable_Artifact_Standards_20250530.md

## 🖨️ GARDEN Printable Artifact Standards

```
Project: Standard Templates for Printable Artifacts
Current Version: v1.0 (Extracted from Brandy case study)
Date: 20250530
Status: Core standard for all printable GARDEN outputs
Purpose: Prevent format iteration cycles in printable requests
```

## 📋 **STANDARD PRINTABLE FORMATS**

### **8.5" x 11" Letter Format (US Standard)**
```css
@page {
    size: letter;
    margin: 0.5in;
}

body {
    font-family: Arial, sans-serif;
    font-size: 12pt;
    line-height: 1.4;
}

h1 { font-size: 18pt; margin-bottom: 10px; }
h2 { font-size: 14pt; margin-bottom: 8px; }
```

### **Key Requirements**
- **Font Size:** 12pt minimum for body text
- **Margins:** 0.5" minimum for lamination compatibility
- **Line Height:** 1.4 for readability
- **Color:** Black text on white background
- **Checkboxes:** 20x20px minimum for pen marking

## ✅ **CHECKBOX PATTERNS**

### **Standard Checkbox HTML**
```html
<span class="checkbox"></span>

<style>
.checkbox {
    width: 20px;
    height: 20px;
    border: 1px solid #333;
    display: inline-block;
    margin-right: 5px;
    vertical-align: middle;
}
</style>
```

### **Checkbox Usage Guidelines**
- Place BEFORE text for left-hand checking
- Minimum 5px spacing from text
- Group related items with consistent indentation
- Consider pen width for box size

## 📊 **TABLE FORMATS**

### **Standard Table Structure**
```html
<table>
    <thead>
        <tr>
            <th class="time-col">Time</th>
            <th class="content-col">Content</th>
            <th class="notes-col">Notes</th>
        </tr>
    </thead>
    <tbody>
        <!-- rows -->
    </tbody>
</table>

<style>
table { 
    width: 100%; 
    border-collapse: collapse; 
}
th, td { 
    border: 1px solid #333; 
    padding: 8px; 
}
.time-col { width: 15%; }
.content-col { width: 60%; }
.notes-col { width: 25%; }
</style>
```

## 🎨 **LAMINATION CONSIDERATIONS**

### **Design for Durability**
- **Border Safety:** 0.25" clear border for lamination seal
- **High Contrast:** Black on white for marker visibility
- **No Bleed:** Keep critical content away from edges
- **Rounded Corners:** Account for lamination trimming

### **Reusable Surface Compatibility**
- Design for dry-erase markers
- Avoid fine details that smudge
- Use bold lines for divisions
- Consider erasure patterns

## 📐 **LAYOUT PATTERNS**

### **Single Page Optimization**
```css
/* Force single page */
.page-content {
    max-height: 9.5in; /* 11" - 1" margins */
    overflow: hidden;
}

/* Responsive spacing */
.compact-mode {
    line-height: 1.2;
    margin: 0.5em 0;
}

/* Print-specific */
@media print {
    .no-print { display: none; }
    .page-break { page-break-after: always; }
}
```

## 🔄 **MULTI-VERSION PATTERNS**

### **Today vs Ongoing Templates**
When schedules or processes have transition periods:
- **Page 1:** "TODAY ONLY" with specific date
- **Page 2:** "ONGOING" standard schedule
- **Visual Distinction:** Different header colors
- **Clear Dating:** Prevent confusion

## 📱 **RESPONSIVE CONSIDERATIONS**

### **Screen Preview vs Print**
```css
/* Screen preview */
@media screen {
    .printable {
        max-width: 8.5in;
        margin: 0 auto;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
}

/* Print reality */
@media print {
    .printable {
        box-shadow: none;
        margin: 0;
    }
}
```

## ✅ **VALIDATION CHECKLIST**

Before finalizing any printable:
- [ ] Fits on single 8.5x11 page
- [ ] 12pt minimum font size
- [ ] Checkboxes are 20x20px minimum
- [ ] 0.5" margins all around
- [ ] Black text on white background
- [ ] Lamination-safe borders
- [ ] Page orientation specified
- [ ] Print preview tested

## 🎯 **COMMON USE CASES**

1. **Medical Schedules:** Time-based tracking with checkboxes
2. **Daily Trackers:** Column-based activity logs
3. **Checklists:** Sequential task completion
4. **Reference Cards:** Quick lookup information
5. **Form Templates:** Fillable fields with pen

## 📝 **Version History**

```
20250530: v1.0 - Initial standards extracted from Brandy medication schedule success
```

## 🤖 **Note for Claude**

When users request "printable" artifacts:
1. **Assume 8.5x11** unless specified otherwise
2. **Include checkboxes** for any tracking/completion items
3. **Optimize for single page** by default
4. **Consider lamination** for repeated use items
5. **Test print preview** CSS before finalizing

These standards prevent the 4-6 revision cycles typically spent on format discovery!