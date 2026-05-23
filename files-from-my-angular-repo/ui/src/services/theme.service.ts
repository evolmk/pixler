import { computed, DestroyRef, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'system';

/** @deprecated Use `ThemeMode` instead */
export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'lazar-ui-theme';
const STORAGE_KEY_PRESET = 'lazar-ui-preset';
const STORAGE_KEY_ACCENT = 'lazar-ui-accent';
const STORAGE_KEY_FONT = 'lazar-ui-font';
const STORAGE_KEY_TEXT_SIZE = 'lazar-ui-text-size';
const DARK_QUERY = '(prefers-color-scheme: dark)';

/** Google Fonts URLs keyed by font stack. Loaded on demand when a font is selected. */
const FONT_URLS: Record<string, string> = {
  '"Inter", sans-serif': 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  '"Manrope", sans-serif': 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap',
  '"Nunito", sans-serif': 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap',
  '"JetBrains Mono", monospace':
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap',
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly themeSignal = signal<ThemeMode>(this._loadStorage(STORAGE_KEY, 'system') as ThemeMode);
  private readonly systemDark = signal(false);
  private mqList: MediaQueryList | null = null;
  private mqListener: ((e: MediaQueryListEvent) => void) | null = null;

  /** Preset/skin name (e.g. 'default', 'zinc', 'slate', 'rose', 'blue', 'green', 'orange') */
  readonly preset = signal<string>(this._loadStorage(STORAGE_KEY_PRESET, 'green'));

  /** Accent color CSS value or token name */
  readonly accentColor = signal<string>(this._loadStorage(STORAGE_KEY_ACCENT, ''));

  /** Font family CSS value or font name */
  readonly fontFamily = signal<string>(this._loadStorage(STORAGE_KEY_FONT, ''));

  /** Text size preset: 'small' | 'default' | 'large' */
  readonly textSize = signal<string>(this._loadStorage(STORAGE_KEY_TEXT_SIZE, 'default'));

  /** The raw user choice: 'light' | 'dark' | 'system' */
  readonly currentTheme = this.themeSignal.asReadonly();

  /** Resolved effective theme: always 'light' | 'dark' */
  readonly themeMode = computed<Theme>(() => {
    const mode = this.themeSignal();
    if (mode !== 'system') return mode;
    return this.systemDark() ? 'dark' : 'light';
  });

  /** Whether the effective theme is dark */
  readonly isDark = computed(() => this.themeMode() === 'dark');

  /** @deprecated Use `themeMode` for resolved theme or `currentTheme` for raw choice */
  readonly theme = this.themeMode;

  constructor() {
    if (this.isBrowser) {
      const mql = window.matchMedia(DARK_QUERY);
      this.mqList = mql;
      this.systemDark.set(mql.matches);

      this.mqListener = (e: MediaQueryListEvent) => this.systemDark.set(e.matches);
      mql.addEventListener('change', this.mqListener);

      this.destroyRef.onDestroy(() => {
        if (this.mqList && this.mqListener) {
          this.mqList.removeEventListener('change', this.mqListener);
        }
      });
    }

    effect(() => {
      const resolved = this.themeMode();
      const raw = this.themeSignal();
      this.doc.documentElement.classList.toggle('dark', resolved === 'dark');
      this.doc.documentElement.setAttribute('data-theme', resolved);
      this._saveStorage(STORAGE_KEY, raw);
    });

    effect(() => {
      const preset = this.preset();
      if (preset && preset !== 'default') {
        this.doc.documentElement.setAttribute('data-color-scheme', preset);
      } else {
        this.doc.documentElement.removeAttribute('data-color-scheme');
      }
      this._saveStorage(STORAGE_KEY_PRESET, preset);
    });

    effect(() => {
      const accent = this.accentColor();
      if (accent) {
        this.doc.documentElement.style.setProperty('--primary', accent);
        this.doc.documentElement.style.setProperty('--sidebar-primary', accent);
        this.doc.documentElement.style.setProperty('--sidebar-primary-foreground', 'oklch(0.985 0 0)');
      } else {
        this.doc.documentElement.style.removeProperty('--primary');
        this.doc.documentElement.style.removeProperty('--sidebar-primary');
        this.doc.documentElement.style.removeProperty('--sidebar-primary-foreground');
      }
      this._saveStorage(STORAGE_KEY_ACCENT, accent);
    });

    effect(() => {
      const font = this.fontFamily();
      if (font) {
        this._loadFont(font);
        this.doc.documentElement.style.setProperty('--font-family-override', font);
      } else {
        this.doc.documentElement.style.removeProperty('--font-family-override');
      }
      this._saveStorage(STORAGE_KEY_FONT, font);
    });

    effect(() => {
      const size = this.textSize();
      const sizeMap: Record<string, string> = { small: '14px', default: '16px', large: '18px' };
      this.doc.documentElement.style.fontSize = sizeMap[size] ?? '16px';
      this._saveStorage(STORAGE_KEY_TEXT_SIZE, size);
    });
  }

  /** Cycle: light → dark → system → light */
  toggle(): void {
    this.themeSignal.update((current) => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'system';
      return 'light';
    });
  }

  setTheme(mode: ThemeMode): void {
    this.themeSignal.set(mode);
  }

  setPreset(preset: string): void {
    this.preset.set(preset);
    if (this.accentColor()) {
      this.accentColor.set('');
    }
  }

  setAccentColor(color: string): void {
    this.accentColor.set(color);
  }

  setFontFamily(font: string): void {
    this.fontFamily.set(font);
  }

  setTextSize(size: string): void {
    this.textSize.set(size);
  }

  private readonly _loadedFonts = new Set<string>();

  /** Lazily inject a Google Fonts <link> for the given font stack. */
  private _loadFont(fontStack: string): void {
    if (this._loadedFonts.has(fontStack)) return;
    const url = FONT_URLS[fontStack];
    if (!url) return;
    this._loadedFonts.add(fontStack);
    const link = this.doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    this.doc.head.appendChild(link);
  }

  private _loadStorage(key: string, fallback: string): string {
    if (!this.isBrowser) return fallback;
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  }

  private _saveStorage(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* quota / SSR */
    }
  }
}
