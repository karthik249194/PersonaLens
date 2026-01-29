# PersonaLens - Implementation Notes & Technical Considerations

## 🏗️ Architecture Overview

### Component Stack

```
┌─────────────────────────────────────────┐
│          Figma Desktop App              │
│  ┌───────────────────────────────────┐  │
│  │     PersonaLens Plugin UI         │  │
│  │  (ui.html - Runs in iframe)       │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  Chat Interface             │  │  │
│  │  │  File Upload Handler        │  │  │
│  │  │  Session Management         │  │  │
│  │  └─────────────────────────────┘  │  │
│  │           ↓ postMessage            │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  Claude API Integration     │  │  │
│  │  │  (fetch → anthropic.com)    │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
│           ↕ figma.ui.onmessage          │
│  ┌───────────────────────────────────┐  │
│  │   Plugin Sandbox (code.js)        │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  Canvas Generator           │  │  │
│  │  │  Layer Creator              │  │  │
│  │  │  Storage Manager            │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
│              ↓ Figma API                │
│  ┌───────────────────────────────────┐  │
│  │      Figma Canvas                 │  │
│  │  (1920×1080 Persona Frames)       │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## 🔐 Security & API Configuration

### Current Implementation
The plugin currently uses **direct client-side API calls** to Anthropic. This works for development but has security implications:

```javascript
// ui.html
await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: systemPrompt,
    messages: [...]
  })
});
```

### Production Recommendations

#### Option 1: API Key in Plugin (Not Recommended)
❌ **Don't do this** - Exposes key in client code
❌ Users can extract key from network inspector
❌ No rate limiting or usage tracking

#### Option 2: Backend Proxy (Recommended)
✅ Secure API key on server
✅ Rate limiting per user
✅ Usage analytics
✅ Error handling and retries

```javascript
// Your Backend API
POST https://your-backend.com/api/synthesize
Body: { message, history, files }
→ Your backend calls Claude API
→ Returns response to plugin

// Plugin code
await fetch("https://your-backend.com/api/synthesize", {
  method: "POST",
  headers: { 
    "Authorization": `Bearer ${userToken}`,
    "Content-Type": "application/json" 
  },
  body: JSON.stringify({ message, history })
});
```

#### Option 3: Figma Tokens + OAuth
✅ Leverage Figma's user authentication
✅ Per-user API quotas
✅ Subscription management
✅ Best for paid plugins

### Network Access Configuration

```json
// manifest.json
{
  "networkAccess": {
    "allowedDomains": [
      "https://api.anthropic.com",
      "https://your-backend.com"  // Add your proxy
    ]
  }
}
```

## 📦 Data Flow & Storage

### File Processing Pipeline

```
User Uploads File
    ↓
FileReader API (browser)
    ↓
Extract Text/Base64
    ↓
Store in uploadedFiles[]
    ↓
Include in Claude Context
    ↓
Claude Analyzes
    ↓
Structured JSON Response
    ↓
Store in personaData
    ↓
Generate Button Enabled
    ↓
Click → postMessage to code.js
    ↓
Create Figma Layers
```

### Session Persistence

```javascript
// Saved in Figma's clientStorage
{
  "sessions": {
    "session-1234567890": {
      "name": "CMR Manager Research",
      "conversation": [
        { role: "user", content: "..." },
        { role: "assistant", content: "..." }
      ],
      "timestamp": 1234567890,
      "files": ["file1.pdf", "file2.docx"]
    }
  }
}
```

**Storage Limits**:
- Max 10MB per plugin
- Stored locally on user's machine
- Persists across Figma sessions
- Not synced across devices

## 🎨 Canvas Generation Details

### Layer Hierarchy

```
Frame: "Persona: CMR Management" [1920×1080]
├── Rectangle: "Left Background" [640×1080] #262626
│   └── Rectangle: "Profile Image Placeholder" [520×500]
│   └── Text: "Persona Label" [Inter Regular 18px]
│   └── Text: "Persona Name" [Inter Bold 48px]
│   └── Text: "Logo Placeholder" [Inter Regular 14px]
├── Text: "Key Quote" [Inter Regular 20px]
├── Text: "Roles Header" [Inter Bold 24px]
├── Group: "Role Bullet 1"
│   ├── Ellipse: [8×8] (bullet)
│   └── Text: [Inter Regular 14px]
├── ... (more bullets)
├── Text: "Delights Header"
├── ... (content sections)
└── Group: "Touchpoints"
    ├── Rectangle: "Node 1"
    ├── Ellipse: "Icon"
    ├── Text: "Label"
    └── Line: "Arrow" (connector)
