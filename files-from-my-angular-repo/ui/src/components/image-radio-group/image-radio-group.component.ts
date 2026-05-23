import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils/cn';
import { Check } from 'lucide-angular';
import { IconComponent } from '../icon/icon.component';

export interface ImageRadioOption {
  value: string;
  label: string;
  imageUrl?: string;
}

@Component({
  selector: 'ui-image-radio-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageRadioGroupComponent),
      multi: true,
    },
  ],
  host: { '[class]': 'computedClass()' },
  template: `
    @for (option of options(); track option.value) {
      <button
        type="button"
        [class]="itemClass(option.value)"
        (click)="select(option.value)"
        [attr.aria-pressed]="value() === option.value"
      >
        <span class="text-xs font-medium text-center leading-tight">{{ option.label }}</span>
        <div class="rounded bg-muted/50 flex items-center justify-center overflow-hidden">
          @if (option.imageUrl) {
            <img [src]="option.imageUrl" [alt]="option.label" class="h-auto" />
          } @else {
            <img [src]="placeholderImage()" [alt]="option.label" class="w-[120px] h-[120px] object-cover" />
          }
        </div>
        @if (value() === option.value) {
          <div class="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <ui-icon [name]="checkIcon" size="mini" class="text-primary-foreground" />
          </div>
        }
      </button>
    }
  `,
})
export class ImageRadioGroupComponent implements ControlValueAccessor {
  readonly options = input.required<ImageRadioOption[]>();
  readonly value = model<string>('');
  readonly columns = input<number>(0);
  readonly placeholderImage = input<string>('assets/img/placeholder.jpg');
  readonly class = input<string>('');

  protected readonly checkIcon = Check;

  private _onChange: (v: string) => void = () => {};
  private _onTouched: () => void = () => {};

  private static readonly MD_COLS: Record<number, string> = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6',
  };

  protected readonly computedClass = computed(() => {
    const cols = this.columns();
    const count = this.options().length;
    const colClass =
      cols > 0
        ? (ImageRadioGroupComponent.MD_COLS[cols] ?? `md:grid-cols-${cols}`)
        : `grid-cols-2 ${ImageRadioGroupComponent.MD_COLS[count] ?? 'md:grid-cols-5'}`;
    return cn('block grid gap-4', colClass, this.class());
  });

  protected itemClass(optionValue: string): string {
    const selected = this.value() === optionValue;
    return cn(
      'relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-colors cursor-pointer',
      selected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
    );
  }

  protected select(optionValue: string): void {
    this.value.set(optionValue);
    this._onChange(optionValue);
    this._onTouched();
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (v: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(): void {}
}
