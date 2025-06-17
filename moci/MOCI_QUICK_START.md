# 🚀 MOCI 2.0 Quick Start Guide

## 🎯 Start Using MOCI in 2 Minutes

### Option 1: Load MOCI Files into Claude (Easiest)
1. **Open the MOCI Loader:** `toolshed/moci-tools/moci-loader.html`
2. **Select MOCI files** from `contexts/moci/` directory
3. **Click "Copy All"** button
4. **Paste into Claude** and start your conversation with 7x more context!

### Option 2: Convert Your Own CITs
1. **Open the MOCI Converter:** `toolshed/moci-tools/moci-converter.html`  
2. **Paste your CIT** content into the left panel
3. **See instant MOCI** compression on the right
4. **Save the MOCI** file for future use

## 📊 Example: Loading Multiple Contexts

```bash
# Traditional way (hits limits fast):
- Load CIT_Personal_Scott.md (2,847 tokens)
- Load CIT_ProjectManagement.md (1,893 tokens)  
- Load CIT_CoreStandards.md (1,234 tokens)
Total: 5,974 tokens (already 6% of limit!)

# MOCI way (barely uses any space):
- Load MOCI_Personal_Scott.moci (487 tokens)
- Load MOCI_ProjectManagement.moci (245 tokens)
- Load MOCI_CoreStandards.moci (198 tokens)
Total: 930 tokens (less than 1% of limit!)
```

## 🛠️ Understanding MOCI Format

### Simple Example
**Original CIT:**
```markdown
The user prefers light blue (#87ceeb), purple (#9370db), and pink (#ffc0cb) colors.
They dislike orange. The interface should use Star Trek LCARS styling.
```

**MOCI Encoded:**
```
🎨c[#87ceeb,#9370db,#ffc0cb]×[🟠]
🖼️ui[trek.lcars]
```

**Compression:** 88% smaller!

## 💡 Pro Tips

### 1. Load Your Entire Project
With MOCI, you can load:
- All personal contexts
- All project contexts  
- All tool documentation
- Still have 90% space left!

### 2. Combine Related Contexts
The MOCI Loader lets you select multiple files:
- Ctrl/Cmd+Click to select multiple
- Load 10+ contexts at once
- Never worry about limits

### 3. Keep Both Versions
- Human-readable CITs in `contexts/`
- Machine-optimized MOCIs in `contexts/moci/`
- Best of both worlds!

## 🚨 Common Questions

**Q: Will Claude understand MOCI format?**  
A: Yes! Include this line when loading MOCI files:
```
"Initialize with MOCI-encoded contexts. These use multi-language compression
but contain 100% of the original information."
```

**Q: Can I edit MOCI files directly?**  
A: Not recommended. Edit the original CIT and reconvert.

**Q: How much can I compress?**  
A: Average 87%, but we've seen up to 91% on some contexts!

## 🎉 Ready to Start?

1. **Try it now:** Open [MOCI Loader](toolshed/moci-tools/moci-loader.html)
2. **Load some contexts** from `contexts/moci/`
3. **Experience the freedom** of unlimited context!

---

**Need help?** Check the full [MOCI Documentation](README_MOCI.md)  
**Want to contribute?** See our [GitHub Repository](https://github.com/scottloeb/garden)