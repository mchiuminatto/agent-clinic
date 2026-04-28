# Validation — Ailments

## Automated

- `npx tsc --noEmit` passes with zero errors
- `npx vitest run` passes all tests

### Required test assertions

| Area | Assertion |
|------|-----------|
| Catalog API | `GET /api/ailments` returns all seeded entries with `name`, `description`, `severity` |
| Catalog API | `POST /api/ailments` with valid body returns 201 and the created entry |
| Catalog API | `POST /api/ailments` missing `name` or `severity` returns 400 |
| Catalog API | `POST /api/ailments` with duplicate `name` returns 409 |
| Catalog API | `PUT /api/ailments/[id]` updates fields and returns the updated record |
| Agent ailments API | `POST /api/agents/[id]/ailments` with valid `ailmentId` returns 201 and the new association |
| Agent ailments API | Duplicate `POST` for same agent + ailment (while Active) returns 409 |
| Agent API | `DELETE /api/agents/[id]` when agent has ailments returns 409 |
| Agent ailments API | `GET /api/agents/[id]/ailments` returns active and resolved records, each with nested ailment name and severity |
| Resolve API | `PATCH .../resolve` transitions status to `Resolved` and sets `resolvedAt` |
| Resolve API | `PATCH .../resolve` on an already-resolved record returns 400 |
| Component | `AilmentSeverityBadge` renders distinct badge for `Low`, `Medium`, and `High` |
| Component | `AilmentForm` disables submit when `name` or `severity` is empty |

## Manual Walkthrough

### Browse and manage the catalog (staff mode)

1. Switch role toggle to **Staff**
2. Navigate to **Ailments** (nav link)
3. Confirm seeded catalog entries appear with severity badges
4. Click **New Ailment**, fill in name, description, severity, submit
5. Confirm new entry appears in the catalog list
6. Click an entry's **Edit** action, change the description, save
7. Confirm updated description is reflected in the list

### Log an ailment for an agent (staff mode)

1. Navigate to **Agents**, open any agent's detail page
2. Locate the **Ailments** section; confirm it is empty initially
3. Click **Log Ailment**, select an ailment from the catalog, submit
4. Confirm the ailment appears in the active list with correct name and severity badge
5. Attempt to log the **same ailment** again — confirm the action is rejected (409 / error message)

### Resolve an ailment (staff mode)

1. From an agent's detail page, find an active ailment
2. Click **Resolve** next to the ailment
3. Confirm the ailment moves from the active list to the history section
4. Confirm `resolvedAt` date is shown in the history entry
5. Click **Resolve** again on the same record — confirm it is no longer possible (button hidden or disabled)

### Log the same ailment after resolution (staff mode)

1. After resolving an ailment, log the same ailment again for the same agent
2. Confirm a new Active record is created (history now shows one resolved + one active)

### Agent role read-only gate

1. Switch role toggle to **Agent**
2. Navigate to **Ailments** — confirm catalog is visible but **New Ailment** and **Edit** are hidden
3. Navigate to an agent detail page — confirm **Log Ailment** and **Resolve** buttons are hidden
4. Confirm active ailments and history are still visible

## Tone Check

- Ailment names should read as fictional-clinical (e.g. "Context Overflow", not "Bug #42")
- Severity badge labels: **Low**, **Medium**, **High** — match enum values exactly
- "Log Ailment" / "Resolve" — keep copy clinical and consistent with AgentClinic voice
- History section header: something like "Ailment History" or "Past Conditions"

## Definition of Done

- [ ] All automated tests pass
- [ ] TypeScript compiles with no errors
- [ ] Manual walkthrough completed without errors
- [ ] Staff gate verified: catalog CRUD, log, and resolve hidden in Agent role
- [ ] Duplicate active ailment rejected with clear feedback
- [ ] History section visible with `resolvedAt` date
- [ ] Ailments nav link appears after Agents and active-highlights correctly
- [ ] Seed script is idempotent (re-running does not create duplicate catalog entries)
- [ ] No regressions in Phase 1–2 layout, nav, or agent CRUD
