---
name: code-review
description: |
  Multi-axis code review tuned for the Pixler stack (React 19, NestJS, TypeScript, Tailwind v4,
  Zustand, TanStack Query, pnpm workspaces). Covers correctness, readability, architecture,
  security, and performance.

  Manual invocation only — does not auto-fire on natural-language triggers. Invoke explicitly
  by slash command (`/code-review`) or by the Skill tool (`skill: "code-review"`).
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash # run lint/test/build commands to verify code quality
  - WebFetch # consult latest docs / best practices
---

# Code Review (Pixler)

Multi-axis review with quality gates. Every change gets reviewed before merge — no exceptions.

## Invocation

This skill is invoked manually, by name. It does not auto-fire on natural-language triggers.

Two ways to invoke:

- **Slash command:** `/code-review`
- **Skill tool:** `skill: "code-review"`

The lens applies the Pixler-specific review standards below, then the five-axis generic review. Use this skill for any code review within the Pixler project.

**The approval standard:** Approve a change when it definitely improves overall code health, even if it isn't perfect. Perfect code doesn't exist — the goal is continuous improvement. Don't block a change because it isn't exactly how you would have written it. If it improves the codebase and follows the project's conventions, approve it.

## When to Use This Skill

- Establishing code review standards
- Mentoring through reviews
- Conducting security or architecture reviews
- Reviewing code written by yourself, another agent, or a human

## Pixler Reviewer Lens (apply first)

When invoked inside this monorepo, this lens runs BEFORE the generic axes below.

### Standing review standards

Hold every plan and every diff to this bar:

- Prefer shared components, shared utilities, and shared types over local one-off implementations.
- Flag hardcoded styles when design tokens or design system primitives should be reused instead.
- Flag API or DTO drift across frontend, shared packages, and backend services.
- Flag weak auth boundaries, missing role checks, and insecure default exposure.
- Flag changes that make React, NestJS, Node, or package upgrades harder.
- Flag copy-paste patterns that should become reusable primitives.
- Flag write paths that skip existing safety patterns where the repo already uses them.

### Areas to watch closely

These subsystems have outsized blast radius — review changes here with extra scrutiny:

- `apps/api` — backend API surface
- `apps/web` — frontend application
- `packages/*` — shared libraries and utilities
- Auth-related frontend route guards and API middleware
- Shared UI patterns and design system components

### Multi-session theme

Hold the repo to a reviewer bar of: **consistency, reuse, secure auth, secure API boundaries, modularity, performance, and long-term upgrade safety.**

## The Five-Axis Review

Every review evaluates code across these dimensions. Apply after the Pixler lens above.

### 1. Correctness

Does the code do what it claims to do?

- Does it match the spec or task requirements?
- Are edge cases handled (null, empty, boundary values)?
- Are error paths handled (not just the happy path)?
- Does it pass all tests? Are the tests actually testing the right things?
- Are there off-by-one errors, race conditions, or state inconsistencies?

### 2. Readability & Simplicity

Can another engineer (or agent) understand this code without the author explaining it?

