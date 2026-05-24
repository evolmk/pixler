# M01 — Monorepo scaffold + `npx pixler` boot

## Goal

Stand up the Turborepo + pnpm workspace described in SPEC §2.1, wire up the `bin/pixler.js` entry so `npx pixler` boots a NestJS server and opens a browser to it. No real features — just the bones.

## Depends on

Nothing. This is the root of the dependency tree.

## Deliverables

- [ ] `package.json` at repo root with `"bin": { "pixler": "./bin/pixler.js" }`, `"type": "module"`, pnpm workspace config
- [ ] `pnpm-workspace.yaml` listing `apps/*` and `packages/*`
- [ ] `turbo.json` with `dev`, `build`, `lint`, `typecheck` pipelines
- [ ] `apps/api/` — NestJS 11 skeleton with a single `GET /api/health` returning `{ ok: true, version }`
- [ ] `apps/web/` — React 19 + Vite + TypeScript skeleton, dev proxy to the api, shows a `Pixler is alive` page that calls `/api/health` and renders the version
- [ ] `packages/ui/` — empty package, only `package.json` + `tsconfig.json` (real components land in M03)
- [ ] `packages/ui-styles/` — empty package skeleton (real tokens land in M02)
- [ ] `packages/shared-types/` — exports an empty `index.ts` placeholder + `package.json`
- [ ] `packages/orchestrator/` — empty package skeleton
- [ ] `packages/linear-cli/` — empty package skeleton with a `bin` entry stub that prints `"pixler linear cli — not yet implemented"`
- [ ] `bin/pixler.js` — Node script that:
  - finds a free port (default 7777, fallback to next free)
  - spawns the built NestJS server from `apps/api/dist/main.js`
  - opens the user's default browser to `http://localhost:<port>` (use `open` package or platform fallback)
  - logs `Pixler running at http://localhost:<port>` to stdout
- [ ] `tsconfig.base.json` + per-package extends
- [ ] `.gitignore` updated (`node_modules`, `dist`, `.turbo`, `*.log`, `.DS_Store`)
- [ ] Root README pointer left intact (the real README is updated by another agent)

## Acceptance

- `pnpm install` at the repo root succeeds.
- `pnpm -w build` builds api + web + all packages without TS errors.
- `pnpm -w dev` starts api on its port and Vite on 5173, and the web page renders "Pixler is alive — version 0.0.1" sourced from the api.
- From a sibling directory: `node /Users/mike/work/workspace-lazar/pixler/bin/pixler.js` boots the server, opens the browser, page works.
- `npm pack` produces a tarball whose `bin` resolves correctly.

## Files

```
package.json
pnpm-workspace.yaml
turbo.json
tsconfig.base.json
bin/pixler.js
apps/api/{package.json,tsconfig.json,src/main.ts,src/app.module.ts,src/health.controller.ts}
apps/web/{package.json,tsconfig.json,index.html,vite.config.ts,src/main.tsx,src/App.tsx}
packages/{ui,ui-styles,shared-types,orchestrator,linear-cli}/{package.json,tsconfig.json,src/index.ts}
.gitignore
```

## Dependency policy

All packages must be installed at their **latest stable/LTS versions** — no alpha, beta, RC, canary, or `@next` tags. When a package offers an LTS track (e.g. NestJS), prefer the current LTS. Pin with `^` ranges so patches flow in but major bumps are intentional.

## Out of scope

- Any visual design — bare HTML is fine; M02/M03/M06 own UI.
- Auto-update / publish workflow — M25 owns distribution.
- WebSocket / Socket.io — M04 owns the api wiring beyond the health endpoint.
