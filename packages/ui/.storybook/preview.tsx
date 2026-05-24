import type { Preview, Decorator } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import { addons } from 'storybook/preview-api';
import '@pixler/ui-styles/src/css/globals.css';

const COLOR_SCHEMES = [
  'green', 'neutral', 'slate', 'zinc', 'stone', 'gray',
  'rose', 'blue', 'greenog', 'orange', 'violet', 'nord-ice',
];

const applyColorScheme = (scheme: string) => {
  if (scheme === 'green') {
    document.documentElement.removeAttribute('data-color-scheme');
  } else {
    document.documentElement.setAttribute('data-color-scheme', scheme);
  }
};

try {
  const channel = addons.getChannel();
  channel.on('globalsUpdated', ({ globals }: { globals: Record<string, string> }) => {
    applyColorScheme(globals['colorScheme'] ?? 'green');
  });
} catch {
  // channel not yet initialised during SSR/build
}

const colorSchemeDecorator: Decorator = (Story, context) => {
  applyColorScheme(context.globals['colorScheme'] ?? 'green');
  const isDark = context.globals['theme'] === 'Dark';
  document.documentElement.classList.toggle('dark', isDark);
  return <Story />;
};

const preview: Preview = {
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
        const DEMO_ORDER = ['Showcase', 'Style Guide', 'Design', 'Design.md', 'Shadcn-case'];
        const GROUP_ORDER = ['Demos', 'Components', 'Hooks'];

        const aGroup = a.title.split('/')[0];
        const bGroup = b.title.split('/')[0];

        if (aGroup !== bGroup) {
          const ai = GROUP_ORDER.indexOf(aGroup);
          const bi = GROUP_ORDER.indexOf(bGroup);
          return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
        }

        if (aGroup === 'Demos') {
          const aName = a.title.split('/').pop() ?? '';
          const bName = b.title.split('/').pop() ?? '';
          const ai = DEMO_ORDER.indexOf(aName);
          const bi = DEMO_ORDER.indexOf(bName);
          return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
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
      description: 'Active color scheme for all stories',
      toolbar: {
        icon: 'paintbrush',
        items: COLOR_SCHEMES.map((v) => ({ value: v, title: v })),
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: { Light: '', Dark: 'dark' },
      defaultTheme: 'Light',
    }),
    colorSchemeDecorator,
  ],
};

export default preview;
