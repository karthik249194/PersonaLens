# PersonaLens - AI-Powered Figma Plugin

Transform multi-modal research data into beautiful, editable Figma persona maps using Claude AI.

## 🎯 Overview

PersonaLens bridges the gap between UX research and design by allowing researchers and designers to:
- Upload research data (PDFs, Word docs, audio files)
- Have conversational analysis with Claude AI
- Generate professional 1920×1080 persona maps directly in Figma
- Maintain full editability of all design elements

## ✨ Features

### Multi-Modal Data Ingestion
- **Supported formats**: `.docx`, `.pdf`, `.mp3`, `.wav`
- **Drag & drop** or click to upload
- **Multiple file** processing in one session

### Conversational AI Synthesis
- **Chat with Claude** to extract insights from your research
- **Contextual understanding** of UX research terminology
- **Structured output** optimized for 1920×1080 layouts

### Professional Persona Maps
- **Exact dimensions**: 1920×1080 landscape frames
- **2-column layout**: Profile + detailed content sections
- **Auto-generated touchpoints**: Organizational flow diagrams
- **Fully editable**: All text and graphics are native Figma layers

### Session Management
- **Save conversations** for later reference
- **Load previous sessions** from dropdown
- **Export history** for documentation

### Customizable UI
- **Dark/Light mode** toggle
- **Responsive design**
- **Smooth animations**

## 📋 Technical Specifications

### Canvas Layout (1920×1080)

```
┌─────────────────────────────────────────────────────┐
│  LEFT COLUMN (640px)   │   RIGHT COLUMN (1280px)    │
│  ─────────────────────  │  ───────────────────────   │
│  • Profile Image        │  • Key Quote               │
│  • Persona Name         │  • Roles & Responsibilities│
│  • Logo Placeholder     │  • Products Used           │
│                         │  • Delights                │
│                         │  • Challenges              │
│                         │  • Wishes                  │
│                         │  • Touch-points Diagram    │
└─────────────────────────────────────────────────────┘
```

### Character Constraints

To ensure clean layouts without overflow:

| Section | Constraint |
|---------|-----------|
| Key Quote | Max 80 characters |
| Roles & Responsibilities | 4 bullets, 120 chars each |
| Products Used | 4 items, 40 chars each |
| Delights/Challenges/Wishes | 3-4 bullets, 100 chars each |
| Touch-points | 5-6 key stakeholders |

### JSON Schema

```json
{
  "metadata": {
    "canvas_size": "1920x1080",
    "persona_type": "Primary/Secondary"
  },
  "identity": {
    "name": "String",
    "role_title": "String",
    "key_quote": "String (max 80 chars)"
  },
  "content_sections": {
    "roles_responsibilities": ["Array of 4 strings (120 chars each)"],
    "products_used": ["Array of 4 strings (40 chars each)"],
    "delights": ["Array of 3-4 strings (100 chars each)"],
    "challenges": ["Array of 3-4 strings (100 chars each)"],
    "wishes": ["Array of 3-4 strings (100 chars each)"]
  },
  "hierarchy": {
    "reports_to": "String",
    "interacts_with": ["Array of strings"]
  },
  "touchpoints": [
    {
      "role": "String",
      "relationship": "reports_to|interacts"
    }
  ]
}
```

## 🚀 Installation

### Prerequisites
- Figma Desktop App (recommended) or Figma Web
- Anthropic API access (Claude API key will be managed by the plugin)

### Setup Steps

1. **Download the plugin files**
   ```
   personalens-plugin/
   ├── manifest.json
   ├── code.js
   └── ui.html
   ```

2. **Import to Figma**
   - Open Figma Desktop App
   - Go to `Plugins` → `Development` → `Import plugin from manifest`
   - Select the `manifest.json` file
   - The plugin will appear in your plugins list

3. **Configure API Access**
   - The plugin uses the Anthropic API endpoint
   - Network access is pre-configured in `manifest.json`
   - No additional API key configuration needed (handled in production)

## 📖 Usage Guide

### Basic Workflow

1. **Launch Plugin**
   - Right-click on canvas → `Plugins` → `PersonaLens`
   - Plugin UI opens in a side panel

2. **Upload Research Data**
   - Drag & drop files into the upload area
   - Or click to browse and select files
   - Supported: `.docx`, `.pdf`, `.mp3`, `.wav`

3. **Converse with Claude**
   - Ask questions about your research
   - Example: "What are the main pain points for CMR managers?"
   - Claude analyzes and responds with insights

4. **Generate Persona Map**
   - When ready, say "Generate persona map" or click the generate button
   - Claude provides structured JSON
   - Click "Generate 1920×1080 Persona Map"
   - Frame appears on your canvas, fully editable!

### Example Conversation

