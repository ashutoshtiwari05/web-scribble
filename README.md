# WebScribble - Webpage Annotation Extension

A powerful Chrome extension that enables real-time annotation directly on any webpage. Perfect for content creators, educators, and trainers who need to explain topics during screen recordings.

## 🚀 Features

### Core Annotation Tools
- **Pen Tool** - Draw with custom colors and thickness
- **Highlighter** - Semi-transparent highlighting
- **Eraser** - Remove parts of your annotations
- **Shapes** - Rectangle, circle, and arrow tools
- **Text Tool** - Click and type anywhere on the page with customizable font sizes
- **Laser Pointer** - Cursor glow effect for presentations

### User Experience
- **Floating Toolbar** - Draggable, always accessible
- **Undo/Redo** - Full history support
- **Clear All** - Quick reset functionality
- **Toggle Mode** - Easy on/off without page reload
- **Recording Compatible** - All annotations visible in screen recordings

### Keyboard Shortcuts
| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Toggle Annotation | `Alt + D` | `Alt + D` |
| Pen Tool | `Ctrl + Shift + 1` | `⌘ + Shift + 1` |
| Highlighter | `Ctrl + Shift + 2` | `⌘ + Shift + 2` |
| Text Tool | `Ctrl + Shift + 3` | `⌘ + Shift + 3` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |

*Note: Clear All is available via the toolbar button (🗑️ Clear)*

## 📦 Installation

### For Development

1. **Load Extension in Chrome**
   ```bash
   # Use Makefile helper
   make install
   
   # Or manually:
   # 1. Open Chrome → chrome://extensions/
   # 2. Enable "Developer mode"
   # 3. Click "Load unpacked"
   # 4. Select this directory
   ```

2. **Start Development**
   ```bash
   make dev
   ```

### For End Users

#### Install from Source
1. **Clone the repository**
   ```bash
   git clone https://github.com/ashutoshtiwari05/web-scribble.git
   cd web-scribble
   ```

2. **Build the extension**
   ```bash
   make build
   ```

3. **Load in Chrome**
   - Open Chrome → `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `build` folder

## 🛠️ Development

### Quick Start
```bash
# Clone and setup
git clone https://github.com/ashutoshtiwari05/web-scribble.git
cd web-scribble

# Build the extension
make build

# Load in Chrome
# 1. Open chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the 'build' folder
```

### Available Commands

```bash
make dev          # Start development mode
make build        # Build for production
make package      # Create distribution package
make clean        # Clean build artifacts
make install      # Show installation instructions
make help         # Show all available commands
```

### Development Workflow

1. **Make Changes** - Edit source files in the root directory
2. **Test Changes** - Go to `chrome://extensions/` and refresh the extension
3. **Build for Production** - Run `make build` to update the build folder

## 🎯 Usage

### Basic Usage
1. **Activate**: Click the WebScribble icon or press `Alt+D`
2. **Select Tool**: Choose from pen, highlighter, eraser, shapes, or text
3. **Customize**: Adjust color and size using the toolbar
4. **Annotate**: Draw, highlight, or type directly on the webpage
5. **Deactivate**: Click the close button or press `Alt+D` again

### Perfect For
- **Content Creators**: Screen recordings with visible annotations
- **Educators**: Live demos and tutorial creation
- **Trainers**: Interactive presentations and explanations

## 🔧 Configuration

The extension automatically saves your preferences:
- Selected tool and color preferences
- Brush size and toolbar position
- Drag the toolbar to your preferred location

## 📦 Building

### Create Distribution Package
```bash
make package
```
This creates a ZIP file in the `dist/` directory that can be shared or installed manually.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

### Common Issues
- **Extension not working?** Check if enabled in `chrome://extensions/`
- **Annotations not visible in recordings?** Ensure extension is active before recording
- **Keyboard shortcuts not working?** Check for conflicts with other extensions

---

**Made with ❤️ for content creators and educators**
