# Tech Stack

## Framework

**Next.js 14** (App Router) with **TypeScript** — server-side rendering and API routes in a single repo. All business logic runs server-side; client components are limited to interactivity.

## Styling

**Tailwind CSS** — utility-first styling aligned with Steve's requirement for an attractive, modern browser experience.  
**Radix UI** — headless, accessible component primitives for dropdowns, labels, and form elements.  
**lucide-react** — icon set.

## Database

**SQLite** via **Prisma ORM** — zero-config, file-based database ideal for a local-first educational and demo project. Prisma handles migrations, seeding, and type-safe queries.

## Testing

**Vitest** — fast unit and integration test runner compatible with the Vite/Next.js ecosystem.  
**@testing-library/react** — component-level tests against real DOM behavior.

## Utilities

- `class-variance-authority` + `clsx` + `tailwind-merge` — composable, conflict-safe class utilities.
- `tsx` — TypeScript execution for seed scripts.

## Decisions

| Decision | Rationale |
|---|---|
| Next.js over Express | Full-stack TypeScript in one repo; App Router gives co-located API routes and server components |
| SQLite over Postgres | Zero-setup for demos and course use; swap to Postgres via one Prisma config change when needed |
| Radix UI over a full component library | Gives styling control while handling accessibility primitives |
| Vitest over Jest | Faster, native ESM, works without config changes in a Next.js/Vite project |
