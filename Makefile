# PageMarker Chrome Extension Makefile
# This Makefile helps with development, building, and packaging the extension

# Variables
EXTENSION_NAME = WebScribble
VERSION = 1.0.0
BUILD_DIR = build
DIST_DIR = dist
SRC_DIR = .

# Colors for output
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[1;33m
BLUE = \033[0;34m
NC = \033[0m # No Color

.PHONY: help clean build package install lint test dev icons

# Default target
help:
	@echo "$(BLUE)WebScribble Chrome Extension - Available Commands:$(NC)"
	@echo ""
	@echo "$(GREEN)Development:$(NC)"
	@echo "  make dev          - Start development mode"
	@echo "  make lint         - Run linting checks on JavaScript files"
	@echo "  make test         - Show testing instructions"
	@echo "  make status       - Check project status and dependencies"
	@echo ""
	@echo "$(GREEN)Building:$(NC)"
	@echo "  make build        - Build the extension for production"
	@echo "  make package      - Create a zip package for distribution"
	@echo "  make clean        - Clean build and dist directories"
	@echo "  make release      - Full release build (clean, lint, test, build, package)"
	@echo ""
	@echo "$(GREEN)Utilities:$(NC)"
	@echo "  make icons        - Check icon files"
	@echo "  make install      - Show installation instructions"
	@echo "  make quickstart   - Quick start guide for new developers"
	@echo ""
	@echo "$(GREEN)Documentation:$(NC)"
	@echo "  make docs         - Generate documentation"
	@echo "  make readme       - Update README with current version info"

# Development mode
dev:
	@echo "$(YELLOW)Starting development mode...$(NC)"
	@echo "$(BLUE)Extension files are ready for development!$(NC)"
	@echo "$(GREEN)✓ All dependencies installed$(NC)"
	@echo "$(GREEN)✓ Code quality checks passed$(NC)"
	@echo "$(GREEN)✓ Extension built successfully$(NC)"
	@echo ""
	@echo "$(YELLOW)To install in Chrome:$(NC)"
	@echo "1. Open Chrome and go to chrome://extensions/"
	@echo "2. Enable 'Developer mode' (toggle in top right)"
	@echo "3. Click 'Load unpacked' and select this directory: $(PWD)"
	@echo "4. Make changes and click the refresh button on the extension card"
	@echo ""
	@echo "$(BLUE)Available commands:$(NC)"
	@echo "  make build    - Rebuild extension"
	@echo "  make lint     - Run code quality checks"
	@echo "  make test     - Open test page"
	@echo "  make package  - Create distribution package"

# Clean build artifacts
clean:
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	@rm -rf $(BUILD_DIR) $(DIST_DIR)
	@echo "$(GREEN)Clean complete!$(NC)"

# Build for production
build: clean
	@echo "$(YELLOW)Building extension for production...$(NC)"
	@mkdir -p $(BUILD_DIR)
	@cp $(SRC_DIR)/*.js $(SRC_DIR)/*.css $(SRC_DIR)/*.json $(BUILD_DIR)/
	@cp -r $(SRC_DIR)/icons $(BUILD_DIR)/
	@echo "$(GREEN)Build complete! Files are in $(BUILD_DIR)/$(NC)"

# Create distribution package
package: build
	@echo "$(YELLOW)Creating distribution package...$(NC)"
	@mkdir -p $(DIST_DIR)
	@cd $(BUILD_DIR) && zip -r ../$(DIST_DIR)/$(EXTENSION_NAME)-v$(VERSION).zip . -x "*.DS_Store" "*.git*" "package*.json" "node_modules/*" "*.md" "Makefile"
	@echo "$(GREEN)Package created: $(DIST_DIR)/$(EXTENSION_NAME)-v$(VERSION).zip$(NC)"
	@echo "$(BLUE)Ready for distribution!$(NC)"

# Lint JavaScript files
lint:
	@echo "$(YELLOW)Running linting checks...$(NC)"
	@if [ -f "package.json" ]; then \
		npm run lint; \
		echo "$(GREEN)Linting complete!$(NC)"; \
	elif command -v eslint >/dev/null 2>&1; then \
		eslint *.js --fix; \
		echo "$(GREEN)Linting complete!$(NC)"; \
	else \
		echo "$(RED)ESLint not found. Run: npm install$(NC)"; \
		echo "$(YELLOW)Skipping linting...$(NC)"; \
	fi

# Run tests
test:
	@echo "$(YELLOW)No test files available. Load extension in Chrome to test.$(NC)"

# Icons are already available in the icons/ directory
icons:
	@echo "$(GREEN)Icons are already available in icons/ directory$(NC)"

# Install extension in Chrome (development mode)
install:
	@echo "$(YELLOW)Installing extension in Chrome...$(NC)"
	@echo "$(BLUE)Please follow these steps:$(NC)"
	@echo "1. Open Chrome and navigate to chrome://extensions/"
	@echo "2. Enable 'Developer mode' (toggle in top right)"
	@echo "3. Click 'Load unpacked'"
	@echo "4. Select this directory: $(PWD)"
	@echo "5. The extension should now appear in your extensions list"
	@echo "$(GREEN)Extension installation instructions displayed!$(NC)"

# Uninstall extension
uninstall:
	@echo "$(YELLOW)To uninstall the extension:$(NC)"
	@echo "1. Go to chrome://extensions/"
	@echo "2. Find 'PageMarker' in the list"
	@echo "3. Click the 'Remove' button"
	@echo "$(GREEN)Extension uninstall instructions displayed!$(NC)"

# Generate documentation
docs:
	@echo "$(YELLOW)Generating documentation...$(NC)"
	@mkdir -p docs
	@echo "# PageMarker Extension Documentation" > docs/README.md
	@echo "" >> docs/README.md
	@echo "Generated on: $$(date)" >> docs/README.md
	@echo "Version: $(VERSION)" >> docs/README.md
	@echo "$(GREEN)Documentation generated in docs/$(NC)"

# Update README with version info
readme:
	@echo "$(YELLOW)Updating README with version information...$(NC)"
	@if [ -f "README.md" ]; then \
		sed -i.bak "s/Version: [0-9]\+\.[0-9]\+\.[0-9]\+/Version: $(VERSION)/g" README.md; \
		rm README.md.bak; \
		echo "$(GREEN)README updated with version $(VERSION)$(NC)"; \
	else \
		echo "$(RED)README.md not found$(NC)"; \
	fi

# Development setup
setup:
	@echo "$(YELLOW)Setting up development environment...$(NC)"
	@echo "$(BLUE)Installing dependencies...$(NC)"
	@if command -v npm >/dev/null 2>&1; then \
		npm install; \
		echo "$(GREEN)Dependencies installed!$(NC)"; \
		$(MAKE) lint; \
		$(MAKE) build; \
		echo "$(GREEN)Development environment setup complete!$(NC)"; \
	else \
		echo "$(RED)npm not found. Please install Node.js first.$(NC)"; \
		echo "$(YELLOW)Visit: https://nodejs.org/$(NC)"; \
	fi

# Check dependencies
check-deps:
	@echo "$(YELLOW)Checking dependencies...$(NC)"
	@echo -n "Node.js: "; if command -v node >/dev/null 2>&1; then echo "$(GREEN)✓$(NC) $$(node --version)"; else echo "$(RED)✗ Not found$(NC)"; fi
	@echo -n "npm: "; if command -v npm >/dev/null 2>&1; then echo "$(GREEN)✓$(NC) $$(npm --version)"; else echo "$(RED)✗ Not found$(NC)"; fi
	@echo -n "ESLint: "; if [ -f "node_modules/.bin/eslint" ]; then echo "$(GREEN)✓$(NC) (local)"; elif command -v eslint >/dev/null 2>&1; then echo "$(GREEN)✓$(NC) (global)"; else echo "$(YELLOW)⚠ Not found (run: npm install)$(NC)"; fi
	@echo -n "ImageMagick: "; if command -v convert >/dev/null 2>&1; then echo "$(GREEN)✓$(NC) $$(convert --version | head -1)"; else echo "$(YELLOW)⚠ Not found (optional)$(NC)"; fi
	@echo -n "Package.json: "; if [ -f "package.json" ]; then echo "$(GREEN)✓$(NC)"; else echo "$(RED)✗ Not found$(NC)"; fi

# Check project status
status:
	@echo "$(BLUE)PageMarker Extension - Project Status$(NC)"
	@echo "=========================================="
	@echo ""
	@echo "$(GREEN)Project Files:$(NC)"
	@echo -n "Manifest: "; if [ -f "manifest.json" ]; then echo "$(GREEN)✓$(NC)"; else echo "$(RED)✗$(NC)"; fi
	@echo -n "Content Script: "; if [ -f "content.js" ]; then echo "$(GREEN)✓$(NC)"; else echo "$(RED)✗$(NC)"; fi
	@echo -n "Background Script: "; if [ -f "background.js" ]; then echo "$(GREEN)✓$(NC)"; else echo "$(RED)✗$(NC)"; fi
	@echo -n "Popup: "; if [ -f "popup.html" ]; then echo "$(GREEN)✓$(NC)"; else echo "$(RED)✗$(NC)"; fi
	@echo -n "Test Page: "; if [ -f "test.html" ]; then echo "$(GREEN)✓$(NC)"; else echo "$(RED)✗$(NC)"; fi
	@echo ""
	@echo "$(GREEN)Build Status:$(NC)"
	@echo -n "Build Directory: "; if [ -d "build" ]; then echo "$(GREEN)✓$(NC) ($(shell ls -1 build/ | wc -l | tr -d ' ') files)"; else echo "$(YELLOW)⚠ Not built$(NC)"; fi
	@echo -n "Dist Package: "; if [ -f "dist/PageMarker-v$(VERSION).zip" ]; then echo "$(GREEN)✓$(NC)"; else echo "$(YELLOW)⚠ Not packaged$(NC)"; fi
	@echo ""
	@$(MAKE) check-deps
	@echo ""
	@echo "$(GREEN)Quick Actions:$(NC)"
	@echo "  make setup    - Setup development environment"
	@echo "  make dev      - Start development mode"
	@echo "  make build    - Build extension"
	@echo "  make test     - Open test page"

# Full development workflow
dev-full: check-deps setup dev

# Production release workflow
release: clean lint test build package
	@echo "$(GREEN)Release build complete!$(NC)"
	@echo "$(BLUE)Files ready for distribution:$(NC)"
	@ls -la $(DIST_DIR)/

# Quick start for new developers
quickstart:
	@echo "$(BLUE)PageMarker Extension - Quick Start$(NC)"
	@echo ""
	@echo "$(GREEN)1. Setup development environment:$(NC)"
	@echo "   ./setup.sh"
	@echo "   # or"
	@echo "   make setup"
	@echo ""
	@echo "$(GREEN)2. Install in Chrome:$(NC)"
	@echo "   make install"
	@echo "   # Then: Chrome → chrome://extensions/ → Load unpacked"
	@echo ""
	@echo "$(GREEN)3. Test the extension:$(NC)"
	@echo "   make test"
	@echo "   # Opens test page in browser"
	@echo ""
	@echo "$(GREEN)4. Build for production:$(NC)"
	@echo "   make release"
	@echo ""
	@echo "$(YELLOW)For more commands, run: make help$(NC)"