```

### Font Loading

```javascript
// Must load fonts before creating text
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Bold" });

// Then create text nodes
const text = figma.createText();
text.fontName = { family: "Inter", style: "Bold" };
```

**Important**: If Inter font isn't available, fallback:
1. Check available fonts: `await figma.listAvailableFontsAsync()`
2. Use fallback: `{ family: "Roboto", style: "Regular" }`
3. Document this in UI with warning message

### Positioning Algorithm

```javascript
// 3-column layout calculation
const LEFT_COLUMN = 640;    // Profile section
const PADDING = 60;
const RIGHT_START = LEFT_COLUMN + PADDING; // 700px
const RIGHT_WIDTH = 1920 - RIGHT_START - PADDING; // 1160px

// 3 equal columns in right section
const COL_GAP = 30;
const COL_WIDTH = (RIGHT_WIDTH - (COL_GAP * 2)) / 3; // ~367px each

const COL1_X = RIGHT_START;           // 700px
const COL2_X = COL1_X + COL_WIDTH + COL_GAP;  // 1097px
const COL3_X = COL2_X + COL_WIDTH + COL_GAP;  // 1494px
```

### Auto-Layout Alternative

For easier maintenance, consider using Figma's Auto Layout:

```javascript
const frame = figma.createFrame();
frame.layoutMode = "HORIZONTAL";
frame.primaryAxisSizingMode = "FIXED";
frame.counterAxisSizingMode = "FIXED";
frame.primaryAxisAlignItems = "MIN";
frame.counterAxisAlignItems = "MIN";
frame.paddingLeft = 60;
frame.paddingRight = 60;
frame.itemSpacing = 30;

// Child frames automatically position themselves
```

## 🔄 Update Mechanisms

### Editing Existing Personas

```javascript
// Find existing persona frame
const existingFrame = figma.currentPage.findOne(
  node => node.type === "FRAME" && 
          node.name === `Persona: ${personaData.identity.name}`
);

if (existingFrame) {
  // Update in place
  updateFrame(existingFrame, personaData);
} else {
  // Create new
  generatePersonaFrame(personaData);
}
```

### Bulk Operations

For creating multiple personas:

```javascript
async function generateMultiplePersonas(personasArray) {
  const frames = [];
  const spacing = 100;
  
  for (let i = 0; i < personasArray.length; i++) {
    const frame = await generatePersonaFrame(personasArray[i]);
    frame.x = i * (1920 + spacing);
    frames.push(frame);
  }
  
  return frames;
}
```

## ⚡ Performance Optimization

### Current Bottlenecks

1. **Font Loading**: ~200ms per font variant
2. **Text Node Creation**: ~50ms per node
3. **API Calls**: 2-5 seconds depending on context

### Optimization Strategies

```javascript
// 1. Cache fonts
const fontCache = new Set();

async function loadFontOnce(family, style) {
  const key = `${family}-${style}`;
  if (!fontCache.has(key)) {
    await figma.loadFontAsync({ family, style });
    fontCache.add(key);
  }
}

// 2. Batch operations
const nodes = [];
// Create all nodes first (fast)
for (const item of items) {
  nodes.push(createNode(item));
}
// Then append (single reflow)
nodes.forEach(node => parent.appendChild(node));

// 3. Debounce API calls
let timeout;
function debouncedAPICall(message) {
  clearTimeout(timeout);
  timeout = setTimeout(() => callAPI(message), 500);
}
```

## 🧪 Testing Strategy

### Unit Tests (code.js functions)

```javascript
// Test character limit enforcement
test('truncates long quotes', () => {
  const longQuote = "This is a very long quote that exceeds 80 characters...";
  const result = truncateQuote(longQuote, 80);
  expect(result.length).toBeLessThanOrEqual(80);
});

