const fs = require('fs');
const { createCanvas } = require('canvas');

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(0, 0, size, size);

  // Color picker circle
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;

  // Draw color wheel
  for (let angle = 0; angle < 360; angle++) {
    const startAngle = (angle * Math.PI) / 180;
    const endAngle = ((angle + 1) * Math.PI) / 180;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();

    // Create gradient for the color wheel
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius
    );
    gradient.addColorStop(0, `hsl(${angle}, 100%, 50%)`);
    gradient.addColorStop(1, `hsl(${angle}, 100%, 25%)`);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  // Center dot
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(centerX, centerY, size * 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Save the icon
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`icons/icon${size}.png`, buffer);
}

// Generate icons in different sizes
[16, 48, 128].forEach(size => generateIcon(size)); 