- Are names descriptive and consistent with project conventions? (No `temp`, `data`, `result` without context.)
- Is the control flow straightforward (avoid nested ternaries, deep callbacks)?
- Is the code organized logically (related code grouped, clear module boundaries)?
- Are there any "clever" tricks that should be simplified?
- **Could this be done in fewer lines?** (1000 lines where 100 suffice is a failure.)
- **Are abstractions earning their complexity?** (Don't generalize until the third use case.)
- Would comments help clarify non-obvious intent? (But don't comment obvious code.)
- Are there dead code artifacts: no-op variables (`_unused`), backwards-compat shims, or `// removed` comments?

### 3. Architecture

Does the change fit the system's design?

- Does it follow existing patterns or introduce a new one? If new, is it justified?
- Does it maintain clean module boundaries?
- Is there code duplication that should be shared?
- Are dependencies flowing in the right direction (no circular dependencies)?
- Is the abstraction level appropriate (not over-engineered, not too coupled)?

### 4. Security

Does the change introduce vulnerabilities?

- Is user input validated and sanitized?
- Are secrets kept out of code, logs, and version control?
- Is authentication/authorization checked where needed?
- Are SQL queries parameterized (no string concatenation)?
- Are outputs encoded to prevent XSS?
- Are dependencies from trusted sources with no known vulnerabilities?
- Is data from external sources (APIs, logs, user content, config files) treated as untrusted?
- Are external data flows validated at system boundaries before use in logic or rendering?

See `reference/security-review-guide.md` for the full checklist.

### 5. Performance

Does the change introduce performance problems?

- Any N+1 query patterns?
- Any unbounded loops or unconstrained data fetching?
- Any synchronous operations that should be async?
- Any unnecessary re-renders in UI components?
- Any missing pagination on list endpoints?
- Any large objects created in hot paths?

See `reference/performance-review-guide.md` for the full checklist.

## Core Principles

### The Review Mindset

**Goals of Code Review:**

- Catch bugs and edge cases
- Ensure code maintainability
- Share knowledge across team
- Enforce coding standards
- Improve design and architecture
- Build team culture

**Not the Goals:**

- Show off knowledge
- Nitpick formatting (use linters)
- Block progress unnecessarily
- Rewrite to your preference

### Effective Feedback

**Good Feedback is:**

- Specific and actionable
- Educational, not judgmental
- Focused on the code, not the person
- Balanced (praise good work too)
- Prioritized (critical vs nice-to-have)

```markdown
❌ Bad: "This is wrong."
✅ Good: "This could cause a race condition when multiple users
access simultaneously. Consider using a mutex here."

❌ Bad: "Why didn't you use X pattern?"
✅ Good: "Have you considered the Repository pattern? It would
make this easier to test. Here's an example: [link]"

❌ Bad: "Rename this variable."
✅ Good: "[nit] Consider `userCount` instead of `uc` for
clarity. Not blocking if you prefer to keep it."
```

## Review Process

### Phase 1: Context Gathering (2-3 minutes)

Before diving into code, understand:

1. Read PR description / plan body and linked issue
2. Check PR size — see Change Sizing below
3. Review CI/CD status (tests passing?)
4. Understand the business requirement
5. Note any relevant architectural decisions

### Phase 2: High-Level Review (5-10 minutes)

1. **Architecture & Design** — Does the solution fit the problem?
   - For significant changes, consult [Architecture Review Guide](reference/architecture-review-guide.md)
   - Check: SOLID principles, coupling/cohesion, anti-patterns
2. **Performance Assessment** — Are there performance concerns?
   - For performance-critical code, consult [Performance Review Guide](reference/performance-review-guide.md)
   - Check: Algorithm complexity, N+1 queries, memory usage
3. **File Organization** — Are new files in the right places?
4. **Testing Strategy** — Are there tests covering edge cases?

### Phase 3: Line-by-Line Review (10-20 minutes)

For each file, walk the five axes: Correctness, Readability, Architecture, Security, Performance.

### Phase 4: Summary & Decision (2-3 minutes)

1. Summarize key concerns
2. Highlight what you liked
3. Make clear decision:
   - ✅ Approve
   - 💬 Comment (minor suggestions)
   - 🔄 Request Changes (must address)
4. Offer to pair if complex

## Change Sizing

Small, focused changes are easier to review, faster to merge, and safer to deploy. Target these sizes:

```
~100 lines changed   → Good. Reviewable in one sitting.
~300 lines changed   → Acceptable if it's a single logical change.
~1000 lines changed  → Too large. Split it.
```

**What counts as "one change":** A single self-contained modification that addresses one thing, includes related tests, and keeps the system functional after submission. One part of a feature — not the whole feature.

**Splitting strategies when a change is too large:**

| Strategy          | How                                                     | When                    |
| ----------------- | ------------------------------------------------------- | ----------------------- |
| **Stack**         | Submit a small change, start the next one based on it   | Sequential dependencies |
| **By file group** | Separate changes for groups needing different reviewers | Cross-cutting concerns  |
| **Horizontal**    | Create shared code/stubs first, then consumers          | Layered architecture    |
| **Vertical**      | Break into smaller full-stack slices of the feature     | Feature work            |

**When large changes are acceptable:** Complete file deletions and automated refactoring where the reviewer only needs to verify intent, not every line.

**Separate refactoring from feature work.** A change that refactors existing code and adds new behavior is two changes — submit them separately. Small cleanups (variable renaming) can be included at reviewer discretion.

## Dead Code Hygiene

After any refactoring or implementation change, check for orphaned code:

1. Identify code that is now unreachable or unused
2. List it explicitly
3. **Ask before deleting:** "Should I remove these now-unused elements: [list]?"

Don't leave dead code lying around — it confuses future readers and agents. But don't silently delete things you're not sure about. When in doubt, ask.

```
DEAD CODE IDENTIFIED:
- formatLegacyDate() in src/utils/date.ts — replaced by formatDate()
- OldTaskCard component in src/components/ — replaced by TaskCard
- LEGACY_API_URL constant in src/config.ts — no remaining references
→ Safe to remove these?
```

## Honesty in Review

When reviewing code — whether written by you, another agent, or a human:

- **Don't rubber-stamp.** "LGTM" without evidence of review helps no one.
- **Don't soften real issues.** "This might be a minor concern" when it's a bug that will hit production is dishonest.
- **Quantify problems when possible.** "This N+1 query will add ~50ms per item in the list" is better than "this could be slow."
- **Push back on approaches with clear problems.** Sycophancy is a failure mode in reviews. If the implementation has issues, say so directly and propose alternatives.
- **Accept override gracefully.** If the author has full context and disagrees, defer to their judgment. Comment on code, not people — reframe personal critiques to focus on the code itself.

This is especially important when an agent reviews its own output. Self-review tends toward LGTM-bias — counteract it explicitly.

## Multi-Model Review Pattern

Use different models for different review perspectives:

```
Model A writes the code
    │
    ▼
Model B reviews for correctness and architecture
    │
    ▼
Model A addresses the feedback
    │
    ▼
Human makes the final call
```

This catches issues that a single model might miss — different models have different blind spots.

## Review Techniques

### Technique 1: The Question Approach

Instead of stating problems, ask questions:

```markdown
❌ "This will fail if the list is empty."
✅ "What happens if `items` is an empty array?"

❌ "You need error handling here."
✅ "How should this behave if the API call fails?"
```

### Technique 2: Suggest, Don't Command

Use collaborative language:

```markdown
❌ "You must change this to use async/await"
✅ "Suggestion: async/await might make this more readable. What do you think?"

❌ "Extract this into a function"
✅ "This logic appears in 3 places. Would it make sense to extract it?"
```

### Technique 3: Differentiate Severity

Use labels to indicate priority:

- 🔴 `[blocking]` — Must fix before merge
- 🟡 `[important]` — Should fix, discuss if disagree
- 🟢 `[nit]` — Nice to have, not blocking
- 💡 `[suggestion]` — Alternative approach to consider
- 📚 `[learning]` — Educational comment, no action needed
- 🎉 `[praise]` — Good work, keep it up!

## Stack-Specific Guides

Skill-internal reference guides cover the language-agnostic parts. When the project doc and a skill guide disagree, the project doc wins — it reflects current repo conventions.

| Area                                       | Primary reference (project)                              | Skill support                                                          |
| ------------------------------------------ | -------------------------------------------------------- | ---------------------------------------------------------------------- |
| **React** components / hooks              | `_specs/spec-ui/` (loaded by `/ui` skill)                | [TypeScript Guide](reference/typescript.md)                            |
| **NestJS** controllers / services / guards | —                                                        | [TypeScript Guide](reference/typescript.md)                            |
| **Tailwind / styling**                     | `_specs/spec-ui/spec-ui-tokens.md`                       | — (project uses Tailwind v4 utilities + design tokens, not raw CSS)    |
| **TypeScript** language patterns           | —                                                        | [TypeScript Guide](reference/typescript.md)                            |
| **Security / auth**                        | —                                                        | [Security Review Guide](reference/security-review-guide.md)            |
| **Database / ORM**                         | —                                                        | [Common Bugs Checklist](reference/common-bugs-checklist.md) § Database |
| **Performance**                            | —                                                        | [Performance Review Guide](reference/performance-review-guide.md)      |
| **Architecture**                           | —                                                        | [Architecture Review Guide](reference/architecture-review-guide.md)    |
| **Best practices**                         | —                                                        | [Code Review Best Practices](reference/code-review-best-practices.md)  |

## Dependency Discipline

Part of code review is dependency review.

**Before adding any dependency:**

1. Does the existing stack solve this? (Often it does.)
2. How large is the dependency? (Check bundle impact.)
3. Is it actively maintained? (Check last commit, open issues.)
4. Does it have known vulnerabilities? (`npm audit`)
5. What's the license? (Must be compatible with the project.)

**Rule:** Prefer standard library and existing utilities over new dependencies. Every dependency is a liability.

## Common Rationalizations

| Rationalization                      | Reality                                                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| "It works, that's good enough"       | Working code that's unreadable, insecure, or architecturally wrong creates debt that compounds.                           |
| "I wrote it, so I know it's correct" | Authors are blind to their own assumptions. Every change benefits from another set of eyes.                               |
| "We'll clean it up later"            | Later never comes. The review is the quality gate — use it. Require cleanup before merge, not after.                      |
| "AI-generated code is probably fine" | AI code needs more scrutiny, not less. It's confident and plausible, even when wrong.                                     |
| "The tests pass, so it's good"       | Tests are necessary but not sufficient. They don't catch architecture problems, security issues, or readability concerns. |

## Red Flags

- PRs merged without any review
- Review that only checks if tests pass (ignoring other axes)
- "LGTM" without evidence of actual review
- Security-sensitive changes without security-focused review
- Large PRs that are "too big to review properly" (split them)
- No regression tests with bug fix PRs
- Review comments without severity labels — makes it unclear what's required vs optional
- Accepting "I'll fix it later" — it never happens

## Additional Resources

- [Architecture Review Guide](reference/architecture-review-guide.md) — SOLID, anti-patterns, coupling/cohesion
- [Performance Review Guide](reference/performance-review-guide.md) — Web Vitals, N+1, complexity (React/Node oriented)
- [Common Bugs Checklist](reference/common-bugs-checklist.md) — universal + TypeScript/JS + database + API + testing
- [Security Review Guide](reference/security-review-guide.md) — authn/authz, input validation, secrets, headers
- [Code Review Best Practices](reference/code-review-best-practices.md) — review depth levels, communication, prioritization
- [PR Review Template](assets/pr-review-template.md) — comment template
- [Review Checklist](assets/review-checklist.md) — quick reference checklist
