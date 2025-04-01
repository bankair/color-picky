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

// Expose the function globally
window.rgbToOklch = rgbToOklch; 