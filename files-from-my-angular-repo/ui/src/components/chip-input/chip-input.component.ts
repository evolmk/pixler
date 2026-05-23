import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  output,
  signal,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { cn } from '../../utils/cn';

/**
 * `<ui-chip-input>` — Tag/chip input that stores an array of strings.
 *
 * Type text and press Enter or comma to add a chip.
 * Click X on a chip to remove it.
 *
 * Usage:
 * ```html
 * <ui-chip-input [value]="tags()" (valueChange)="onTagsChange($event)" placeholder="New Tags..." />
 * ```
 */
@Component({
  selector: 'ui-chip-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClass()',
    '(click)': 'focusInput()',
  },
  template: `
    <div
      class="flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      [class.opacity-50]="disabled()"
    >
      @for (chip of chips(); track chip; let i = $index) {
        <span
          class="inline-flex items-center gap-1 rounded-full bg-muted border border-border px-2.5 py-0.5 text-xs font-medium text-foreground"
        >
          {{ chip }}
          @if (!disabled()) {
            <button
              type="button"
              class="inline-flex items-center justify-center size-3.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              (click)="removeChip(i, $event)"
            >
              <svg
                class="size-2.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          }
        </span>
      }
      <input
        #inputEl
        class="flex-1 min-w-[80px] bg-transparent outline-none placeholder:text-muted-foreground text-sm"
        [placeholder]="chips().length === 0 ? placeholder() : ''"
        [disabled]="disabled()"
        [value]="inputValue()"
        (input)="onInput($event)"
        (keydown)="onKeydown($event)"
        (paste)="onPaste($event)"
      />
    </div>
  `,
})
export class ChipInputComponent {
  @ViewChild('inputEl') private inputEl!: ElementRef<HTMLInputElement>;

  readonly value = input<string[]>([]);
  readonly placeholder = input<string>('New Tags...');
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  readonly valueChange = output<string[]>();

  protected readonly inputValue = signal('');

  protected readonly chips = computed(() => this.value() ?? []);

  protected readonly computedClass = computed(() => cn('block', this.class()));

  protected focusInput(): void {
    this.inputEl?.nativeElement?.focus();
  }

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    // If the user types a comma, add chip immediately
    if (value.includes(',')) {
      const parts = value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length > 0) {
        this.addChips(parts);
      }
      this.inputValue.set('');
      (event.target as HTMLInputElement).value = '';
    } else {
      this.inputValue.set(value);
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    const value = this.inputValue().trim();

    if (event.key === 'Enter') {
      event.preventDefault();
      if (value) {
        this.addChips([value]);
        this.inputValue.set('');
        (event.target as HTMLInputElement).value = '';
      }
    }

    // Backspace on empty input removes last chip
    if (event.key === 'Backspace' && !value && this.chips().length > 0) {
      this.removeChip(this.chips().length - 1, event);
    }
  }

  protected onPaste(event: ClipboardEvent): void {
    const text = event.clipboardData?.getData('text') ?? '';
    if (text.includes(',')) {
      event.preventDefault();
      const parts = text
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length > 0) {
        this.addChips(parts);
      }
    }
  }

  protected removeChip(index: number, event: Event): void {
    event.stopPropagation();
    const updated = [...this.chips()];
    updated.splice(index, 1);
    this.valueChange.emit(updated);
  }

  private addChips(newChips: string[]): void {
    const current = this.chips();
    // Deduplicate — don't add chips that already exist (case-insensitive)
    const existingLower = new Set(current.map((c) => c.toLowerCase()));
    const toAdd = newChips.filter((c) => !existingLower.has(c.toLowerCase()));
    if (toAdd.length > 0) {
      this.valueChange.emit([...current, ...toAdd]);
    }
  }
}
