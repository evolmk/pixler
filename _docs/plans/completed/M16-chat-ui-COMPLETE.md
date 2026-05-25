# M16 — Chat UI (`assistant-ui` over the same agent PTY)

**Status:** ✅ COMPLETE
**Modified:** 2026-05-25
**Current Status:** All 3 sprints complete — MessagesModule + PTY bridge, ChatPane with streaming markdown, Composer with @file / /command / attachments / gate approval.

---

## Goal

Implement SPEC §4.5 + §8.5: a polished chat pane built on `assistant-ui` primitives (Thread,
Message, Composer, ActionBar, ThreadList) that renders streaming agent output as messages. Same
underlying agent process as Terminal mode — different UI.

## Depends on

- M06 (right pane / mode switch)
- M09 (PTY infra — chat reads from the same stream)
- M13 (orchestrator drives the agent)

## Acceptance

- Starting a workspace in Chat mode shows the planner's output as streaming chat messages with
  markdown rendering, not raw ANSI.
- Switching to Terminal mode and back preserves the conversation.
- `@file ./src/auth/foo.ts` typeahead works, the file path embeds into the message, the agent
  receives it.
- Slash commands dispatch correctly.
- Theme change retints code blocks and chat surface.
- `pnpm -w typecheck` clean.

## Out of scope

- Chat history search across workspaces — single-workspace search only in v1.
- Voice input.
- Threading inside a workspace — flat history in v1.

## Files (expected surface)

```
apps/api/src/db/migrations/0007_messages.sql
apps/api/src/messages/messages.module.ts
apps/api/src/messages/messages.service.ts
apps/api/src/messages/messages.controller.ts
apps/api/src/messages/pty-bridge.service.ts
packages/shared-types/src/messages.ts
apps/web/src/components/ChatPane.tsx
apps/web/src/components/Composer.tsx
apps/web/src/components/FileMentionPicker.tsx
apps/web/src/components/SlashCommandPicker.tsx
apps/web/src/components/AttachmentPicker.tsx
apps/web/src/lib/shiki.ts
apps/web/src/hooks/useMessages.ts
apps/web/package.json   (add @assistant-ui/react, shiki)
```

---

## Sprint 1 — DB + MessagesModule + PTY bridge

**Status:** ✅ complete
**Goal:** Server persists chat history per workspace; PTY output is parsed into message chunks
and emitted.

**Tasks:**

- [ ] `0007_messages.sql` migration.
- [ ] `MessagesModule` + `MessagesService` + `MessagesController`.
- [ ] `GET /api/workspaces/:id/messages?cursor=&limit=`,
  `POST /api/workspaces/:id/messages` (sends as stdin to agent PTY),
  `DELETE /api/workspaces/:id/messages` (with confirmation).
- [ ] `pty-bridge.service.ts` — streaming parser handles ANSI stripping, fences, attachments;
  each chunk persisted + emitted as `message.appended` / `message.streaming`.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/api test messages` — bridge a mock PTY stream, assert chunks persisted correctly.

---

## Sprint 2 — ChatPane with assistant-ui + Shiki + markdown rendering

**Status:** ✅ complete
**Goal:** Streaming agent output renders as proper chat messages with syntax-highlighted code.

**Tasks:**

- [ ] Add `@assistant-ui/react` + `shiki` to `apps/web/package.json`.
- [ ] `ChatPane.tsx` — built on Thread / Message / ActionBar primitives; streaming auto-scroll;
  markdown rendering; unread badge + jump-to-next-unread.
- [ ] `lib/shiki.ts` — theme synced with active Pixler theme.
- [ ] `hooks/useMessages.ts`.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm --filter @pixler/web build` + manual: stream agent output, observe formatted chat.

---

## Sprint 3 — Composer features + slash commands + attachments + mode switch

**Status:** ✅ complete
**Goal:** Composer is fully functional: `@file`/`@folder` typeahead, attachment uploader, slash
commands, thinking/plan-mode toggles, Stop button, image preview.

**Tasks:**

- [ ] `Composer.tsx` with all controls wired.
- [ ] `FileMentionPicker.tsx` — typeahead from `git ls-files`.
- [ ] `SlashCommandPicker.tsx` — `/plan`, `/review`, `/test`, `/commit`, `/rebase`,
  `/resolve-conflicts`; each maps to an orchestrator action or agent command.
- [ ] `AttachmentPicker.tsx` — screenshots/logs/PDFs/.md to per-workspace `attachments/` dir.
- [ ] Thinking-mode + plan-mode toggles drive `--thinking` / `--permission-mode plan` flags.
- [ ] Stop button calls `POST /api/workspaces/:id/interrupt`.
- [ ] Right-pane mode switch: Terminal ↔ Chat does NOT respawn agent (same PTY, different UI).
- [ ] Approve / Reject buttons from M13 sit above composer when relevant.
- [ ] Image attachments → click opens fullscreen image file tab.
- [ ] Per-workspace message search.

**Files Created/Modified:**

- _none yet_

**Issues Encountered:**

- _none yet_

**Verify:** `pnpm -w typecheck && pnpm --filter @pixler/web build` + manual: @file typeahead, slash command dispatch, image preview.

---

## Prompt that created this plan

_(Predates merged template; preserved as historical record. Plan re-shaped into sprints on 2026-05-24.)_
