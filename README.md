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

1. **Quick Setup (Recommended)**
   ```bash
   # Run the setup script
   ./setup.sh
   ```

2. **Manual Setup**
   ```bash
   # Install dependencies
   npm install
   
   # Build the extension
   npm run build
   ```

3. **Load Extension in Chrome**
   ```bash
   # Use Makefile helper
   make install
   
   # Or manually:
   # 1. Open Chrome → chrome://extensions/
   # 2. Enable "Developer mode"
   # 3. Click "Load unpacked"
   # 4. Select this directory
   ```

4. **Start Development**
   ```bash
   npm run dev
   # or
   make dev
   ```

### For End Users

#### Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore) (link coming soon)
2. Search for "WebScribble"
3. Click "Add to Chrome"
4. Grant permissions when prompted

#### Manual Installation
1. Download the latest release from [GitHub Releases](https://github.com/your-repo/pagemarker/releases)
2. Extract the ZIP file
3. Open Chrome → `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked" and select the extracted folder

## 🛠️ Development

### Project Structure
```
Chrome-Plugin/
├── manifest.json          # Extension configuration
├── background.js          # Service worker
├── content.js            # Main annotation logic
├── content.css           # Styling for toolbar
├── popup.html            # Extension popup UI
├── popup.js              # Popup functionality
├── icons/                # Extension icons
├── Makefile              # Build automation
├── environment.yaml      # Conda environment
└── README.md            # This file
```

### Available Commands

```bash
# Development
make dev          # Start development mode
make lint         # Run code linting
make test         # Run tests

# Building
make build        # Build for production
make package      # Create Chrome Web Store package
make clean        # Clean build artifacts

# Utilities
make icons        # Generate icon files
make install      # Show installation instructions
make setup        # Setup development environment
make help         # Show all available commands
```

### Development Workflow

1. **Make Changes**
   - Edit source files in the root directory
   - Changes are automatically reflected in the extension

2. **Test Changes**
   - Go to `chrome://extensions/`
   - Click the refresh button on the WebScribble extension card
   - Test your changes on any webpage

3. **Build for Production**
   ```bash
   make release  # Full build, lint, test, and package
   ```

## 🎯 Usage

### Basic Usage
1. **Activate**: Click the WebScribble icon or press `Alt+D` (Windows) / `Option+D` (Mac)
2. **Select Tool**: Choose from pen, highlighter, eraser, shapes, or text
3. **Customize**: Adjust color and size using the toolbar
4. **Annotate**: Draw, highlight, or type directly on the webpage
5. **Deactivate**: Click the close button or press `Alt+D` again

### For Content Creators
- **Screen Recording**: All annotations remain visible in OBS, Loom, QuickTime, etc.
- **Laser Pointer**: Use the laser tool for presentations
- **Quick Toggle**: Switch between browse and annotation modes instantly

### For Educators
- **Live Demos**: Annotate during online classes
- **Tutorial Creation**: Mark important points in real-time
- **Student Interaction**: Highlight key concepts during explanations

## 🔧 Configuration

### Settings Storage
The extension automatically saves your preferences:
- Selected tool
- Color preferences
- Brush size
- Toolbar position

### Customization
- **Toolbar Position**: Drag the toolbar to your preferred location
- **Keyboard Shortcuts**: Customize in Chrome's extension settings
- **Colors**: Use the color picker for any color you prefer

## 🚀 Publishing

### Chrome Web Store

1. **Prepare Package**
   ```bash
   make package
   ```

2. **Chrome Web Store Developer Account**
   - Visit [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   - Pay the one-time $5 registration fee
   - Verify your identity

3. **Upload Package**
   - Upload the generated ZIP file from `dist/` directory
   - Fill out store listing information
   - Add screenshots and promotional images
   - Submit for review

4. **Store Listing Requirements**
   - **Name**: WebScribble - Webpage Annotation Tool
   - **Description**: Clear, compelling description of features
   - **Screenshots**: Show the extension in action
   - **Promotional Images**: 1280x800 and 640x400 banners
   - **Privacy Policy**: Required for extensions with permissions

### Store Listing Content

#### Short Description
"Annotate directly on any webpage with drawing tools, shapes, and text. Perfect for content creators and educators."

#### Detailed Description
```
WebScribble transforms any webpage into an interactive canvas for real-time annotation. Whether you're creating tutorials, conducting online training, or explaining concepts during screen recordings, WebScribble provides the tools you need.

🎨 ANNOTATION TOOLS
• Pen with customizable colors and sizes
• Highlighter for emphasizing content
• Eraser for precise corrections
• Shapes: rectangles, circles, and arrows
• Text tool for adding notes
• Laser pointer mode for presentations

⌨️ KEYBOARD SHORTCUTS
• Alt+D: Toggle annotation mode
• Alt+C: Clear all annotations
• Ctrl+1: Pen tool
• Ctrl+2: Highlighter
• Ctrl+Z: Undo / Ctrl+Shift+Z: Redo

🎥 RECORDING COMPATIBLE
All annotations remain visible in screen recordings, making WebScribble perfect for:
• YouTube tutorials
• Online course creation
• Live presentations
• Training sessions
• Educational content

🚀 EASY TO USE
• One-click activation
• Draggable toolbar
• No page reload required
• Works on any website
• Saves your preferences

Perfect for content creators, educators, trainers, and anyone who needs to annotate web content in real-time.
```

## 🤝 Contributing

1. **Fork the Repository**
2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make Changes**
   ```bash
   make dev  # Start development
   # Make your changes
   make lint  # Check code quality
   ```
4. **Test Thoroughly**
   - Test on multiple websites
   - Verify keyboard shortcuts
   - Check recording compatibility
5. **Submit Pull Request**

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test on multiple browsers
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**Extension not working?**
- Check if it's enabled in `chrome://extensions/`
- Try refreshing the extension
- Clear browser cache and reload

**Annotations not visible in recordings?**
- Ensure the extension is active before starting recording
- Some recording software may need specific settings

**Keyboard shortcuts not working?**
- Check for conflicts with other extensions
- Verify the page has focus
- Try refreshing the page

### Getting Help
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check this README and inline comments
- **Community**: Join discussions in GitHub Discussions

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Core annotation tools
- Keyboard shortcuts
- Recording compatibility
- Cross-platform support

## 🎯 Roadmap

### Upcoming Features
- [ ] Safari extension support
- [ ] Cloud sync for annotations
- [ ] Export annotations as images
- [ ] Collaborative annotation
- [ ] More shape tools
- [ ] Annotation templates
- [ ] Voice notes integration

---

**Made with ❤️ for content creators and educators**

*WebScribble - Making web annotation simple and powerful*
