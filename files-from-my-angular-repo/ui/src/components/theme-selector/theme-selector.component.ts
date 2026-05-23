import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { IconComponent } from '../icon/icon.component';
import { Sun, Moon, Check } from 'lucide-angular';

export interface ThemePreset {
  name: string;
  label: string;
  /** Representative color swatch shown in the picker */
  color: string;
}

export interface AccentColor {
  name: string;
  label: string;
  value: string;
}

export interface FontOption {
  name: string;
  label: string;
  stack: string;
}

const PRESETS: ThemePreset[] = [
  { name: 'default', label: 'Black', color: 'oklch(0.205 0 0)' },
  { name: 'zinc', label: 'Zinc', color: 'oklch(0.21 0.006 285.885)' },
  { name: 'slate', label: 'Slate', color: 'oklch(0.208 0.042 265.755)' },
  { name: 'stone', label: 'Stone', color: 'oklch(0.216 0.006 56.043)' },
  { name: 'gray', label: 'Gray', color: 'oklch(0.21 0.034 264.665)' },
  { name: 'rose', label: 'Rose', color: 'oklch(0.585 0.22 12)' },
  { name: 'orange', label: 'Orange', color: 'oklch(0.65 0.2 55)' },
  { name: 'green', label: 'Green', color: 'oklch(0.59 0.14 149.56)' },
  { name: 'greenog', label: 'Green OG', color: 'oklch(0.55 0.17 145)' },
  { name: 'blue', label: 'Blue', color: 'oklch(0.55 0.2 250)' },
  { name: 'violet', label: 'Violet', color: 'oklch(0.55 0.22 290)' },
];

const ACCENT_COLORS: AccentColor[] = [
  { name: '', label: 'Auto', value: '' },
  { name: 'blue', label: 'Blue', value: 'oklch(0.55 0.2 250)' },
  { name: 'violet', label: 'Violet', value: 'oklch(0.55 0.2 280)' },
  { name: 'green', label: 'Green', value: 'oklch(0.55 0.2 145)' },
  { name: 'orange', label: 'Orange', value: 'oklch(0.65 0.2 55)' },
  { name: 'rose', label: 'Rose', value: 'oklch(0.55 0.22 10)' },
  { name: 'cyan', label: 'Cyan', value: 'oklch(0.65 0.17 200)' },
];

const FONTS: FontOption[] = [
  { name: '', label: 'System', stack: '' },
  { name: 'inter', label: 'Inter', stack: '"Inter", sans-serif' },
  { name: 'geist', label: 'Geist', stack: '"Geist", sans-serif' },
  { name: 'mono', label: 'Mono', stack: '"JetBrains Mono", monospace' },
  { name: 'manrope', label: 'Manrope', stack: '"Manrope", sans-serif' },
  { name: 'nunito', label: 'Nunito', stack: '"Nunito", sans-serif' },
];

type SelectorTab = 'themes' | 'colors' | 'fonts';