```
User: I've uploaded interview transcripts with 5 CMR managers. 
      What are their biggest challenges?

Claude: Based on the transcripts, CMR managers face three main challenges:
        1. Manual effort in capacity management using Excel
        2. Communication gaps between trial planning and execution
        3. Lack of real-time visibility into resource vacancies
        
        Would you like me to dive deeper into any of these?

User: Yes, tell me more about the Excel problem.

Claude: The manual Excel-based workflow creates several issues:
        - Time-consuming data entry and calculations
        - Error-prone when coordinating across regions
        - Difficult to share updates with stakeholders
        - No automated forecasting capabilities
        
        Managers wish for ML-powered capacity planning tools.

User: Great! Generate a persona map with this information.

Claude: [Provides structured JSON with all sections filled]

User: [Clicks "Generate 1920×1080 Persona Map"]

Result: Beautiful persona map appears on canvas! ✨
```

## 🎨 Design Specifications

### Color Palette

**Dark Mode (Default)**
- Background: `#1a1a1a`
- Text: `#e0e0e0`
- Cards: `#2a2a2a`
- Accent: `#6b46c1` (Purple)

**Light Mode**
- Background: `#ffffff`
- Text: `#333333`
- Cards: `#f7fafc`
- Accent: `#6b46c1` (Purple)

### Typography
- Font Family: Inter
- Persona Name: 48px Bold
- Headers: 24px Bold
- Body Text: 14px Regular
- Small Text: 12px Regular

### Spacing
- Frame Padding: 60px
- Section Gaps: 30px
- Bullet Spacing: 16px
- Column Gap: 30px

## 🔧 Development

### File Structure

```
personalens-plugin/
├── manifest.json          # Plugin configuration
├── code.js               # Figma plugin logic (canvas generation)
├── ui.html               # Chat UI + Claude integration
└── README.md            # Documentation
```

### Key Functions

**code.js**
- `generatePersonaFrame()` - Creates 1920×1080 frame
- `createLeftColumn()` - Profile section
- `createRightColumn()` - Content sections
- `createTouchpoints()` - Flow diagram
- `saveSession()` - Persist conversations
- `loadSession()` - Restore previous chats

**ui.html (JavaScript)**
- `callClaudeAPI()` - Communicates with Claude
- `handleFiles()` - Process uploaded files
- `sendMessage()` - Chat functionality
- `generateBtn.click()` - Trigger frame generation

### Customization

**Modify Layout Dimensions**
```javascript
// In code.js
const FRAME_WIDTH = 1920;
const FRAME_HEIGHT = 1080;
const LEFT_COLUMN_WIDTH = 640;
```

**Change Color Scheme**
```css
/* In ui.html <style> */
.dark-mode {
  background-color: #your-color;
}
```

**Adjust Character Limits**
```javascript
// In ui.html callClaudeAPI()
const systemPrompt = `
Character limits:
- Quote: Max 80 chars
- Roles: 4 bullets, max 120 chars each
...
`;
```

## 🧪 Testing

### Test with Sample Data

Use the provided `sample-cmr-persona.json` to test frame generation:

```javascript
// In Figma, run this in the console:
parent.postMessage({
  pluginMessage: {
    type: 'generate-persona',
    data: /* paste sample-cmr-persona.json content */
  }
}, '*');
```

### Expected Output
- Frame named "Persona: CMR Management"
- Dimensions exactly 1920×1080
- All text layers editable
- Touch-points diagram with 7 nodes
- Dark left column with placeholder image
- White right column with categorized content

## 🐛 Troubleshooting

### Common Issues

**Plugin won't load**
- Ensure you're using Figma Desktop App (not browser)
- Check that all three files are in the same directory
- Verify `manifest.json` is valid JSON

**API calls failing**
- Check network connectivity
- Verify Anthropic API endpoint is accessible
- Review browser console for error messages

**Frame not generating**
- Ensure JSON structure matches schema exactly
- Check that all required fields are present
- Verify character limits are respected

**Text overflow on canvas**
- Content exceeds character limits
- Manually adjust text in Figma after generation
- Re-generate with shorter content

## 📊 Success Criteria

✅ Plugin successfully creates 1920×1080 frames
✅ All text layers are editable after generation
✅ Conversational state persists across sessions
✅ Multi-modal file upload works smoothly
✅ Touch-points diagram auto-generates correctly
✅ Dark/Light mode toggle functions properly

## 🔒 Security & Privacy

- Files are processed client-side
- API calls use secure HTTPS
- No data is stored on external servers
- Session data saved locally in Figma
- User can delete sessions anytime

## 📝 License

This plugin is provided as-is for educational and commercial use.

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Audio transcription integration
- More layout templates
- Export to other formats
- Multi-language support
- Collaborative features

## 📬 Support

For issues or questions:
- Open an issue in the repository
- Check Figma Plugin documentation
- Review Anthropic Claude API docs

## 🎉 Credits

Built with:
- **Claude AI** by Anthropic
- **Figma Plugin API**
- **Inter Font** by Rasmus Andersson

---

**Made with ❤️ for UX Researchers everywhere**
