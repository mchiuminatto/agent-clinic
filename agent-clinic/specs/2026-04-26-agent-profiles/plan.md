Implement# Plan — Agent Profiles

## 1. Data Layer

1.1. Add `Agent` model to `prisma/schema.prisma` with fields: `id`, `name`, `modelType`, `status` (enum), `createdAt`  
1.2. Define `AgentStatus` enum: `Active`, `InTreatment`, `Inactive`, `OnHold`  
1.3. Run `prisma migrate dev --name agent-profiles` to generate and apply the migration  
1.4. Verify Prisma Client types are generated and `db.agent` is accessible  

## 2. API Routes

2.1. `GET /api/agents?page=N` — return paginated list (10 per page), total count, and page metadata  
2.2. `POST /api/agents` — create agent; validate required fields (`name`, `status`); set `modelType` to `"Claude"`  
2.3. `GET /api/agents/[id]` — return single agent or 404  
2.4. `PUT /api/agents/[id]` — update `name` and/or `status`  
2.5. `DELETE /api/agents/[id]` — hard delete; return 204  

## 3. Components

3.1. `AgentStatusBadge` — coloured badge mapping each `AgentStatus` value to a distinct shadcn/ui `Badge` variant  
3.2. `AgentForm` — controlled form for create and edit (name field, status select); shared between both flows  
3.3. `AgentCard` / table row component used inside the list page  
3.4. Pagination controls (prev/next + page indicator) reusable component  

## 4. Pages & Routes

4.1. `/agents` — list page: paginated table of agents, "New Agent" button (staff only), link to detail per row  
4.2. `/agents/new` — create page: renders `AgentForm`, redirects to list on success (staff only)  
4.3. `/agents/[id]` — detail page: displays all Phase 2 fields, "Edit" and "Delete" actions (staff only)  
4.4. `/agents/[id]/edit` — edit page: renders `AgentForm` pre-filled, redirects to detail on success (staff only)  

## 5. Navigation

5.1. Add "Agents" as the first link in the navigation shell built in Phase 1  
5.2. Apply active-link highlighting consistent with existing nav style  

## 6. Tests

6.1. Unit test `AgentStatusBadge` renders correct variant for each status value  
6.2. Unit test `AgentForm` validates required fields and calls submit handler  
6.3. API route tests (Vitest): happy-path create, list pagination, update, delete, and 404 on missing id  
6.4. Run `tsc --noEmit` and confirm no type errors  
