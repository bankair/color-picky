// Function to convert RGB to OKLCH
function rgbToOklch(r, g, b) {
  console.log('Converting RGB to OKLCH:', { r, g, b });
  
  // Step 1: Convert sRGB to linear RGB (remove gamma correction)
  // Normalize RGB values to range [0, 1]
  let lr = r / 255;
  let lg = g / 255;
  let lb = b / 255;

  // Apply sRGB gamma correction removal (sRGB to linear RGB)
  lr = lr <= 0.04045 ? lr / 12.92 : Math.pow((lr + 0.055) / 1.055, 2.4);
  lg = lg <= 0.04045 ? lg / 12.92 : Math.pow((lg + 0.055) / 1.055, 2.4);
  lb = lb <= 0.04045 ? lb / 12.92 : Math.pow((lb + 0.055) / 1.055, 2.4);

  // Step 2: Convert linear RGB to OKLab
  // Linear RGB to LMS (long, medium, short cone response)
  const lms_l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const lms_m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const lms_s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  // Apply the non-linearity (cube root)
  const lCubeRoot = Math.cbrt(lms_l);
  const mCubeRoot = Math.cbrt(lms_m);
  const sCubeRoot = Math.cbrt(lms_s);

  // Convert to OKLab
  const L = 0.2104542553 * lCubeRoot + 0.7936177850 * mCubeRoot - 0.0040720468 * sCubeRoot;
  const a = 1.9779984951 * lCubeRoot - 2.4285922050 * mCubeRoot + 0.4505937099 * sCubeRoot;
  const b_lab = 0.0259040371 * lCubeRoot + 0.7827717662 * mCubeRoot - 0.8086757660 * sCubeRoot;

  // Step 3: Convert OKLab to OKLCH
  // Calculate chroma (distance from neutral gray axis)
  const C = Math.sqrt(a * a + b_lab * b_lab);
  
  // Calculate hue (angle in the a,b plane)
  // Use atan2 for correct quadrant handling
  let h = Math.atan2(b_lab, a) * 180 / Math.PI;
  
  // Normalize hue to [0, 360) range
  if (h < 0) h += 360;
  
  // For very low chroma (near grayscale), hue value becomes meaningless
  // In this case, we can either keep last valid hue or set to 0
  // Use a threshold to determine low chroma
  const hue = C < 0.00001 ? 0 : h;

  // Format result with integer percentage for lightness and precision for chroma and hue
  const lightness = Math.round(L * 100); // Round to nearest integer
  const result = `oklch(${lightness}% ${C.toFixed(4)} ${hue.toFixed(4)})`;
  console.log('OKLCH result:', result);
  return result;
}

// Expose the function globally
window.rgbToOklch = rgbToOklch; 