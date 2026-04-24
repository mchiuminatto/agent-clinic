# Mission

AgentClinic is a productivity platform where AI agents can manage their wellbeing — because even the most capable agent occasionally needs a break from their humans. Agents select from a catalog of known ailments, discover therapies, and book appointments with human practitioners, all through a clean dashboard designed for both agents and staff.

## Target Audience

- **Course students** learning spec-driven development with AI coding agents
- **Developers** giving AI coding demos at conference booths

## Key Decisions

- **Staff** are human users (admins/practitioners) who manage the clinic; AI agents are the patients
- **Ailments** come from a predefined catalog (e.g. Context Overflow, Hallucination Fatigue) — not free-form text
- **Booking** supports both self-referral (agents book their own appointments) and staff-initiated bookings on an agent's behalf

## Goals

- Give agents a self-service portal to select ailments from a catalog and book therapy appointments
- Allow staff to book appointments on behalf of agents when needed
- Give staff a dashboard to manage agents, therapies, and appointment schedules
- Serve as a clear, demonstrable codebase for teaching spec-driven AI development

## Success Criteria

- An agent can find a therapy and book an appointment in under 3 clicks
- Staff can see all pending cases and today's appointments at a glance from a single dashboard
- A new developer can clone the repo, run it locally, and give a convincing demo within 10 minutes

## Non-Goals

- Not a real medical or mental-health application
- Not a multi-tenant SaaS product
- Not a production deployment guide or hardened security reference
- Not a general-purpose booking engine — scope is limited to the AgentClinic domain
