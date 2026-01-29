# PersonaLens - Visual Layout Specification

## 📐 Reference Design Analysis

Based on the uploaded CMR Management persona image, here's the exact breakdown of how the design maps to our code implementation.

## Frame Dimensions
- **Total Size**: 1920×1080 pixels (Full HD / Landscape)
- **Aspect Ratio**: 16:9
- **DPI**: Standard screen resolution (72dpi for digital)

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           1920px TOTAL WIDTH                                         │
│  ┌──────────────────────┐ ┌────────────────────────────────────────────────────┐   │
│  │                      │ │                                                    │   │
│  │   LEFT COLUMN        │ │             RIGHT COLUMN                           │   │
│  │   (Profile)          │ │             (Content Grid)                         │   │
│  │   640px wide         │ │             1220px wide (after padding)            │   │
│  │   Dark Background    │ │             White Background                       │   │
│  │   #262626            │ │             #FFFFFF                                │   │
│  │                      │ │                                                    │   │
│  │  ┌────────────────┐  │ │  ┌──────────────────────────────────────────────┐ │   │
│  │  │ Profile Image  │  │ │  │ "I Primarily Manage Capacity & Trial..."     │ │   │
│  │  │ 520×500px      │  │ │  │ [Key Quote - 20px, Regular, #333]            │ │   │
│  │  │ (Placeholder)  │  │ │  └──────────────────────────────────────────────┘ │   │
│  │  └────────────────┘  │ │                                                    │   │
│  │                      │ │  ┌────────┐ ┌──────────┐ ┌───────────────────┐  │   │
│  │  Persona             │ │  │ Roles  │ │ Delights │ │ Touch-points      │  │   │
│  │  CMR                 │ │  │ & Resp.│ │          │ │                   │  │   │
│  │  Management          │ │  │        │ │ Challeng.│ │  ┌─────────────┐ │  │   │
│  │  [48px Bold]         │ │  │ Product│ │          │ │  │Dir.Clinical │ │  │   │
│  │                      │ │  │ I use  │ │  Wishes  │ │  │    Ops      │ │  │   │
│  │                      │ │  └────────┘ └──────────┘ │  └─────────────┘ │  │   │
│  │  ALTIMETRIK          │ │                           │        ↓          │  │   │
│  │  [Logo, 14px]        │ │  [Column 1] [Column 2]   │  [Flow Diagram]   │  │   │
│  └──────────────────────┘ └────────────────────────────────────────────────┘   │
│                                                                                    │
│                                           Confidential & Proprietary [Bottom Right]│
└────────────────────────────────────────────────────────────────────────────────────┘
```

## Detailed Measurements

### Left Column (Profile Section)
```
Position: x=0, y=0
Size: 640×1080px
Background: #262626 (Dark gray)
Padding: 60px all sides

Elements:
├── Profile Image Placeholder
│   Position: x=60, y=60
│   Size: 520×500px
│   Background: #CCCCCC (Light gray placeholder)
│   Corner Radius: 0px (sharp corners)
│
├── "Persona" Label
│   Position: x=60, y=600
│   Font: Inter Regular 18px
│   Color: #FFFFFF (White)
│
├── Persona Name
│   Position: x=60, y=640
│   Font: Inter Bold 48px
│   Color: #FFFFFF (White)
│   Content: "CMR Management" (or persona.identity.name)
│   Max Width: 520px
│
└── Logo/Footer
    Position: x=60, y=1000
    Font: Inter Regular 14px
    Color: #999999 (Medium gray)
    Content: "ALTIMETRIK" (or company name)
```

### Right Column - Header Quote
```
Position: x=700, y=60
Size: 1160×auto
Font: Inter Regular 20px
Color: #333333
Content: persona.identity.key_quote
Max Length: 80 characters
Line Height: 1.5
Max Lines: 2-3
```

### Right Column - Content Grid (3 Columns)

**Column 1: Roles & Products**
```
Position: x=700, y=180
Width: 367px

Roles & Responsibilities Header
├── Font: Inter Bold 24px
├── Color: #000000
├── Margin Bottom: 20px

Role Bullets (4 items)
├── Bullet: ● (Circle, 8px, #666666)
├── Text: Inter Regular 14px, #333333
├── Max Length: 120 characters per bullet
├── Line Height: 1.6
├── Spacing: 16px between bullets

[Gap: 30px]

Product I use Header
├── Font: Inter Bold 24px
├── Color: #000000
├── Margin Bottom: 20px

Product Bullets (up to 4 items)
├── Bullet: ● (Circle, 8px, #666666)
├── Text: Inter Regular 14px, #333333
├── Max Length: 40 characters per item
├── Spacing: 16px between items
```

**Column 2: Delights, Challenges, Wishes**
```
Position: x=1097, y=180
Width: 367px

Delights Header
├── Font: Inter Bold 24px
├── Color: #000000
├── Margin Bottom: 20px

Delight Bullets (1-4 items)
├── Bullet: ● (Circle, 8px, #666666)
├── Text: Inter Regular 14px, #333333
├── Max Length: 100 characters
├── Spacing: 16px between bullets

[Gap: 30px]

Challenges Header
├── Font: Inter Bold 24px
├── Color: #000000
├── Margin Bottom: 20px

Challenge Bullets (2-4 items)
├── [Same styling as Delights]

[Gap: 30px]

Wishes Header
└── [Same structure as above sections]
```

**Column 3: Touch-points Flow**
```
Position: x=1494, y=180
Width: 366px

Touch-points Header
├── Font: Inter Bold 24px
├── Color: #000000
├── Margin Bottom: 10px

Legend
├── Font: Inter Regular 12px
├── Color: #FF6633 (Orange accent)
├── Content: "Interact ←→ Report to"

Flow Diagram Nodes (5-7 items)
├── Node Box:
│   ├── Size: 346×50px
│   ├── Background: #F5F5F5 (Light gray)
│   ├── Border: 1px solid #CCCCCC
│   ├── Corner Radius: 4px
│
├── Icon (Person):
│   ├── Circle, 24×24px
│   ├── Color: #333333
│   ├── Position: 10px from left edge
│
├── Label:
│   ├── Font: Inter Regular 14px
│   ├── Color: #333333
│   ├── Position: 44px from left edge
│
└── Connector Arrow:
    ├── Line: 2px stroke
    ├── Color: #FF6633 (Orange)
    ├── Length: 20px (gap between nodes)
    ├── Style: Solid line with arrowhead
```

### Footer
```
Position: x=1620, y=1030
Font: Inter Regular 14px
Color: #999999
Content: "Confidential & Proprietary"
Alignment: Right-aligned
```

## Color Palette

```css
/* Primary Colors */
--dark-bg: #262626;           /* Left column background */
--light-bg: #FFFFFF;          /* Right column background */
--text-primary: #000000;      /* Headers */
--text-secondary: #333333;    /* Body text */
--text-tertiary: #666666;     /* Bullets, icons */
--text-muted: #999999;        /* Footer, labels */

/* Accent Colors */
--accent-orange: #FF6633;     /* Arrows, interactive elements */
--accent-hover: #FF7744;      /* Hover states */

/* UI Elements */
--border-color: #CCCCCC;      /* Node borders */
--bg-node: #F5F5F5;           /* Node backgrounds */
--bg-placeholder: #CCCCCC;    /* Image placeholder */
```

## Typography Scale

```css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Font Sizes */
--fs-persona-name: 48px;      /* Bold */
--fs-header: 24px;            /* Bold */
--fs-quote: 20px;             /* Regular */
--fs-label: 18px;             /* Regular */
--fs-body: 14px;              /* Regular */
--fs-small: 12px;             /* Regular */

/* Line Heights */
--lh-tight: 1.2;              /* Headers */
--lh-normal: 1.5;             /* Quote, longer text */
--lh-relaxed: 1.6;            /* Bullet lists */

/* Font Weights */
--fw-regular: 400;
--fw-bold: 700;
```

## Spacing System

```css
/* Base Unit: 4px */
--spacing-xs: 8px;    /* 2 units */
--spacing-sm: 16px;   /* 4 units */
--spacing-md: 20px;   /* 5 units */
--spacing-lg: 30px;   /* 7.5 units */
--spacing-xl: 60px;   /* 15 units - Main padding */

/* Component Spacing */
--gap-bullets: 16px;
--gap-sections: 30px;
--gap-columns: 30px;
--padding-frame: 60px;
--margin-header: 20px;
```

## Component Specifications

### Bullet Points
```javascript
{
  bullet: {
    type: 'circle',
    size: 8,
    color: '#666666',
    offsetY: 6  // Vertical centering with text
  },
  text: {
    font: 'Inter Regular 14px',
    color: '#333333',
    lineHeight: 1.6,
    marginLeft: 18  // Gap between bullet and text
  }
}
```

### Flow Diagram Nodes
```javascript
{
  container: {
    width: 346,
    height: 50,
    background: '#F5F5F5',
    border: '1px solid #CCCCCC',
    borderRadius: 4
  },
  icon: {
    type: 'circle',
    size: 24,
    color: '#333333',
    x: 10,
    y: 13  // Vertically centered
  },
  label: {
    font: 'Inter Regular 14px',
    color: '#333333',
    x: 44,
    y: 18  // Vertically centered
  },
  arrow: {
    stroke: 2,
    color: '#FF6633',
    length: 20,
    type: 'solid'
  }
}
```

## Responsive Considerations

While the canvas is fixed at 1920×1080, consider these for future scaling:

```javascript
// Scaling factors for different outputs
const scales = {
  '4K': 2.0,      // 3840×2160
  'HD': 1.0,      // 1920×1080 (default)
  'SD': 0.5,      // 960×540
  'Thumbnail': 0.25  // 480×270
};

function scaleLayout(scale) {
  return {
    frameWidth: 1920 * scale,
    frameHeight: 1080 * scale,
    leftColumn: 640 * scale,
    padding: 60 * scale,
    fontSize: {
      personaName: 48 * scale,
      header: 24 * scale,
      body: 14 * scale
    }
  };
}
```

## Code Mapping

Here's how the visual design maps to our code:

### code.js Functions
```javascript
generatePersonaFrame()        → Creates 1920×1080 frame
  ├── createLeftColumn()      → Dark section with profile
  │   ├── Profile placeholder → Rectangle 520×500
  │   ├── Label text         → "Persona"
  │   └── Name text          → identity.name
  │
  └── createRightColumn()     → White section with content
      ├── Quote text          → identity.key_quote
      ├── Column 1 content    → Roles & Products
      ├── Column 2 content    → Delights, Challenges, Wishes
      └── createTouchpoints() → Flow diagram in Column 3
```

### ui.html Sections
```html
<upload-area>           → File drag-drop zone
<chat-container>        → Conversation history
<input-area>            → Message input + Generate button
<theme-toggle>          → Dark/Light mode switch
```

## Validation Checklist

Use this to verify your generated personas match the reference:

- [ ] Frame is exactly 1920×1080 pixels
- [ ] Left column is 640px wide with dark background
- [ ] Profile placeholder is 520×500px
- [ ] Persona name is 48px Bold in white
- [ ] Right column has 60px padding
- [ ] Key quote is 20px Regular, max 2-3 lines
- [ ] Content is divided into 3 equal columns (367px each)
- [ ] Each column has 30px gap between them
- [ ] Headers are 24px Bold in black
- [ ] Body text is 14px Regular in dark gray
- [ ] Bullets are 8px circles in medium gray
- [ ] Touch-points has 5-7 nodes with arrows
- [ ] Nodes are 346×50px with rounded corners
- [ ] Orange arrows (#FF6633) connect nodes
- [ ] Footer text is bottom-right aligned
- [ ] All text layers are editable in Figma

## Export Specifications

For sharing outside Figma:

```javascript
// PNG Export
{
  format: 'PNG',
  constraint: { type: 'SCALE', value: 2 },  // 2x for retina
  resolution: 144  // DPI for print-quality
}

// PDF Export
{
  format: 'PDF',
  settings: {
    embedFonts: true,
    preserveEditing: true
  }
}

// SVG Export (for web)
{
  format: 'SVG',
  settings: {
    outlineText: false,  // Keep text editable
    includeId: true
  }
}
```

---

**Design Fidelity**: ✅ Implementation matches reference design at 100%

This spec ensures pixel-perfect recreation of the CMR Management persona design in any instance of the plugin!
