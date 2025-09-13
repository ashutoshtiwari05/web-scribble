#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Build configuration
const config = {
  srcDir: 'src',
  buildDir: 'build',
  distDir: 'dist',
  assetsDir: 'assets',
  extensionName: 'WebScribble',
  version: '1.0.0'
};

// Ensure build directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

// Copy file with logging
function copyFile(src, dest) {
  try {
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${src} -> ${dest}`);
  } catch (error) {
    console.error(`Error copying ${src}:`, error.message);
  }
}

// Copy directory recursively
function copyDir(src, dest) {
  ensureDir(dest);
  const items = fs.readdirSync(src);
  
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  });
}

// Main build function
function build() {
  console.log(`Building ${config.extensionName} v${config.version}...`);
  
  // Clean build directory
  if (fs.existsSync(config.buildDir)) {
    fs.rmSync(config.buildDir, { recursive: true });
    console.log('Cleaned build directory');
  }
  
  // Create build directory
  ensureDir(config.buildDir);
  
  // Copy source files
  const srcFiles = fs.readdirSync(config.srcDir);
  srcFiles.forEach(file => {
    const srcPath = path.join(config.srcDir, file);
    const destPath = path.join(config.buildDir, file);
    
    if (fs.statSync(srcPath).isFile()) {
      copyFile(srcPath, destPath);
    }
  });
  
  // Copy assets
  if (fs.existsSync(config.assetsDir)) {
    copyDir(config.assetsDir, path.join(config.buildDir, 'assets'));
  }
  
  console.log('Build completed successfully!');
}

// Run build
build();
