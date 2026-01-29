// PersonaLens Figma Plugin - Main Code
// This runs in the Figma plugin sandbox

figma.showUI(__html__, { 
  width: 400, 
  height: 600,
  themeColors: true 
});

// Store conversation context
let conversationHistory = [];
let currentSessionId = null;

// Message handler from UI
figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case 'generate-persona':
        await generatePersonaFrame(msg.data);
        break;
      
      case 'save-session':
        await saveSession(msg.sessionData);
        break;
      
      case 'load-session':
        await loadSession(msg.sessionId);
        break;
      
      case 'new-session':
        conversationHistory = [];
        currentSessionId = null;
        figma.ui.postMessage({ type: 'session-cleared' });
        break;
      
      case 'resize':
        figma.ui.resize(msg.width, msg.height);
        break;
      
      default:
        console.log('Unknown message type:', msg.type);
    }
  } catch (error) {
    figma.ui.postMessage({ 
      type: 'error', 
      message: error.message 
    });
  }
};

/**
 * Generate 1920x1080 Persona Frame from JSON data
 */
async function generatePersonaFrame(personaData) {
  const FRAME_WIDTH = 1920;
  const FRAME_HEIGHT = 1080;
  const LEFT_COLUMN_WIDTH = 640; // ~1/3 of width
  const PADDING = 60;
  const RIGHT_COLUMN_START = LEFT_COLUMN_WIDTH + PADDING;

  // Create main frame
  const frame = figma.createFrame();
  frame.name = `Persona: ${personaData.identity.name}`;
  frame.resize(FRAME_WIDTH, FRAME_HEIGHT);
  frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

  // LEFT COLUMN - Profile Section
  await createLeftColumn(frame, personaData, LEFT_COLUMN_WIDTH, FRAME_HEIGHT, PADDING);

  // RIGHT COLUMN - Content Sections
  await createRightColumn(frame, personaData, RIGHT_COLUMN_START, FRAME_WIDTH, FRAME_HEIGHT, PADDING);

  // Select the newly created frame
  figma.currentPage.selection = [frame];
  figma.viewport.scrollAndZoomIntoView([frame]);

  figma.notify('✅ Persona map generated successfully!');
}

/**
 * Create left column with profile image and persona name
 */
async function createLeftColumn(parentFrame, data, width, height, padding) {
  // Dark background for left column
  const leftBg = figma.createRectangle();
  leftBg.resize(width, height);
  leftBg.fills = [{ type: 'SOLID', color: { r: 0.15, g: 0.15, b: 0.15 } }];
  leftBg.name = 'Left Background';
  parentFrame.appendChild(leftBg);

  // Profile image placeholder
  const profileImg = figma.createRectangle();
  profileImg.resize(width - (padding * 2), 500);
  profileImg.x = padding;
  profileImg.y = padding;
  profileImg.fills = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
  profileImg.name = 'Profile Image Placeholder';
  parentFrame.appendChild(profileImg);

  // Label "Persona"
  const labelText = figma.createText();
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  labelText.characters = "Persona";
  labelText.fontSize = 18;
  labelText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  labelText.x = padding;
  labelText.y = 600;
  labelText.name = 'Persona Label';
  parentFrame.appendChild(labelText);

  // Persona Name
  const nameText = figma.createText();
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  nameText.characters = data.identity.name;
  nameText.fontSize = 48;
  nameText.fontName = { family: "Inter", style: "Bold" };
  nameText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  nameText.x = padding;
  nameText.y = 640;
  nameText.resize(width - (padding * 2), nameText.height);
  nameText.name = 'Persona Name';
  parentFrame.appendChild(nameText);

  // Company logo placeholder (bottom)
  const logo = figma.createText();
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  logo.characters = "COMPANY LOGO";
  logo.fontSize = 14;
  logo.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
  logo.x = padding;
  logo.y = height - 80;
  logo.name = 'Logo Placeholder';
  parentFrame.appendChild(logo);
}

/**
 * Create right column with all content sections
 */