@Component({
  selector: 'ui-theme-selector',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="w-72 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-border px-4 py-3">
        <p class="text-sm font-semibold">Appearance</p>
        <!-- Light / Dark toggle -->
        <button
          type="button"
          (click)="toggleDarkMode()"
          class="flex h-7 w-14 cursor-pointer items-center rounded-full bg-input p-0.5 transition-colors duration-200"
        >
          <span
            [class]="
              'flex h-6 w-6 items-center justify-center rounded-full bg-background shadow-sm transition-all duration-200 ' +
              (themeService.isDark() ? 'translate-x-7' : 'translate-x-0')
            "
          >
            @if (themeService.isDark()) {
              <ui-icon [name]="moonIcon" [size]="14" />
            } @else {
              <ui-icon [name]="sunIcon" [size]="14" />
            }
          </span>
        </button>
      </div>

      <!-- Tab bar -->
      <div class="flex border-b border-border">
        @for (tab of tabs; track tab.id) {
          <button
            type="button"
            (click)="activeTab.set(tab.id)"
            [class]="
              activeTab() === tab.id
                ? 'flex-1 cursor-pointer border-b-2 border-primary pb-2.5 pt-3 text-xs font-semibold text-foreground transition-colors'
                : 'flex-1 cursor-pointer pb-2.5 pt-3 text-xs text-muted-foreground transition-colors hover:text-foreground'
            "
          >
            {{ tab.label }}
          </button>
        }
      </div>

      <!-- Tab: Themes -->
      @if (activeTab() === 'themes') {
        <div class="grid grid-cols-3 gap-2 p-4">
          @for (preset of presets; track preset.name) {
            <button
              type="button"
              (click)="themeService.setPreset(preset.name)"
              [class]="
                'flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 p-2 transition-all ' +
                (themeService.preset() === preset.name
                  ? 'border-primary bg-accent/10'
                  : 'border-transparent hover:bg-accent/5')
              "
            >
              <span class="h-6 w-6 rounded-full" [style.background]="preset.color"></span>
              <span class="text-[11px] font-medium leading-none">{{ preset.label }}</span>
            </button>
          }
        </div>
      }

      <!-- Tab: Colors -->
      @if (activeTab() === 'colors') {
        <div class="p-4 space-y-4">
          <p class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Accent Color</p>
          <div class="grid grid-cols-4 gap-2">
            @for (accent of accentColors; track accent.name) {
              <button
                type="button"
                (click)="themeService.setAccentColor(accent.value)"
                [class]="
                  'flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 p-2 transition-all ' +
                  (themeService.accentColor() === accent.value
                    ? 'border-primary bg-accent/10'
                    : 'border-transparent hover:bg-accent/5')
                "
              >
                <span
                  class="h-6 w-6 rounded-full border border-border/50"
                  [style.background]="accent.value || 'oklch(var(--primary))'"
                ></span>
                <span class="text-[11px] font-medium leading-none">{{ accent.label }}</span>
              </button>
            }
          </div>
        </div>
      }

      <!-- Tab: Fonts -->
      @if (activeTab() === 'fonts') {
        <div class="p-4 space-y-4">
          <!-- Text size -->
          <div class="space-y-2">
            <p class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Text Size</p>
            <div class="grid grid-cols-3 gap-2">
              @for (size of textSizes; track size.name) {
                <button
                  type="button"
                  (click)="themeService.setTextSize(size.name)"
                  [class]="
                    'flex cursor-pointer flex-col items-center gap-1 rounded-lg border-2 px-2 py-2.5 transition-all ' +
                    (themeService.textSize() === size.name
                      ? 'border-primary bg-accent/10'
                      : 'border-transparent hover:bg-accent/5')
                  "
                >
                  <span class="font-medium leading-none" [style.font-size]="size.preview">Aa</span>
                  <span class="text-[11px] text-muted-foreground leading-none mt-1">{{ size.label }}</span>
                </button>
              }
            </div>
          </div>

          <!-- Font family -->
          <div class="space-y-2">
            <p class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Font Family</p>
            @for (font of fonts; track font.name) {
              <button
                type="button"
                (click)="themeService.setFontFamily(font.stack)"
                [class]="
                  'flex w-full cursor-pointer items-center justify-between rounded-lg border-2 px-3 py-2.5 transition-all ' +
                  (themeService.fontFamily() === font.stack
                    ? 'border-primary bg-accent/10'
                    : 'border-transparent hover:bg-accent/5')
                "
              >
                <span class="text-sm font-medium" [style.font-family]="font.stack || 'inherit'">
                  {{ font.label }}
                </span>
                @if (themeService.fontFamily() === font.stack) {
                  <ui-icon [name]="checkIcon" [size]="14" [strokeWidth]="2.5" class="text-primary" />
                }
              </button>
            }
          </div>
        </div>
      }

      <!-- Footer -->
      <div class="border-t border-border px-4 py-2.5">
        <button
          type="button"
          (click)="resetAll()"
          class="w-full cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  `,
})
export class ThemeSelectorComponent {
  protected readonly themeService = inject(ThemeService);
  private readonly doc = inject(DOCUMENT);

  protected readonly activeTab = signal<SelectorTab>('themes');

  protected readonly presets = PRESETS;
  protected readonly accentColors = ACCENT_COLORS;
  protected readonly fonts = FONTS;
  protected readonly textSizes = [
    { name: 'small', label: 'Small', preview: '13px' },
    { name: 'default', label: 'Default', preview: '16px' },
    { name: 'large', label: 'Large', preview: '19px' },
  ];

  protected readonly sunIcon = Sun;
  protected readonly moonIcon = Moon;
  protected readonly checkIcon = Check;

  protected toggleDarkMode(): void {
    const isDark = this.themeService.isDark();
    const newMode = isDark ? 'light' : 'dark';
    this.themeService.setTheme(newMode);
    // Direct DOM toggle for immediate feedback (ThemeService effect is async)
    this.doc.documentElement.classList.toggle('dark', !isDark);
    this.doc.documentElement.setAttribute('data-theme', newMode);
  }

  protected readonly tabs: { id: SelectorTab; label: string }[] = [
    { id: 'themes', label: 'Themes' },
    { id: 'colors', label: 'Colors' },
    { id: 'fonts', label: 'Fonts' },
  ];

  protected resetAll(): void {
    this.themeService.setPreset('green');
    this.themeService.setAccentColor('');
    this.themeService.setFontFamily('');
    this.themeService.setTextSize('default');
  }
}
