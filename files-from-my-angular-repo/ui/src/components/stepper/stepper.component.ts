import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, model, output } from '@angular/core';
import { cn } from '../../utils/cn';

export type StepStatus = 'pending' | 'current' | 'completed' | 'error';
export type StepperOrientation = 'horizontal' | 'vertical';

export interface StepperStep {
  title: string;
  description?: string;
  status?: StepStatus;
  icon?: string; // optional icon label
}

@Component({
  selector: 'ui-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()', '[attr.aria-label]': '"Steps"' },
  template: `
    @for (step of steps(); track $index; let last = $last) {
      <!-- Step item -->
      <div [class]="stepClass($index)">
        <!-- Indicator circle -->
        <button
          type="button"
          [class]="circleClass($index)"
          [attr.aria-current]="_effectiveStatus($index) === 'current' ? 'step' : null"
          [attr.aria-label]="step.title"
          [disabled]="!editable() || _effectiveStatus($index) === 'pending'"
          (click)="_goTo($index)"
        >
          @if (_effectiveStatus($index) === 'completed') {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          } @else if (_effectiveStatus($index) === 'error') {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          } @else {
            <span class="text-xs font-semibold tabular-nums">{{ $index + 1 }}</span>
          }
        </button>

        <!-- Text -->
        <div [class]="textClass()">
          <p class="text-sm font-medium leading-none" [class]="titleClass($index)">{{ step.title }}</p>
          @if (step.description) {
            <p class="text-xs text-muted-foreground mt-0.5">{{ step.description }}</p>
          }
        </div>

        <!-- Connector line (between steps) -->
        @if (!last) {
          <div [class]="connectorClass($index)"></div>
        }
      </div>
    }
  `,
})
export class StepperComponent {
  readonly steps = input.required<StepperStep[]>();
  readonly currentStep = model<number>(0);
  readonly orientation = input<StepperOrientation>('horizontal');
  readonly editable = input<boolean>(false);
  readonly class = input<string>('');

  readonly stepChange = output<number>();

  protected readonly computedClass = computed(() =>
    cn(this.orientation() === 'horizontal' ? 'flex flex-row items-start gap-0' : 'flex flex-col gap-0', this.class()),
  );

  protected _effectiveStatus(index: number): StepStatus {
    const step = this.steps()[index];
    if (step?.status) return step.status;
    const cur = this.currentStep();
    if (index < cur) return 'completed';
    if (index === cur) return 'current';
    return 'pending';
  }

  protected stepClass(_index: number): string {
    return cn(
      'flex items-center gap-2',
      this.orientation() === 'horizontal' ? 'flex-1 flex-row' : 'flex-col items-start',
    );
  }

  protected circleClass(index: number): string {
    const status = this._effectiveStatus(index);
    return cn(
      'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors cursor-pointer',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:cursor-not-allowed',
      status === 'completed'
        ? 'border-primary bg-primary text-primary-foreground'
        : status === 'current'
          ? 'border-primary bg-background text-primary'
          : status === 'error'
            ? 'border-destructive bg-destructive text-destructive-foreground'
            : 'border-muted-foreground/30 bg-background text-muted-foreground',
    );
  }

  protected textClass(): string {
    return this.orientation() === 'horizontal' ? 'hidden sm:block min-w-0' : 'block min-w-0';
  }

  protected titleClass(index: number): string {
    const status = this._effectiveStatus(index);
    return status === 'current'
      ? 'text-foreground'
      : status === 'error'
        ? 'text-destructive'
        : status === 'completed'
          ? 'text-foreground'
          : 'text-muted-foreground';
  }

  protected connectorClass(index: number): string {
    const completed = this._effectiveStatus(index) === 'completed';
    return cn(
      'transition-colors',
      this.orientation() === 'horizontal' ? 'h-0.5 flex-1 self-center mx-2' : 'w-0.5 h-6 ml-4',
      completed ? 'bg-primary' : 'bg-muted',
    );
  }

  protected _goTo(index: number): void {
    if (!this.editable()) return;
    this.currentStep.set(index);
    this.stepChange.emit(index);
  }
}
