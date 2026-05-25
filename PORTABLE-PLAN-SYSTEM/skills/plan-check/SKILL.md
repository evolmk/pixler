---
name: plan-check
description: |
  Show the status of all plans — what's done, in-progress, and pending. Read-only; never edits or
  moves files.
  Triggers on: "check plan", "check plans", "plan status", "is <plan> done".
---

# Check Plan Status

## Instructions

1. **List active plans.** Glob `_docs/plans/*.md` (exclude `.TEMPLATE-*`). Skip
   `_docs/plans/done/` unless the user asks to see completed plans. (Some repos use a different
   completion folder name — check `_docs/plans/CLAUDE.md` if present.)
2. For each file, read just the top ~15 lines to extract: the plan name, `Status`, and the
   `Current Status` summary line.
3. **Present concisely:**

   ```
   ## Plans
   - ✅ name — current status      (COMPLETE)
   - → name — current status       (IN_PROGRESS)
   - ⏳ name — current status       (not started)
   ```

4. **If asked about a specific plan by name:** read the full file and show sprint-by-sprint
   progress with completion percentages (count `[x]` vs total tasks), then highlight the next
   pending sprint/task.
5. **If asked to show completed plans:** glob the completion folder (`_docs/plans/done/` by
   default) and list name + completion status.

## Output format

- Keep it terse — this is a status check, not a deep dive.
- Use ✅ for complete, → for in-progress, ⏳ for not started.
