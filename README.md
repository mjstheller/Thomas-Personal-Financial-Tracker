# Thomas Personal Finance Tracker

A simple, senior-friendly web app to track expenses, bills, savings, installments, and income. Built with Next.js and Tailwind, with data stored in Supabase so nothing is lost when you close the browser.

## Features

- **Add, edit, delete** records for: Expenses, Bills, Savings, Installments, Salary or income
- **Categories** and labels for each record
- **Totals** by week, month, or year
- **Export** all records to CSV or PDF
- **Dashboard** with total balance, total expenses, total savings
- **Charts**: monthly expenses (bar), balance over time (line), spending by category (pie)
- Large text and buttons, high contrast, clear labels, step-by-step instructions
- Confirmations before delete or export
- Keyboard friendly, large click targets, tooltips on inputs

## Setup

### 1. Create a Supabase project (free)

1. Go to [supabase.com](https://supabase.com) and sign in or create an account.
2. Click **New project**, choose a name and password, and create the project.
3. In the project, open **SQL Editor** and run the script in `supabase/schema.sql`. This creates the `records` table.
4. Go to **Project Settings** → **API**. Copy the **Project URL** and the **anon public** key.

### 2. Configure environment variables

1. Create a file named `.env.local` in the **project root** (same folder as `package.json`).
2. Add these lines with no spaces around `=` (use your Supabase project URL and anon key from step 1):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. **Restart the dev server** after creating or editing `.env.local` — Next.js only reads env when it starts.

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Deploy on Vercel

1. Push this repo to GitHub (or connect your Git provider in Vercel).
2. In [Vercel](https://vercel.com), import the project.
3. Add the same environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in Project Settings → Environment Variables.
4. Deploy. Your data will load from Supabase on every visit.

## Tech stack

- **Frontend**: Next.js (App Router), Tailwind CSS, Recharts
- **Database**: Supabase (PostgreSQL, free tier)
- **Export**: jsPDF + jspdf-autotable for PDF; CSV generated in the browser
