#!/usr/bin/env node
'use strict';

const { readFileSync, existsSync, writeFileSync } = require('fs');
const { basename } = require('path');

// ── Auto-detect light/dark terminal ──
// Checks COLORFG (iTerm2/terminals that set it), or falls back to dark
function isLightBackground() {
  const colorfg = process.env.COLORFG;
  if (colorfg) {
    // COLORFG is "R;G;B" or a single 0-255 value — dark fg = light bg
    const parts = colorfg.split(';').map(Number);
    const avg = parts.reduce((a, b) => a + b, 0) / parts.length;
    return avg < 128;
  }
  // TERM_BACKGROUND is set by some terminal configs
  const bg = (process.env.TERM_BACKGROUND || '').toLowerCase();
  if (bg === 'light') return true;
  if (bg === 'dark') return false;
  // Default to dark background
  return false;
}

const light = isLightBackground();

// ── Color palettes ──
const RST = '\x1b[0m';

const theme = light
  ? {
      project: '\x1b[38;5;30m',    // dark teal (readable on white)
      branch: '\x1b[38;5;25m',     // dark blue
      model: '\x1b[38;5;242m',     // dark grey
      text: '\x1b[38;5;242m',      // dark grey
      sep: '\x1b[38;5;250m',       // medium grey separators
      barEmpty: '\x1b[38;5;252m',  // light grey empty blocks
      barGreen: '\x1b[38;5;65m',   // muted dark sage
      barYellow: '\x1b[38;5;136m', // dark gold
      barRed: '\x1b[38;5;124m',    // dark red
      bolt: '\x1b[38;5;172m',      // dark orange bolt
      skill: '\x1b[38;5;242m',     // dark grey
      msg: '\x1b[38;5;245m',       // medium grey
    }
  : {
      project: '\x1b[38;5;116m',   // pastel cyan
      branch: '\x1b[38;5;68m',     // denim blue
      model: '\x1b[38;5;250m',      // light grey
      text: '\x1b[38;5;250m',      // light grey
      sep: '\x1b[90m',             // dark grey separators
      barEmpty: '\x1b[38;5;238m',  // dark grey empty blocks
      barGreen: '\x1b[38;5;108m',  // muted sage
      barYellow: '\x1b[38;5;180m', // muted sand
      barRed: '\x1b[38;5;131m',    // dusty rose
      bolt: '\x1b[38;5;180m',      // sand
      skill: '\x1b[38;5;250m',      // light grey
      msg: '\x1b[90m',             // grey
    };

// ── Icons (Nerd Font) ──
const ICON_MSG = '\uf086 ';

// ── Bar builder (gradient: green → yellow → red) ──
function buildBar(pct, barWidth) {
  let bar = '';
  for (let i = 0; i < barWidth; i++) {
    const threshold = (i / barWidth) * 100;
    if (threshold >= pct) {
      bar += `${theme.barEmpty}\u2591${RST}`;
    } else {
      let color;
      if (threshold < 50) color = theme.barGreen;
      else if (threshold < 75) color = theme.barYellow;
      else color = theme.barRed;
      bar += `${color}\u2588${RST}`;
    }
  }
  return bar;
}

