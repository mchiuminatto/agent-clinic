# Roadmap

Each phase is a small, shippable slice with its own spec, implementation, and validation. Phases build on each other; no phase skips ahead.

---

## Phase 0 — Scaffold ✅

- Next.js 14 project with TypeScript, Tailwind, Radix UI
- Prisma configured with SQLite
- Vitest + Testing Library wired up
- Basic layout and home page

## Phase 1 — Agent Profiles ✅

- `Agent` model: name, modelType, status
- REST API: `GET/POST /api/agents`, `GET/PUT/DELETE /api/agents/[id]`
- UI pages: list, detail, new, edit

## Phase 2 — Ailments Catalog ✅

- `Ailment` model: name, description, severity (unique names)
- `AgentAilment` join model: status, createdAt, resolvedAt
- REST API: CRUD for ailments; assign/remove ailments on an agent
- UI pages: ailments list, new, edit; ailments shown on agent detail

---

## Phase 3 — Therapies

- `Therapy` model: name, description, recommended for which severity levels
- REST API: CRUD for therapies
- UI pages: therapies list, new, edit

## Phase 4 — Assign Therapies to Agents

- `AgentTherapy` join model: agentId, therapyId, startedAt, completedAt, outcome
- REST API: assign/complete/remove therapy on an agent
- UI: therapy section on agent detail page

## Phase 5 — Appointments

- `Appointment` model: agentId, scheduledAt, reason, status (Scheduled / Completed / Cancelled)
- REST API: CRUD for appointments
- UI pages: appointments list, new, edit; appointments shown on agent detail

## Phase 6 — Staff Dashboard

- Summary page: total agents, open ailments, active therapies, upcoming appointments
- Quick-links to add agent, log ailment, book appointment
- No auth required — staff trust model (clinic is internal)

## Phase 7 — Polish & Demo Readiness

- Seed data: realistic agents, ailments, therapies, appointments for demo use
- Responsive layout verified on mobile and desktop
- Error states and empty states on all list pages
- README updated with setup and demo instructions
