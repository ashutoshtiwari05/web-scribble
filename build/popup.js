// Popup script for WebScribble extension
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleBtn');
  const helpLink = document.getElementById('helpLink');
  const settingsLink = document.getElementById('settingsLink');
  
  // Helper function to update button state
  function updateButtonState(isActive) {
    if (isActive) {
      toggleBtn.textContent = 'Stop Annotating';
      toggleBtn.classList.add('active');
    } else {
      toggleBtn.textContent = 'Start Annotating';
      toggleBtn.classList.remove('active');
    }
  }
  
  // Helper function to show page restriction message
  function showPageRestrictionMessage() {
    // Remove existing warnings first
    const existingWarnings = document.querySelectorAll('.page-restriction-warning');
    existingWarnings.forEach(warning => warning.remove());
    
    const statusDiv = document.createElement('div');
    statusDiv.className = 'page-restriction-warning';
    statusDiv.style.cssText = 'background: #fff3cd; color: #856404; padding: 10px; margin: 10px 0; border-radius: 4px; font-size: 12px;';
    statusDiv.innerHTML = '⚠️ WebScribble cannot run on this page. Try a regular website (not chrome:// pages).';
    document.querySelector('.shortcuts').appendChild(statusDiv);
  }
  
  // Helper function to show success message
  function showSuccessMessage() {
    // Remove existing warnings first
    const existingWarnings = document.querySelectorAll('.page-restriction-warning');
    existingWarnings.forEach(warning => warning.remove());
  }
  
  // Check current state
  console.log('WebScribble Popup: Checking initial state');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      console.log('WebScribble Popup: Querying tab:', tabs[0].id, tabs[0].url);
      // Try to communicate with content script
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getState' }, (response) => {
        if (chrome.runtime.lastError) {
          console.log('WebScribble Popup: Content script not available on this page:', chrome.runtime.lastError.message);
          updateButtonState(false);
          showPageRestrictionMessage();
          return;
        }
        console.log('WebScribble Popup: Initial state response:', response);
        // Content script is loaded and responding
        if (response && response.active) {
          updateButtonState(true);
          showSuccessMessage();
        } else {
          updateButtonState(false);
          showSuccessMessage();
        }
      });
    }
  });
  
  // Toggle button click
  toggleBtn.addEventListener('click', () => {
    console.log('WebScribble Popup: Toggle button clicked');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        console.log('WebScribble Popup: Sending message to tab:', tabs[0].id);
        // Try to send message to content script
        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle-annotation' }, (response) => {
          if (chrome.runtime.lastError) {
            console.log('WebScribble Popup: Content script not available on this page:', chrome.runtime.lastError.message);
            showPageRestrictionMessage();
            return;
          }
          console.log('WebScribble Popup: Received response:', response);
          // Content script is loaded and responding
          if (response && response.active) {
            console.log('WebScribble Popup: Annotation mode activated');
            updateButtonState(true);
            showSuccessMessage();
            // Close popup when annotation mode is activated
            window.close();
          } else {
            console.log('WebScribble Popup: Annotation mode deactivated');
            updateButtonState(false);
            showSuccessMessage();
            // Close popup when annotation mode is deactivated
            window.close();
          }
        });
      }
    });
  });
  
  // Help link
  helpLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://github.com/your-repo/pagemarker#help' });
  });
  
  // Settings link
  settingsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
});
