import type { Meta, StoryObj } from '@storybook/react';
import { useMediaQuery } from './use-media-query';

const meta: Meta = { title: 'Hooks/useMediaQuery' };
export default meta;
type Story = StoryObj;

function Demo({ query }: { query: string }) {
  const matches = useMediaQuery(query);
  return (
    <div className="rounded-md border border-border p-4 space-y-1">
      <p className="font-mono text-sm">{query}</p>
      <p className="text-sm">Matches: <span className={matches ? 'text-green-500 font-semibold' : 'text-muted-foreground'}>{String(matches)}</span></p>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <div className="space-y-3">
      <Demo query="(min-width: 640px)" />
      <Demo query="(min-width: 768px)" />
      <Demo query="(min-width: 1024px)" />
      <Demo query="(prefers-color-scheme: dark)" />
      <Demo query="(prefers-reduced-motion: reduce)" />
    </div>
  ),
};
