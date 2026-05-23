import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { addons } from 'storybook/preview-api';
import { withThemeByClassName } from '@storybook/addon-themes';

/**
 * Applies the `data-color-scheme` attribute to the preview document root,
 * driven by the colorScheme toolbar global. The dark/light class is handled
 * entirely by `withThemeByClassName` from @storybook/addon-themes.
 */
const applyColorScheme = (colorScheme: string) => {
  document.documentElement.setAttribute('data-color-scheme', colorScheme);
};

try {
  const channel = addons.getChannel();
  channel.on('globalsUpdated', ({ globals }: any) => {
    applyColorScheme(globals?.['colorScheme'] ?? 'neutral');
  });
} catch {
  /* channel not yet initialised during SSR/build */
}

// Inject dark-mode overrides for Storybook docs wrapper elements.
// Uses hardcoded neutral grays so the Storybook chrome stays black & white
// regardless of the active color scheme.
const SB_DARK_BG = '#1a1a1a';
const SB_DARK_SURFACE = '#242424';
const SB_DARK_BORDER = 'rgba(255,255,255,0.18)';
const SB_DARK_TEXT = '#e0e0e0';
const SB_DARK_MUTED = '#999';
const SB_DARK_INPUT = '#2a2a2a';

const darkDocsStyle = document.createElement('style');
darkDocsStyle.textContent = `
  /* ── Page-level wrappers ──────────────────────────────────────────── */
  .dark .sb-wrapper,
  .dark .sbdocs-wrapper,
  .dark .sbdocs-wrapper[class*="css-"],
  .dark .sbdocs[class*="css-"] {
    background-color: ${SB_DARK_BG} !important;
    background: ${SB_DARK_BG} !important;
    color: ${SB_DARK_TEXT} !important;
  }

  /* ── Preview box: elevated surface for visual lift ──────────────── */
  .dark .sb-previewBlock {
    background-color: ${SB_DARK_SURFACE} !important;
    background: ${SB_DARK_SURFACE} !important;
    border: 1px solid ${SB_DARK_BORDER} !important;
    border-radius: 0.5rem !important;
    color: ${SB_DARK_TEXT} !important;
  }
  .dark .sb-previewBlock_header {
    background-color: ${SB_DARK_SURFACE} !important;
    border-color: ${SB_DARK_BORDER} !important;
  }
  .dark .sb-previewBlock_icon {
    background-color: ${SB_DARK_SURFACE} !important;
  }
  .dark .sb-unstyled {
    background-color: transparent !important;
    color: inherit !important;
  }
  .dark .docs-story,
  .dark .docs-story > div,
  .dark [class*="css-"].docs-story {
    background-color: transparent !important;
  }

  /* ── "Show code" button bar ───────────────────────────────────────── */
  .dark .docblock-code-toggle {
    background-color: ${SB_DARK_SURFACE} !important;
    color: ${SB_DARK_MUTED} !important;
    border: 1px solid ${SB_DARK_BORDER} !important;
    border-radius: 0.375rem !important;
  }
  .dark .docblock-code-toggle:hover {
    color: ${SB_DARK_TEXT} !important;
  }
  .dark div:has(> .docblock-code-toggle) {
    background-color: transparent !important;
  }

  /* ── Docs page text ─────────────────────────────────────────────────── */
  .dark h1, .dark h2, .dark h3 {
    color: ${SB_DARK_TEXT} !important;
    border-color: ${SB_DARK_BORDER} !important;
  }
  .dark .sb-wrapper p,
  .dark .sb-wrapper li,
  .dark .sb-wrapper label {
    color: ${SB_DARK_MUTED} !important;
  }

  /* ── Controls / args table ──────────────────────────────────────────── */
  .dark .sb-argstableBlock,
  .dark table {
    background-color: ${SB_DARK_SURFACE} !important;
    border: 1px solid ${SB_DARK_BORDER} !important;
    border-radius: 0.5rem !important;
    overflow: hidden !important;
  }
  .dark .sb-argstableBlock-head,
  .dark thead {
    background-color: ${SB_DARK_BG} !important;
  }
  .dark .sb-argstableBlock-head th,
  .dark thead th {
    background-color: ${SB_DARK_BG} !important;
    color: ${SB_DARK_TEXT} !important;
    border-color: ${SB_DARK_BORDER} !important;
    font-weight: 600 !important;
  }
  .dark .sb-argstableBlock-body tr,
  .dark tbody tr {
    background-color: ${SB_DARK_SURFACE} !important;
    border-color: ${SB_DARK_BORDER} !important;
  }
  .dark .sb-argstableBlock-body td,
  .dark tbody td {
    background-color: transparent !important;
    color: ${SB_DARK_TEXT} !important;
    border-color: ${SB_DARK_BORDER} !important;
  }
  /* Force ALL text inside table visible */
  .dark .sb-argstableBlock td *,
  .dark .sb-argstableBlock th *,
  .dark table td *,
  .dark table th * {
    color: ${SB_DARK_TEXT} !important;
  }
  .dark table td button,
  .dark table td input,
  .dark table td select,
  .dark table td textarea {
    background-color: ${SB_DARK_INPUT} !important;
    color: ${SB_DARK_TEXT} !important;
    border: 1px solid ${SB_DARK_BORDER} !important;
  }
  .dark .sb-argstableBlock-code {
    background-color: ${SB_DARK_INPUT} !important;
    color: ${SB_DARK_TEXT} !important;
    border-radius: 0.25rem !important;
    padding: 0.125rem 0.375rem !important;
  }

  /* ── Kill white backgrounds from Emotion wrappers ───────────────────── */
  .dark .sbdocs-preview[class*="css-"],
  .dark .sbdocs-preview [class*="css-"],
  .dark .docs-story[class*="css-"],
  .dark div[class*="css-"]:has(> .docblock-code-toggle),
  .dark .sb-nopreview[class*="css-"],
  .dark .sb-nopreview_main,
  .dark .sb-errordisplay[class*="css-"],
  .dark .sb-errordisplay_main {
    background-color: transparent !important;
    color: ${SB_DARK_TEXT} !important;
  }
`;
document.head.appendChild(darkDocsStyle);

