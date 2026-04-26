---
name: changelog
description: Maintains CHANGELOG.md in the agent-clinic project root using git commit history scoped to this directory. Invoke with /changelog before merging a branch. Creates the file from scratch if it doesn't exist (all commits grouped by date); otherwise prepends only commits newer than the last recorded date.
---

# Changelog Skill

## Workflow

1. Run the script from the **agent-clinic/** directory:

```bash
python3 .claude/skills/changelog/scripts/changelog.py
```

2. The script handles both cases automatically:
   - **No CHANGELOG.md**: reads full git history for this directory, writes the file grouped by date (newest first)
   - **CHANGELOG.md exists**: finds the newest `## YYYY-MM-DD` heading, fetches commits after that date, prepends new sections

3. Review the output and clean up bullet wording if needed, then commit `CHANGELOG.md` as part of the merge commit.

## Format

```markdown
# Changelog

## 2026-04-26

- Implement Phase 2 — Agent Profiles (CRUD, API routes, components, tests)
- Scaffold Next.js + Prisma + Tailwind + Vitest

## 2026-04-23

- Add agent-clinic specs (mission, roadmap, data model, tech stack)
```

- One `# Changelog` title at the top
- Date headings as `## YYYY-MM-DD`, newest first
- One bullet per commit; clean up wording manually after generation

## Notes

- Must be run from `agent-clinic/` (the directory containing `CHANGELOG.md`)
- Only commits that touch files inside `agent-clinic/` are included
- Re-running when nothing is new prints a message and exits without modifying the file
