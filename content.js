let isPicking = false;

// Function to convert RGB to OKLCH
function rgbToOklch(r, g, b) {
  console.log('Converting RGB to OKLCH:', { r, g, b });
  
  // First convert RGB to linear RGB
  let r1 = r / 255;
  let g1 = g / 255;
  let b1 = b / 255;

  // Convert to sRGB
  r1 = r1 > 0.04045 ? Math.pow((r1 + 0.055) / 1.055, 2.4) : r1 / 12.92;
  g1 = g1 > 0.04045 ? Math.pow((g1 + 0.055) / 1.055, 2.4) : g1 / 12.92;
  b1 = b1 > 0.04045 ? Math.pow((b1 + 0.055) / 1.055, 2.4) : b1 / 12.92;

  // Convert to XYZ
  const x = r1 * 0.4124564 + g1 * 0.3575761 + b1 * 0.1804375;
  const y = r1 * 0.2126729 + g1 * 0.7151522 + b1 * 0.0721750;
  const z = r1 * 0.0193339 + g1 * 0.1191920 + b1 * 0.9503041;

  // Convert to OKLab
  const x1 = Math.pow(x, 1/3);
  const y1 = Math.pow(y, 1/3);
  const z1 = Math.pow(z, 1/3);

  const l = 0.2104542553 * x1 + 0.7936177850 * y1 - 0.0040720468 * z1;
  const a = 1.9779984951 * x1 - 2.4285922050 * y1 + 0.4505937099 * z1;
  const b2 = 0.0259040371 * x1 + 0.7827717662 * y1 - 0.8086757660 * z1;

  // Convert to OKLCH
  const c = Math.sqrt(a * a + b2 * b2);
  let h = Math.atan2(b2, a) * 180 / Math.PI;
  if (h < 0) h += 360;

  // Round to 4 decimal places for better precision
  const result = `oklch(${(l * 100).toFixed(4)}% ${c.toFixed(4)} ${h.toFixed(4)})`;
  console.log('OKLCH result:', result);
  return result;
}

function parseColor(colorString) {
  console.log('Parsing color:', colorString);
  
  // Handle rgb/rgba format
  const rgbMatch = colorString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgbMatch) {
    const result = rgbMatch.slice(1).map(Number);
    console.log('RGB match:', result);
    return result;
  }

  // Handle hex format
  const hexMatch = colorString.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);
    const result = [r, g, b];
    console.log('Hex match:', result);
    return result;
  }

  // Handle named colors
  const tempDiv = document.createElement('div');
  tempDiv.style.color = colorString;
  document.body.appendChild(tempDiv);
  const computedColor = window.getComputedStyle(tempDiv).color;
  document.body.removeChild(tempDiv);
  const rgb = computedColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgb) {
    const result = rgb.slice(1).map(Number);
    console.log('Named color match:', result);
    return result;
  }

  console.log('No color match found');
  return null;
}

