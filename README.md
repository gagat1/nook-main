# ShiftShift

ShiftShift is an employee operations dashboard for schedule generation, employee management, time-off tracking, cashier counting, COGS calculation, and basic payroll summaries.

## Run Locally

Prerequisite: Node.js

```bash
npm install
npm run dev
```

The app runs on:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev      # start the local development server
npm run build    # create a production build
npm run preview  # preview the production build
npm run lint     # run TypeScript checks
```

## Supabase Setup

1. Buat project di Supabase.
2. Buka SQL Editor, lalu jalankan isi file `supabase/schema.sql`.
3. Buat file `.env` dari `.env.example`, lalu isi:

```bash
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
```

Data employee, shift template, time off, schedule, settings, pemasukan, dan pengeluaran akan tersimpan ke Supabase saat env tersebut aktif. Jika env belum diisi, aplikasi tetap berjalan dengan penyimpanan lokal.
