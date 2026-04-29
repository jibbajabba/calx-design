# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with HMR (Vite)
npm run build     # Type-check (tsc -b) then build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build locally
```

No test suite is configured yet.

## Stack

- **React 19** + **TypeScript 6** + **Vite 8**
- **Tailwind CSS v4** via `@tailwindcss/vite` — no `tailwind.config.js`; configure in CSS or `vite.config.ts`
- ESLint flat config (`eslint.config.js`) with strict TS rules
- `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly` are enforced by `tsconfig.app.json`

## Architecture

The app has two views managed by a single `useState<'landing' | 'overview'>` in `App.tsx` — no router.

- **`src/App.tsx`** — Landing page: hero, search input, animated globe, "How Calx Works" section
- **`src/pages/OverviewPage.tsx`** — TWP Analysis dashboard: overview & analysis panel with expert advisor card, stats row, map layer tabs, California map placeholder, data sidebar (emissions, risk counties, farmland exposure, emitters), hotspot/buffer controls

Fonts (Source Serif 4, Geist, Inter, Source Sans 3) are loaded via Google Fonts in `index.css`. Icons are SVG sprites from `public/icons.svg` and individual SVGs in `src/assets/icons/`. Globe animation assets live in `src/assets/globe/`.

Local helper components (`Icon`, `StatMetric`, `MapTab`, `SidebarSection`, `DataRow`, `RankedRow`) are defined inline at the bottom of each page file rather than in separate files.

## Figma Integration

The project is pre-wired for Figma MCP workflows. Allowed tools include `get_design_context`, `use_figma`, and `get_metadata`. Asset downloads from the Figma API via `curl` are also pre-approved in `.claude/settings.local.json`.

## Claude Code Commands

These slash commands maintain project documentation automatically:

| Command | What it does |
|---------|-------------|
| `/update-docs` | Runs all documentation updates in one pass |
| `/update-design-system` | Scans for design tokens, maintains `src/styles/design.ts` |
| `/update-changelog` | Generates changelog entry from git history, outputs release notes |
| `/update-readme` | Regenerates README from actual project config and file structure |
| `/update-memory` | Records patterns, decisions, and gotchas in `.claude/memory/MEMORY.md` |
| `/update-plan` | Tracks roadmap progress in `PLAN.md`, auto-marks completed items from git |

### Usage

- Run `/update-docs` before each release to refresh everything
- Run `/update-changelog` when preparing a deployment
- Run `/update-memory` after solving a tricky bug or making an architecture decision
- Run `/update-design-system check` for a read-only audit of design tokens
- Pass arguments to any command for targeted updates (e.g., `/update-docs just changelog and readme`)

### Project-Local Memory

`.claude/memory/MEMORY.md` is committed to the repo and shared across machines. It stores project-specific patterns, workarounds, and decisions that Claude should remember. This is separate from Claude's auto-memory (which is machine-specific and stored in `~/.claude/`).

## Coding Principles

Derived from [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) on LLM coding pitfalls. These bias toward caution over speed — for trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.
