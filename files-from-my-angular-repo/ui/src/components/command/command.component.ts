import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  ViewEncapsulation,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { cn } from '../../utils/cn';

export const COMMAND_TOKEN = new InjectionToken<CommandComponent>('COMMAND_TOKEN');

// ── Root ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-command',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: COMMAND_TOKEN, useExisting: forwardRef(() => CommandComponent) }],
  host: {
    '[class]': 'computedClass()',
    '(keydown.escape)': 'search.set("")',
  },
  template: `<ng-content />`,
})
export class CommandComponent {
  readonly class = input<string>('');
  /** Live search query — child components filter against this */
  readonly search = signal<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      this.class(),
    ),
  );
}

// ── Input ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-command-input',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': '"flex items-center border-b px-3"' },
  template: `
    <!-- Search icon -->
    <svg
      xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      class="mr-2 h-4 w-4 shrink-0 opacity-50"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.3-4.3"/>
    </svg>
    <input
      [class]="computedClass()"
      type="text"
      role="searchbox"
      autocomplete="off"
      [attr.placeholder]="placeholder()"
      [(ngModel)]="_query"
      (ngModelChange)="_command.search.set($event)"
    />
  `,
})
export class CommandInputComponent {
  readonly placeholder = input<string>('Search...');
  readonly class = input<string>('');
  protected readonly _command = inject(COMMAND_TOKEN);
  protected _query = '';

  protected readonly computedClass = computed(() =>
    cn(
      'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none',
      'placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
      this.class(),
    ),
  );
}

// ── List ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-command-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    role: 'listbox',
  },
  template: `<ng-content />`,
})
export class CommandListComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('max-h-[300px] overflow-y-auto overflow-x-hidden', this.class()),
  );
}

// ── Empty ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-command-empty',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    role: 'presentation',
  },
  template: `<ng-content />`,
})
export class CommandEmptyComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('block py-6 text-center text-sm', this.class()),
  );
}

// ── Group ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-command-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    role: 'group',
  },
  template: `
    @if (heading()) {
      <div [attr.aria-label]="heading()" class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
        {{ heading() }}
      </div>
    }
    <ng-content />
  `,
})
export class CommandGroupComponent {
  readonly heading = input<string>('');
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground', this.class()),
  );
}

// ── Separator ────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-command-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"separator"',
  },
  template: ``,
})
export class CommandSeparatorComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('-mx-1 h-px bg-border', this.class()),
  );
}

// ── Item ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-command-item, [uiCommandItem]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"option"',
    '[attr.tabindex]': '"0"',
    '[attr.aria-selected]': 'selected()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-selected]': 'selected()',
    /**
     * Command items can be hidden when they don't match the search query.
     * Consumers should set [hidden]="!matchesSearch()" from outside.
     */
  },
  template: `<ng-content />`,
})
export class CommandItemComponent {
  readonly class = input<string>('');
  readonly selected = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  protected readonly computedClass = computed(() =>
    cn(
      'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
      'transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      'data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      this.class(),
    ),
  );
}

// ── Shortcut ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-command-shortcut',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class CommandShortcutComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('ml-auto text-xs tracking-widest text-muted-foreground', this.class()),
  );
}
