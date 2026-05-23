import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InjectionToken,
  ViewChild,
  ViewEncapsulation,
  computed,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  type ConnectedOverlayPositionChange,
  type ConnectedPosition,
} from '@angular/cdk/overlay';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils/cn';
import { overlayEnter, overlayExit, type MotionPreset } from '../../utils/motion';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
  image?: string;
}

export const SELECT_TOKEN = new InjectionToken<SelectComponent>('SELECT_TOKEN');

type SelectSize = 'sm' | 'default' | 'lg';
type CheckmarkPosition = 'left' | 'right';

const TRIGGER_SIZE: Record<SelectSize, string> = {
  sm: 'h-8 px-2 py-1 text-xs',
  default: 'h-9 px-3 py-2 text-sm',
  lg: 'h-11 px-4 py-2 text-base',
};

const SELECT_POSITIONS: ConnectedPosition[] = [
  // Prefer below
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
  // Fallback above
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
];

// ── Root ────────────────────────────────────────────────────────────────────
// Owns both the overlay origin (via hostDirective) and the CdkConnectedOverlay.
// Follows the Spartan.ng pattern: parent orchestrates overlay, children are styling-only.

@Component({
  selector: 'ui-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CdkConnectedOverlay],
  hostDirectives: [CdkOverlayOrigin],
  providers: [
    { provide: SELECT_TOKEN, useExisting: forwardRef(() => SelectComponent) },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  host: { '[class]': '"relative inline-block w-full"' },
  template: `
    @if (_useOptionsMode()) {
      <button
        type="button"
        [class]="_optionsTriggerClass()"
        [disabled]="disabled()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-haspopup]="'listbox'"
        [attr.tabindex]="disabled() ? -1 : 0"
        (click)="toggle()"
      >
        @if (_selectedImage()) {
          <img
            [src]="_selectedImage()"
            [alt]="_optionsDisplayValue()"
            class="size-5 rounded object-cover shrink-0 mr-1.5"
            loading="lazy"
          />
        }
        <span class="flex-1 text-start truncate" [class.text-muted-foreground]="!_optionsDisplayValue()">
          {{ _optionsDisplayValue() || placeholder() }}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="ml-auto opacity-50 shrink-0"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    } @else {
      <ng-content select="ui-select-trigger" />
    }

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="_overlayOrigin"
      [cdkConnectedOverlayOpen]="isOpen()"
      [cdkConnectedOverlayPositions]="_positions"
      [cdkConnectedOverlayMinWidth]="_triggerWidth()"
      [cdkConnectedOverlayHasBackdrop]="true"
      cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
      (positionChange)="_onPositionChange($event)"
      (attach)="_onOverlayAttach()"
      (backdropClick)="animatedClose()"
      (detach)="_onOverlayDetach()"
    >
      @if (_useOptionsMode()) {
        <div data-select-content [class]="_optionsContentClass()">
          @if (searchable()) {
            <div class="p-2 border-b border-border">
              <input
                type="text"
                [placeholder]="searchPlaceholder()"
                (input)="_onSearchInput($event)"
                class="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          }
          <div class="max-h-60 overflow-y-auto p-1" role="listbox" [attr.aria-multiselectable]="multiple()">
            @for (item of _renderItems(); track $index) {
              @if (item.type === 'header') {
                @if (groupSelect() && multiple()) {
                  <div
                    class="flex items-center justify-between pl-2 pr-2 py-1.5 eyebrow text-muted-foreground cursor-pointer hover:bg-accent/50 rounded-sm transition-colors"
                    (click)="toggleGroup(item.label!)"
                  >
                    {{ item.label }}
                    <span
                      class="size-3.5 flex items-center justify-center rounded border shrink-0"
                      [class]="
                        _isGroupFullySelected(item.label!)
                          ? 'bg-primary border-primary'
                          : _isGroupPartiallySelected(item.label!)
                            ? 'bg-primary/50 border-primary'
                            : 'border-muted-foreground/40'
                      "
                    >
                      @if (_isGroupFullySelected(item.label!)) {
                        <svg
                          class="size-2.5 text-primary-foreground"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="3"
                          stroke="currentColor"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" d="M20 6 9 17l-5-5" />
                        </svg>
                      } @else if (_isGroupPartiallySelected(item.label!)) {
                        <svg
                          class="size-2.5 text-primary-foreground"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="3"
                          stroke="currentColor"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                        </svg>
                      }
                    </span>
                  </div>
                } @else {
                  <div class="pl-2 pr-2 py-1.5 eyebrow text-muted-foreground select-none">
                    {{ item.label }}
                  </div>
                }
              } @else if (item.option; as opt) {
                <div
                  role="option"
                  [attr.aria-selected]="isSelected(opt.value)"
                  [attr.data-disabled]="opt.disabled ? '' : null"
                  [class]="_optionsItemClass(opt)"
                  (click)="!opt.disabled && select(opt.value)"
                >
                  <span
                    class="absolute flex h-3.5 w-3.5 items-center justify-center"
                    [class.left-2]="checkmarkPosition() === 'left'"
                    [class.right-2]="checkmarkPosition() === 'right'"
                  >
                    @if (isSelected(opt.value)) {
                      <svg
                        class="text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    }
                  </span>
                  @if (opt.image) {
                    <img
                      [src]="opt.image"
                      [alt]="opt.label"
                      class="size-6 rounded object-cover shrink-0 mr-2"
                      loading="lazy"
                    />
                  }
                  {{ opt.label }}
                </div>
              }
            }
            @if (_filteredOptions().length === 0) {
              <div class="px-3 py-2 text-sm text-muted-foreground text-center">
                {{ emptyMessage() }}
              </div>
            }
          </div>
        </div>
      } @else {
        <ng-content select="ui-select-content" />
      }
    </ng-template>
  `,
})
export class SelectComponent implements ControlValueAccessor {
  @ViewChild(CdkConnectedOverlay) private _overlay!: CdkConnectedOverlay;

  readonly _overlayOrigin = inject(CdkOverlayOrigin);
  private readonly _elRef = inject(ElementRef);

  readonly value = model<string | string[]>('');
  readonly multiple = input<boolean>(false);
  readonly maxLabelCount = input<number | null>(null);
  readonly size = input<SelectSize>('default');
  readonly isOpen = signal(false);
  readonly disabled = signal(false);
  readonly _triggerWidth = signal<number>(0);
  readonly _positions = SELECT_POSITIONS;

  // Options-mode inputs
  readonly options = input<SelectOption[] | null>(null);
  readonly searchable = input<boolean>(false);
  readonly groupSelect = input<boolean>(true);
  readonly placeholder = input<string>('Select...');
  readonly searchPlaceholder = input<string>('Search...');
  readonly emptyMessage = input<string>('No options found');
  readonly checkmarkPosition = input<CheckmarkPosition>('right');

  readonly valueChange = output<string | string[]>();

  // Options-mode computed state
  readonly _useOptionsMode = computed(() => this.options() !== null);
  readonly _searchQuery = signal('');

  readonly _filteredOptions = computed(() => {
    const opts = this.options() ?? [];
    const q = this._searchQuery().toLowerCase();
    if (!this.searchable() || !q) return opts;
    return opts.filter((o) => o.label.toLowerCase().includes(q) || o.group?.toLowerCase().includes(q));
  });

  /** Options with group headers interleaved for rendering. */
  readonly _renderItems = computed<{ type: 'header' | 'option'; label?: string; option?: SelectOption }[]>(() => {
    const opts = this._filteredOptions();
    const hasGroups = opts.some((o) => o.group);
    if (!hasGroups) return opts.map((o) => ({ type: 'option' as const, option: o }));

    const items: { type: 'header' | 'option'; label?: string; option?: SelectOption }[] = [];
    let currentGroup: string | undefined;
    for (const opt of opts) {
      if (opt.group && opt.group !== currentGroup) {
        currentGroup = opt.group;
        items.push({ type: 'header', label: opt.group });
      } else if (!opt.group && currentGroup !== undefined) {
        currentGroup = undefined;
      }
      items.push({ type: 'option', option: opt });
    }
    return items;
  });

  /** Whether all options in a group are selected. */
  _isGroupFullySelected(groupName: string): boolean {
    const current = this.value();
    const arr = Array.isArray(current) ? current : [];
    const groupOpts = this._filteredOptions().filter((o) => o.group === groupName && !o.disabled);
    return groupOpts.length > 0 && groupOpts.every((o) => arr.includes(o.value));
  }

  /** Whether some (but not all) options in a group are selected. */
  _isGroupPartiallySelected(groupName: string): boolean {
    const current = this.value();
    const arr = Array.isArray(current) ? current : [];
    const groupOpts = this._filteredOptions().filter((o) => o.group === groupName && !o.disabled);
    const selectedCount = groupOpts.filter((o) => arr.includes(o.value)).length;
    return selectedCount > 0 && selectedCount < groupOpts.length;
  }

  /** Toggle all options in a group on/off. */
  toggleGroup(groupName: string): void {
    if (this.disabled() || !this.multiple()) return;
    const current = this.value();
    const arr = Array.isArray(current) ? [...current] : [];
    const groupOpts = this._filteredOptions().filter((o) => o.group === groupName && !o.disabled);
    const allSelected = this._isGroupFullySelected(groupName);

    let next: string[];
    if (allSelected) {
      const groupValues = new Set(groupOpts.map((o) => o.value));
      next = arr.filter((v) => !groupValues.has(v));
    } else {
      const existing = new Set(arr);
      next = [...arr, ...groupOpts.filter((o) => !existing.has(o.value)).map((o) => o.value)];
    }
    this.value.set(next);
    this._onChange(next);
    this._onTouched();
    this.valueChange.emit(next);
  }

  readonly _selectedImage = computed(() => {
    const current = this.value();
    if (Array.isArray(current)) return undefined;
    const opts = this.options() ?? [];
    return opts.find((o) => o.value === current)?.image;
  });

  readonly _optionsDisplayValue = computed(() => {
    const current = this.value();
    const opts = this.options() ?? [];
    if (!opts.length) return typeof current === 'string' ? current : '';
    if (Array.isArray(current)) {
      if (current.length === 0) return '';
      const max = this.maxLabelCount();
      const labels = current.map((v) => opts.find((o) => o.value === v)?.label ?? v);
      if (max !== null && labels.length > max) {
        if (max === 0) return `${labels.length} selected`;
        return `${labels.slice(0, max).join(', ')} +${labels.length - max}`;
      }
      return labels.join(', ');
    }
    return opts.find((o) => o.value === current)?.label ?? current;
  });

  readonly _optionsTriggerClass = computed(() =>
    cn(
      'flex w-full cursor-pointer items-center justify-between rounded-md border border-input bg-background',
      'ring-offset-background placeholder:text-muted-foreground',
      'hover:border-foreground/25 dark:hover:border-foreground/25',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      '[&>span]:line-clamp-1',
      TRIGGER_SIZE[this.size()],
    ),
  );

  readonly _optionsContentClass = computed(() =>
    cn('block w-full min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md'),
  );

  private _onChange: (v: string | string[]) => void = () => {};
  private _onTouched: () => void = () => {};
  private _closing = false;
  private _motionPreset: MotionPreset = 'slide-down';

  toggle(): void {
    if (this.disabled()) return;
    if (this.isOpen()) {
      void this.animatedClose();
    } else {
      this._triggerWidth.set(this._elRef.nativeElement.offsetWidth);
      this.isOpen.set(true);
    }
  }

  close(): void {
    this.isOpen.set(false);
    this._closing = false;
    this._searchQuery.set('');
  }

  /** Animate out, then destroy the overlay. */
  async animatedClose(): Promise<void> {
    if (!this.isOpen() || this._closing) return;
    this._closing = true;
    try {
      const el = this._overlay?.overlayRef?.overlayElement?.querySelector('[data-select-content], ui-select-content');
      if (el) {
        await overlayExit(el, this._motionPreset);
      }
    } finally {
      this.close();
    }
  }

  /** @internal — detect panel position to choose slide direction */
  _onPositionChange(event: ConnectedOverlayPositionChange): void {
    this._motionPreset = event.connectionPair.overlayY === 'bottom' ? 'slide-up' : 'slide-down';
  }

  /** @internal — enter animation on overlay attach, blur trigger, focus search */
  _onOverlayAttach(): void {
    queueMicrotask(() => {
      // Blur trigger to remove focus ring when overlay opens
      const trigger = this._elRef.nativeElement.querySelector('button, ui-select-trigger') as HTMLElement | null;
      if (trigger) trigger.blur();

      const panel = this._overlay?.overlayRef?.overlayElement;
      const el = panel?.querySelector('[data-select-content], ui-select-content');
      if (el) overlayEnter(el, this._motionPreset);

      // Auto-focus search input if searchable
      if (this.searchable()) {
        const searchInput = panel?.querySelector<HTMLElement>('input[type="text"]');
        if (searchInput) searchInput.focus();
      }
    });
  }

  /** @internal — cleanup on detach */
  _onOverlayDetach(): void {
    this._closing = false;
    this.isOpen.set(false);
  }

  select(val: string): void {
    if (this.disabled()) return;
    if (this.multiple()) {
      const current = this.value();
      const arr = Array.isArray(current) ? current : [];
      const next = arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
      this.value.set(next);
      this._onChange(next);
      this._onTouched();
      this.valueChange.emit(next);
    } else {
      this.value.set(val);
      this._onChange(val);
      this._onTouched();
      this.valueChange.emit(val);
      void this.animatedClose();
    }
  }

  isSelected(val: string): boolean {
    const current = this.value();
    if (Array.isArray(current)) return current.includes(val);
    return current === val;
  }

  getDisplayValue(): string {
    const current = this.value();
    if (!Array.isArray(current)) return current;
    const max = this.maxLabelCount();
    if (max !== null && current.length > max) {
      return `${current.slice(0, max).join(', ')} +${current.length - max}`;
    }
    return current.join(', ');
  }

  // ControlValueAccessor
  writeValue(val: string | string[]): void {
    this.value.set(val ?? (this.multiple() ? [] : ''));
  }
  registerOnChange(fn: (v: string | string[]) => void): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // Options-mode helpers
  _optionsItemClass(opt: SelectOption): string {
    const isRight = this.checkmarkPosition() === 'right';
    const hasGroup = !!opt.group;
    const selected = this.isSelected(opt.value);
    return cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 text-sm outline-none',
      isRight ? (hasGroup ? 'pl-5 pr-8' : 'pl-2 pr-8') : hasGroup ? 'pl-11 pr-2' : 'pl-8 pr-2',
      'hover:bg-accent hover:text-accent-foreground',
      selected && 'text-primary font-medium',
      opt.disabled && 'pointer-events-none cursor-not-allowed opacity-50',
    );
  }

  _onSearchInput(event: Event): void {
    this._searchQuery.set((event.target as HTMLInputElement).value);
  }
}

