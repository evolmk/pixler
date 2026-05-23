# Contributing to the Code Review Skill

This document describes the conventions for editing this skill. It's preserved from the upstream [awesome-skills/code-review-skill](https://github.com/awesome-skills/code-review-skill) (MIT) for reference; in this Pixler fork most contributions happen by editing the files directly.

## Claude Code Skill Conventions

### Directory Layout

```
code-review-skill/
├── SKILL.md                    # required: main file, always loaded
├── README.md                   # project overview
├── CONTRIBUTING.md             # this file
├── LICENSE
├── reference/                  # on-demand deep guides
│   ├── typescript.md
│   ├── common-bugs-checklist.md
│   ├── security-review-guide.md
│   ├── architecture-review-guide.md
│   ├── performance-review-guide.md
│   └── code-review-best-practices.md
├── assets/                     # templates and quick references
│   ├── review-checklist.md
│   └── pr-review-template.md
└── scripts/                    # tooling
    └── pr-analyzer.py
```

### Frontmatter

`SKILL.md` must include YAML frontmatter:

```yaml
---
name: skill-name
description: |
  What the skill does. When it should activate.
  Use when [specific situation].
allowed-tools: ['Read', 'Grep', 'Glob'] # optional: restrict tool access
---
```

#### Required fields

| Field         | Description                  | Constraint                                       |
| ------------- | ---------------------------- | ------------------------------------------------ |
| `name`        | Skill identifier             | lowercase letters, digits, hyphens; max 64 chars |
| `description` | Function and activation hint | max 1024 chars; should include "Use when"        |

#### Optional fields

| Field           | Description          | Example                    |
| --------------- | -------------------- | -------------------------- |
| `allowed-tools` | Restrict tool access | `["Read", "Grep", "Glob"]` |

### Naming

**Skill names**:

- lowercase letters, digits, and hyphens (kebab-case)
- max 64 chars
- avoid underscores or uppercase

```
✅ code-review-excellence, typescript-advanced-types
❌ CodeReview, code_review, TYPESCRIPT
```

**Filenames**:

- reference files are lowercase: `typescript.md`, `vue.md`
- multi-word files use hyphens: `common-bugs-checklist.md`

### Description Conventions

A description has two parts:

1. **What it does** — what the skill provides
2. **When to use** — start with "Use when"

```yaml
# ✅ Good example
description: |
  Code review guidance for the Pixler stack: React 19, NestJS, TypeScript,
  Tailwind v4, Zustand, TanStack Query.
  Use when reviewing pull requests, conducting PR reviews, establishing
  review standards, or mentoring developers through code reviews.

# ❌ Bad example (too vague, no activation hint)
description: |
  Helps with code review.
```

### Progressive Disclosure

Claude loads supporting files on demand, not all at once.

#### File responsibilities

| File             | Loaded      | Contents                                  |
| ---------------- | ----------- | ----------------------------------------- |
| `SKILL.md`       | always      | Core principles, quick index, when to use |
| `reference/*.md` | on demand   | Detailed language/framework guides        |
| `assets/*.md`    | when needed | Templates, checklists                     |
| `scripts/*.py`   | when needed | Tooling                                   |

#### Content split

**SKILL.md** (~200 lines or less):

- 2–3 sentence summary of purpose
- Core principles and methodology
- Language/framework index (linking to `reference/`)
- When to use this skill

**reference/\*.md** (detailed content):

- Full code examples
- All best practices
- Review checklists
- Edge cases and gotchas

### File References

When referencing other files from SKILL.md:

```markdown
# ✅ Good — Markdown link syntax

| **React** | [React Guide](reference/react.md) | Hooks, React 19, RSC |
| **Vue 3** | [Vue Guide](reference/vue.md) | Composition API |

See the [React Guide](reference/react.md) for the full guide.

# ❌ Bad — bare code-block reference

See the `reference/react.md` file.
```

**Path rules**:

- Use relative paths (relative to the skill directory)
- Use forward slashes `/`, never backslashes
- No `./` prefix

---

## Contribution Types

### Adding a new language

1. Create a new file under `reference/` (e.g. `go.md`)
2. Follow this structure:

````markdown
# [Language] Code Review Guide

> Short, one-sentence description of what's covered.

## Contents

- [Topic 1](#topic-1)
- [Topic 2](#topic-2)
- [Review Checklist](#review-checklist)

---

## Topic 1

### Subtopic

```[language]
// ❌ Bad pattern — say why it's bad
bad_code_example()

// ✅ Good pattern — say why it's better
good_code_example()
```
````

---

## Review Checklist

### Category 1

- [ ] Check 1
- [ ] Check 2

````

3. Add a link in the index table in `SKILL.md`
4. Update the stats in `README.md`

### Adding framework patterns

1. Cite official docs
2. Include version numbers (e.g. "React 19", "Vue 3.5+")
3. Provide runnable code examples
4. Add corresponding checklist items

### Improving existing content

- Fix spelling or grammar
- Update outdated patterns (note the version change)
- Add edge-case examples
- Improve example clarity

---

## Code Example Conventions

### Format

```markdown
// ❌ Problem — explain why this is bad
problematic_code()

// ✅ Recommended — explain why this is better
recommended_code()
````

### Quality bar

- Examples should be drawn from real scenarios, not contrived
- Show both the problem and the solution
- Keep examples short and focused
- Include necessary context (imports, etc.)

---

## Submitting Changes

### Issues

- Use GitHub Issues to report problems or suggestions
- Provide a clear description and example
- Label the relevant language/framework

### Pull Request flow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/add-go-support`
3. Make changes
4. Commit (see commit format below)
5. Push to your fork: `git push origin feature/add-go-support`
6. Open a Pull Request

### Commit message format

```
type: short description

Longer explanation (if needed)

- specific change 1
- specific change 2
```

**Types**:

- `feat`: new feature or new content
- `fix`: bug fix
- `docs`: documentation only
- `refactor`: refactor (no behavior change)
- `chore`: maintenance

**Example**:

```
feat: add Go code review guide

- New reference/go.md
- Covers error handling, concurrency, interface design
- Update SKILL.md index table
```

---

## Skill Design Principles

### Single responsibility

Each skill focuses on one core capability. This skill is for **code review** and should not expand into:

- Code generation
- Project initialization
- Deployment configuration

### Versioning

- Note framework/language versions in reference files
- When updating, note version changes in commits
- Update outdated content rather than deleting it (unless fully deprecated)

### Content quality

- Recommendations should be backed by sources (official docs, established best practices)
- Avoid subjective style preferences; focus on objective issues
- Prioritize common pitfalls and security problems

---

## FAQ

### Q: How do I test my changes?

Copy the modified skill to `~/.claude/skills/` and test in Claude Code:

```bash
cp -r code-review-skill ~/.claude/skills/code-review-excellence
```

### Q: Should I update SKILL.md or a reference file?

- **SKILL.md** — only edit the index table or core principles
- **reference/\*.md** — add or update language/framework content

### Q: How do I handle outdated content?

1. Note the version change (e.g. "React 18 → React 19")
2. Keep the older content if it's still useful
3. Update the related checklist items

---

## Questions

Open a GitHub Issue against the upstream repo if you have questions.
