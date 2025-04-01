// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureScreen") {
    // Capture the visible tab
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, function(dataUrl) {
      // Send the data URL back to the content script for processing
      chrome.tabs.sendMessage(sender.tab.id, {
        action: "processImage",
        dataUrl: dataUrl,
        x: request.x,
        y: request.y
      });
    });
  }
}); 