import { Injectable, InjectionToken, signal, computed } from '@angular/core';

/** Token for passing data into programmatically-opened drawers. */
export const DRAWER_DATA = new InjectionToken<unknown>('DRAWER_DATA');

export interface DrawerConfig<T = unknown> {
  data?: T;
  side?: 'top' | 'right' | 'bottom' | 'left';
  size?: 'sm' | 'default' | 'lg' | 'full';
  /** Unique ID — auto-generated if omitted */
  id?: string;
}

export interface DrawerEntry<T = unknown> extends Required<DrawerConfig<T>> {
  id: string;
}

let _nextId = 0;

@Injectable({ providedIn: 'root' })
export class DrawerService {
  private readonly _drawers = signal<DrawerEntry[]>([]);

  /** All currently open drawers */
  readonly drawers = this._drawers.asReadonly();

  /** Whether any drawer is currently open */
  readonly hasOpen = computed(() => this._drawers().length > 0);

  open<T = unknown>(config: DrawerConfig<T> = {}): DrawerEntry<T> {
    const entry: DrawerEntry<T> = {
      id: config.id ?? `drawer-${++_nextId}`,
      data: config.data as T,
      side: config.side ?? 'right',
      size: config.size ?? 'default',
    };
    this._drawers.update((list) => [...list, entry as DrawerEntry]);
    return entry;
  }

  close(id: string): void {
    this._drawers.update((list) => list.filter((d) => d.id !== id));
  }

  closeAll(): void {
    this._drawers.set([]);
  }

  isOpen(id: string): boolean {
    return this._drawers().some((d) => d.id === id);
  }
}
