// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  ResizableComponent,
  ResizablePanelComponent,
  ResizableHandleComponent,
} from './resizable.component';

const ALL = [ResizableComponent, ResizablePanelComponent, ResizableHandleComponent];

const meta: Meta<ResizableComponent> = {
  title: 'Layout/Resizable',
  component: ResizableComponent,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'radio', options: ['horizontal', 'vertical'] },
  },
};
export default meta;
type Story = StoryObj<ResizableComponent>;

// ── Horizontal ────────────────────────────────────────────────────────────────

export const Horizontal: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="h-48 rounded-lg border border-border overflow-hidden">
        <ui-resizable direction="horizontal">
          <ui-resizable-panel [size]="30" [minSize]="20">
            <div class="h-full p-4 bg-muted/30 flex flex-col">
              <p class="text-xs font-medium text-muted-foreground mb-2">Sidebar</p>
              <p class="text-xs text-muted-foreground">Drag the handle →</p>
            </div>
          </ui-resizable-panel>
          <ui-resizable-handle direction="horizontal"></ui-resizable-handle>
          <ui-resizable-panel [size]="70">
            <div class="h-full p-4 flex flex-col">
              <p class="text-xs font-medium text-muted-foreground mb-2">Main Content</p>
              <p class="text-xs text-muted-foreground">This panel grows as you resize</p>
            </div>
          </ui-resizable-panel>
        </ui-resizable>
      </div>
    `,
  }),
};

// ── Vertical ──────────────────────────────────────────────────────────────────

export const Vertical: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="h-64 w-full rounded-lg border border-border overflow-hidden">
        <ui-resizable direction="vertical">
          <ui-resizable-panel [size]="40">
            <div class="h-full p-4 bg-muted/30 flex flex-col">
              <p class="text-xs font-medium text-muted-foreground mb-2">Top Panel</p>
              <p class="text-xs text-muted-foreground">Drag the handle ↓</p>
            </div>
          </ui-resizable-panel>
          <ui-resizable-handle direction="vertical"></ui-resizable-handle>
          <ui-resizable-panel [size]="60">
            <div class="h-full p-4 flex flex-col">
              <p class="text-xs font-medium text-muted-foreground mb-2">Bottom Panel</p>
              <p class="text-xs text-muted-foreground">This panel adjusts vertically</p>
            </div>
          </ui-resizable-panel>
        </ui-resizable>
      </div>
    `,
  }),
};

// ── Three Panels ──────────────────────────────────────────────────────────────

export const ThreePanels: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="h-48 rounded-lg border border-border overflow-hidden">
        <ui-resizable direction="horizontal">
          <ui-resizable-panel [size]="20" [minSize]="15">
            <div class="h-full p-3 bg-muted/30">
              <p class="text-xs font-medium text-muted-foreground">Files</p>
            </div>
          </ui-resizable-panel>
          <ui-resizable-handle direction="horizontal"></ui-resizable-handle>
          <ui-resizable-panel [size]="55">
            <div class="h-full p-3">
              <p class="text-xs font-medium text-muted-foreground">Editor</p>
            </div>
          </ui-resizable-panel>
          <ui-resizable-handle direction="horizontal"></ui-resizable-handle>
          <ui-resizable-panel [size]="25" [minSize]="15">
            <div class="h-full p-3 bg-muted/30">
              <p class="text-xs font-medium text-muted-foreground">Preview</p>
            </div>
          </ui-resizable-panel>
        </ui-resizable>
      </div>
    `,
  }),
};