async function createRightColumn(parentFrame, data, startX, frameWidth, frameHeight, padding) {
  let currentY = padding;

  // Quote at the top
  const quote = await createTextNode(
    data.identity.key_quote,
    startX,
    currentY,
    frameWidth - startX - padding,
    20,
    "Regular"
  );
  quote.name = 'Key Quote';
  parentFrame.appendChild(quote);
  currentY += quote.height + 40;

  // Main content area - 3 columns
  const columnWidth = (frameWidth - startX - padding - 60) / 3; // 3 columns with gaps
  
  // Column 1: Roles & Products
  let col1Y = currentY;
  
  // Roles & Responsibilities
  const rolesHeader = await createTextNode(
    "Roles & Responsibilities",
    startX,
    col1Y,
    columnWidth,
    24,
    "Bold"
  );
  rolesHeader.name = 'Roles Header';
  parentFrame.appendChild(rolesHeader);
  col1Y += rolesHeader.height + 20;

  for (const role of data.content_sections.roles_responsibilities) {
    const bullet = await createBulletPoint(role, startX, col1Y, columnWidth);
    parentFrame.appendChild(bullet);
    col1Y += bullet.height + 16;
  }

  col1Y += 30;

  // Products Used
  const productsHeader = await createTextNode(
    "Product I use",
    startX,
    col1Y,
    columnWidth,
    24,
    "Bold"
  );
  productsHeader.name = 'Products Header';
  parentFrame.appendChild(productsHeader);
  col1Y += productsHeader.height + 20;

  for (const product of data.content_sections.products_used) {
    const bullet = await createBulletPoint(product, startX, col1Y, columnWidth);
    parentFrame.appendChild(bullet);
    col1Y += bullet.height + 16;
  }

  // Column 2: Delights & Challenges
  let col2Y = currentY;
  const col2X = startX + columnWidth + 30;

  // Delights
  const delightsHeader = await createTextNode(
    "Delights:",
    col2X,
    col2Y,
    columnWidth,
    24,
    "Bold"
  );
  delightsHeader.name = 'Delights Header';
  parentFrame.appendChild(delightsHeader);
  col2Y += delightsHeader.height + 20;

  for (const delight of data.content_sections.delights) {
    const bullet = await createBulletPoint(delight, col2X, col2Y, columnWidth);
    parentFrame.appendChild(bullet);
    col2Y += bullet.height + 16;
  }

  col2Y += 30;

  // Challenges
  const challengesHeader = await createTextNode(
    "Challenges",
    col2X,
    col2Y,
    columnWidth,
    24,
    "Bold"
  );
  challengesHeader.name = 'Challenges Header';
  parentFrame.appendChild(challengesHeader);
  col2Y += challengesHeader.height + 20;

  for (const challenge of data.content_sections.challenges) {
    const bullet = await createBulletPoint(challenge, col2X, col2Y, columnWidth);
    parentFrame.appendChild(bullet);
    col2Y += bullet.height + 16;
  }

  col2Y += 30;

  // Wishes
  const wishesHeader = await createTextNode(
    "Wishes",
    col2X,
    col2Y,
    columnWidth,
    24,
    "Bold"
  );
  wishesHeader.name = 'Wishes Header';
  parentFrame.appendChild(wishesHeader);
  col2Y += wishesHeader.height + 20;

  for (const wish of data.content_sections.wishes) {
    const bullet = await createBulletPoint(wish, col2X, col2Y, columnWidth);
    parentFrame.appendChild(bullet);
    col2Y += bullet.height + 16;
  }

  // Column 3: Touch-points
  const col3X = col2X + columnWidth + 30;
  await createTouchpoints(parentFrame, data, col3X, currentY, columnWidth);

  // Footer - Confidential
  const footer = await createTextNode(
    "Confidential & Proprietary",
    frameWidth - 300,
    frameHeight - 50,
    280,
    14,
    "Regular"
  );
  footer.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
  footer.name = 'Footer';
  parentFrame.appendChild(footer);
}

/**
 * Create touchpoints flow diagram
 */
