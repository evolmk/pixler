import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils/cn';

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
}

function rgbToHsl(r: number, g: number, b: number): string {
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn),
    min = Math.min(rn, gn, bn);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === rn ? (gn - bn) / d + (gn < bn ? 6 : 0) : max === gn ? (bn - rn) / d + 2 : (rn - gn) / d + 4;
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

@Component({
  selector: 'ui-color-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true,
    },
  ],
  host: { '[class]': 'computedClass()' },
  template: `
    <!-- Trigger: swatch + text -->
    <button
      type="button"
      [class]="triggerClass()"
      (click)="_toggleOpen()"
      [attr.aria-expanded]="_open()"
      aria-haspopup="dialog"
    >
      <span class="h-5 w-5 rounded border border-border/50 shrink-0" [style.background]="value()"></span>
      <span class="font-mono text-sm">{{ _display() }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ml-auto h-3 w-3 text-muted-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <!-- Dropdown panel -->
    @if (_open()) {
      <div class="absolute z-50 mt-1 w-56 rounded-lg border border-border bg-popover p-3 shadow-md space-y-3">
        <!-- Native color input -->
        <div class="flex items-center gap-2">
          <input
            type="color"
            [value]="_hex()"
            (input)="_onColorInput($event)"
            class="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
            aria-label="Color wheel"
          />
          <!-- Format tabs -->
          <div class="flex gap-0.5 rounded-md bg-muted p-0.5">
            @for (fmt of formats; track fmt) {
              <button
                type="button"
                [class]="
                  format() === fmt
                    ? 'rounded px-1.5 py-0.5 text-xs font-medium bg-background'
                    : 'rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground'
                "
                (click)="format.set(fmt)"
              >
                {{ fmt.toUpperCase() }}
              </button>
            }
          </div>
        </div>

        <!-- Text input for the formatted value -->
        <input
          type="text"
          [value]="_display()"
          (change)="_onTextInput($event)"
          class="w-full rounded-md border border-input bg-background px-2 py-1 font-mono text-xs
                 focus:outline-none focus:ring-1 focus:ring-ring"
          [attr.aria-label]="'Color value (' + format() + ')'"
        />

        <!-- Preset swatches -->
        @if (presets().length) {
          <div class="grid grid-cols-8 gap-1">
            @for (preset of presets(); track preset) {
              <button
                type="button"
                class="h-5 w-5 rounded border border-border/30 transition-transform hover:scale-110"
                [style.background]="preset"
                [attr.aria-label]="preset"
                (click)="_applyHex(preset)"
              ></button>
            }
          </div>
        }
      </div>
    }
  `,
})
export class ColorPickerComponent implements ControlValueAccessor {
  readonly value = model<string>('#000000');
  readonly format = model<ColorFormat>('hex');
  readonly presets = input<string[]>([]);
  readonly class = input<string>('');

  protected readonly _open = signal(false);
  protected readonly formats: ColorFormat[] = ['hex', 'rgb', 'hsl'];

  private _onChange: (v: string) => void = () => {};
  private _onTouched: () => void = () => {};

  protected readonly computedClass = computed(() => cn('relative inline-block', this.class()));

  protected readonly triggerClass = computed(() =>
    cn(
      'flex w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5',
      'text-sm transition-colors',
      'focus:outline-none focus:ring-1 focus:ring-ring',
      'hover:bg-accent/30',
    ),
  );

  protected readonly _hex = computed(() => {
    const v = this.value();
    if (v.startsWith('#') && v.length === 7) return v;
    return '#000000';
  });

  protected readonly _display = computed(() => {
    const hex = this._hex();
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    switch (this.format()) {
      case 'rgb':
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      case 'hsl':
        return rgbToHsl(rgb.r, rgb.g, rgb.b);
      default:
        return hex;
    }
  });

  protected _toggleOpen(): void {
    this._open.update((v) => !v);
  }

  protected _onColorInput(event: Event): void {
    this._applyHex((event.target as HTMLInputElement).value);
  }

  protected _onTextInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    // Accept hex directly; for simplicity keep hex as internal value
    if (/^#[0-9a-f]{6}$/i.test(raw)) {
      this._applyHex(raw);
    }
  }

  protected _applyHex(hex: string): void {
    this.value.set(hex);
    this._onChange(hex);
    this._onTouched();
  }

  writeValue(value: string): void {
    this.value.set(value ?? '#000000');
  }

  registerOnChange(fn: (v: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(): void {}
}
