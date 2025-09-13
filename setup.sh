#!/bin/bash

# PageMarker Extension Setup Script
# This script sets up the development environment for the PageMarker Chrome extension

echo "🎨 PageMarker Chrome Extension Setup"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js $(node --version) found"
echo "✅ npm $(npm --version) found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Run linting
echo ""
echo "🔍 Running code quality checks..."
npm run lint

if [ $? -eq 0 ]; then
    echo "✅ Code quality checks passed"
else
    echo "⚠️  Code quality checks completed with warnings"
fi

# Build the extension
echo ""
echo "🔨 Building extension..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Extension built successfully"
else
    echo "❌ Failed to build extension"
    exit 1
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode' (toggle in top right)"
echo "3. Click 'Load unpacked'"
echo "4. Select this directory: $(pwd)"
echo "5. The PageMarker extension should now appear in your extensions list"
echo ""
echo "🚀 Development Commands:"
echo "  npm run dev     - Start development mode"
echo "  npm run build   - Build for production"
echo "  npm run lint    - Run code quality checks"
echo "  npm run package - Create Chrome Web Store package"
echo ""
echo "📖 For more information, see README.md"
echo ""
echo "Happy coding! 🎨"
