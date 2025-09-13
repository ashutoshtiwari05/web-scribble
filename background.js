// Background script for WebScribble extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('WebScribble extension installed');
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: command }, (response) => {
        if (chrome.runtime.lastError) {
          console.log('Content script not available for keyboard shortcut:', chrome.runtime.lastError.message);
        }
      });
    }
  });
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: 'toggle-annotation' }, (response) => {
    if (chrome.runtime.lastError) {
      console.log('Content script not available for icon click:', chrome.runtime.lastError.message);
    }
  });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.action === 'updateIcon') {
    chrome.action.setIcon({
      path: request.active ? 'icons/icon-active.png' : 'icons/icon16.png',
      tabId: sender.tab.id
    });
  }
});

// Handle injection requests from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'injectContentScript') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['content.js']
        }).then(() => {
          console.log('Content script injected successfully');
          sendResponse({ success: true });
        }).catch((error) => {
          console.log('Failed to inject content script:', error);
          sendResponse({ success: false, error: error.message });
        });
      } else {
        sendResponse({ success: false, error: 'No active tab found' });
      }
    });
    return true; // Keep message channel open for async response
  }
});
