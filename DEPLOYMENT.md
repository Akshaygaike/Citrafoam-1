# Citrafoam — Production Deployment Guide

Citrafoam is a full-stack Next.js application with unified frontend and backend (REST APIs, NextAuth, Stripe integration, and Prisma ORM).

---

## 🚀 Recommended: Vercel + Neon.tech (100% Free & Serverless)

### Step 1: Create a Free PostgreSQL Database
1. Go to **[Neon.tech](https://neon.tech)** (or **[Supabase.com](https://supabase.com)**) and create a free account.
2. Click **Create Project** (Name: `citrafoam`).
3. Under **Connection Details**, copy your connection string (`DATABASE_URL`):
   ```text
   postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require
   ```

---

### Step 2: Configure Prisma for PostgreSQL
1. Open [`prisma/schema.prisma`](prisma/schema.prisma) and change the datasource provider to `postgresql`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. In your `.env` file, set `DATABASE_URL` to your Neon/Supabase connection string.
3. Push the tables and initial seed data:
   ```bash
   npx prisma db push
   npm run db:seed
   ```
   *Your online PostgreSQL database is now populated with all 3 products (₹250 / ₹200 / ₹250) and test users.*

---

### Step 3: Deploy to Vercel
1. Push your code to **GitHub** (or use the Vercel CLI).
2. Go to **[Vercel Dashboard](https://vercel.com/new)** and click **Add New > Project**.
3. Import your Citrafoam repository.
4. Under **Environment Variables**, add:
   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | Your Neon / Supabase connection string |
   | `AUTH_SECRET` | A secure random 32-character string |
   | `NEXTAUTH_SECRET` | Same value as `AUTH_SECRET` |
   | `NEXTAUTH_URL` | `https://your-citrafoam-project.vercel.app` |
   | `NEXT_PUBLIC_APP_URL` | `https://your-citrafoam-project.vercel.app` |
   | `NEXT_PUBLIC_APP_NAME` | `Citrafoam` |
   | `AUTH_TRUST_HOST` | `true` |
5. Click **Deploy**.
6. Vercel will automatically build the Next.js storefront, bundle the backend API routes, and deploy globally with SSL.

---

## 🚂 Alternative: Railway.app (1-Click Container + Postgres)
1. Go to **[Railway.app](https://railway.app)**.
2. Click **New Project > Provision PostgreSQL**.
3. In the same project, click **New > GitHub Repo** and select your Citrafoam repo.
4. Connect the database by referencing `${{Postgres.DATABASE_URL}}`.
5. Railway runs `npm run build` and `npm start` on a persistent Node.js container.
