# Task Tracker (Assignment #05)

A small client-side Task Tracker built with React, TypeScript, Vite, Tailwind CSS, and Vitest.

## Features
- Create tasks with a trimmed title (1–100 characters), priority (`low`, `medium`, `high`), and optional tag (up to 30 characters in UI).
- Toggle task completion status and delete tasks.
- Filter tasks by status (`All`, `Active`, `Completed`) and view live counters (`TOTAL`, `ACTIVE`, `DONE`).
- Strictly client-side application: no backend, database, authentication, secrets, or real personal data.

## Setup & Commands
- Install dependencies: `npm ci` (or `npm install`)
- Start dev server: `npm run dev`
- Run unit tests: `npm test`
- Run linter: `npm run lint`
- Run typecheck: `npm run typecheck`
- Build production bundle: `npm run build`

## Project Structure
- `src/lib/tasks.ts` — Task types, validation, and pure state helper functions (`isTitleValid`, `createTask`, `toggleTask`, `deleteTask`, `filterTasks`, `getTaskStats`).
- `src/lib/tasks.test.ts` — Vitest unit tests for domain logic and fallback ID generation.
- `src/App.tsx` — Main client-side UI component.
- `AGENTS.md` — Repository rules, boundaries, safe commands, and review gates for AI agents.
