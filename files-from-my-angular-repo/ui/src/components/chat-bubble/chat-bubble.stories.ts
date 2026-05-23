// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import {
  ChatBubbleComponent,
  ChatBubbleAvatarComponent,
  ChatBubbleContentComponent,
  ChatBubbleTimestampComponent,
  ChatBubbleTypingComponent,
} from './chat-bubble.component';
import { AvatarComponent, AvatarFallbackComponent } from '../avatar/avatar.component';

const ALL = [
  ChatBubbleComponent,
  ChatBubbleAvatarComponent,
  ChatBubbleContentComponent,
  ChatBubbleTimestampComponent,
  ChatBubbleTypingComponent,
];

const meta: Meta<ChatBubbleComponent> = {
  title: 'Display/ChatBubble',
  component: ChatBubbleComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<ChatBubbleComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="flex flex-col gap-6 max-w-md p-6">
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Side: Start (Received)</p>
          <div class="space-y-2">
            <ui-chat-bubble side="start">
              <ui-chat-bubble-content variant="default">Default variant — accent background</ui-chat-bubble-content>
            </ui-chat-bubble>
            <ui-chat-bubble side="start">
              <ui-chat-bubble-content variant="muted">Muted variant — muted background</ui-chat-bubble-content>
            </ui-chat-bubble>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Side: End (Sent)</p>
          <div class="space-y-2">
            <ui-chat-bubble side="end">
              <ui-chat-bubble-content variant="primary">Primary variant — primary color</ui-chat-bubble-content>
            </ui-chat-bubble>
            <ui-chat-bubble side="end">
              <ui-chat-bubble-content variant="default">Default variant — accent background</ui-chat-bubble-content>
            </ui-chat-bubble>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Typing Indicator</p>
          <ui-chat-bubble side="start">
            <ui-chat-bubble-content variant="muted" [typing]="true"></ui-chat-bubble-content>
          </ui-chat-bubble>
        </div>
      </div>
    `,
  }),
};

// ── Received Message ──────────────────────────────────────────────────────────

export const ReceivedMessage: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="space-y-3 max-w-md">
        <ui-chat-bubble side="start">
          <ui-chat-bubble-content>
            Hi! I have a question about my order #4521.
          </ui-chat-bubble-content>
        </ui-chat-bubble>
      </div>
    `,
  }),
};

// ── Sent Message ──────────────────────────────────────────────────────────────

export const SentMessage: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="space-y-3 max-w-md">
        <ui-chat-bubble side="end">
          <ui-chat-bubble-content variant="primary">
            Hello! I'd be happy to help with your order. Let me pull that up for you.
          </ui-chat-bubble-content>
        </ui-chat-bubble>
      </div>
    `,
  }),
};

// ── Conversation ──────────────────────────────────────────────────────────────

export const Conversation: Story = {
  render: () => ({
    moduleMetadata: { imports: [...ALL, AvatarComponent, AvatarFallbackComponent] },
    template: `
      <div class="space-y-4 max-w-md p-4 rounded-lg border border-border">
        <ui-chat-bubble side="start">
          <ui-chat-bubble-avatar>
            <ui-avatar size="sm">
              <ui-avatar-fallback>JD</ui-avatar-fallback>
            </ui-avatar>
          </ui-chat-bubble-avatar>
          <div class="flex flex-col gap-1">
            <ui-chat-bubble-content>
              Hi! I have a question about order #4521. When will it ship?
            </ui-chat-bubble-content>
            <ui-chat-bubble-timestamp>10:42 AM</ui-chat-bubble-timestamp>
          </div>
        </ui-chat-bubble>

        <ui-chat-bubble side="end">
          <div class="flex flex-col items-end gap-1">
            <ui-chat-bubble-content variant="primary">
              Hi John! Order #4521 is scheduled to ship today. You'll receive a tracking number by email.
            </ui-chat-bubble-content>
            <ui-chat-bubble-timestamp>10:44 AM</ui-chat-bubble-timestamp>
          </div>
          <ui-chat-bubble-avatar>
            <ui-avatar size="sm">
              <ui-avatar-fallback>CS</ui-avatar-fallback>
            </ui-avatar>
          </ui-chat-bubble-avatar>
        </ui-chat-bubble>

        <ui-chat-bubble side="start">
          <ui-chat-bubble-avatar>
            <ui-avatar size="sm">
              <ui-avatar-fallback>JD</ui-avatar-fallback>
            </ui-avatar>
          </ui-chat-bubble-avatar>
          <div class="flex flex-col gap-1">
            <ui-chat-bubble-content>
              Great, thank you!
            </ui-chat-bubble-content>
            <ui-chat-bubble-timestamp>10:45 AM</ui-chat-bubble-timestamp>
          </div>
        </ui-chat-bubble>
      </div>
    `,
  }),
};

// ── Typing Indicator ──────────────────────────────────────────────────────────

export const TypingIndicator: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="space-y-3 max-w-md">
        <ui-chat-bubble side="start">
          <ui-chat-bubble-content>Can you help me with my account?</ui-chat-bubble-content>
        </ui-chat-bubble>
        <ui-chat-bubble side="end">
          <ui-chat-bubble-content variant="muted" [typing]="true"></ui-chat-bubble-content>
        </ui-chat-bubble>
      </div>
    `,
  }),
};

// ── Variants ──────────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <div class="space-y-3 max-w-md">
        <ui-chat-bubble side="start">
          <ui-chat-bubble-content variant="default">
            Default variant — uses accent background
          </ui-chat-bubble-content>
        </ui-chat-bubble>
        <ui-chat-bubble side="end">
          <ui-chat-bubble-content variant="primary">
            Primary variant — uses primary color
          </ui-chat-bubble-content>
        </ui-chat-bubble>
        <ui-chat-bubble side="start">
          <ui-chat-bubble-content variant="muted">
            Muted variant — uses muted background
          </ui-chat-bubble-content>
        </ui-chat-bubble>
      </div>
    `,
  }),
};
