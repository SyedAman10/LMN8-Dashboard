# LMN8 Dashboard — CLAUDE.md

## Project

Clinician-facing dashboard for psychedelic therapy practices. Built with Next.js 15 App Router + plain JavaScript (no TypeScript in this repo despite global preference).

## Stack

- **Framework:** Next.js 15, React 19, App Router
- **Styling:** Tailwind CSS v4, Framer Motion
- **Database:** Neon PostgreSQL via `@neondatabase/serverless`
- **Auth:** Custom JWT (`jsonwebtoken`) + bcrypt — dual auth system (clinicians + patients)
- **Email:** Nodemailer
- **Deploy:** Vercel

## Key Architecture

### Dual Auth System
- **Clinician auth:** `src/lib/auth.js` — `users` + `user_sessions` tables, session token via DB
- **Patient auth:** `src/lib/patientAuth.js` — `patient_users` table, JWT-based

### API Routes
All under `src/app/api/`:
- `/api/auth/*` — clinician login/signup/logout/me/token
- `/api/patient-auth/*` — patient login/logout/me/profile/forgot-password/reset-password
- `/api/patients/*` — CRUD for patient records
- `/api/backend/*` — journal entries, clinician-sharing preferences
- `/api/forms/*` — public contact/demo/partner forms

### DB Layer
- `src/lib/db.js` — connection pool, `query(text, params)` export
- Init/reset scripts: `npm run init-db`, `npm run reset-db`
- Env: `DATABASE_URL` or `NEON_DATABASE_URL` in `.env.local`

### Component Layout
- `src/components/pages/` — full page content components
- `src/components/modals/` — modal dialogs
- `src/components/ui/` — reusable UI primitives
- `src/components/layout/` — Sidebar, PageHeader

## Dev Commands

```bash
npm run dev        # Next.js dev with Turbopack
npm run build      # Build with Turbopack
npm run init-db    # Initialize DB schema
npm run reset-db   # Wipe and reinitialize DB
```

## Environment Variables (.env.local)

```
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require
JWT_SECRET=...
```

## Notes

- Plain JS throughout — no `.ts`/`.tsx` files, `jsconfig.json` instead of `tsconfig.json`
- Patient portal data (idol, personality, goals, etc.) stored on `patient_users` table
- Crisis alert system: `src/app/api/crisis-alert/route.js` + `src/lib/crisisEmail.js`
