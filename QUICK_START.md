# PersonaLens - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Import to Figma (2 min)

1. Open **Figma Desktop App** (required for plugins)
2. Navigate to: `Plugins` → `Development` → `Import plugin from manifest`
3. Select the `manifest.json` file from the `personalens-plugin` folder
4. Plugin appears in your plugins list as "PersonaLens"

### Step 2: Test with Sample Data (1 min)

1. Launch the plugin: Right-click canvas → `Plugins` → `PersonaLens`
2. In the chat, type: **"Generate a CMR Management persona"**
3. Click the **"Generate 1920×1080 Persona Map"** button
4. Watch as a fully-formatted persona appears on your canvas! ✨

### Step 3: Use Your Own Research (2 min)

1. **Upload files**: Drag & drop your research documents (PDFs, Word docs)
2. **Chat with Claude**: Ask about pain points, behaviors, goals
3. **Refine insights**: Have a conversation to extract what matters
4. **Generate**: Say "create persona map" and click generate

## 📁 What's Included

```
personalens-plugin/
├── manifest.json              # Plugin configuration
├── code.js                    # Canvas generation logic
├── ui.html                    # Chat interface with Claude
├── README.md                  # Full documentation
├── CLAUDE_SYSTEM_PROMPT.md   # AI configuration
└── sample-cmr-persona.json   # Test data
```

## 🎯 Key Features

### ✅ What Works Out of the Box
- Multi-file upload (drag & drop)
- Conversational AI synthesis
- Auto-generation of 1920×1080 frames
- Dark/Light mode toggle
- Session save/load
- Fully editable Figma layers

### 🔧 What You Can Customize
- Layout dimensions (change FRAME_WIDTH/HEIGHT in code.js)
- Color schemes (modify CSS in ui.html)
- Character limits (adjust in CLAUDE_SYSTEM_PROMPT.md)
- Font families (update in code.js)

## 💡 Pro Tips

### Getting Better Results
1. **Be specific**: "What tools does this persona use?" gets better data than "Tell me about them"
2. **Iterate**: You can refine the persona by chatting more before generating
3. **Multiple personas**: Save each conversation to create multiple persona maps
4. **Edit after**: All text is editable in Figma - polish as needed

### Common Workflows

**Workflow 1: Quick Persona from Notes**
```
Upload → Ask "Summarize key insights" → Generate
Time: ~2 minutes
```

**Workflow 2: Deep Research Synthesis**
```
Upload multiple files → Ask targeted questions → 
Refine understanding → Generate → Edit in Figma
Time: ~15 minutes
```

**Workflow 3: Comparative Personas**
```
New Session → Upload User A data → Generate → 
New Session → Upload User B data → Generate → Compare
Time: ~10 minutes
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Plugin won't load | Use Figma Desktop App (not browser) |
| Files won't upload | Check file format: .docx, .pdf, .mp3, .wav only |
| Generate button disabled | Say "generate persona" to trigger JSON output |
| Text overflowing | Content exceeded character limits - edit in Figma |
| JSON error | Check console (Cmd+Option+I) for validation issues |

## 📊 Success Metrics

You'll know it's working when:
- ✅ Frame is exactly 1920×1080 pixels
- ✅ All text is editable (not images or groups)
- ✅ Touch-points diagram auto-generates
- ✅ Layout matches reference design
- ✅ Session saves/loads properly

## 🎨 Example Outputs

### Sample Persona: CMR Management
- **Role**: Clinical Manager - Regional
- **Key Insight**: Manual Excel workflows causing inefficiency
- **Pain Points**: Communication gaps, lack of real-time data
- **Wishes**: ML-powered forecasting, automated capacity planning

See `sample-cmr-persona.json` for complete data structure.

## 🔗 Next Steps

1. **Customize**: Edit colors, fonts, layout in the code
2. **Extend**: Add more persona templates (patient personas, stakeholder maps)
3. **Integrate**: Connect to other research tools via API
4. **Share**: Export personas as PDFs or images for stakeholders

## 📚 Resources

- **Full Documentation**: `README.md`
- **System Prompt**: `CLAUDE_SYSTEM_PROMPT.md`
- **Figma Plugin API**: https://www.figma.com/plugin-docs/
- **Claude API Docs**: https://docs.anthropic.com/

## 💬 Support

Stuck? Check these first:
1. Is Figma Desktop App running?
2. Are files in the correct format?
3. Did you click "Generate" after getting JSON?
4. Check the browser console for errors

## 🎉 Ready to Go!

You now have everything you need to transform your research into beautiful persona maps. Start with the sample data, then try your own research files.

**Remember**: The best personas come from thoughtful conversations with Claude about your research. Don't rush - take time to explore the insights!

---

**Made with ❤️ for UX Researchers**

Questions? Feedback? Let us know!
