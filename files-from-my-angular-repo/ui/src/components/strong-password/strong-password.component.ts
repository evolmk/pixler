import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

export interface PasswordRule {
  label: string;
  test: (value: string) => boolean;
}

const DEFAULT_RULES: PasswordRule[] = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'Uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'Lowercase letter', test: (v) => /[a-z]/.test(v) },
  { label: 'Number', test: (v) => /\d/.test(v) },
  { label: 'Special character', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const STRENGTH_LABEL = ['', 'Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];
const STRENGTH_COLOR = [
  '',
  'bg-destructive',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-blue-500',
  'bg-green-500',
];

@Component({
  selector: 'ui-strong-password',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    <!-- Strength bar -->
    <div class="flex gap-1" role="progressbar" [attr.aria-valuenow]="strength()" aria-valuemin="0" [attr.aria-valuemax]="rules().length">
      @for (seg of segments(); track $index) {
        <div class="h-1.5 flex-1 rounded-full transition-all duration-300"
          [class]="$index < strength() ? strengthColor() : 'bg-muted'">
        </div>
      }
    </div>

    <!-- Strength label -->
    @if (showLabel()) {
      <p class="text-xs font-medium" [class]="strength() > 0 ? 'text-foreground' : 'text-muted-foreground'">
        {{ strengthLabel() }}
      </p>
    }

    <!-- Rules list -->
    @if (showRules()) {
      <ul class="space-y-1">
        @for (rule of rules(); track rule.label) {
          <li class="flex items-center gap-1.5 text-xs"
            [class]="rule.test(value()) ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'">
            @if (rule.test(value())) {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 shrink-0" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 shrink-0" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
              </svg>
            }
            {{ rule.label }}
          </li>
        }
      </ul>
    }
  `,
})
export class StrongPasswordComponent {
  readonly value = input<string>('');
  readonly rules = input<PasswordRule[]>(DEFAULT_RULES);
  readonly showLabel = input<boolean>(true);
  readonly showRules = input<boolean>(true);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('flex flex-col gap-2', this.class()),
  );

  protected readonly strength = computed(() => {
    const v = this.value();
    if (!v) return 0;
    return this.rules().filter((r) => r.test(v)).length;
  });

  protected readonly segments = computed(() =>
    Array.from({ length: this.rules().length }),
  );

  protected readonly strengthLabel = computed(
    () => STRENGTH_LABEL[Math.min(this.strength(), STRENGTH_LABEL.length - 1)] ?? '',
  );

  protected readonly strengthColor = computed(
    () => STRENGTH_COLOR[Math.min(this.strength(), STRENGTH_COLOR.length - 1)] ?? '',
  );
}
