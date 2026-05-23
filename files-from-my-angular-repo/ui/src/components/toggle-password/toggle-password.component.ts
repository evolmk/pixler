import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, signal } from '@angular/core';
import { cn } from '../../utils/cn';

type TogglePasswordSize = 'sm' | 'default' | 'lg';

const SIZE_CLASS: Record<TogglePasswordSize, string> = {
  sm: 'h-7 px-2 py-1 text-xs',
  default: 'h-9 px-3 py-1 text-sm',
  lg: 'h-11 px-4 py-2 text-base',
};

@Component({
  selector: 'ui-toggle-password',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': '"relative flex w-full items-center"' },
  template: `
    <input
      [type]="revealed() ? 'text' : 'password'"
      [value]="value()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [class]="inputClass()"
      (input)="_emit($event)"
    />
    <button
      type="button"
      class="absolute right-2.5 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
      [attr.aria-label]="revealed() ? 'Hide password' : 'Show password'"
      (click)="_toggleRevealed()"
    >
      @if (revealed()) {
        <!-- Eye-off icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <path d="m1 1 22 22" />
          <path d="M10.73 10.73A2 2 0 0 0 14 12" />
          <path d="M8 12a4 4 0 0 0 4 4" />
        </svg>
      } @else {
        <!-- Eye icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      }
    </button>
  `,
})
export class TogglePasswordComponent {
  readonly value = input<string>('');
  readonly placeholder = input<string>('Password');
  readonly size = input<TogglePasswordSize>('default');
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly revealed = signal(false);

  protected readonly inputClass = computed(() =>
    cn(
      'w-full rounded-md border border-input bg-background pr-9',
      'text-foreground placeholder:text-muted-foreground transition-colors',
      'focus:outline-none focus:ring-1 focus:ring-ring',
      'disabled:cursor-not-allowed disabled:opacity-50',
      SIZE_CLASS[this.size()],
      this.class(),
    ),
  );

  protected _toggleRevealed(): void {
    this.revealed.update((v) => !v);
  }

  protected _emit(event: Event): void {
    // Value is read from the native input; consumers bind [value] directly
    // or use this inside a reactive form via ngModel / formControl on the native input
    void event;
  }
}
