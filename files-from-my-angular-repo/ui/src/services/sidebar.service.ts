import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const COLLAPSED_KEY = 'lazar-sidebar-collapsed';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly openSignal = signal(true);
  private readonly collapsedSignal = signal(this.loadCollapsed());

  readonly isOpen = this.openSignal.asReadonly();
  readonly isCollapsed = this.collapsedSignal.asReadonly();

  constructor() {
    effect(() => {
      const collapsed = this.collapsedSignal();
      if (this.isBrowser) {
        try {
          localStorage.setItem(COLLAPSED_KEY, String(collapsed));
        } catch {
          /* storage quota or SSR */
        }
      }
    });
  }

  open(): void {
    this.openSignal.set(true);
  }
  close(): void {
    this.openSignal.set(false);
  }
  toggle(): void {
    this.openSignal.update((v) => !v);
  }

  collapse(): void {
    this.collapsedSignal.set(true);
  }
  expand(): void {
    this.collapsedSignal.set(false);
  }
  toggleCollapse(): void {
    this.collapsedSignal.update((v) => !v);
  }

  private loadCollapsed(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(COLLAPSED_KEY) === 'true';
    } catch {
      return false;
    }
  }
}