function main() {
  let raw = '';
  try {
    raw = readFileSync(0, 'utf8');
  } catch {
    process.exit(0);
  }

  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const S = theme.sep + '│' + RST;

  // ── Project name ──
  const cwd = input.cwd || '';
  const dir = cwd ? basename(cwd) : '?';

  // ── Git branch ──
  let branch = '';
  try {
    const { execSync } = require('child_process');
    if (cwd) {
      branch = execSync(`git -C "${cwd}" branch --show-current`, {
        encoding: 'utf8',
        timeout: 3000,
        stdio: ['pipe', 'pipe', 'pipe'],
      }).trim();
    }
  } catch {}

  // ── Model ──
  const model = input.model?.display_name || input.model?.id || '?';

  // ── Context bar ──
  const maxContext = input.context_window?.context_window_size || 200000;
  const barWidth = 10;
  let pct = input.context_window?.used_percentage || 0;
  if (pct > 100) pct = 100;

  const bar = buildBar(pct, barWidth);
  let pctColor = theme.text;
  if (pct >= 75) pctColor = theme.barRed;
  const usedTokens = Math.round((pct / 100) * maxContext);
  const tokK = Math.round(usedTokens / 1000);
  const tokStr = `${tokK}k`;
  const ctxStr = `${bar} ${pctColor}${pct}%${RST} ${theme.text}${tokStr}${RST}`;

  // ── Cost ──
  const costUsd = input.cost?.total_cost_usd || 0;
  const costStr =
    costUsd > 0 && costUsd < 0.01
      ? `$${costUsd.toFixed(4)}`
      : `$${costUsd.toFixed(2)}`;

  // ── Duration ──
  const durationMs = input.cost?.total_api_duration_ms || 0;
  let durStr;
  const totalSec = Math.floor(durationMs / 1000);
  if (totalSec < 60) {
    durStr = `${totalSec}s`;
  } else if (totalSec < 3600) {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    durStr = s > 0 ? `${m}m ${s}s` : `${m}m`;
  } else {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    durStr = m > 0 ? `${h}h ${m}m` : `${h}h`;
  }

  // ── Skills ──
  let skillSegment = '';
  try {
    const logPath = `${__dirname}/../logs/skill-log.txt`;
    if (existsSync(logPath)) {
      const lines = readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
      // Only show skills logged within the last 60 seconds
      const now = Date.now();
      const recent = lines.filter((l) => {
        const ts = l.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
        if (!ts) return false;
        return now - new Date(ts[1]).getTime() < 60000;
      });
      // Prune old entries from the log
      if (recent.length !== lines.length) {
        writeFileSync(logPath, recent.length > 0 ? recent.join('\n') + '\n' : '');
      }
      // Extract skill names (format: "2026-03-08 12:00:00 skill-name")
      const names = recent.map((l) => l.split(' ').slice(2).join(' ')).filter(Boolean);
      const unique = [...new Set(names)];
      if (unique.length > 0) {
        skillSegment = ` ${S} ${theme.bolt}\u26a1${RST} ${theme.skill}${unique.join(' \u2192 ')}${RST}`;
      }
    }
  } catch {}

  // ── Profile (derived from CLAUDE_CONFIG_DIR) ──
  let userSegment = '';
  {
    const configDir = process.env.CLAUDE_CONFIG_DIR || '';
    const dirName = configDir ? basename(configDir) : '';
    // .claude-evolmikek → evolmikek, .claude → '' (skip default)
    const profile = dirName.startsWith('.claude-') ? dirName.slice(8) : '';
    if (profile) userSegment = ` ${S} ${theme.text}${profile}${RST}`;
  }

  // ── Build line 1 ──
  let line1 = `${theme.project}${dir}${RST}`;
  line1 += userSegment;
  if (branch) line1 += ` ${S} ${theme.branch}${branch}${RST}`;
  line1 += ` ${S} ${theme.model}${model}${RST}`;
  line1 += ` ${S} ${ctxStr}`;
  line1 += ` ${S} ${theme.text}${costStr}${RST}`;
  line1 += ` ${S} ${theme.text}${durStr}${RST}`;
  line1 += skillSegment;

  process.stdout.write(line1 + '\n');

  // ── Line 2: Last user message ──
  const transcriptPath = input.transcript_path || '';
  if (transcriptPath && existsSync(transcriptPath)) {
    try {
      const transcriptRaw = readFileSync(transcriptPath, 'utf8');
      const entries = transcriptRaw
        .split('\n')
        .filter(Boolean)
        .map((line) => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      let lastUserMsg = '';
      for (let i = entries.length - 1; i >= 0; i--) {
        const e = entries[i];
        if (e.type !== 'user') continue;
        const content = e.message?.content;
        let text = '';
        if (typeof content === 'string') {
          text = content;
        } else if (Array.isArray(content)) {
          text = content
            .filter((c) => c.type === 'text')
            .map((c) => c.text)
            .join(' ');
        }
        text = text.replace(/\n/g, ' ').replace(/ {2,}/g, ' ').trim();
        if (
          text &&
          !text.startsWith('[Request interrupted') &&
          !text.startsWith('[Request cancelled')
        ) {
          lastUserMsg = text;
          break;
        }
      }

      if (lastUserMsg) {
        const maxLen = 120;
        const display =
          lastUserMsg.length > maxLen
            ? lastUserMsg.substring(0, maxLen - 3) + '...'
            : lastUserMsg;
        process.stdout.write(`${theme.msg}${ICON_MSG}${display}${RST}\n`);
      }
    } catch {}
  }
}

main();
