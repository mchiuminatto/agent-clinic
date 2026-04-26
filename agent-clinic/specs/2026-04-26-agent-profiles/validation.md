# Validation — Agent Profiles

## Automated

- `npx tsc --noEmit` passes with zero errors
- `npx vitest run` passes all tests

### Required test assertions

| Area | Assertion |
|------|-----------|
| List API | `GET /api/agents?page=1` returns `{ data: Agent[], total: number, page: number, pageSize: 10 }` |
| List API | Page 2 returns the correct slice when total > 10 |
| Create API | `POST /api/agents` with valid body returns 201 and the created agent |
| Create API | `POST /api/agents` missing `name` returns 400 |
| Create API | Created agent always has `modelType === "Claude"` |
| Detail API | `GET /api/agents/[id]` for unknown id returns 404 |
| Update API | `PUT /api/agents/[id]` updates `name` and `status` and returns the updated record |
| Delete API | `DELETE /api/agents/[id]` returns 204 and the record no longer exists |
| Component | `AgentStatusBadge` renders distinct badge for each of the four status values |
| Component | `AgentForm` disables submit when `name` is empty |

## Manual Walkthrough

### Create an agent (staff mode)

1. Switch role toggle to **Staff**
2. Navigate to **Agents** (top nav link)
3. Click **New Agent**
4. Fill in a name, select a status, submit
5. Confirm redirect to the list; new agent appears on page 1
6. Confirm `modelType` shows as "Claude" on the detail page

### Edit an agent (staff mode)

1. From the list, click an agent row to open the detail page
2. Click **Edit**
3. Change the name and/or status, save
4. Confirm the detail page reflects the updated values

### Delete an agent (staff mode)

1. Open an agent detail page
2. Click **Delete** and confirm the prompt
3. Confirm redirect to the list; deleted agent is gone and does not reappear on any page

### Pagination

1. Seed or create more than 10 agents
2. Confirm page 1 shows exactly 10 rows
3. Click **Next** — confirm page 2 shows the remainder
4. Click **Previous** — confirm return to page 1

### Staff gate

1. Switch role toggle to **Agent**
2. Confirm **New Agent**, **Edit**, and **Delete** actions are hidden or disabled
3. Confirm the list and detail views are still visible (read access is not restricted)

## Tone Check

- "New Agent" button copy — keep clinical/neutral, not techy ("Register Agent" also acceptable)
- Status badge labels should match enum values exactly: Active, In Treatment, Inactive, On Hold
- No placeholder copy referencing future phases

## Definition of Done

- [ ] All automated tests pass
- [ ] TypeScript compiles with no errors
- [ ] Manual walkthrough completed without errors
- [ ] Staff gate verified in Agent role
- [ ] Agents nav link appears first and active-highlights correctly
- [ ] No regressions in Phase 1 layout or nav shell
