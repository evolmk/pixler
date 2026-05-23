import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

type ChatBubbleSide = 'start' | 'end';
type ChatBubbleVariant = 'default' | 'primary' | 'muted';

// ── Root ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-chat-bubble',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class ChatBubbleComponent {
  readonly side = input<ChatBubbleSide>('start');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'flex gap-2',
      this.side() === 'end' ? 'flex-row-reverse' : 'flex-row',
      this.class(),
    ),
  );
}

// ── Avatar ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-chat-bubble-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': '"shrink-0"' },
  template: `<ng-content />`,
})
export class ChatBubbleAvatarComponent {}

// ── Timestamp ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-chat-bubble-timestamp',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': '"mt-0.5 text-[11px] text-muted-foreground"' },
  template: `<ng-content />`,
})
export class ChatBubbleTimestampComponent {}

// ── Typing indicator ──────────────────────────────────────────────────────────

@Component({
  selector: 'ui-chat-bubble-typing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '"inline-flex items-center gap-0.5 py-0.5"',
    '[attr.aria-label]': '"Typing"',
  },
  template: `
    @for (delay of [0, 0.15, 0.3]; track delay) {
      <span
        class="h-1.5 w-1.5 rounded-full bg-current"
        [style.animation]="'chat-bubble-bounce 1s ' + delay + 's ease-in-out infinite'"
      ></span>
    }
    <style>
      @keyframes chat-bubble-bounce {
        0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
        40% { transform: translateY(-4px); opacity: 1; }
      }
    </style>
  `,
})
export class ChatBubbleTypingComponent {}

// ── Content wrapper ───────────────────────────────────────────────────────────

@Component({
  selector: 'ui-chat-bubble-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    <ng-content />
    @if (typing()) {
      <ui-chat-bubble-typing />
    }
  `,
  imports: [ChatBubbleTypingComponent],
})
export class ChatBubbleContentComponent {
  readonly variant = input<ChatBubbleVariant>('default');
  readonly typing = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
      this.variant() === 'primary'
        ? 'bg-primary text-primary-foreground'
        : this.variant() === 'muted'
          ? 'bg-muted text-muted-foreground'
          : 'bg-accent text-accent-foreground',
      this.class(),
    ),
  );
}
