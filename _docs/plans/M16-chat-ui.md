# M16 — Chat UI (`assistant-ui` over the same agent PTY)

## Goal

Implement SPEC §4.5 + §8.5: a polished chat pane built on
`assistant-ui` primitives (Thread, Message, Composer, ActionBar, ThreadList) that renders streaming agent output as messages. Same underlying agent process as Terminal mode — different UI.

## Depends on

- M06 (right pane / mode switch)
- M09 (PTY infra — chat reads from the same stream)
- M13 (orchestrator drives the agent)

## Deliverables

- [ ] DB migration `0007_messages.sql`:
  `messages (id PK, workspace_id, role TEXT, content TEXT, ts, raw JSON)` — persisted chat history per workspace
- [ ] api `MessagesModule`:
    - `MessagesService` — append/list/search messages per workspace
    - `GET /api/workspaces/:id/messages?cursor=&limit=`
    - `POST /api/workspaces/:id/messages` — append a user message (sends it as stdin to the agent PTY)
    - `DELETE /api/workspaces/:id/messages` — clear (with confirmation)
    - **Bridge from PTY output → messages
      **: parse claude/codex output streams into chunks (a small streaming parser handles ANSI stripping, fences, attachments); each chunk gets persisted and emitted as
      `message.appended` / `message.streaming` events
- [ ] **Chat pane** (`apps/web/src/components/ChatPane.tsx`):
    - Built on `assistant-ui` primitives: `Thread`, `Message`, `Composer`, `ActionBar`
    - Streaming auto-scroll
    - Markdown rendering with code-block syntax highlighting via Shiki (theme synced with active Pixler theme)
    - Unread badge + jump-to-next-unread (Conductor pattern, SPEC §8.5)
    - All styling via CSS variables — picks up theme automatically
- [ ] **Composer** features:
    - `@file` and `@folder` tagging — typeahead from the workspace's git-ls-files index
    - Attach button: screenshots, logs, PDFs, .md files (uploaded to a per-workspace
      `attachments/` dir, referenced by path in the message)
    - **Slash commands** with palette: `/plan`, `/review`, `/test`, `/commit`, `/rebase`,
      `/resolve-conflicts` — each maps to an orchestrator action or an agent command
    - **Thinking mode** + **plan mode** toggles (drive the `--thinking`/
      `--permission-mode plan` flags on the next agent invocation)
    - **Stop** button (calls `POST /api/workspaces/:id/interrupt`)
- [ ] **Image attachments**: click-to-fullscreen in a new file tab
- [ ] Message search (within a workspace, M22 surfaces it via cmdk too)
- [ ] **Right-pane mode switch
  ** wired: switching from Terminal to Chat does not respawn the agent — same PTY, different UI
- [ ] Approve / Reject buttons from M13 sit above the composer when relevant

## Acceptance

- Starting a workspace in Chat mode shows the planner's output as streaming chat messages with markdown rendering, not raw ANSI.
- Switching to Terminal mode and back preserves the conversation.
- `@file ./src/auth/foo.ts` typeahead works, the file path embeds into the message, the agent receives it.
- Slash commands dispatch correctly.
- Theme change retints code blocks and chat surface.
- `pnpm -w typecheck` clean.

## Files

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

## Out of scope

- Chat history search across workspaces — single-workspace search only in v1.
- Voice input.
- Threading inside a workspace — flat history in v1.
