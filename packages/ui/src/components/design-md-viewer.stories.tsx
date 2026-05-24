import type { Meta, StoryObj } from '@storybook/react';
import { DesignMdViewer } from './design-md-viewer';
import { Badge } from './badge';

const meta: Meta<typeof DesignMdViewer> = { title: 'Components/Pixler/DesignMdViewer', component: DesignMdViewer, tags: ['autodocs'], parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj<typeof DesignMdViewer>;

export const Default: Story = {
  args: {
    tocTitle: 'On this page',
    sections: [
      {
        number: '01',
        eyebrow: 'Intro',
        title: 'Section One',
        lead: 'This is the lead paragraph for section one. It describes the purpose of this section.',
        markdown: '## Details\n\nSupporting markdown content with **bold**, _italic_, and `code` examples.',
      },
      {
        number: '02',
        eyebrow: 'Examples',
        title: 'Section Two',
        lead: 'This section has live React examples rendered inline alongside the description.',
        examples: (
          <div className="flex gap-2 flex-wrap">
            <Badge>Live example</Badge>
            <Badge variant="secondary">Another badge</Badge>
            <Badge variant="outline">Outline badge</Badge>
          </div>
        ),
      },
      {
        number: '03',
        eyebrow: 'Combined',
        title: 'Section Three',
        lead: 'Both markdown prose and live examples can appear in the same section.',
        markdown: 'Use `data-color-scheme` on `<html>` to switch themes.',
        examples: <div className="h-12 rounded bg-primary/10 flex items-center px-4 text-sm text-primary">Primary surface</div>,
      },
    ],
  },
};
