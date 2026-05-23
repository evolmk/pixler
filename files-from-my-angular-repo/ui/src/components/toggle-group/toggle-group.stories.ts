// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { ToggleGroupComponent, ToggleGroupItemComponent } from './toggle-group.component';

const ALL = [ToggleGroupComponent, ToggleGroupItemComponent];

const ALIGN_LEFT = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></svg>`;
const ALIGN_CENTER = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="17" x2="7" y1="12" y2="12"/><line x1="19" x2="5" y1="18" y2="18"/></svg>`;
const ALIGN_RIGHT = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="21" x2="9" y1="12" y2="12"/><line x1="21" x2="7" y1="18" y2="18"/></svg>`;

const meta: Meta<ToggleGroupComponent> = {
  title: 'Forms/ToggleGroup',
  component: ToggleGroupComponent,
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'radio', options: ['single', 'multiple'] },
    size: { control: 'radio', options: ['sm', 'default', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<ToggleGroupComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Mode: Single</p>
          <ui-toggle-group mode="single" value="center">
            <ui-toggle-group-item value="left">${ALIGN_LEFT}</ui-toggle-group-item>
            <ui-toggle-group-item value="center">${ALIGN_CENTER}</ui-toggle-group-item>
            <ui-toggle-group-item value="right">${ALIGN_RIGHT}</ui-toggle-group-item>
          </ui-toggle-group>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Mode: Multiple</p>
          <ui-toggle-group mode="multiple">
            <ui-toggle-group-item value="bold">B</ui-toggle-group-item>
            <ui-toggle-group-item value="italic">I</ui-toggle-group-item>
            <ui-toggle-group-item value="underline">U</ui-toggle-group-item>
          </ui-toggle-group>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3">
              <span class="text-sm w-20">sm</span>
              <ui-toggle-group mode="single" size="sm" value="a">
                <ui-toggle-group-item value="a">A</ui-toggle-group-item>
                <ui-toggle-group-item value="b">B</ui-toggle-group-item>
                <ui-toggle-group-item value="c">C</ui-toggle-group-item>
              </ui-toggle-group>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm w-20">default</span>
              <ui-toggle-group mode="single" size="default" value="a">
                <ui-toggle-group-item value="a">A</ui-toggle-group-item>
                <ui-toggle-group-item value="b">B</ui-toggle-group-item>
                <ui-toggle-group-item value="c">C</ui-toggle-group-item>
              </ui-toggle-group>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm w-20">lg</span>
              <ui-toggle-group mode="single" size="lg" value="a">
                <ui-toggle-group-item value="a">A</ui-toggle-group-item>
                <ui-toggle-group-item value="b">B</ui-toggle-group-item>
                <ui-toggle-group-item value="c">C</ui-toggle-group-item>
              </ui-toggle-group>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

// ── Single ────────────────────────────────────────────────────────────────────

export const Single: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-toggle-group mode="single" value="center">
        <ui-toggle-group-item value="left">${ALIGN_LEFT}</ui-toggle-group-item>
        <ui-toggle-group-item value="center">${ALIGN_CENTER}</ui-toggle-group-item>
        <ui-toggle-group-item value="right">${ALIGN_RIGHT}</ui-toggle-group-item>
      </ui-toggle-group>
    `,
  }),
};

// ── Multiple ──────────────────────────────────────────────────────────────────

export const Multiple: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-toggle-group mode="multiple">
        <ui-toggle-group-item value="bold">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 12a4 4 0 0 0 0-8H6v8"/><path d="M15 20a4 4 0 0 0 0-8H6v8Z"/></svg>
        </ui-toggle-group-item>
        <ui-toggle-group-item value="italic">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>
        </ui-toggle-group-item>
        <ui-toggle-group-item value="underline">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/></svg>
        </ui-toggle-group-item>
      </ui-toggle-group>
    `,
  }),
};

// ── Text Labels ───────────────────────────────────────────────────────────────

export const TextLabels: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-toggle-group mode="single" value="month">
        <ui-toggle-group-item value="day">Day</ui-toggle-group-item>
        <ui-toggle-group-item value="week">Week</ui-toggle-group-item>
        <ui-toggle-group-item value="month">Month</ui-toggle-group-item>
        <ui-toggle-group-item value="year">Year</ui-toggle-group-item>
      </ui-toggle-group>
    `,
  }),
};

// ── Disabled ──────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-toggle-group mode="single" value="list" [disabled]="true">
        <ui-toggle-group-item value="list">List</ui-toggle-group-item>
        <ui-toggle-group-item value="grid">Grid</ui-toggle-group-item>
        <ui-toggle-group-item value="table">Table</ui-toggle-group-item>
      </ui-toggle-group>
    `,
  }),
};