const colorSchemeDecorator = (story: any, context: any) => {
  applyColorScheme(context.globals?.['colorScheme'] ?? 'neutral');

  // Sync dark class to html + body so docs page background follows theme
  const isDark = context.globals?.['theme'] === 'Dark';
  document.documentElement.classList.toggle('dark', isDark);
  document.body.style.backgroundColor = isDark ? SB_DARK_BG : '';
  document.body.style.color = isDark ? SB_DARK_TEXT : '';

  return story();
};

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    options: {
      storySort: (a, b) => {
        const GROUP_ORDER = [
          'Demos',
          'Components',
          'Display',
          'Feedback',
          'Forms',
          'Layout',
          'Navigation',
          'Overlay',
          'Services',
        ];
        const aGroup = a.title.split('/')[0];
        const bGroup = b.title.split('/')[0];
        const aIdx = GROUP_ORDER.indexOf(aGroup);
        const bIdx = GROUP_ORDER.indexOf(bGroup);

        // Different groups — sort by group order; unknown groups go to end
        if (aGroup !== bGroup) {
          const ai = aIdx === -1 ? 999 : aIdx;
          const bi = bIdx === -1 ? 999 : bIdx;
          return ai - bi;
        }

        // Same group — within Demos, enforce: Showcase first, Style Guide second
        if (aGroup === 'Demos') {
          const DEMOS_ORDER = ['Showcase', 'Style Guide'];
          const aName = a.title.split('/').pop() ?? '';
          const bName = b.title.split('/').pop() ?? '';
          const ai = DEMOS_ORDER.indexOf(aName);
          const bi = DEMOS_ORDER.indexOf(bName);
          if (ai !== -1 || bi !== -1) {
            return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
          }
        }

        return a.title.localeCompare(b.title);
      },
    },
  },
  initialGlobals: {
    colorScheme: 'green',
  },
  globalTypes: {
    colorScheme: {
      name: 'Color Scheme',
      description: 'Active Color scheme for all stories',
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        Light: '',
        Dark: 'dark',
      },
      defaultTheme: 'Light',
    }),
    colorSchemeDecorator,
    moduleMetadata({
      imports: [],
    }),
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
};

export default preview;
