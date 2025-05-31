# 🚀 MOCI 2.0 Quick Start Guide

Get started with MOCI in under 2 minutes!

## What is MOCI?

MOCI (Machine-Optimized Context Instructions) compresses AI context files by 87%, letting you load 7-8x more context per Claude conversation.

## Instant Start (No Installation!)

### Option 1: Use Existing MOCI Files

1. **Open the MOCI Loader**
   - Go to: [MOCI Loader Tool](https://scottloeb.github.io/garden/toolshed/moci-tools/moci-loader.html)
   - Or open locally: `/toolshed/moci-tools/moci-loader.html`

2. **Select MOCI Files**
   - Click "Choose MOCI files"
   - Navigate to `/contexts/moci/`
   - Select multiple files (Cmd/Ctrl+click)

3. **Copy to Claude**
   - Click "Copy All to Clipboard"
   - Paste into Claude conversation
   - That's it! 🎉

### Option 2: Convert Your Own Files

1. **Open the MOCI Converter**
   - Go to: [MOCI Converter Tool](https://scottloeb.github.io/garden/toolshed/moci-tools/moci-converter.html)
   - Or open locally: `/toolshed/moci-tools/moci-converter.html`

2. **Convert CIT → MOCI**
   - Paste your context file into left panel
   - Click "Encode to MOCI →"
   - Save the compressed version

3. **Use Your MOCI File**
   - Load it with the MOCI Loader
   - Or paste directly into Claude
   - Enjoy 87% smaller contexts!

## Real Example

### Before (CIT format) - 487 tokens:
```markdown
# CIT_Personal_Zach_20250531

## User Profile
- **Name:** Zach
- **Age:** 8 years old
- **Conditions:** Autism, PDA (Pathological Demand Avoidance)
...
```

### After (MOCI format) - 84 tokens:
```
👤:Zach|8yo|🧠:autism/PDA
🎮:gaming>homework|⏱️:<1min|🎨:lightblue/purple/pink
...
```

**Same information, 83% smaller!**

## Tips for Best Results

### Loading Multiple Files
- Start with 5-10 MOCI files
- Test Claude's response quality
- Add more as needed (up to 30+!)

### Creating New MOCI Files
- Focus on essential information
- Use standard patterns (see docs)
- Test bidirectional conversion

### Organization
- Keep original CITs as backups
- Store MOCI files together
- Use descriptive filenames

## Common Patterns

```
👤 = user/person
📋 = template/CIT
🎯 = goal/objective
⚙️ = configuration
🧠 = cognitive/mental
🎨 = design/visual
📊 = data/metrics
🔧 = technical/tools
```

## Troubleshooting

**Q: How do I know it's working?**
A: Claude will understand the compressed format. You'll see more context capacity.

**Q: Can I mix regular files with MOCI?**
A: Yes! Use MOCI for large contexts, regular format for small ones.

**Q: What if I need to edit a MOCI file?**
A: Use the converter to decode → edit → re-encode.

## Next Steps

1. **Try the example files** in `/contexts/moci/`
2. **Convert one of your own** context files
3. **Share your results** with the community
4. **Read full docs** at [README_MOCI.md](README_MOCI.md)

---

**Need help?** Open an issue on GitHub or check the full documentation.

**Ready to revolutionize your AI conversations? Start now!** 🚀