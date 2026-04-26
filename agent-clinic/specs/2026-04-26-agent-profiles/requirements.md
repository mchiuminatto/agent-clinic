
# Requirements — Agent Profiles

## Scope

### Included

- **Agent model** with fields: `id`, `name`, `modelType`, `status`, `createdAt`
- **CRUD operations** for agents (create, read, update, hard delete) — staff role only
- **Paginated agent list** view with a reasonable default page size (10 per page)
- **Agent detail** view showing Phase 2 fields only
- **Agents** nav link placed at the top of the navigation shell

### Not Included

- Agent ailments, appointments, or therapy associations (Phase 3+)
- Filtering or sorting on the list view
- Soft delete / deactivation
- Agent self-registration

### Data Shape

| Field       | Type     | Values / Notes                                  |
|-------------|----------|-------------------------------------------------|
| id          | Int      | Primary key, auto-increment                     |
| name        | String   | Required                                        |
| modelType   | String   | Fixed value: `"Claude"`                         |
| status      | Enum     | `Active`, `InTreatment`, `Inactive`, `OnHold`   |
| createdAt   | DateTime | Auto-set on creation                            |

## Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| `modelType` values | `"Claude"` only | Only model type in use; extend in a later phase if needed |
| Delete strategy | Hard delete | Simplest for Phase 2; no audit or history requirement yet |
| CRUD access | Staff role only | Agents are patients, not admins; role is controlled by the existing UI toggle |
| List pagination | 10 items per page | Reasonable default; no filtering/sorting needed at this stage |
| Detail scope | Phase 2 fields only | Avoids placeholder UI that would need updating every phase |

## Context

- Tone: light and slightly playful — agents are the patients, keep copy consistent with the AgentClinic voice (see `mission.md`)
- Stack: Next.js App Router, Prisma + SQLite, shadcn/ui, Tailwind — no new dependencies
- The role toggle is already in place from Phase 1; gate staff actions behind the `isStaff` context/state it provides
- Follow existing component and file conventions established in Phase 1
