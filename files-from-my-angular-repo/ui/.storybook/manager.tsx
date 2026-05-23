/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck — Bundled by Storybook's manager webpack (not tsc). React and
// storybook/manager-api are resolved by Storybook's own bundler at dev/build time.
import React from 'react';
import { addons, types, useGlobals } from 'storybook/manager-api';

const ADDON_ID = 'lazar/theme-toggle';
const SCHEME_TOOL_ID = `${ADDON_ID}/color-scheme`;
const DARK_SYNC_ID = `${ADDON_ID}/dark-sync`;

// ── Dark manager CSS ─────────────────────────────────────────────────────────
// Overrides Storybook's manager chrome (sidebar, toolbar, panels) when dark.
const DARK_MANAGER_CSS = `
  html[data-manager-theme="dark"] {
    color-scheme: dark;
  }
  [data-manager-theme="dark"] body,
  [data-manager-theme="dark"] #storybook-explorer-menu,
  [data-manager-theme="dark"] [role="main"] {
    background-color: #1a1a1a !important;
    color: #c9cdcf !important;
  }
  [data-manager-theme="dark"] nav,
  [data-manager-theme="dark"] aside {
    background-color: #1a1a1a !important;
  }
  [data-manager-theme="dark"] hr,
  [data-manager-theme="dark"] [role="separator"] {
    border-color: rgba(255,255,255,0.18) !important;
  }
  [data-manager-theme="dark"] button,
  [data-manager-theme="dark"] a {
    color: #c9cdcf !important;
  }
  [data-manager-theme="dark"] button:hover,
  [data-manager-theme="dark"] a:hover {
    color: #fff !important;
  }
  [data-manager-theme="dark"] input,
  [data-manager-theme="dark"] select,
  [data-manager-theme="dark"] textarea {
    background-color: #222 !important;
    color: #c9cdcf !important;
    border-color: rgba(255,255,255,0.15) !important;
  }
  [data-manager-theme="dark"] [class*="sidebar-header"],
  [data-manager-theme="dark"] header {
    background-color: #1a1a1a !important;
    border-color: rgba(255,255,255,0.18) !important;
  }
  [data-manager-theme="dark"] [data-nodetype] svg {
    color: #798186 !important;
  }
  [data-manager-theme="dark"] [data-selected] {
    color: #fff !important;
  }
  [data-manager-theme="dark"] [data-selected] svg {
    color: #fff !important;
  }
`;

function DarkManagerSyncer() {
  const [globals] = useGlobals();
  const isDark = globals['theme'] === 'Dark';

  React.useEffect(() => {
    document.documentElement.dataset.managerTheme = isDark ? 'dark' : 'light';

    let el = document.getElementById('sb-dark-manager');
    if (isDark && !el) {
      el = document.createElement('style');
      el.id = 'sb-dark-manager';
      el.textContent = DARK_MANAGER_CSS;
      document.head.appendChild(el);
    } else if (!isDark && el) {
      el.remove();
    }
  }, [isDark]);

  return null;
}

const COLOR_SCHEMES = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'slate', label: 'Slate' },
  { value: 'zinc', label: 'Zinc' },
  { value: 'stone', label: 'Stone' },
  { value: 'gray', label: 'Gray' },
  { value: 'rose', label: 'Rose' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'orange', label: 'Orange' },
  { value: 'violet', label: 'Violet' },
  { value: 'nord-ice', label: 'Nord Ice' },
];

