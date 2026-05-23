const config = {
  stories: [
    '../src/components/**/*.stories.@(ts|tsx)',
    '../src/directives/**/*.stories.@(ts|tsx)',
    '../src/layouts/**/*.stories.@(ts|tsx)',
    '../src/features/**/*.stories.@(ts|tsx)',
    '../src/storybook-demos/**/*.stories.@(ts|tsx)',
    '../src/utils/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/angular',
    options: {
      angularBrowserTarget: 'ui:storybook-build',
      enableCompodoc: false,
    },
  },
  docs: {},
  typescript: {
    check: false,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webpackFinal: (config: any): any => {
    // Normalize NODE_ENV across all DefinePlugin instances to prevent
    // 'Conflicting values for process.env.NODE_ENV' from Angular + Storybook each injecting it.
    const nodeEnvValue = JSON.stringify(process.env['NODE_ENV'] ?? 'development');
    for (const plugin of config.plugins ?? []) {
      if (plugin?.constructor?.name === 'DefinePlugin') {
        const definitions: Record<string, unknown> | undefined = plugin.definitions;
        if (definitions) {
          definitions['process.env.NODE_ENV'] = nodeEnvValue;
        }
      }
    }
    return config;
  },
};

export default config;
