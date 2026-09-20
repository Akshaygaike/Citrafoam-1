const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcPath = 'C:/Users/HP/.gemini/antigravity/brain/7c6d129a-9800-416d-81d8-cbadb46e7bdf/.user_uploaded/media_1789901383959.png';
const publicDir = path.resolve('public/images');

async function main() {
  const image = sharp(srcPath);
  const { width, height } = await image.metadata();

  // Find exact bounding box of the green text
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const channels = info.channels;

  let minX = width, maxX = 0, minY = height, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = channels === 4 ? data[idx + 3] : 255;

      // Detect non-white pixels
      if (a > 20 && (r < 235 || g < 235 || b < 235)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`Bounding box: minX=${minX}, maxX=${maxX}, minY=${minY}, maxY=${maxY}`);
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  // Add small padding around text
  const padH = Math.round(cropH * 0.12);
  const padW = Math.round(cropW * 0.03);

  const finalMinX = Math.max(0, minX - padW);
  const finalMaxX = Math.min(width - 1, maxX + padW);
  const finalMinY = Math.max(0, minY - padH);
  const finalMaxY = Math.min(height - 1, maxY + padH);

  const extractW = finalMaxX - finalMinX + 1;
  const extractH = finalMaxY - finalMinY + 1;

  console.log(`Extracted size: ${extractW} x ${extractH}`);

  // 1. Plain cropped PNG with original white background
  await sharp(srcPath)
    .extract({ left: finalMinX, top: finalMinY, width: extractW, height: extractH })
    .png()
    .toFile(path.join(publicDir, 'citrafoam-logo.png'));

  // 2. High-precision Transparent Green Logo:
  // Alpha is calculated from the intensity of the green text vs white background
  // White: r=255, g=255, b=255 -> alpha=0
  // Green text target: r=0, g=170, b=85
  const croppedRaw = await sharp(srcPath)
    .extract({ left: finalMinX, top: finalMinY, width: extractW, height: extractH })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const cData = croppedRaw.data;
  const greenAlphaData = Buffer.from(cData);
  const whiteLogoData = Buffer.from(cData);

  for (let i = 0; i < cData.length; i += 4) {
    const r = cData[i];
    const g = cData[i + 1];
    const b = cData[i + 2];

    // Whiteness metric: how close to 255 is it?
    // In the green text, r and b are low (~0 and ~85), g is ~170.
    // In white, r=255, g=255, b=255.
    const whiteness = (r + b) / 2; // In green text, r+b is ~42. In white, r+b is 255.
    
    let alpha = 0;
    if (whiteness < 245) {
      alpha = Math.round(Math.min(255, Math.max(0, (245 - whiteness) * 1.5)));
      // Normalize green color
      greenAlphaData[i] = 0;
      greenAlphaData[i + 1] = 175;
      greenAlphaData[i + 2] = 85;
      greenAlphaData[i + 3] = alpha;

      // White version
      whiteLogoData[i] = 255;
      whiteLogoData[i + 1] = 255;
      whiteLogoData[i + 2] = 255;
      whiteLogoData[i + 3] = alpha;
    } else {
      greenAlphaData[i + 3] = 0;
      whiteLogoData[i + 3] = 0;
    }
  }

  // Save green transparent logo
  await sharp(greenAlphaData, {
    raw: { width: extractW, height: extractH, channels: 4 }
  })
    .png()
    .toFile(path.join(publicDir, 'citrafoam-logo-header.png'));

  await sharp(greenAlphaData, {
    raw: { width: extractW, height: extractH, channels: 4 }
  })
    .png()
    .toFile(path.join(publicDir, 'citrafoam-logo-transparent.png'));

  // Save white transparent logo (great for dark footer or dark backgrounds)
  await sharp(whiteLogoData, {
    raw: { width: extractW, height: extractH, channels: 4 }
  })
    .png()
    .toFile(path.join(publicDir, 'citrafoam-logo-white.png'));

  console.log('Successfully generated:');
  console.log(' - citrafoam-logo.png (cropped white bg)');
  console.log(' - citrafoam-logo-header.png (crisp green transparent)');
  console.log(' - citrafoam-logo-transparent.png (crisp green transparent)');
  console.log(' - citrafoam-logo-white.png (crisp white transparent)');
}

main().catch(console.error);