async function createTouchpoints(parentFrame, data, x, y, width) {
  const header = await createTextNode(
    "Touch-points",
    x,
    y,
    width,
    24,
    "Bold"
  );
  header.name = 'Touchpoints Header';
  parentFrame.appendChild(header);
  
  let touchY = y + header.height + 30;
  const nodeHeight = 50;
  const nodeGap = 20;

  // Create hierarchy visualization
  const touchpoints = data.touchpoints || [];
  
  for (let i = 0; i < touchpoints.length; i++) {
    const touchpoint = touchpoints[i];
    
    // Create node box
    const node = figma.createRectangle();
    node.resize(width - 20, nodeHeight);
    node.x = x + 10;
    node.y = touchY;
    node.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }];
    node.cornerRadius = 4;
    node.strokes = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
    node.strokeWeight = 1;
    node.name = `Touchpoint: ${touchpoint.role}`;
    parentFrame.appendChild(node);

    // Add icon placeholder
    const icon = figma.createEllipse();
    icon.resize(24, 24);
    icon.x = x + 20;
    icon.y = touchY + 13;
    icon.fills = [{ type: 'SOLID', color: { r: 0.3, g: 0.3, b: 0.3 } }];
    icon.name = 'User Icon';
    parentFrame.appendChild(icon);

    // Add text label
    const label = await createTextNode(
      touchpoint.role,
      x + 54,
      touchY + 16,
      width - 64,
      14,
      "Regular"
    );
    label.name = `Label: ${touchpoint.role}`;
    parentFrame.appendChild(label);

    // Add connecting arrow (if not last item)
    if (i < touchpoints.length - 1) {
      const arrow = createArrow(x + width / 2, touchY + nodeHeight, x + width / 2, touchY + nodeHeight + nodeGap);
      arrow.name = 'Connection Arrow';
      parentFrame.appendChild(arrow);
    }

    touchY += nodeHeight + nodeGap;
  }

  // Add relationship indicators
  const legend = await createTextNode(
    "Interact ←→ Report to",
    x,
    y + 30,
    width,
    12,
    "Regular"
  );
  legend.fills = [{ type: 'SOLID', color: { r: 1, g: 0.4, b: 0 } }];
  legend.name = 'Legend';
  parentFrame.appendChild(legend);
}

/**
 * Create arrow vector
 */
function createArrow(x1, y1, x2, y2) {
  const line = figma.createLine();
  line.x = x1;
  line.y = y1;
  line.resize(0, y2 - y1);
  line.strokes = [{ type: 'SOLID', color: { r: 1, g: 0.4, b: 0 } }];
  line.strokeWeight = 2;
  return line;
}

/**
 * Helper: Create text node
 */
async function createTextNode(text, x, y, width, fontSize, style) {
  const textNode = figma.createText();
  await figma.loadFontAsync({ family: "Inter", style: style });
  textNode.characters = text;
  textNode.fontSize = fontSize;
  textNode.fontName = { family: "Inter", style: style };
  textNode.x = x;
  textNode.y = y;
  textNode.resize(width, textNode.height);
  textNode.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
  return textNode;
}

/**
 * Helper: Create bullet point with circle
 */
async function createBulletPoint(text, x, y, width) {
  const group = figma.group([], figma.currentPage);
  
  // Bullet circle
  const bullet = figma.createEllipse();
  bullet.resize(8, 8);
  bullet.x = x;
  bullet.y = y + 6;
  bullet.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
  group.appendChild(bullet);

  // Text
  const textNode = figma.createText();
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  textNode.characters = text;
  textNode.fontSize = 14;
  textNode.x = x + 18;
  textNode.y = y;
  textNode.resize(width - 18, textNode.height);
  textNode.fills = [{ type: 'SOLID', color: { r: 0.3, g: 0.3, b: 0.3 } }];
  group.appendChild(textNode);

  return group;
}

/**
 * Save session to plugin data
 */
async function saveSession(sessionData) {
  const sessions = await figma.clientStorage.getAsync('sessions') || {};
  sessions[sessionData.id] = {
    name: sessionData.name,
    conversation: sessionData.conversation,
    timestamp: Date.now()
  };
  await figma.clientStorage.setAsync('sessions', sessions);
  
  figma.ui.postMessage({ 
    type: 'session-saved', 
    sessionId: sessionData.id 
  });
}

/**
 * Load session from plugin data
 */
async function loadSession(sessionId) {
  const sessions = await figma.clientStorage.getAsync('sessions') || {};
  const session = sessions[sessionId];
  
  if (session) {
    conversationHistory = session.conversation;
    currentSessionId = sessionId;
    
    figma.ui.postMessage({ 
      type: 'session-loaded', 
      session: session 
    });
  }
}