function getColorAtPoint(x, y) {
  const element = document.elementFromPoint(x, y);
  if (!element) {
    console.log('No element found at point');
    return null;
  }

  console.log('Element found:', element.tagName, element.className);
  
  // First try computed styles
  const style = window.getComputedStyle(element);
  const colorProperties = [
    'backgroundColor',
    'color',
    'borderColor',
    'outlineColor'
  ];

  for (const prop of colorProperties) {
    const color = style[prop];
    console.log(`Checking ${prop}:`, color);
    if (color && color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') {
      const rgb = parseColor(color);
      if (rgb) {
        console.log(`Found color in ${prop}:`, rgb);
        return rgb;
      }
    }
  }

  // Then try to find the closest SVG element
  let currentElement = element;
  while (currentElement) {
    if (currentElement.tagName === 'svg' || currentElement.tagName === 'path' || 
        currentElement.tagName === 'rect' || currentElement.tagName === 'circle' ||
        currentElement.tagName === 'ellipse' || currentElement.tagName === 'polygon') {
      console.log('Found SVG element:', currentElement.tagName);
      
      // Check fill and stroke attributes first
      const fill = currentElement.getAttribute('fill');
      const stroke = currentElement.getAttribute('stroke');
      
      if (fill && fill !== 'none') {
        console.log('Found fill:', fill);
        const rgb = parseColor(fill);
        if (rgb) return rgb;
      }
      
      if (stroke && stroke !== 'none') {
        console.log('Found stroke:', stroke);
        const rgb = parseColor(stroke);
        if (rgb) return rgb;
      }
      
      // Then check computed styles
      const svgStyle = window.getComputedStyle(currentElement);
      const fillStyle = svgStyle.fill;
      const strokeStyle = svgStyle.stroke;
      
      if (fillStyle && fillStyle !== 'none') {
        console.log('Found fill style:', fillStyle);
        const rgb = parseColor(fillStyle);
        if (rgb) return rgb;
      }
      
      if (strokeStyle && strokeStyle !== 'none') {
        console.log('Found stroke style:', strokeStyle);
        const rgb = parseColor(strokeStyle);
        if (rgb) return rgb;
      }
    }
    currentElement = currentElement.parentElement;
  }

  // If still no color found, try parent elements
  let parent = element.parentElement;
  while (parent) {
    const parentStyle = window.getComputedStyle(parent);
    const backgroundColor = parentStyle.backgroundColor;
    console.log('Checking parent background:', backgroundColor);
    if (backgroundColor && backgroundColor !== 'transparent' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
      const rgb = parseColor(backgroundColor);
      if (rgb) {
        console.log('Found color in parent:', rgb);
        return rgb;
      }
    }
    parent = parent.parentElement;
  }

  console.log('No color found in element or parents');
  return null;
}

function pickColor(e) {
  if (!isPicking) return;

  // Prevent the click event from reaching the underlying element
  e.preventDefault();
  e.stopPropagation();

  console.log('Click detected at:', e.clientX, e.clientY);
  
  // Send the coordinates to the background script to capture the screen
  chrome.runtime.sendMessage({
    action: "captureScreen",
    x: e.clientX,
    y: e.clientY
  });

  // Stop picking
  stopPicking();
}

function startPicking() {
  console.log('Starting color picker...');
  isPicking = true;
  
  // Create a style element for the cursor
  const style = document.createElement('style');
  style.textContent = 'body { cursor: crosshair !important; }';
  document.head.appendChild(style);
  
  // Store the style element for later removal
  window.colorPickerStyle = style;
  
  // Only listen for clicks
  document.addEventListener('click', pickColor, true);
}

function stopPicking() {
  console.log('Stopping color picker...');
  isPicking = false;
  
  // Remove the cursor style
  if (window.colorPickerStyle) {
    window.colorPickerStyle.remove();
    window.colorPickerStyle = null;
  }
  
  document.removeEventListener('click', pickColor, true);
}

// Listen for messages from the popup and background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Received message:', request);
  if (request.action === "startPicking") {
    startPicking();
  } else if (request.action === "processImage") {
    // Create an image element to load the screenshot
    const img = new Image();
    img.onload = function() {
      // Create a canvas to get the pixel data
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image
      ctx.drawImage(img, 0, 0);
      
      // Get the pixel data at the clicked coordinates
      const pixel = ctx.getImageData(request.x, request.y, 1, 1).data;
      console.log('Pixel data:', pixel);
      
      // Convert to OKLCH using the existing function
      const oklch = rgbToOklch(pixel[0], pixel[1], pixel[2]);
      console.log('OKLCH:', oklch);
      
      // Copy to clipboard
      navigator.clipboard.writeText(oklch).then(() => {
        // Show a notification
        const notification = document.createElement('div');
        notification.textContent = `Color copied: ${oklch}`;
        notification.style.cssText = `
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: white;
          padding: 10px 20px;
          border-radius: 4px;
          z-index: 10000;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
      });
    };
    img.src = request.dataUrl;
  }
}); 