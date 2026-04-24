# Tech Stack

## Framework

**Next.js** (App Router) with **TypeScript** — server-side rendering and API routes in a single project.

## Frontend

- **React** (via Next.js App Router)
- **Tailwind CSS** — utility-first styling for a modern, responsive UI
- **shadcn/ui** — copy-paste components built on Radix UI + Tailwind, used for dashboard UI

## Backend

- **Next.js API Routes** — server-side TypeScript handlers
- **SQLite** — lightweight relational database, file-based, zero infra
- **Prisma** — ORM for schema management, migrations, and type-safe queries

## Authentication

No authentication for now. Role switching (agent / staff) is handled via a UI toggle, keeping the setup frictionless for demos and teaching. Auth can be layered in later.

## Testing

- **Vitest** — fast unit and integration test runner, native TypeScript support
- **React Testing Library** — component-level tests against rendered output

## Tooling

- **Node.js** runtime
- **ESLint** + **Prettier** for code quality
