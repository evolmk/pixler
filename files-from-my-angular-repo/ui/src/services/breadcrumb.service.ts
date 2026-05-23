import { Injectable, signal } from '@angular/core';
import type { AdminBreadcrumb } from '../layouts';

/**
 * Allows child routes to override the auto-built topbar breadcrumbs
 * and optionally display an entity ID pill next to the last crumb.
 *
 * Usage from a routed component:
 * ```ts
 * constructor() {
 *   this.breadcrumbService.set({
 *     crumbs: [
 *       { label: 'Dashboard', url: '/customers' },
 *       { label: 'Acme Corp', url: '/customers/abc123' },
 *     ],
 *     entityId: 'abc123',
 *   });
 * }
 * ngOnDestroy() { this.breadcrumbService.clear(); }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  /** When set, replaces auto-built display breadcrumbs */
  readonly customCrumbs = signal<AdminBreadcrumb[] | null>(null);

  /** Entity ID to render as a copyable pill after the last breadcrumb */
  readonly entityId = signal<string | null>(null);

  /**
   * When set, the admin shell renders the 3-part breadcrumb:
   * [Section ▾] / [Page ▾] / pageTitle
   * (page switcher is derived from activeSection().children)
   */
  readonly pageTitle = signal<string | null>(null);

  set(opts: { crumbs?: AdminBreadcrumb[]; entityId?: string; pageTitle?: string }): void {
    this.customCrumbs.set(opts.crumbs ?? null);
    this.entityId.set(opts.entityId ?? null);
    this.pageTitle.set(opts.pageTitle ?? null);
  }

  clear(): void {
    this.customCrumbs.set(null);
    this.entityId.set(null);
    this.pageTitle.set(null);
  }
}
