// This file is for debugging specific color conversions

// Mock the global window object to handle the global function
global.window = {};

// Import the color-conversion.js script
require('../color-conversion.js');

// Get reference to the function exposed on the window
const rgbToOklch = window.rgbToOklch;

describe('Debug Color Conversion', () => {
  test('Debug RGB(50, 96, 224) conversion', () => {
    // Test the specific blue color
    const r = 50;
    const g = 96;
    const b = 224;

    // Call the conversion function
    const result = rgbToOklch(r, g, b);

    // Log the result
    console.log(`\nRGB(${r}, ${g}, ${b}) converts to: ${result}`);

    // Parse the OKLCH values
    const matches = result.match(/oklch\((\d+\.\d+)% (\d+\.\d+) (\d+\.\d+)\)/);
    if (matches) {
      const l = parseFloat(matches[1]);
      const c = parseFloat(matches[2]);
      const h = parseFloat(matches[3]);
      
      console.log('Parsed OKLCH values:');
      console.log(` - Lightness: ${l}%`);
      console.log(` - Chroma: ${c}`);
      console.log(` - Hue: ${h}°`);
    } else {
      console.log('Failed to parse the OKLCH value:', result);
    }
    
    // Simple assertion to make the test pass
    expect(result).toBeTruthy();
  });
}); 