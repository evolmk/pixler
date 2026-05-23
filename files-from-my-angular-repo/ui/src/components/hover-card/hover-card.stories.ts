// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  HoverCardComponent,
  HoverCardContentComponent,
  HoverCardTriggerDirective,
} from './hover-card.component';
import { AvatarComponent, AvatarFallbackComponent } from '../avatar/avatar.component';
import { BadgeComponent } from '../badge/badge.component';

const ALL = [HoverCardComponent, HoverCardContentComponent, HoverCardTriggerDirective];

const meta: Meta<HoverCardComponent> = {
  title: 'Overlay/HoverCard',
  component: HoverCardComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { height: '280px' } },
  },
};
export default meta;
type Story = StoryObj<HoverCardComponent>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-hover-card>
        <a class="text-sm font-medium underline cursor-pointer" uiHoverCardTrigger>@lazarcapper</a>
        <ui-hover-card-content>
          <div class="space-y-2">
            <h4 class="text-sm font-semibold">Lazar Technologies</h4>
            <p class="text-xs text-muted-foreground">Manufacturing precision bottle capping machinery since 1987.</p>
            <p class="text-xs text-muted-foreground">Joined December 1987</p>
          </div>
        </ui-hover-card-content>
      </ui-hover-card>
    `,
  }),
};

// ── With Avatar ───────────────────────────────────────────────────────────────

export const WithAvatar: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, AvatarComponent, AvatarFallbackComponent, BadgeComponent] },
    template: `
      <ui-hover-card>
        <a class="text-sm font-medium underline cursor-pointer" uiHoverCardTrigger>John Doe</a>
        <ui-hover-card-content>
          <div class="flex items-center gap-3">
            <ui-avatar size="lg">
              <ui-avatar-fallback>JD</ui-avatar-fallback>
            </ui-avatar>
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <h4 class="text-sm font-semibold">John Doe</h4>
                <ui-badge variant="success" shape="pill" class="text-xs">Admin</ui-badge>
              </div>
              <p class="text-xs text-muted-foreground">john@lazarcapper.com</p>
              <p class="text-xs text-muted-foreground">Member since Jan 2024</p>
            </div>
          </div>
        </ui-hover-card-content>
      </ui-hover-card>
    `,
  }),
};
