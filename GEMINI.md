# Collaro - Project Context

## Project Overview
Collaro is a modern video conferencing and workspace management application built with Next.js 16. It features real-time video calls, workspace organization, member management, and subscription handling.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Drizzle ORM
- **Authentication:** Better Auth
- **UI/Styling:** Tailwind CSS v4, Shadcn/UI, Radix UI, Framer Motion
- **Video/Real-time:** Stream Video SDK
- **Background Jobs:** Inngest
- **Email:** Nodemailer, Resend
- **Payments:** Razorpay
- **State Management:** Zustand
- **Linting/Formatting:** Biome
- **Package Manager:** Bun (preferred), NPM/Yarn/PNPM supported

## Key Commands

### Development
- `bun dev` / `npm run dev`: Start the development server (uses Turbopack).
- `bun run docker:dev`: Start local infrastructure via Docker Compose.

### Database (Drizzle)
- `bun run db:push`: Push schema changes to the database.
- `bun run db:generate`: Generate migration files.
- `bun run db:migrate`: Run migrations.
- `bun run db:seed`: Seed the database.
- `bun run db:studio`: Open Drizzle Studio.

### Code Quality
- `bun run lin` / `npm run lin`: Run Biome check (linting).
- `bun run format`: Run Biome format.

### Build
- `bun run build`: Build the application for production.

## Architecture & Conventions

### Directory Structure (`src/`)
- `app/`: Next.js App Router pages and API routes.
- `components/`: React components (UI library in `ui/`, features in root).
- `db/`: Database configuration, schema definitions (`schema/`), and migrations.
- `lib/`: Utility functions, library configurations (Auth, Stream, Email).
- `action/`: Server Actions for data mutations.
- `hooks/`: Custom React hooks.
- `constants/`: Static constant data.
- `styles/`: Global styles (`globals.css`).

### Database & Data Fetching
- **Schema:** Defined in `src/db/schema/`. Split into `schema.ts` (main) and `auth-schema.ts`.
- **Access:** Use Drizzle ORM for all database interactions.
- **Mutations:** Use Server Actions (`src/action/`) for modifying data.

### Authentication
- Implemented using **Better Auth**.
- Configuration located in `src/lib/auth.ts` and `src/lib/auth-client.ts`.

### UI Components
- **Shadcn/UI:** Used for base components (`src/components/ui`).
- **Icons:** Lucide React (`lucide-react`) and React Icons (`react-icons`).
- **Styling:** Tailwind CSS v4 with CSS variables.

## Environment Variables
Ensure the following are configured in `.env` (or `.env.local`):
- Database connection string (`DATABASE_URL`).
- Authentication secrets (`BETTER_AUTH_...`).
- Stream Video SDK credentials.
- SMTP settings (Nodemailer).
- Inngest Event Key.
- Razorpay credentials.
