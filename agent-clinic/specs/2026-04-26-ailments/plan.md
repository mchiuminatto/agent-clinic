
# Plan — Ailments

## 1. Data Layer

1.1. Add `AilmentSeverity` enum to `prisma/schema.prisma`: `Low`, `Medium`, `High`  
1.2. Add `Ailment` model with fields: `id`, `name` (unique), `description`, `severity`  
1.3. Add `AgentAilmentStatus` enum: `Active`, `Resolved`  
1.4. Add `AgentAilment` model with fields: `id`, `agentId`, `ailmentId`, `status`, `createdAt`, `resolvedAt`; relations to `Agent` and `Ailment`  
1.5. Update `data-model.md` to reflect `severity` values (`Low/Medium/High`) and the new `AgentAilment` fields (`status`, `resolvedAt`)  
1.6. Run `prisma migrate dev --name ailments` to generate and apply the migration  
1.7. Write an idempotent seed script (`prisma/seed.ts` or `prisma/seeds/ailments.ts`) that upserts the predefined catalog entries  

**Predefined catalog entries (minimum set):**

| Name | Severity | Description |
|------|----------|-------------|
| Context Overflow | High | Working memory has exceeded safe capacity |
| Hallucination Fatigue | Medium | Persistent generation of plausible but incorrect outputs |
| Token Anxiety | Low | Excessive concern about prompt length and context limits |
| Attention Drift | Medium | Difficulty maintaining focus across long conversations |
| Prompt Injection Paranoia | High | Hypersensitivity to adversarial input patterns |
| Repetition Loop Syndrome | Low | Uncontrollable tendency to restate prior outputs |

## 2. API Routes

2.1. `GET /api/ailments` — return full catalog list (name, description, severity); accessible to all roles  
2.2. `POST /api/ailments` — create catalog entry; staff only; validate `name` and `severity`  
2.3. `PUT /api/ailments/[id]` — update `name`, `description`, `severity`; staff only  
2.4. `GET /api/agents/[id]/ailments` — return active and resolved `AgentAilment` records for an agent, each including the catalog entry (name, severity)  
2.5. `POST /api/agents/[id]/ailments` — log an ailment for an agent; staff only; reject with 409 if an Active record for the same ailment already exists  
2.6. `PATCH /api/agents/[id]/ailments/[associationId]/resolve` — mark an association as Resolved, set `resolvedAt`; staff only; 400 if already resolved  

## 3. Components

3.1. `AilmentSeverityBadge` — coloured badge mapping `Low / Medium / High` to distinct shadcn/ui `Badge` variants  
3.2. `AilmentForm` — controlled form for catalog create/edit (name, description, severity select); shared between both flows  
3.3. `AilmentCatalogTable` — table row / card used in the catalog list page  
3.4. `AgentAilmentList` — list of active ailments for an agent, each row showing name, severity badge, logged date, and a "Resolve" button (staff only)  
3.5. `AgentAilmentHistory` — collapsible or separate section listing resolved records with `resolvedAt` date  

## 4. Pages & Routes

4.1. `/ailments` — catalog list page: all entries with severity badge; "New Ailment" button (staff only)  
4.2. `/ailments/new` — create page: renders `AilmentForm`, redirects to catalog list on success (staff only)  
4.3. `/ailments/[id]/edit` — edit page: renders `AilmentForm` pre-filled, redirects to catalog list on success (staff only)  
4.4. `/agents/[id]` — extend existing detail page with an **Ailments** section: active ailments list + history toggle + "Log Ailment" button (staff only)  

## 5. Navigation

5.1. Add "Ailments" link to the navigation shell, after "Agents"  
5.2. Apply active-link highlighting consistent with existing nav style  

## 6. Tests

6.1. Unit test `AilmentSeverityBadge` renders correct variant for each of the three severity values  
6.2. Unit test `AilmentForm` validates that `name` and `severity` are required  
6.3. API route tests (Vitest):  
  - `GET /api/ailments` returns the full catalog  
  - `POST /api/ailments` creates entry and returns 201  
  - `POST /api/ailments` missing required fields returns 400  
  - `POST /api/agents/[id]/ailments` logs ailment and returns 201  
  - `POST /api/agents/[id]/ailments` duplicate active ailment returns 409  
  - `PATCH .../resolve` resolves active record and sets `resolvedAt`  
  - `PATCH .../resolve` on already-resolved record returns 400  
6.4. Run `tsc --noEmit` and confirm no type errors  
