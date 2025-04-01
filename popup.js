document.addEventListener('DOMContentLoaded', function() {
  const startPickingButton = document.getElementById('startPicking');
  const statusElement = document.getElementById('status');

  startPickingButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // First inject the content script
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      }).then(() => {
        // Then start the color picking
        chrome.tabs.sendMessage(tabs[0].id, {action: "startPicking"});
        window.close();
      }).catch(error => {
        console.error('Failed to inject content script:', error);
        statusElement.textContent = 'Error: Could not start color picker';
        statusElement.style.display = 'block';
      });
    });
  });

  // Listen for color updates from content script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "colorPicked") {
      statusElement.textContent = `Copied: ${request.oklch}`;
      statusElement.style.display = 'block';
    }
  });
}); 