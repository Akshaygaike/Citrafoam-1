# Citrafoam — Premium Natural Cleaning Website

Production-ready Next.js 14 eCommerce platform with Supabase PostgreSQL and Netlify support.

## Project Structure
- `src/`: App Router pages, components, server actions, API routes, state management
- `public/`: Optimized brand logos, product photography, icons
- `prisma/`: PostgreSQL database schema with Supabase pooling
- `netlify.toml`: Preconfigured Netlify deployment configuration

## Quick Local Setup
```bash
npm install
npm run build
npm run start
```

## Deploy to Netlify
1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
2. In Netlify (app.netlify.com):
   - Click "Add new site" -> "Import an existing project" -> Choose GitHub
   - Netlify will auto-detect Next.js and read `netlify.toml`
3. Set Environment Variables in Netlify (Site configuration -> Environment variables):
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `AUTH_SECRET`
   - `AUTH_TRUST_HOST` = "true"
   - `NEXTAUTH_URL` = "https://your-site.netlify.app"
   - `NEXT_PUBLIC_APP_NAME` = "Citrafoam"
