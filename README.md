# AuraTracker

Production-ready MVP web app for tracking group aura.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Node**: 20 LTS
- **Styling**: Tailwind CSS
- **Auth**: NextAuth.js (Google OAuth)
- **Database**: Neon PostgreSQL + Prisma

## Setup

1. **Environment Variables**:
   Ensure `.env` contains valid credentials for:
   - `DATABASE_URL` (Neon PostgreSQL)
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `ADMIN_EMAIL`

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Database Setup**:
   ```bash
   npx prisma db push
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Project Structure
- `src/app`: App Router pages and API routes.
- `src/lib`: Shared utilities (Prisma, Auth).
- `src/middleware.ts`: Route protection.
- `prisma/schema.prisma`: Database schema.
