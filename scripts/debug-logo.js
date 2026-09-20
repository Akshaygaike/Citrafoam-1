const sharp = require('sharp');

async function check() {
  const src = 'C:/Users/HP/.gemini/antigravity/brain/7c6d129a-9800-416d-81d8-cbadb46e7bdf/.user_uploaded/media_1789901383959.png';
  const header = 'public/images/citrafoam-logo-header.png';
  const trimmed = 'public/images/citrafoam-logo.png';

  console.log('--- Analyzing header image ---');
  const hRaw = await sharp(header).raw().toBuffer({ resolveWithObject: true });
  let nonZeroAlpha = 0;
  let greenPixels = 0;
  for (let i = 0; i < hRaw.data.length; i += 4) {
    if (hRaw.data[i + 3] > 10) {
      nonZeroAlpha++;
      if (hRaw.data[i + 1] > 100) greenPixels++;
    }
  }
  console.log('Header total pixels:', hRaw.info.width * hRaw.info.height);
  console.log('Header nonZeroAlpha:', nonZeroAlpha);
  console.log('Header greenPixels:', greenPixels);
  console.log('Dimensions:', hRaw.info.width, 'x', hRaw.info.height);

  console.log('--- Sampling source image pixels ---');
  const sRaw = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  // Sample corner pixel
  console.log('Top-left (0,0): R=', sRaw.data[0], 'G=', sRaw.data[1], 'B=', sRaw.data[2], 'A=', sRaw.data[3]);
  // Sample middle row
  const midY = 500;
  for (let x = 0; x < sRaw.info.width; x += 100) {
    const idx = (midY * sRaw.info.width + x) * sRaw.info.channels;
    console.log(`(${x}, ${midY}): R=${sRaw.data[idx]} G=${sRaw.data[idx+1]} B=${sRaw.data[idx+2]}`);
  }
}

check().catch(console.error);
