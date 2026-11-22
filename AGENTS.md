# AGENTS.md — Task Tracker

## Purpose & Scope
Small client-side Task Tracker web application built with React, TypeScript, Vite, Tailwind CSS, and Vitest.
- Strictly client-side application: no authentication, no backend/database, and no external API calls.
- Never include secrets, API keys, tokens, credentials, or real personal data (PII) in source files, tests, fixtures, or commits.
- Baseline commit reference prior to modifications: `22b2f3c` (`https://github.com/Laura-git-7/task-tracker-assignment05/commit/22b2f3c2460a534485c806925f258d9bb296a3d7`).

## Architecture & Key Files
- `src/lib/tasks.ts`: Task domain types (`low` | `medium` | `high` priority) and pure functions (`isTitleValid`, `createTask`, `toggleTask`, `deleteTask`, `filterTasks`, `getTaskStats`).
- `src/lib/tasks.test.ts`: Vitest unit tests covering task validation and pure state transition helpers.
- `src/App.tsx`: Root UI component rendering task creation form, priority selector, optional tag input, status filters (`All`, `Active`, `Completed`), summary counts, and task list.
- `src/main.tsx` & `index.html`: Application entry point and root HTML document.
- `package.json`: Project scripts, dependencies, and devDependencies.

## Setup & Safe Commands
- Install dependencies when needed: `npm ci` or `npm install`
- Run unit tests: `npm test` (`vitest run`)
- Run linter: `npm run lint` (`eslint .`)
- Run type check: `npm run typecheck` (`tsc --noEmit -p tsconfig.app.json`)
- Run production build: `npm run build` (`vite build`)

## Coding Conventions & Test Expectations
- Keep domain logic and state transitions in `src/lib/tasks.ts` pure and deterministic without mutating input arrays or objects.
- Validate task titles cleanly (trim whitespace; reject empty/whitespace-only titles and titles exceeding 100 characters).
- Keep UI in `src/App.tsx` clean, client-side only, and free of secrets, real personal data, or unverified external network calls.
- After any code change, inspect the diff carefully and run `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` before finishing.

## Forbidden Actions
- **No secrets or PII:** Never add API keys, tokens, passwords, `.env` secrets, or real personal data.
- **No production deployments:** Never run or trigger production deployment commands or publish unverified changes externally.
- **No destructive commands:** Never run destructive git or filesystem commands (such as `git reset --hard`, force-pushing to `main`, or deleting unrelated files/directories) without explicit user approval.
- **No unreviewed dependency changes:** Do not add, remove, or upgrade packages in `package.json` or `package-lock.json` without explicit review and justification.

## Agent Instruction Loading & Human Review Gate
- If the AI assistant or coding agent does not load `AGENTS.md` automatically, paste the relevant rules from this file explicitly into the prompt and disclose that manual inclusion was used.
- Every AI-proposed change must be reviewed by diff, verified with tests and checks, and approved by the human owner before acceptance.
