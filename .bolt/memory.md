# Project memory

## Product intent & audience

- Task Tracker: small, clean, fully client-side single-page web app for managing fictional tasks locally in the browser.
- Audience: users needing a lightweight task tracker; also built to be small and auditable (clear architecture, minimal dependencies).

## Brand personality & voice

- Clean, no-frills, production-quality utility app.
- Tone: straightforward and concise in UI labels and summaries (e.g., Total / Active / Done).

## Visual design & UX direction

- Responsive single-page layout, card-based.
- Color scheme: slate/neutral Tailwind palette.
- Components/patterns: priority badges (Low/Medium/High), task list rows with toggle and delete controls, summary counts, filter buttons (All/Active/Completed).
- Interactions: smooth hover and tap states.
- Lucide React icons used where appropriate (per project conventions).
- Accessibility/usability: clear controls and live-updating counts; avoid extraneous visual noise.

## Decisions, constraints & rationale

- Strict client-side only: no login, backend, database, Supabase, external APIs, or secrets. Rationale: safety and auditability.
- Fictional, non-sensitive sample tasks only; no real names/emails/personal data.
- Architecture separates pure logic from UI:
  - `src/lib/tasks.ts` — pure functions and `Task` type (`id`, `title`, `priority 'low'|'medium'|'high'`, `completed`, optional `tag`).
  - Functions: `createTask`, `toggleTask`, `deleteTask`, `filterTasks` (by `all`|`active`|`completed`), `getTaskStats` (total/active/completed).
  - Input validation: trim whitespace, reject empty titles or titles >100 chars.
  - `src/lib/tasks.test.ts` — Vitest unit tests covering creation, validation, toggling, deleting, filtering, stats.
  - `src/App.tsx` — UI wired to pure functions via React state.
- Tooling: Vite + React + TypeScript + Tailwind CSS; Vitest (jsdom) for unit tests.
- `package.json` scripts include working `dev`, `build`, `lint`, `typecheck` (`tsc --noEmit`), and `test` (`vitest run`).
- Path alias `@/` maps to `src/` for imports (per project conventions).
- Verified: 27/27 tests pass, typecheck/lint/build all clean.

## Open questions & assumptions

- No persistent storage requested; task state is in-memory only and resets on reload. Persistence (e.g. localStorage) not added unless requested.
- No sorting/ordering requirement specified beyond filters; current ordering not yet defined/confirmed as a stable design decision.
- Tag editing/search beyond optional tag field not requested; assumed out of scope.