# Requirements — Ailments

## Scope

### Included

- **Ailment catalog model** with predefined entries (e.g. Context Overflow, Hallucination Fatigue, Token Anxiety)
- **Seed script** to populate the catalog at startup
- **Staff CRUD** for catalog entries (add and edit; no delete to preserve referential integrity)
- **Agent ailment association** (`AgentAilment`) linking agents to catalog entries with a status lifecycle
- **One active record** per ailment per agent — enforced at the application layer
- **Resolved status** — records are marked resolved, not deleted, preserving history
- **Active ailments view** per agent, showing severity from the catalog entry
- **Ailment history view** per agent, showing resolved records

### Not Included

- Agent self-resolution (only staff can mark an ailment resolved)
- Filtering or sorting on ailment lists
- Therapies or appointments (Phase 3 sub-features)
- Severity override at the association level (severity lives on the catalog entry)

### Data Shape

**Ailment (catalog)**

| Field       | Type     | Values / Notes                        |
|-------------|----------|---------------------------------------|
| id          | Int      | Primary key, auto-increment           |
| name        | String   | Required, unique, e.g. "Context Overflow" |
| description | String?  | Optional explanation                  |
| severity    | Enum     | `Low`, `Medium`, `High`               |

**AgentAilment (association)**

| Field       | Type      | Values / Notes                              |
|-------------|-----------|---------------------------------------------|
| id          | Int       | Primary key, auto-increment                 |
| agentId     | Int       | FK → Agent                                  |
| ailmentId   | Int       | FK → Ailment                                |
| status      | Enum      | `Active`, `Resolved`                        |
| createdAt   | DateTime  | When ailment was logged; auto-set           |
| resolvedAt  | DateTime? | Set when status transitions to `Resolved`   |

## Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Severity values | `Low`, `Medium`, `High` | Three-tier scale is sufficient; avoids ambiguity of a fourth tier |
| Severity location | On catalog entry, not association | Ailment severity is an intrinsic property of the ailment type, not per-agent |
| Catalog delete | Not allowed | Deleting catalog entries would break association history; staff may only add/edit |
| Duplicate active records | Prevented at app layer | SQLite partial unique indices are unsupported; enforce with a pre-insert check |
| Unique ailment names | Enforced at DB layer (`@unique`) | Prevents catalog pollution from duplicate entries; a 409 is returned on conflict |
| Agent deletion with ailments | Returns 409 | FK constraint (`ON DELETE RESTRICT`) protects association history; caller must resolve or re-assign ailments first |
| Resolution | Mark `Resolved` + set `resolvedAt` | Preserves full history; aligns with clinical record-keeping tone |
| Who can resolve | Staff only | Consistent with staff-as-practitioner model from mission.md |

## Context

- Tone: light and slightly playful — ailments are fictional AI conditions, keep copy consistent with the AgentClinic voice (see `mission.md`)
- Stack: Next.js App Router, Prisma + SQLite, shadcn/ui, Tailwind — no new dependencies
- Role toggle is already in place; gate staff actions (catalog CRUD, logging/resolving ailments) behind `isStaff`
- Seed script must be idempotent (safe to re-run without creating duplicates)
