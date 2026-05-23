import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils/cn';

type FileInputSize = 'sm' | 'default' | 'lg';

const SIZE_CLASS: Record<FileInputSize, string> = {
  sm: 'h-7 text-xs',
  default: 'h-9 text-sm',
  lg: 'h-11 text-base',
};

@Component({
  selector: 'ui-file-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileInputComponent),
      multi: true,
    },
  ],
  host: { '[class]': 'computedClass()' },
  template: `
    <input
      type="file"
      [accept]="accept()"
      [multiple]="multiple()"
      [disabled]="_disabled()"
      [class]="inputClass()"
      (change)="_onChange($event)"
      (blur)="_onTouched()"
    />
  `,
})
export class FileInputComponent implements ControlValueAccessor {
  readonly value = model<FileList | null>(null);
  readonly accept = input<string>('');
  readonly multiple = input<boolean>(false);
  readonly size = input<FileInputSize>('default');
  readonly class = input<string>('');

  readonly filesChange = output<FileList | null>();

  protected readonly _disabled = signal(false);

  private _onChangeFn: (v: FileList | null) => void = () => {};
  protected _onTouched: () => void = () => {};

  protected readonly computedClass = computed(() => cn('block w-full', this.class()));

  protected readonly inputClass = computed(() =>
    cn(
      'w-full rounded-md border border-input bg-background',
      'text-foreground transition-colors',
      'file:mr-3 file:border-0 file:bg-primary file:px-3 file:text-primary-foreground',
      'file:rounded-l-md file:font-medium file:cursor-pointer file:h-full',
      'focus:outline-none focus:ring-1 focus:ring-ring',
      'disabled:cursor-not-allowed disabled:opacity-50',
      SIZE_CLASS[this.size()],
    ),
  );

  protected _onChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    this.value.set(files);
    this._onChangeFn(files);
    this.filesChange.emit(files);
  }

  writeValue(): void {
    // FileList is not settable programmatically — no-op
  }

  registerOnChange(fn: (v: FileList | null) => void): void {
    this._onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}
