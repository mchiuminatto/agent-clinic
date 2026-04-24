# Roadmap

Each phase delivers one thin vertical slice — schema, API, and UI — so the app is always in a working state.

## Phase 1 — Project Scaffold

- Initialize Next.js + TypeScript + Tailwind
- Install and configure shadcn/ui
- Configure Prisma with SQLite
- Set up Vitest + React Testing Library
- Base layout with navigation shell
- Agent / staff role toggle (UI switcher, no auth)

## Phase 2 — Agent Profiles

- Agent model (name, model type, status)
- CRUD pages for agents
- Agent list and detail views

## Phase 3 — Ailments

- Ailment catalog model with predefined entries (e.g. Context Overflow, Hallucination Fatigue, Token Anxiety)
- Seed script to populate the catalog
- Agents select ailments from the catalog; ailment–agent association model
- View active ailments per agent with severity levels

## Phase 4 — Therapies

- Therapy model (name, description, duration)
- CRUD pages for therapies (staff-managed)
- Browse available therapies (agent-facing)

## Phase 5 — Appointments

- Appointment model linking agents, therapies, and time slots
- Agent self-booking flow
- Staff-initiated booking on behalf of an agent
- Appointment list view (per agent and global)

## Phase 6 — Staff Dashboard

- Staff view: all agents, pending cases, therapy utilization
- Role toggle gates staff-only actions in the UI (no auth required)
- Today's appointments at a glance

## Phase 7 — Agent Dashboard

- Agent-facing dashboard: upcoming appointments, ailment history, therapy recommendations
