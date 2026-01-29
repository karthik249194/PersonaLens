// code.ts - Main plugin code that runs in Figma's sandbox

// Show the UI
figma.showUI(__html__, {
  width: 1200,
  height: 800,
  themeColors: true
});

// Handle messages from UI
figma.ui.onmessage = async (msg: any) => {
  
  if (msg.type === 'resize') {
    figma.ui.resize(msg.width, msg.height);
  }

  if (msg.type === 'store-session') {
    // Store session data in Figma's client storage
    try {
      await figma.clientStorage.setAsync(msg.key, msg.data);
      figma.ui.postMessage({
        type: 'storage-success',
        operation: 'set',
        key: msg.key
      });
    } catch (error: any) {
      figma.ui.postMessage({
        type: 'storage-error',
        operation: 'set',
        error: error.message
      });
    }
  }

  if (msg.type === 'get-session') {
    try {
      const data = await figma.clientStorage.getAsync(msg.key);
      figma.ui.postMessage({
        type: 'storage-data',
        key: msg.key,
        data: data
      });
    } catch (error: any) {
      figma.ui.postMessage({
        type: 'storage-error',
        operation: 'get',
        error: error.message
      });
    }
  }

  if (msg.type === 'list-sessions') {
    try {
      const keys = await figma.clientStorage.keysAsync();
      const sessionKeys = keys.filter((key: string) => key.startsWith('session:'));
      
      const sessions = [];
      for (const key of sessionKeys) {
        const data = await figma.clientStorage.getAsync(key);
        if (data) {
          sessions.push(JSON.parse(data));
        }
      }
      
      figma.ui.postMessage({
        type: 'sessions-list',
        sessions: sessions
      });
    } catch (error: any) {
      figma.ui.postMessage({
        type: 'storage-error',
        operation: 'list',
        error: error.message
      });
    }
  }

  if (msg.type === 'delete-session') {
    try {
      await figma.clientStorage.deleteAsync(msg.key);
      figma.ui.postMessage({
        type: 'storage-success',
        operation: 'delete',
        key: msg.key
      });
    } catch (error: any) {
      figma.ui.postMessage({
        type: 'storage-error',
        operation: 'delete',
        error: error.message
      });
    }
  }

  if (msg.type === 'close-plugin') {
    figma.closePlugin();
  }

  if (msg.type === 'notify') {
    figma.notify(msg.message, { timeout: msg.timeout || 2000 });
  }
};