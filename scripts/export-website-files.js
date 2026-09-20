const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = 'C:\\Users\\HP\\.gemini\\antigravity\\scratch\\citrafoam';
const destDir = 'C:\\Users\\HP\\.gemini\\antigravity\\scratch\\citrafoam-website';
const zipFile = 'C:\\Users\\HP\\.gemini\\antigravity\\scratch\\citrafoam-website.zip';

// Clean or create destDir
if (fs.existsSync(destDir)) {
  fs.rmSync(destDir, { recursive: true, force: true });
}
fs.mkdirSync(destDir, { recursive: true });

// Items to copy (exclude node_modules and .next)
const includeItems = [
  'src',
  'public',
  'prisma',
  'scripts',
  'package.json',
  'package-lock.json',
  'netlify.toml',
  'next.config.mjs',
  'tailwind.config.ts',
  'tsconfig.json',
  'postcss.config.js',
  '.env',
  '.env.example',
  '.gitignore',
  'DEPLOYMENT.md',
  'next-env.d.ts'
];

for (const item of includeItems) {
  const srcPath = path.join(srcDir, item);
  const destPath = path.join(destDir, item);
  if (!fs.existsSync(srcPath)) continue;

  const stat = fs.statSync(srcPath);
  if (stat.isDirectory()) {
    fs.cpSync(srcPath, destPath, { recursive: true });
    console.log(`Copied directory: ${item}`);
  } else {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied file: ${item}`);
  }
}

// Create README.md inside destDir with Netlify deployment instructions
const readmeContent = `# Citrafoam — Premium Natural Cleaning Website

Production-ready Next.js 14 eCommerce platform with Supabase PostgreSQL and Netlify support.

## Project Structure
- \`src/\`: App Router pages, components, server actions, API routes, state management
- \`public/\`: Optimized brand logos, product photography, icons
- \`prisma/\`: PostgreSQL database schema with Supabase pooling
- \`netlify.toml\`: Preconfigured Netlify deployment configuration

## Quick Local Setup
\`\`\`bash
npm install
npm run build
npm run start
\`\`\`

## Deploy to Netlify
1. Push this folder to a GitHub repository:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   \`\`\`
2. In Netlify (app.netlify.com):
   - Click "Add new site" -> "Import an existing project" -> Choose GitHub
   - Netlify will auto-detect Next.js and read \`netlify.toml\`
3. Set Environment Variables in Netlify (Site configuration -> Environment variables):
   - \`DATABASE_URL\`
   - \`DIRECT_URL\`
   - \`AUTH_SECRET\`
   - \`AUTH_TRUST_HOST\` = "true"
   - \`NEXTAUTH_URL\` = "https://your-site.netlify.app"
   - \`NEXT_PUBLIC_APP_NAME\` = "Citrafoam"
`;

fs.writeFileSync(path.join(destDir, 'README.md'), readmeContent, 'utf8');
console.log('Created README.md in export folder');

// Create zip archive using PowerShell Compress-Archive
try {
  if (fs.existsSync(zipFile)) {
    fs.unlinkSync(zipFile);
  }
  console.log('Creating ZIP archive...');
  execSync(`powershell.exe -Command "Compress-Archive -Path '${destDir}\\*' -DestinationPath '${zipFile}' -Force"`);
  console.log(`ZIP created successfully at: ${zipFile}`);
} catch (err) {
  console.error('Compress error:', err.message);
}

console.log(`\nExport complete!\nFolder: ${destDir}\nArchive: ${zipFile}`);
