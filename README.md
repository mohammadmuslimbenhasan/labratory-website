# Laboratory Testing Platform

A full-stack laboratory testing and service management platform built with **Next.js 16**, **Prisma**, **Supabase (PostgreSQL)**, and **Tailwind CSS 4**. Supports multi-language (English & Chinese).

---

## Quick Start (3 Steps)

1. **Set up Supabase** - Create project & run SQL
2. **Configure environment** - Add connection strings
3. **Deploy to Vercel** - One-click deploy

---

## Table of Contents

- [Step 1: Create Supabase Project](#step-1-create-supabase-project)
- [Step 2: Create Database Tables](#step-2-create-database-tables)
- [Step 3: Get Connection Strings](#step-3-get-connection-strings)
- [Step 4: Local Development Setup](#step-4-local-development-setup)
- [Step 5: Deploy to Vercel](#step-5-deploy-to-vercel)
- [Default Login Accounts](#default-login-accounts)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Common Database Queries](#common-database-queries)
- [Troubleshooting](#troubleshooting)

---

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up / log in
2. Click **"New Project"**
3. Fill in:
   - **Project name**: `labtest-platform` (or any name)
   - **Database password**: Choose a strong password (save this!)
   - **Region**: Pick the closest to your users
4. Click **"Create new project"**
5. Wait for the project to finish setting up (takes ~2 minutes)

---

## Step 2: Create Database Tables

This is where you create all the tables, enums, and seed data in one go.

1. In your Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open the file `supabase-schema.sql` from this repository
4. **Copy the ENTIRE content** and paste it into the SQL Editor
5. Click **"Run"** (or press Ctrl+Enter / Cmd+Enter)
6. You should see "Success. No rows returned" - that means it worked!

### Verify Tables Were Created

Go to **Table Editor** in the left sidebar. You should see 40+ tables including:
- `User`, `Session`, `Address`
- `Company`, `CompanyMembership`
- `ServiceCategory`, `TestingService`
- `Order`, `OrderItem`, `Sample`
- `Report`, `Laboratory`, `Equipment`
- `Wallet`, `Transaction`, `Payment`
- `Notification`, `Message`
- And more...

---

## Step 3: Get Connection Strings

1. In Supabase Dashboard, go to **Project Settings** (gear icon) > **Database**
2. Scroll down to **Connection string** section
3. Select the **URI** tab
4. You need TWO connection strings:

### Transaction Mode (for app queries)
- Select **Mode: Transaction** from the dropdown
- Copy the URI - it will look like:
```
postgresql://postgres.[YOUR-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```
- **Add `?pgbouncer=true` at the end**
- This is your `DATABASE_URL`

### Session Mode (for migrations)
- Select **Mode: Session** from the dropdown
- Copy the URI - it will look like:
```
postgresql://postgres.[YOUR-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```
- This is your `DIRECT_URL`

> **Important**: Replace `[PASSWORD]` with the database password you set in Step 1.

---

## Step 4: Local Development Setup

### Prerequisites
- Node.js 18+ ([download here](https://nodejs.org))
- Git

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/mohammadmuslimbenhasan/labratory-website.git
cd labratory-website

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env
```

### Edit `.env` file

Open `.env` and fill in your values:

```env
# Paste your Supabase connection strings from Step 3
DATABASE_URL="postgresql://postgres.[YOUR-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Generate a random secret (run: openssl rand -base64 32)
JWT_SECRET="paste-your-generated-secret-here"

# Keep these as-is for local development
NEXTAUTH_URL="http://localhost:3000"
UPLOAD_DIR="./uploads"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_DEFAULT_LOCALE="zh-CN"
```

### Generate Prisma Client & Run

```bash
# 4. Generate Prisma client
npx prisma generate

# 5. Start the development server
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Step 5: Deploy to Vercel

### Option A: One-Click Deploy (Easiest)

1. Push your code to GitHub (if not already)
2. Go to [https://vercel.com](https://vercel.com) and sign up / log in
3. Click **"Add New Project"**
4. **Import** your GitHub repository
5. In **Environment Variables**, add these:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Supabase Transaction mode URI (with `?pgbouncer=true`) |
| `DIRECT_URL` | Your Supabase Session mode URI |
| `JWT_SECRET` | A strong random string |
| `NEXTAUTH_URL` | Your Vercel domain (e.g., `https://your-app.vercel.app`) |
| `NEXT_PUBLIC_SITE_URL` | Same as NEXTAUTH_URL |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `zh-CN` |

6. Click **"Deploy"**
7. Wait for build to complete (~2-3 minutes)
8. Your site is live!

### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow the prompts)
vercel

# For production deployment
vercel --prod
```

### After Deploying

Update `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` in Vercel environment variables to match your actual production URL (e.g., `https://your-app.vercel.app`), then redeploy.

---

## Default Login Accounts

After running the SQL seed data, these accounts are available:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@labtest.com` | `Admin@123456` |
| Customer | `customer@example.com` | `Test@123456` |

> **Important**: Change these passwords in production!

---

## Project Structure

```
labratory-website/
├── prisma/schema.prisma         # Database schema (Prisma ORM)
├── supabase-schema.sql          # Full SQL for Supabase (run this!)
├── messages/                    # i18n translations
│   ├── en.json                  #   English
│   └── zh-CN.json               #   Chinese
├── src/
│   ├── app/
│   │   ├── [locale]/            # All pages (auto-routed by locale)
│   │   │   ├── page.tsx         #   Homepage
│   │   │   ├── services/        #   Service catalog
│   │   │   ├── labs/            #   Labs directory
│   │   │   ├── dashboard/       #   Customer dashboard
│   │   │   ├── lab-portal/      #   Lab partner portal
│   │   │   └── admin/           #   Admin panel
│   │   └── api/                 # REST API endpoints
│   ├── components/              # Reusable UI & layout components
│   ├── lib/                     # Auth, DB, utilities
│   ├── store/                   # Zustand state management
│   └── types/                   # TypeScript types
├── .env.example                 # Environment variable template
└── package.json
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at http://localhost:3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Visual database browser at http://localhost:5555 |
| `npx prisma generate` | Regenerate Prisma client after schema changes |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (returns JWT token) |
| GET | `/api/services` | List all testing services |
| GET/POST | `/api/orders` | Get or create orders |
| GET/POST | `/api/samples` | Get or submit samples |
| POST | `/api/rfq` | Submit request for quotation |

---

## Common Database Queries

Run these in **Supabase SQL Editor** when needed:

### View All Users
```sql
SELECT "id", "email", "name", "role", "status", "createdAt"
FROM "User"
ORDER BY "createdAt" DESC;
```

### View All Orders
```sql
SELECT o."orderNo", o."status", o."totalAmount", u."name" AS customer, o."createdAt"
FROM "Order" o
JOIN "User" u ON o."userId" = u."id"
ORDER BY o."createdAt" DESC;
```

### View Active Services
```sql
SELECT s."nameZh", s."nameEn", c."nameZh" AS category, s."priceMin", s."turnaroundDays"
FROM "TestingService" s
JOIN "ServiceCategory" c ON s."categoryId" = c."id"
WHERE s."isActive" = true
ORDER BY c."sortOrder", s."sortOrder";
```

### Check Wallet Balances
```sql
SELECT u."name", w."balance", w."frozenAmount"
FROM "Wallet" w
JOIN "User" u ON w."userId" = u."id";
```

### Create a New Admin User
```sql
-- Password: NewAdmin@123 (change the hash for your own password)
INSERT INTO "User" ("id", "email", "passwordHash", "name", "role", "status", "emailVerified")
VALUES (
    gen_random_uuid()::text,
    'newadmin@yourcompany.com',
    '$2a$12$LJ3BRmqEIvGTbL8fLUVCcO8VmRlCDYoJHUPFLn4q2Ey5JMR1eHwne',
    'New Admin',
    'SUPER_ADMIN',
    'ACTIVE',
    true
);
```

### Reset User Password
```sql
-- This sets password to "Admin@123456"
UPDATE "User"
SET "passwordHash" = '$2a$12$LJ3BRmqEIvGTbL8fLUVCcO8VmRlCDYoJHUPFLn4q2Ey5JMR1eHwne'
WHERE "email" = 'admin@labtest.com';
```

### Database Backup (via Supabase)
Go to **Project Settings > Database > Backups** to manage backups. Supabase automatically takes daily backups.

---

## Troubleshooting

### "prisma generate" fails
```bash
# Make sure dependencies are installed
npm install
# Then try again
npx prisma generate
```

### Cannot connect to database
- Double-check your `DATABASE_URL` and `DIRECT_URL` in `.env`
- Make sure you replaced `[PASSWORD]` with your actual Supabase database password
- Ensure `?pgbouncer=true` is at the end of `DATABASE_URL`

### Build fails on Vercel
- Check that ALL environment variables are set in Vercel project settings
- Make sure `DATABASE_URL` uses the Transaction mode URI (port 6543)
- Make sure `DIRECT_URL` uses the Session mode URI (port 5432)

### Tables not showing in Supabase
- Make sure you ran the ENTIRE `supabase-schema.sql` file
- Check the SQL Editor output for any errors
- Tables use quoted names (e.g., `"User"` not `user`) - look in Table Editor, they should be visible

### "relation does not exist" error
```bash
# Sync Prisma with your database
npx prisma db push
```

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework (App Router) |
| React 19 | UI library |
| TypeScript | Type safety |
| Prisma 7 | Database ORM |
| Supabase | PostgreSQL database hosting |
| Tailwind CSS 4 | Styling |
| next-intl | Internationalization (EN/ZH) |
| Zustand | Client state management |
| TanStack Query | Server state management |
| Zod | Input validation |
| jose / bcryptjs | JWT auth & password hashing |

---

## License

This project is private and proprietary.
