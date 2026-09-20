const sharp = require('sharp');
const path = require('path');

const srcPath = 'C:/Users/HP/.gemini/antigravity/brain/7c6d129a-9800-416d-81d8-cbadb46e7bdf/.user_uploaded/media_1789901383959.png';
const publicDir = path.resolve('public/images');

async function fix() {
  console.log('--- Analyzing source image transparent bounds ---');
  const image = sharp(srcPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let minX = width, maxX = 0, minY = height, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const a = channels === 4 ? data[idx + 3] : 255;
      if (a > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`Text Alpha Bounds: minX=${minX}, maxX=${maxX}, minY=${minY}, maxY=${maxY}`);
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  console.log(`Content size: ${cropW} x ${cropH}, aspect ratio: ${(cropW/cropH).toFixed(2)}:1`);

  // Add 10px vertical and 15px horizontal breathing room
  const padX = 15;
  const padY = 10;

  const finalMinX = Math.max(0, minX - padX);
  const finalMaxX = Math.min(width - 1, maxX + padX);
  const finalMinY = Math.max(0, minY - padY);
  const finalMaxY = Math.min(height - 1, maxY + padY);

  const extractW = finalMaxX - finalMinX + 1;
  const extractH = finalMaxY - finalMinY + 1;

  console.log(`Cropping to: ${extractW} x ${extractH}`);

  // Extract directly from original image - preserving the original transparent background and vibrant green letters!
  await sharp(srcPath)
    .extract({ left: finalMinX, top: finalMinY, width: extractW, height: extractH })
    .png()
    .toFile(path.join(publicDir, 'citrafoam-logo-header.png'));

  await sharp(srcPath)
    .extract({ left: finalMinX, top: finalMinY, width: extractW, height: extractH })
    .png()
    .toFile(path.join(publicDir, 'citrafoam-logo.png'));

  await sharp(srcPath)
    .extract({ left: finalMinX, top: finalMinY, width: extractW, height: extractH })
    .png()
    .toFile(path.join(publicDir, 'citrafoam-logo-transparent.png'));

  // Let's also verify the result pixels
  const res = await sharp(path.join(publicDir, 'citrafoam-logo-header.png')).raw().toBuffer({ resolveWithObject: true });
  let alphaCount = 0;
  let transparentCount = 0;
  for (let i = 0; i < res.data.length; i += 4) {
    if (res.data[i + 3] > 10) alphaCount++;
    else transparentCount++;
  }
  console.log(`Result pixels: total=${res.info.width * res.info.height}, visibleLetters=${alphaCount}, transparentSpace=${transparentCount}`);
  console.log('Logo generated perfectly!');
}

fix().catch(console.error);