function ColorSchemeSelect() {
  const [globals, updateGlobals] = useGlobals();
  const scheme = globals['colorScheme'] ?? 'neutral';

  return (
    <select
      value={scheme}
      onChange={(e) => updateGlobals({ colorScheme: e.target.value })}
      title="Color scheme"
      style={{
        height: '26px',
        padding: '0 6px',
        borderRadius: '6px',
        border: '1px solid rgba(0,0,0,0.15)',
        backgroundColor: 'transparent',
        fontSize: '12px',
        fontFamily: 'inherit',
        cursor: 'pointer',
        outline: 'none',
        margin: '0 4px',
        boxSizing: 'border-box',
      }}
    >
      {COLOR_SCHEMES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}

// ── Section filter ────────────────────────────────────────────────────────────
const SECTIONS = [
  { value: 'all', label: 'All Sections' },
  { value: 'Demos', label: 'Demos' },
  { value: 'Components', label: 'Components' },
  { value: 'Display', label: 'Display' },
  { value: 'Feedback', label: 'Feedback' },
  { value: 'Forms', label: 'Forms' },
  { value: 'Layout', label: 'Layout' },
  { value: 'Navigation', label: 'Navigation' },
  { value: 'Overlay', label: 'Overlay' },
  { value: 'Directives', label: 'Directives' },
  { value: 'Features', label: 'Features' },
  { value: 'Services', label: 'Services' },
];

const STORAGE_KEY = 'sb-section-filter';
const getSection = () => localStorage.getItem(STORAGE_KEY) || 'all';

// Inject section dropdown and auto-reset on search
function injectSectionSwitcher() {
  let injected = false;

  const observer = new MutationObserver(() => {
    if (injected) return;

    // Find the search input
    const searchInput = document.querySelector('#storybook-explorer-searchfield') as HTMLInputElement | null;
    if (!searchInput) return;

    injected = true;
    observer.disconnect();

    // Level 1: .search-field, Level 2: container holding search row
    const searchField = searchInput.parentElement; // .search-field
    const searchRow = searchField?.parentElement;   // row container
    if (!searchRow) return;

    // Force the row container into a column layout
    searchRow.style.display = 'flex';
    searchRow.style.flexDirection = 'column';
    searchRow.style.gap = '8px';

    // Create dropdown
    const select = document.createElement('select');
    select.id = 'sb-section-select';
    select.style.cssText = `
      height: 32px;
      padding: 0 10px;
      border-radius: 6px;
      border: 1px solid rgba(255,255,255,0.12);
      background-color: rgba(255,255,255,0.06);
      color: inherit;
      font-size: 13px;
      font-family: inherit;
      font-weight: 600;
      cursor: pointer;
      outline: none;
      flex-shrink: 0;
    `;

    SECTIONS.forEach((s) => {
      const opt = document.createElement('option');
      opt.value = s.value;
      opt.textContent = s.label;
      if (s.value === getSection()) opt.selected = true;
      select.appendChild(opt);
    });

    select.addEventListener('change', (e) => {
      localStorage.setItem(STORAGE_KEY, (e.target as HTMLSelectElement).value);
      location.reload();
    });

    // Insert dropdown as first child of the row container
    searchRow.insertBefore(select, searchRow.firstChild);

    // Auto-reset filter to "all" when user focuses search
    if (getSection() !== 'all') {
      searchInput.addEventListener('focus', () => {
        if (getSection() !== 'all') {
          localStorage.setItem(STORAGE_KEY, 'all');
          select.value = 'all';
          location.reload();
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

injectSectionSwitcher();

// ── Sidebar font & icon size overrides ────────────────────────────────────────
const sidebarStyle = document.createElement('style');
sidebarStyle.textContent = `
  #storybook-explorer-menu a,
  #storybook-explorer-menu button,
  #storybook-explorer-menu span {
    font-size: 12px !important;
  }
  #storybook-explorer-menu svg {
    width: 12px !important;
    height: 12px !important;
  }
`;
document.head.appendChild(sidebarStyle);

addons.setConfig({
  initialStoryId: 'demos-showcase--default',
  sidebar: {
    filters: {
      section: (item) => {
        const selected = getSection();
        if (selected === 'all') return true;
        return item.title?.startsWith(selected + '/') || item.title === selected;
      },
    },
  },
});

addons.register(ADDON_ID, () => {
  addons.add(SCHEME_TOOL_ID, {
    type: types.TOOL,
    title: 'Color Scheme',
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: () => <ColorSchemeSelect />,
  });
  addons.add(DARK_SYNC_ID, {
    type: types.TOOL,
    title: 'Dark Syncer',
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: () => <DarkManagerSyncer />,
  });
});
