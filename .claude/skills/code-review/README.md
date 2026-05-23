# Code Review Skill (Pixler)

Project-scoped code-review skill for Pixler. Forked from [awesome-skills/code-review-skill](https://github.com/awesome-skills/code-review-skill) (MIT) and trimmed to this project's stack.

## Stack covered

- React 19 (functional components, hooks)
- NestJS (controllers, services, guards)
- TypeScript
- Tailwind v4 + Radix UI + CVA
- Zustand + TanStack Query
- pnpm workspaces

Generic guidance (architecture, performance, security, code review process) is preserved.

## When this skill runs

Invoke manually via `/code-review` or the Skill tool. For ad-hoc reviews:

```
Use code-review-skill to review the changes on this branch.
```

## Layout

```
code-review-skill/
├── SKILL.md                     # Core skill — Pixler reviewer lens + review process
├── README.md                    # This file
├── LICENSE                      # MIT (upstream)
├── CONTRIBUTING.md              # Upstream contributing guide (kept for reference)
│
├── reference/                   # On-demand deeper guides
│   ├── typescript.md            # TS strict mode, generics, async/await
│   ├── architecture-review-guide.md
│   ├── performance-review-guide.md
│   ├── security-review-guide.md
│   ├── common-bugs-checklist.md # Universal + TS/JS + React + NestJS + API + Testing
│   └── code-review-best-practices.md
│
├── assets/
│   ├── review-checklist.md      # Quick reference
│   └── pr-review-template.md    # Comment template
│
└── scripts/
    └── pr-analyzer.py           # PR complexity analyzer (optional)
```

## Stack-specific rules

Project-canonical rules live in the repo itself, not in this skill:

| Area            | Source of truth                         |
| --------------- | --------------------------------------- |
| UI spec catalog | `_specs/spec-ui/` (loaded by `/ui` skill) |
| TypeScript      | `reference/typescript.md`              |

When the project doc and a skill guide conflict, the project doc wins.

## Severity

The skill uses `blocking / important / nit / suggestion`. Always include `file:line` references on findings.

- `blocking` — Must fix before merge
- `important` — Should fix, discuss if disagree
- `nit` / `suggestion` — Nice to have, not blocking

## License

MIT — see [LICENSE](LICENSE). Upstream attribution preserved.
