# Plan Authoring — Interview Before Writing

> Merge this into your repo's private `CLAUDE.local.md`. Everything in `CLAUDE.md` still applies;
> this adds an authoring discipline for *how* a plan gets created. Optional but recommended — it's
> where most plan-time misalignment gets caught before a single line is written.

## When it fires

Any time you ask the agent to create a new plan from a chat prompt — milestone or non-trivial
bugfix, whether triggered via `/agent-planning create`, the Skill tool, or natural language
("let's plan X", "write a plan for Y"). Does **not** fire on: trivial edits, or when you say
"skip the interview" / "no interview" / "just write the plan".

## The interview, step by step

Before writing any plan file, run this loop:

1. **State a one-sentence hypothesis with a confidence number.** Example:
   `HYPOTHESIS: You want a list page that mirrors the existing customers page but scoped to
   archived rows. CONFIDENCE: ~40%.` Be honest about the number — if you can't predict the user's
   reactions to the next three questions you'd ask, the number is too high.

2. **Propose the common features a repo like this usually needs for this kind of work,** *before*
   asking generic clarifying questions. Draw from the actual repo conventions (recent completed
   plans, the relevant best-practices docs, the matching domain skill). Pick the 4–8 most likely
   to apply — don't fabricate features the repo doesn't use, and don't dump all of them at once.
   Typical starting points by work type:
   - **New entity/table** — soft-delete, audit fields (`createdBy/At`, `updatedBy/At`),
     authorization gate, archive vs hard-delete, list filters.
   - **New API endpoint** — auth/role gate, DTO location, validation strategy, response shape.
   - **New list/table page** — inline filters vs drawer, active/archived toggle, bulk actions,
     default sort, view modes.
   - **Schema change** — soft-delete/audit fields, indexes, backfill migration, downstream impact.
   - **New UI component** — variants, story/example, theme tokens, accessibility.
   - **Auth work** — role requirements, public vs private routes, token claims, post-login redirect.

3. **Ask using one focused round at a time** (e.g. `AskUserQuestion`). The question is the
   question; your recommended answer is the option labeled `(Recommended)` and listed first. Up to
   4 options per question, up to 4 questions per round. If you'd need more than 4 questions, split
   into two rounds and wait for the first batch's answers before composing the second.

4. **Listen for "want vs. should-want."** If the user answers with best-practice talk ("make it
   scalable", "the standard approach", "whatever's clean"), probe once: *"If you didn't have to
   justify this to anyone, what would you actually want?"* That one question often resolves more
   than the previous five.

5. **Restate intent in 5–8 lines before writing the file.** Format:

   ```
   Here's what I'll write the plan for:
   - Outcome:      <one line>
   - Why now:      <one line>
   - Success:      <one line>
   - Constraint:   <one line>
   - Out of scope: <one line>
   - Common features included: <bulleted from step 2 answers>
   ```

   "Out of scope" is non-negotiable — half of plan-time misalignment is silent disagreement about
   non-goals.

6. **Get an explicit yes.** "Sounds good" / "whatever you think" / silence are not yes. If the
   user delegates ("up to you"), re-ask with two concrete options framed as a choice. Only after
   an explicit yes does the agent write the plan file to `_docs/plans/`.

## Stop condition

Stop interviewing when you can predict the user's reaction to the next three questions you would
ask. That's the bar. If you've gone three rounds and confidence isn't visibly rising, stop and say
so — something foundational is off, not "ask more questions".

## Anti-patterns

- Asking three open-ended questions in one message instead of one structured round with options.
- Listing common-feature suggestions but not committing to a recommendation for each (the
  "(Recommended)" tag is mandatory — leading is the point).
- Accepting "whatever you think" as terminal.
- Writing the plan file before the explicit-yes restate.
- Skipping the "Out of scope" line.
