// Content script for WebScribble extension
class WebScribble {
  constructor() {
    this.isActive = false;
    this.canvas = null;
    this.toolbar = null;
    this.currentTool = 'pen';
    this.currentColor = '#ff0000';
    this.currentSize = 3;
    this.isDrawing = false;
    this.startX = 0;
    this.startY = 0;
    this.history = [];
    this.historyIndex = -1;
    this.laserPointerMode = false;
    
    // Highlighter trail effect properties
    this.highlighterTrails = [];
    this.trailAnimationId = null;
    this.trailFadeSpeed = 0.02; // How fast trails fade (0-1)
    this.trailMinOpacity = 0.1; // Minimum opacity before trail disappears
    
    this.init();
  }

  init() {
    console.log('WebScribble: Initializing extension...');
    this.createCanvas();
    console.log('WebScribble: Canvas created:', this.canvas);
    this.createToolbar();
    console.log('WebScribble: Toolbar created:', this.toolbar);
    this.setupEventListeners();
    console.log('WebScribble: Event listeners set up');
    this.loadSettings();
    console.log('WebScribble: Initialization complete');
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'webscribble-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 2147483647;
      background: transparent;
    `;
    
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    document.body.appendChild(this.canvas);
    console.log('WebScribble: Canvas appended to document.body');
    this.resizeCanvas();
  }

  createToolbar() {
    this.toolbar = document.createElement('div');
    this.toolbar.id = 'webscribble-toolbar';
    this.toolbar.innerHTML = `
      <div class="toolbar-header">
        <div class="header-left">
          <span class="toolbar-title">WebScribble</span>
          <span class="status-indicator" id="statusIndicator">Inactive</span>
        </div>
        <div class="header-right">
          <button class="close-btn" title="Close WebScribble">×</button>
        </div>
      </div>
      
      <div class="toolbar-content" id="toolbarContent" style="display: none;">
        <!-- Top Row: Main Tools + Shapes -->
        <div class="toolbar-row">
          <div class="tool-section">
            <div class="section-label">Tools</div>
            <div class="tool-buttons">
              <button class="tool-btn active" data-tool="pen" title="Pen Tool (Ctrl+Shift+1)">✏️</button>
              <button class="tool-btn" data-tool="highlighter" title="Highlighter (Ctrl+Shift+2)">🖍️</button>
              <button class="tool-btn" data-tool="eraser" title="Eraser - Remove annotations">🧹</button>
            </div>
          </div>
          <div class="tool-section">
            <div class="section-label">Shapes</div>
            <div class="tool-buttons">
              <button class="tool-btn" data-tool="rectangle" title="Rectangle">⬜</button>
              <button class="tool-btn" data-tool="circle" title="Circle">⭕</button>
              <button class="tool-btn" data-tool="arrow" title="Arrow">➡️</button>
            </div>
          </div>
        </div>
        
        <!-- Middle Row: Colors -->
        <div class="toolbar-row">
          <div class="tool-section full-width">
            <div class="section-label">Colors</div>
            <div class="color-grid">
              <button class="color-preset active" data-color="#ff0000" title="Red" style="background: #ff0000;"></button>
              <button class="color-preset" data-color="#ff4500" title="Orange Red" style="background: #ff4500;"></button>
              <button class="color-preset" data-color="#ffa500" title="Orange" style="background: #ffa500;"></button>
              <button class="color-preset" data-color="#ffff00" title="Yellow" style="background: #ffff00;"></button>
              <button class="color-preset" data-color="#9acd32" title="Yellow Green" style="background: #9acd32;"></button>
              <button class="color-preset" data-color="#00ff00" title="Lime" style="background: #00ff00;"></button>
              <button class="color-preset" data-color="#00ff7f" title="Spring Green" style="background: #00ff7f;"></button>
              <button class="color-preset" data-color="#00ffff" title="Cyan" style="background: #00ffff;"></button>
              <button class="color-preset" data-color="#0080ff" title="Sky Blue" style="background: #0080ff;"></button>
              <button class="color-preset" data-color="#0000ff" title="Blue" style="background: #0000ff;"></button>
              <button class="color-preset" data-color="#8000ff" title="Blue Violet" style="background: #8000ff;"></button>
              <button class="color-preset" data-color="#ff00ff" title="Magenta" style="background: #ff00ff;"></button>
              <button class="color-preset" data-color="#ff0080" title="Deep Pink" style="background: #ff0080;"></button>
              <button class="color-preset" data-color="#800080" title="Purple" style="background: #800080;"></button>
              <button class="color-preset" data-color="#8b4513" title="Saddle Brown" style="background: #8b4513;"></button>
              <button class="color-preset" data-color="#000000" title="Black" style="background: #000000;"></button>
              <button class="color-preset" data-color="#808080" title="Gray" style="background: #808080;"></button>
              <button class="color-preset" data-color="#ffffff" title="White" style="background: #ffffff; border: 1px solid #ccc;"></button>
              <input type="color" class="color-picker" value="${this.currentColor}" title="Custom Color">
            </div>
          </div>
        </div>
        
        <!-- Bottom Row: Size + Actions + Shortcuts -->
        <div class="toolbar-row">
          <div class="tool-section">
            <div class="section-label">Size</div>
            <div class="size-buttons">
              <button class="size-preset active" data-size="1" title="1x - Thin">1x</button>
              <button class="size-preset" data-size="2" title="2x - Medium">2x</button>
              <button class="size-preset" data-size="4" title="4x - Thick">4x</button>
              <button class="size-preset" data-size="8" title="8x - Very Thick">8x</button>
            </div>
          </div>
          <div class="tool-section">
            <div class="section-label">Actions</div>
            <div class="action-buttons">
              <button class="action-btn undo-btn" data-action="undo" title="Undo (Ctrl+Z)">↶</button>
              <button class="action-btn redo-btn" data-action="redo" title="Redo (Ctrl+Shift+Z)">↷</button>
              <button class="action-btn clear-btn" data-action="clear" title="Clear All">🗑️</button>
            </div>
          </div>
          <div class="tool-section">
            <div class="section-label">Shortcuts</div>
            <div class="shortcuts-info">
              <div class="shortcut-item">
                <span>Toggle</span>
                <span class="shortcut-key">Alt+D</span>
              </div>
              <div class="shortcut-item">
                <span>Pen</span>
                <span class="shortcut-key">Ctrl+1</span>
              </div>
              <div class="shortcut-item">
                <span>Highlighter</span>
                <span class="shortcut-key">Ctrl+2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.toolbar.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 2147483648;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      user-select: none;
      display: block;
      min-width: 300px;
      max-width: 400px;
    `;
    
    document.body.appendChild(this.toolbar);
    this.setupToolbarEvents();
    
    // Show toolbar by default (collapsed state)
    this.hideToolbar();
  }

  setupToolbarEvents() {
    // Tool selection
    this.toolbar.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        console.log('WebScribble: Tool button clicked:', btn.dataset.tool);
        this.toolbar.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTool = btn.dataset.tool;
        console.log('WebScribble: Current tool set to:', this.currentTool);
        this.updateCursor();
      });
    });

    // Color presets
    this.toolbar.querySelectorAll('.color-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        this.toolbar.querySelectorAll('.color-preset').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentColor = btn.dataset.color;
        this.toolbar.querySelector('.color-picker').value = this.currentColor;
      });
    });

    // Color picker
    this.toolbar.querySelector('.color-picker').addEventListener('change', (e) => {
      this.currentColor = e.target.value;
      // Update active color preset
      this.toolbar.querySelectorAll('.color-preset').forEach(b => b.classList.remove('active'));
    });

    // Size presets
    this.toolbar.querySelectorAll('.size-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        this.toolbar.querySelectorAll('.size-preset').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentSize = parseInt(btn.dataset.size);
        this.updateCursor();
      });
    });


    // Action buttons
    this.toolbar.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.handleAction(btn.dataset.action);
      });
    });

    // Close button
    this.toolbar.querySelector('.close-btn').addEventListener('click', () => {
      if (this.isActive) {
        this.toggle(); // Deactivate annotation mode
      }
      this.hideToolbar(); // Hide the toolbar
    });

    // Make toolbar draggable
    this.makeDraggable();
  }

  makeDraggable() {
    const header = this.toolbar.querySelector('.toolbar-header');
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    header.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('close-btn')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = this.toolbar.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      header.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      this.toolbar.style.left = `${startLeft + deltaX}px`;
      this.toolbar.style.top = `${startTop + deltaY}px`;
      this.toolbar.style.right = 'auto';
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        header.style.cursor = 'grab';
      }
    });

    header.style.cursor = 'grab';
  }

  setupEventListeners() {
    // Canvas events
    this.canvas.addEventListener('mousedown', (e) => {
      console.log('WebScribble: Canvas mousedown event received');
      this.startDrawing(e);
    });
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.stopDrawing());
    this.canvas.addEventListener('mouseout', () => this.stopDrawing());

    // Touch events for mobile
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      this.canvas.dispatchEvent(mouseEvent);
    });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      this.canvas.dispatchEvent(mouseEvent);
    });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      const mouseEvent = new MouseEvent('mouseup', {});
      this.canvas.dispatchEvent(mouseEvent);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));

    // Window resize
    window.addEventListener('resize', () => this.resizeCanvas());

    // Message listener for background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
    });
  }

  handleMessage(request, sender, sendResponse) {
    console.log('WebScribble: Received message:', request.action);
    
    switch (request.action) {
    case 'toggle-annotation':
      console.log('WebScribble: Toggling annotation mode');
      this.toggle();
      sendResponse({ active: this.isActive });
      break;
    case 'pen-tool':
      console.log('WebScribble: Switching to pen tool');
      this.setTool('pen');
      break;
    case 'highlighter-tool':
      console.log('WebScribble: Switching to highlighter tool');
      this.setTool('highlighter');
      break;
    case 'undo':
      console.log('WebScribble: Undoing');
      this.undo();
      break;
    case 'redo':
      console.log('WebScribble: Redoing');
      this.redo();
      break;
    case 'getState':
      console.log('WebScribble: Getting state, active:', this.isActive);
      sendResponse({ active: this.isActive });
      break;
    default:
      console.log('WebScribble: Unknown action:', request.action);
      sendResponse({ error: 'Unknown action' });
    }
    return true; // Keep the message channel open for async response
  }

  handleKeyboard(e) {
    if (!this.isActive) return;

    // Prevent default for our shortcuts
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      this.undo();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
      e.preventDefault();
      this.redo();
    } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === '1') {
      e.preventDefault();
      this.setTool('pen');
    } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === '2') {
      e.preventDefault();
      this.setTool('highlighter');
    }
  }

  setTool(tool) {
    console.log('WebScribble: Setting tool to:', tool);
    this.currentTool = tool;
    this.toolbar.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    const toolButton = this.toolbar.querySelector(`[data-tool="${tool}"]`);
    if (toolButton) {
      toolButton.classList.add('active');
      console.log('WebScribble: Tool button activated:', tool);
    } else {
      console.error('WebScribble: Tool button not found for:', tool);
    }
    this.updateCursor();
  }

  updateCursor() {
    if (this.currentTool === 'laser') {
      document.body.style.cursor = 'crosshair';
      this.addLaserEffect();
    } else {
      document.body.style.cursor = 'default';
      this.removeLaserEffect();
    }
  }

  addLaserEffect() {
    if (this.laserPointerMode) return;
    this.laserPointerMode = true;
    
    const style = document.createElement('style');
    style.id = 'laser-pointer-style';
    style.textContent = `
      * {
        cursor: crosshair !important;
      }
      *:hover {
        box-shadow: 0 0 20px rgba(255, 0, 0, 0.8) !important;
      }
    `;
    document.head.appendChild(style);
  }

  removeLaserEffect() {
    if (!this.laserPointerMode) return;
    this.laserPointerMode = false;
    
    const style = document.getElementById('laser-pointer-style');
    if (style) {
      style.remove();
    }
  }

  startDrawing(e) {
    if (!this.isActive) {
      console.log('WebScribble: Not active, ignoring click');
      return;
    }
    
    console.log('WebScribble: startDrawing called, currentTool:', this.currentTool);
    console.log('WebScribble: Canvas element:', this.canvas);
    console.log('WebScribble: Canvas pointer events:', this.canvas.style.pointerEvents);
    
    const rect = this.canvas.getBoundingClientRect();
    this.startX = e.clientX - rect.left;
    this.startY = e.clientY - rect.top;
    
    console.log('WebScribble: Click coordinates - clientX:', e.clientX, 'clientY:', e.clientY);
    console.log('WebScribble: Canvas rect:', rect);
    console.log('WebScribble: Calculated canvas coords - x:', this.startX, 'y:', this.startY);
    
    
    this.isDrawing = true;
    
    if (this.currentTool === 'highlighter') {
      // Add initial trail point for highlighter
      this.addHighlighterTrail(this.startX, this.startY);
    } else {
      this.saveState();
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
    }
  }

  draw(e) {
    if (!this.isActive || !this.isDrawing) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    switch (this.currentTool) {
    case 'pen':
      this.setupContext();
      this.ctx.lineTo(currentX, currentY);
      this.ctx.stroke();
      break;
    case 'highlighter':
      // Add trail point for highlighter effect
      this.addHighlighterTrail(currentX, currentY);
      break;
    case 'eraser':
      this.setupContext();
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.lineTo(currentX, currentY);
      this.ctx.stroke();
      break;
    case 'rectangle':
      this.drawRectangle(this.startX, this.startY, currentX, currentY);
      break;
    case 'circle':
      this.drawCircle(this.startX, this.startY, currentX, currentY);
      break;
    case 'arrow':
      this.drawArrow(this.startX, this.startY, currentX, currentY);
      break;
    }
  }

  stopDrawing() {
    if (!this.isActive) return;
    this.isDrawing = false;
    this.ctx.globalCompositeOperation = 'source-over';
  }

  setupContext() {
    this.ctx.lineWidth = this.currentSize;
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.fillStyle = this.currentColor;
    
    if (this.currentTool === 'highlighter') {
      this.ctx.globalAlpha = 0.4;
      this.ctx.lineWidth = this.currentSize * 3; // Make highlighter thicker
    } else {
      this.ctx.globalAlpha = 1;
    }
  }

  drawRectangle(x1, y1, x2, y2) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.restoreState();
    this.setupContext();
    this.ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
  }

  drawCircle(x1, y1, x2, y2) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.restoreState();
    this.setupContext();
    const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    this.ctx.beginPath();
    this.ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  drawArrow(x1, y1, x2, y2) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.restoreState();
    this.setupContext();
    
    const headlen = 15;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
    this.ctx.moveTo(x2, y2);
    this.ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
    this.ctx.stroke();
  }


  saveState() {
    this.historyIndex++;
    if (this.historyIndex < this.history.length) {
      this.history.length = this.historyIndex;
    }
    this.history.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
  }

  restoreState() {
    if (this.historyIndex >= 0 && this.history[this.historyIndex]) {
      this.ctx.putImageData(this.history[this.historyIndex], 0, 0);
    }
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.restoreState();
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.restoreState();
    }
  }

  clearAll() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.history = [];
    this.historyIndex = -1;
    this.clearTrails();
  }

  handleAction(action) {
    switch (action) {
    case 'undo':
      this.undo();
      break;
    case 'redo':
      this.redo();
      break;
    case 'clear':
      this.clearAll();
      break;
    }
  }

  toggle() {
    console.log('WebScribble: Toggling annotation mode. Current state:', this.isActive);
    this.isActive = !this.isActive;
    
    if (this.isActive) {
      console.log('WebScribble: Activating annotation mode');
      this.canvas.style.pointerEvents = 'auto';
      this.showToolbar();
      this.updateCursor();
      console.log('WebScribble: Toolbar should now be visible');
    } else {
      console.log('WebScribble: Deactivating annotation mode');
      this.canvas.style.pointerEvents = 'none';
      this.hideToolbar();
      this.removeLaserEffect();
      document.body.style.cursor = 'default';
    }
    
    // Notify background script
    chrome.runtime.sendMessage({
      action: 'updateIcon',
      active: this.isActive
    });
    
    this.saveSettings();
    console.log('WebScribble: Toggle complete. Active state:', this.isActive);
  }

  showToolbar() {
    this.toolbar.style.display = 'block';
    this.toolbar.querySelector('#toolbarContent').style.display = 'block';
    this.toolbar.querySelector('#statusIndicator').textContent = 'Active';
    this.toolbar.querySelector('#statusIndicator').classList.add('active');
  }

  hideToolbar() {
    this.toolbar.style.display = 'none';
    this.toolbar.querySelector('#toolbarContent').style.display = 'none';
    this.toolbar.querySelector('#statusIndicator').textContent = 'Inactive';
    this.toolbar.querySelector('#statusIndicator').classList.remove('active');
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    console.log('WebScribble: Canvas resized to:', this.canvas.width, 'x', this.canvas.height);
  }

  loadSettings() {
    chrome.storage.sync.get(['pagemarkerSettings'], (result) => {
      if (result.pagemarkerSettings) {
        const settings = result.pagemarkerSettings;
        this.currentColor = settings.color || this.currentColor;
        this.currentSize = settings.size || this.currentSize;
        this.currentTool = settings.tool || this.currentTool;
        
        // Update UI
        this.toolbar.querySelector('.color-picker').value = this.currentColor;
        this.toolbar.querySelectorAll('.size-preset').forEach(btn => btn.classList.remove('active'));
        this.toolbar.querySelector(`[data-size="${this.currentSize}"]`)?.classList.add('active');
        this.setTool(this.currentTool);
      }
    });
  }

  saveSettings() {
    const settings = {
      color: this.currentColor,
      size: this.currentSize,
      tool: this.currentTool
    };
    chrome.storage.sync.set({ pagemarkerSettings: settings });
  }

  // Highlighter trail effect methods
  addHighlighterTrail(x, y) {
    if (this.currentTool !== 'highlighter') return;
    
    const trail = {
      x: x,
      y: y,
      opacity: 0.4,
      size: this.currentSize * 3,
      color: this.currentColor,
      timestamp: Date.now()
    };
    
    this.highlighterTrails.push(trail);
    
    // Start animation if not already running
    if (!this.trailAnimationId) {
      this.animateTrails();
    }
  }

  animateTrails() {
    if (this.highlighterTrails.length === 0) {
      this.trailAnimationId = null;
      return;
    }

    // Clear canvas and redraw everything
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.restoreState();

    // Update and draw trails
    this.highlighterTrails = this.highlighterTrails.filter(trail => {
      trail.opacity -= this.trailFadeSpeed;
      return trail.opacity > this.trailMinOpacity;
    });

    // Draw all trails
    this.highlighterTrails.forEach(trail => {
      this.ctx.save();
      this.ctx.globalAlpha = trail.opacity;
      this.ctx.fillStyle = trail.color;
      this.ctx.strokeStyle = trail.color;
      this.ctx.lineWidth = trail.size;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      
      // Draw a small circle for each trail point
      this.ctx.beginPath();
      this.ctx.arc(trail.x, trail.y, trail.size / 2, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.restore();
    });

    // Continue animation
    this.trailAnimationId = requestAnimationFrame(() => this.animateTrails());
  }

  clearTrails() {
    this.highlighterTrails = [];
    if (this.trailAnimationId) {
      cancelAnimationFrame(this.trailAnimationId);
      this.trailAnimationId = null;
    }
  }
}

// Initialize WebScribble when DOM is ready
function initializeWebScribble() {
  try {
    // Prevent multiple initializations
    if (window.pageMarker) {
      console.log('WebScribble: Already initialized, skipping...');
      return;
    }
    
    console.log('WebScribble: Initializing extension on', window.location.href);
    window.pageMarker = new WebScribble();
    console.log('WebScribble: Extension initialized successfully');
    
    // Add a global function for debugging
    window.testWebScribble = function() {
      console.log('WebScribble Debug Info:');
      console.log('- Active:', window.pageMarker.isActive);
      console.log('- Toolbar visible:', window.pageMarker.toolbar.style.display !== 'none');
      console.log('- Canvas ready:', !!window.pageMarker.canvas);
      console.log('- Current tool:', window.pageMarker.currentTool);
      console.log('- Canvas pointer events:', window.pageMarker.canvas.style.pointerEvents);
      console.log('- Canvas dimensions:', window.pageMarker.canvas.width, 'x', window.pageMarker.canvas.height);
      return window.pageMarker;
    };
    
    
    // Notify that WebScribble is ready
    console.log('WebScribble: Ready for communication');
    
  } catch (error) {
    console.error('WebScribble: Failed to initialize:', error);
  }
}

// Initialize immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWebScribble);
} else {
  initializeWebScribble();
}
