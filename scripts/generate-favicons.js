const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'apple-touch-icon.png': 180,
};

async function generateFavicons() {
  const svgBuffer = fs.readFileSync(path.join(__dirname, '../public/favicon.svg'));
  
  // Generate PNG versions
  for (const [filename, size] of Object.entries(sizes)) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, '../public', filename));
  }

  // Generate ICO file (16x16 and 32x32 combined)
  const favicon16 = await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toBuffer();
  
  const favicon32 = await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toBuffer();

  // Combine into ICO
  await sharp(favicon32)
    .joinChannel(favicon16)
    .toFile(path.join(__dirname, '../public/favicon.ico'));
}

generateFavicons().catch(console.error); 