// Test JSON validation
test('validates required fields', () => {
  const invalidJSON = { identity: { name: "Test" } };
  expect(() => validatePersonaJSON(invalidJSON)).toThrow();
});
```

### Integration Tests

```javascript
// Test full workflow
test('generates valid frame from JSON', async () => {
  const json = loadSamplePersona();
  const frame = await generatePersonaFrame(json);
  
  expect(frame.width).toBe(1920);
  expect(frame.height).toBe(1080);
  expect(frame.findOne(n => n.name === "Persona Name")).toBeDefined();
});
```

### Manual Testing Checklist

- [ ] Upload .docx file
- [ ] Upload .pdf file
- [ ] Upload .mp3 file (if transcription enabled)
- [ ] Chat with Claude (5+ messages)
- [ ] Request persona generation
- [ ] Verify JSON structure
- [ ] Click "Generate 1920×1080 Persona"
- [ ] Verify frame dimensions
- [ ] Check all text is editable
- [ ] Test dark/light mode toggle
- [ ] Save session
- [ ] Load saved session
- [ ] Create new session
- [ ] Test with minimal data
- [ ] Test with maximum character limits
- [ ] Test error handling (invalid JSON)

## 🚀 Deployment Checklist

### Pre-Launch
- [ ] Test on Mac (Figma Desktop)
- [ ] Test on Windows (Figma Desktop)
- [ ] Test on Figma Web (if supported)
- [ ] Verify API endpoint security
- [ ] Set up error logging
- [ ] Create usage analytics
- [ ] Write user documentation
- [ ] Create demo video
- [ ] Prepare support materials

### Launch
- [ ] Submit to Figma Community (if public)
- [ ] Set up billing (if paid)
- [ ] Monitor error rates
- [ ] Collect user feedback
- [ ] Track performance metrics

### Post-Launch
- [ ] Respond to user feedback
- [ ] Fix critical bugs within 24h
- [ ] Plan feature updates
- [ ] Optimize performance
- [ ] Expand documentation

## 📊 Analytics to Track

```javascript
// Event tracking (pseudocode)
analytics.track('persona_generated', {
  persona_type: data.metadata.persona_type,
  num_roles: data.content_sections.roles_responsibilities.length,
  num_challenges: data.content_sections.challenges.length,
  generation_time_ms: endTime - startTime
});

analytics.track('file_uploaded', {
  file_type: file.type,
  file_size_kb: file.size / 1024
});

analytics.track('session_saved', {
  message_count: conversationHistory.length,
  duration_minutes: (Date.now() - sessionStart) / 60000
});
```

## 🔮 Future Enhancements

### Short-term (1-2 months)
- [ ] Audio transcription integration (Whisper API)
- [ ] Export to PDF/PNG
- [ ] Multiple persona templates
- [ ] Drag-to-reorder sections
- [ ] Undo/redo for generations

### Medium-term (3-6 months)
- [ ] Collaborative editing (multi-user)
- [ ] Version history
- [ ] Template marketplace
- [ ] Integration with research tools (Dovetail, Miro)
- [ ] AI-powered image generation for profiles

### Long-term (6-12 months)
- [ ] Journey map generation
- [ ] Empathy map support
- [ ] Service blueprint creation
- [ ] Multi-language support
- [ ] Real-time collaboration

## 🤝 Contributing Guidelines

If open-sourcing:
1. Follow existing code style (ESLint config)
2. Add tests for new features
3. Update documentation
4. Submit PR with clear description
5. Ensure all tests pass

## 📝 License Considerations

- **Claude API**: Subject to Anthropic's terms
- **Figma Plugin**: Must comply with Figma's plugin guidelines
- **Your Code**: Choose appropriate license (MIT, Apache, etc.)
- **User Data**: Clarify data usage and privacy policy

---

**Implementation Status**: ✅ Ready for testing and deployment

This implementation provides a solid foundation. Adjust based on your specific needs, scale, and user feedback!