// ── Trigger ──────────────────────────────────────────────────────────────────
// Styling-only — no overlay logic. Click delegates to parent select.

@Component({
  selector: 'ui-select-trigger',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"combobox"',
    '[attr.aria-expanded]': '_select.isOpen()',
    '[attr.aria-disabled]': '_select.disabled()',
    '[attr.tabindex]': '_select.disabled() ? -1 : 0',
    '(click)': '_select.toggle()',
    '(keydown.enter)': '_select.toggle()',
    '(keydown.space)': '_select.toggle()',
  },
  template: `
    <ng-content />
    <!-- Chevron down icon -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="ml-auto opacity-50 shrink-0"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  `,
})
export class SelectTriggerComponent {
  readonly class = input<string>('');
  protected readonly _select = inject(SELECT_TOKEN);

  protected readonly computedClass = computed(() =>
    cn(
      'flex w-full cursor-pointer items-center justify-between rounded-md border border-input bg-background',
      'ring-offset-background placeholder:text-muted-foreground',
      'hover:border-foreground/25 dark:hover:border-foreground/25',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      '[&>span]:line-clamp-1',
      TRIGGER_SIZE[this._select.size()],
      this.class(),
    ),
  );
}

// ── Value ────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-select-value',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (_select.getDisplayValue()) {
      {{ _select.getDisplayValue() }}
    } @else {
      <span class="text-muted-foreground">{{ placeholder() }}</span>
    }
  `,
})
export class SelectValueComponent {
  readonly placeholder = input<string>('Select...');
  protected readonly _select = inject(SELECT_TOKEN);
}

// ── Content ──────────────────────────────────────────────────────────────────
// Styling-only — the overlay is owned by the parent SelectComponent.

@Component({
  selector: 'ui-select-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-select-content]': '""',
    role: 'listbox',
    '[attr.aria-multiselectable]': '_select.multiple()',
    '(keydown.escape)': '_select.animatedClose()',
  },
  template: `
    <div class="p-1">
      <ng-content />
    </div>
  `,
})
export class SelectContentComponent {
  readonly class = input<string>('');
  protected readonly _select = inject(SELECT_TOKEN);

  protected readonly computedClass = computed(() =>
    cn(
      'block w-full min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
      this.class(),
    ),
  );
}

// ── Group ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-select-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { role: 'group' },
  template: `<ng-content />`,
})
export class SelectGroupComponent {}

// ── Label ─────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-select-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class SelectLabelComponent {
  readonly class = input<string>('');
  protected readonly _select = inject(SELECT_TOKEN);
  protected readonly computedClass = computed(() => {
    const isRight = this._select.checkmarkPosition() === 'right';
    return cn('block py-1.5 text-sm font-semibold', isRight ? 'pl-2 pr-8' : 'pl-8 pr-2', this.class());
  });
}

// ── Item ──────────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-select-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"option"',
    '[attr.tabindex]': '"0"',
    '[attr.aria-selected]': '_select.isSelected(value())',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '(click)': '_select.select(value())',
    '(keydown.enter)': '_select.select(value())',
    '(keydown.space)': '_select.select(value())',
  },
  template: `
    <!-- Checkmark for selected state -->
    <span
      class="absolute flex h-3.5 w-3.5 items-center justify-center"
      [class.left-2]="_select.checkmarkPosition() === 'left'"
      [class.right-2]="_select.checkmarkPosition() === 'right'"
    >
      @if (_select.isSelected(value())) {
        <svg
          class="text-primary"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      }
    </span>
    <ng-content />
  `,
})
export class SelectItemComponent {
  readonly value = input.required<string>();
  readonly class = input<string>('');
  readonly disabled = input<boolean>(false);

  protected readonly _select = inject(SELECT_TOKEN);

  protected readonly computedClass = computed(() => {
    const isRight = this._select.checkmarkPosition() === 'right';
    const selected = this._select.isSelected(this.value());
    return cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 text-sm outline-none',
      isRight ? 'pl-2 pr-8' : 'pl-8 pr-2',
      'focus:bg-accent focus:text-accent-foreground',
      'hover:bg-accent hover:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
      selected && 'text-primary font-medium',
      this.class(),
    );
  });
}

// ── Separator ────────────────────────────────────────────────────────────────

@Component({
  selector: 'ui-select-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '[attr.role]': '"separator"',
  },
  template: ``,
})
export class SelectSeparatorComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('-mx-1 my-1 h-px bg-muted', this.class()));
}
