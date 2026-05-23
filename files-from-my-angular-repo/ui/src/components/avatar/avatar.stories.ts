// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  AvatarComponent,
  AvatarImageComponent,
  AvatarFallbackComponent,
  AvatarGroupComponent,
} from './avatar.component';
import { TooltipDirective } from '../../directives/tooltip.directive';

const meta: Meta<AvatarComponent> = {
  title: 'Display/Avatar',
  component: AvatarComponent,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl'],
    },
    shape: {
      control: 'radio',
      options: ['circle', 'square'],
    },
    status: {
      control: 'select',
      options: [null, 'online', 'offline', 'busy', 'away'],
    },
  },
};
export default meta;
type Story = StoryObj<AvatarComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [AvatarComponent, AvatarFallbackComponent, AvatarGroupComponent] },
    template: `
      <div class="flex flex-col gap-6 p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes</p>
          <div class="flex items-center gap-3">
            <ui-avatar size="xs"><ui-avatar-fallback>XS</ui-avatar-fallback></ui-avatar>
            <ui-avatar size="sm"><ui-avatar-fallback>SM</ui-avatar-fallback></ui-avatar>
            <ui-avatar size="default"><ui-avatar-fallback>MD</ui-avatar-fallback></ui-avatar>
            <ui-avatar size="lg"><ui-avatar-fallback>LG</ui-avatar-fallback></ui-avatar>
            <ui-avatar size="xl"><ui-avatar-fallback>XL</ui-avatar-fallback></ui-avatar>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Shapes</p>
          <div class="flex items-center gap-3">
            <ui-avatar shape="circle"><ui-avatar-fallback>CI</ui-avatar-fallback></ui-avatar>
            <ui-avatar shape="square"><ui-avatar-fallback>SQ</ui-avatar-fallback></ui-avatar>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</p>
          <div class="flex items-center gap-3">
            <ui-avatar status="online"><ui-avatar-fallback>ON</ui-avatar-fallback></ui-avatar>
            <ui-avatar status="offline"><ui-avatar-fallback>OF</ui-avatar-fallback></ui-avatar>
            <ui-avatar status="busy"><ui-avatar-fallback>BZ</ui-avatar-fallback></ui-avatar>
            <ui-avatar status="away"><ui-avatar-fallback>AW</ui-avatar-fallback></ui-avatar>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Group</p>
          <ui-avatar-group>
            <ui-avatar><ui-avatar-fallback>A1</ui-avatar-fallback></ui-avatar>
            <ui-avatar><ui-avatar-fallback>A2</ui-avatar-fallback></ui-avatar>
            <ui-avatar><ui-avatar-fallback>A3</ui-avatar-fallback></ui-avatar>
            <ui-avatar><ui-avatar-fallback>+4</ui-avatar-fallback></ui-avatar>
          </ui-avatar-group>
        </div>
      </div>
    `,
  }),
};

// ── With Image ────────────────────────────────────────────────────────────────

export const WithImage: Story = {
  render: () => ({
    moduleMetadata: { imports: [AvatarComponent, AvatarImageComponent, AvatarFallbackComponent] },
    template: `
      <ui-avatar>
        <ui-avatar-image src="https://i.pravatar.cc/150?img=1" alt="User" />
        <ui-avatar-fallback>JD</ui-avatar-fallback>
      </ui-avatar>
    `,
  }),
};

// ── With Fallback ─────────────────────────────────────────────────────────────

export const WithFallback: Story = {
  render: () => ({
    moduleMetadata: { imports: [AvatarComponent, AvatarImageComponent, AvatarFallbackComponent] },
    template: `
      <div class="flex gap-3">
        <ui-avatar>
          <ui-avatar-image src="/broken-image.jpg" alt="Broken" />
          <ui-avatar-fallback>JD</ui-avatar-fallback>
        </ui-avatar>
        <ui-avatar>
          <ui-avatar-fallback>AU</ui-avatar-fallback>
        </ui-avatar>
      </div>
    `,
  }),
};

// ── Group ─────────────────────────────────────────────────────────────────────

export const Group: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [AvatarComponent, AvatarImageComponent, AvatarFallbackComponent, AvatarGroupComponent, TooltipDirective],
    },
    template: `
      <ui-avatar-group>
        <ui-avatar uiTooltip="Alice" uiTooltipPlacement="top" class="transition-transform hover:-translate-x-1 hover:scale-110"><ui-avatar-image src="https://i.pravatar.cc/150?img=1" alt="Alice" /><ui-avatar-fallback>A1</ui-avatar-fallback></ui-avatar>
        <ui-avatar uiTooltip="Bob" uiTooltipPlacement="top" class="transition-transform hover:-translate-x-1 hover:scale-110"><ui-avatar-image src="https://i.pravatar.cc/150?img=2" alt="Bob" /><ui-avatar-fallback>A2</ui-avatar-fallback></ui-avatar>
        <ui-avatar uiTooltip="Carol" uiTooltipPlacement="top" class="transition-transform hover:-translate-x-1 hover:scale-110"><ui-avatar-image src="https://i.pravatar.cc/150?img=3" alt="Carol" /><ui-avatar-fallback>A3</ui-avatar-fallback></ui-avatar>
        <ui-avatar uiTooltip="4 more" uiTooltipPlacement="top" class="transition-transform hover:-translate-x-1 hover:scale-110"><ui-avatar-fallback>+4</ui-avatar-fallback></ui-avatar>
      </ui-avatar-group>
    `,
  }),
};
