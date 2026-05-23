import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  Directive,
  HostListener,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  ViewChild,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  Bell,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Copy,
  LogOut,
  Paintbrush,
  PanelLeft,
  Search,
  Settings,
  type LucideIconData,
} from 'lucide-angular';
import { BreadcrumbService, ThemeService, SidebarService } from '../../services';
import { AccordionComponent, AccordionItemComponent, AccordionContentComponent } from '../../components/accordion';
import { AvatarComponent, AvatarFallbackComponent } from '../../components/avatar';
import { IconComponent } from '../../components/icon';
import {
  DropdownComponent,
  DropdownTriggerDirective,
  DropdownContentDirective,
  type DropdownItem,
} from '../../components/dropdown';
import { ThemeSelectorComponent } from '../../components/theme-selector';
import { TooltipComponent, TooltipContentComponent } from '../../components/tooltip';

export interface AdminNavChild {
  label: string;
  route: string;
  exact?: boolean;
}

export interface AdminNavItem {
  label: string;
  route: string;
  icon: LucideIconData;
  /** Override the default icon size (collapsed: 18, expanded: 17). */
  iconSize?: number;
  children?: AdminNavChild[];
}

export interface AdminBreadcrumb {
  label: string;
  url: string;
}

@Directive({ selector: '[uiAdminUserMenu]', standalone: true })
export class AdminUserMenuDirective {
  readonly templateRef = inject(TemplateRef);
}

@Component({
  selector: 'ui-admin-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterOutlet,
    RouterLink,
    NgTemplateOutlet,
    AccordionComponent,
    AccordionItemComponent,
    AccordionContentComponent,
    AvatarComponent,
    AvatarFallbackComponent,
    IconComponent,
    DropdownComponent,
    DropdownTriggerDirective,
    DropdownContentDirective,
    ThemeSelectorComponent,
    TooltipComponent,
    TooltipContentComponent,
  ],
  host: { class: 'block' },
  styles: [
    `
      .sidebar-nav-scroll {
        scrollbar-width: thin;
        scrollbar-color: var(--color-sidebar-border) transparent;
      }
      .sidebar-nav-scroll::-webkit-scrollbar {
        width: 4px;
      }
      .sidebar-nav-scroll::-webkit-scrollbar-track {
        background: transparent;
      }
      .sidebar-nav-scroll::-webkit-scrollbar-thumb {
        background-color: var(--color-sidebar-border);
        border-radius: 4px;
      }
    `,
  ],
  template: /* html */ `
    <!-- Root: full-height flex row -->
    <div class="flex h-dvh overflow-hidden bg-background pt-safe">
      <!-- ───────────────────────────────────────────────────────── SIDEBAR -->
      <aside
        class="flex flex-col shrink-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-[width] duration-300 ease-in-out overflow-hidden"
        [style.width]="sidebarService.isCollapsed() ? '52px' : '240px'"
      >
        <!-- Sidebar Header: logo + hamburger toggle -->
        <div
          [class]="
            'h-14 flex items-center border-b border-sidebar-border shrink-0 ' +
            (sidebarService.isCollapsed() ? 'justify-center px-0' : 'px-4 gap-2')
          "
        >
          @if (!sidebarService.isCollapsed()) {
            <a [routerLink]="homeRoute()" class="flex-1 min-w-0">
              @if (appLogo()) {
                <img [src]="appLogo()" [alt]="appName()" class="h-6 object-contain object-left select-none" />
              } @else {
                <span class="font-bold text-base tracking-[0.2em] uppercase text-sidebar-foreground select-none">
                  {{ appName() }}
                </span>
              }
            </a>
          }
          <!-- Sidebar collapse toggle -->
          <button
            type="button"
            (click)="sidebarService.toggleCollapse()"
            class="p-2 rounded-md hover:bg-sidebar-accent transition-colors text-sidebar-foreground/70 hover:text-sidebar-foreground shrink-0"
          >
            <ui-icon [name]="PanelLeft" [size]="18" [strokeWidth]="1.5" />
          </button>
        </div>

        <!-- Nav Items -->
        <nav class="flex-1 overflow-y-auto overflow-x-hidden py-3 sidebar-nav-scroll">
          <ui-accordion type="multiple" [defaultValue]="initiallyExpandedRoutes()" class="px-2 block">
            @for (item of navItems(); track item.route) {
              @if (item.children?.length) {
                <!-- Group item: accordion-driven expand/collapse -->
                <ui-accordion-item [value]="item.route" class="border-0 block">
                  <ui-tooltip class="block w-full">
                    <button
                      type="button"
                      (click)="toggleExpanded(item)"
                      [class]="
                        'flex items-center w-full overflow-hidden cursor-pointer ' +
                        (isGroupActive(item)
                          ? 'rounded-md bg-sidebar-accent hover:bg-sidebar-accent'
                          : 'rounded-lg hover:bg-sidebar-accent')
                      "
                    >
                      <span
                        [class]="
                          'flex items-center gap-x-3 px-2 py-2 transition-colors flex-1 min-w-0 ' +
                          (isGroupActive(item)
                            ? 'text-sidebar-accent-foreground font-semibold'
                            : 'text-sidebar-foreground/80 hover:text-sidebar-accent-foreground font-medium')
                        "
                        [style.justifyContent]="sidebarService.isCollapsed() ? 'center' : ''"
                      >
                        <span class="w-5 flex items-center justify-center shrink-0">
                          <ui-icon
                            [name]="item.icon"
                            [size]="item.iconSize ?? (sidebarService.isCollapsed() ? 18 : 17)"
                            [strokeWidth]="1.5"
                          />
                        </span>
                        @if (!sidebarService.isCollapsed()) {
                          <span class="flex-1 truncate leading-tight text-left text-sm">{{ item.label }}</span>
                        }
                      </span>
                      @if (!sidebarService.isCollapsed()) {
                        <span
                          [class]="
                            'shrink-0 p-2 transition-colors ' +
                            (isGroupActive(item) ? 'text-sidebar-accent-foreground/70' : 'text-sidebar-foreground/50')
                          "
                        >
                          <ui-icon [name]="isExpanded(item) ? ChevronUp : ChevronDown" [size]="14" [strokeWidth]="2" />
                        </span>
                      }
                    </button>

                    @if (sidebarService.isCollapsed()) {
                      <ui-tooltip-content
                        placement="right"
                        variant="sidebar"
                        [fixed]="true"
                        padding="px-2.5 py-1"
                        class="text-sm font-medium"
                      >
                        {{ item.label }}
                      </ui-tooltip-content>
                    }
                  </ui-tooltip>

                  @if (!sidebarService.isCollapsed()) {
                    <ui-accordion-content class="[&>div]:py-0 [&>div]:text-inherit">
                      <ul class="mt-0.5 ml-[22px] border-l border-sidebar-border/40 pl-1 space-y-0.5 pb-1">
                        @for (child of item.children; track child.route) {
                          <li>
                            <a
                              [routerLink]="child.route"
                              [class]="
                                'block px-3 py-1.5 rounded-md text-sm transition-colors ' +
                                (isRouteActive(child.route, child.exact)
                                  ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                                  : 'text-sidebar-foreground/55 hover:text-sidebar-foreground hover:bg-sidebar-accent')
                              "
                            >
                              {{ child.label }}
                            </a>
                          </li>
                        }
                      </ul>
                    </ui-accordion-content>
                  }
                </ui-accordion-item>
              } @else {
                <!-- Page item: plain link, no accordion -->
                <ui-tooltip class="block w-full">
                  <a
                    [routerLink]="item.route"
                    [class]="
                      'flex items-center overflow-hidden ' +
                      (isGroupActive(item)
                        ? 'rounded-md bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'rounded-lg hover:bg-sidebar-accent')
                    "
                  >
                    <span
                      [class]="
                        'flex items-center gap-x-3 px-2 py-2 transition-colors flex-1 min-w-0 ' +
                        (isGroupActive(item)
                          ? 'text-sidebar-primary-foreground font-semibold'
                          : 'text-sidebar-foreground/80 hover:text-sidebar-accent-foreground font-medium')
                      "
                      [style.justifyContent]="sidebarService.isCollapsed() ? 'center' : ''"
                    >
                      <span class="w-5 flex items-center justify-center shrink-0">
                        <ui-icon
                          [name]="item.icon"
                          [size]="item.iconSize ?? (sidebarService.isCollapsed() ? 18 : 17)"
                          [strokeWidth]="1.5"
                        />
                      </span>
                      @if (!sidebarService.isCollapsed()) {
                        <span class="flex-1 truncate leading-tight text-sm">{{ item.label }}</span>
                      }
                    </span>
                  </a>

                  @if (sidebarService.isCollapsed()) {
                    <ui-tooltip-content
                      placement="right"
                      variant="sidebar"
                      [fixed]="true"
                      padding="px-2.5 py-1"
                      class="text-sm font-medium"
                    >
                      {{ item.label }}
                    </ui-tooltip-content>
                  }
                </ui-tooltip>
              }
            }
          </ui-accordion>
        </nav>

        <!-- ──────────────────── Sidebar Footer: User Area -->
        <div class="border-t border-sidebar-border p-2 shrink-0">
          <ui-dropdown align="above" class="w-full" #sidebarUserDropdown>
            <button
              uiDropdownTrigger
              [class]="
                'flex items-center w-full rounded-lg p-2 hover:bg-sidebar-accent transition-colors text-sidebar-foreground ' +
                (sidebarService.isCollapsed() ? 'justify-center gap-0' : 'gap-3')
              "
            >
              <!-- Avatar -->
              <ui-avatar class="size-8 shrink-0">
                <ui-avatar-fallback class="bg-primary/20 text-primary text-xs font-semibold">
                  {{ userInitials() }}
                </ui-avatar-fallback>
              </ui-avatar>
              @if (!sidebarService.isCollapsed()) {
                <div class="flex-1 text-left min-w-0">
                  <p class="text-[12px] font-medium text-sidebar-foreground truncate leading-none mb-0.5">
                    {{ userName() }}
                  </p>
                  <p class="text-[11px] text-sidebar-foreground/55 truncate leading-none">{{ userEmail() }}</p>
                </div>
                <ui-icon
                  [name]="ChevronsUpDown"
                  [size]="16"
                  [strokeWidth]="2"
                  class="text-sidebar-foreground/50 shrink-0"
                />
              }
            </button>

            <div
              uiDropdownContent
              class="rounded-lg bg-popover border border-border shadow-lg py-1 text-popover-foreground"
            >
              <div class="px-3 py-2 border-b border-border mb-1">
                <p class="font-semibold">{{ userName() }}</p>
                <p class="text-xs text-muted-foreground">{{ userEmail() }}</p>
              </div>
              <ng-container *ngTemplateOutlet="userMenuItems; context: { $implicit: sidebarUserDropdown }" />
            </div>
          </ui-dropdown>
        </div>
      </aside>

      <!-- ──────────────────────────────── MAIN AREA: Header + Content -->
      <div class="flex flex-1 flex-col min-w-0 overflow-hidden">
        <!-- ─────────────────────────────────────── TOPBAR -->
        <header class="h-14 bg-background border-b border-border flex items-center px-4 gap-3 shrink-0">
          <!-- Section Switcher + Page Title (left, flex-1) -->
          <nav class="flex items-center gap-2 flex-1 min-w-0">
            <!-- Section Switcher -->
            <ui-dropdown
              [items]="switcherItems()"
              [value]="activeSection()?.route ?? ''"
              (valueChange)="onSectionSelect($event)"
            />

            <!-- 3-part breadcrumb: [Page ▾] / Page Title (hidden on mobile) -->
            <div class="hidden md:contents">
              @if (breadcrumbService.pageTitle(); as pageTitle) {
                @if (pageSwitcherItems().length > 0) {
                  <span class="text-muted-foreground/50 select-none">/</span>
                  <ui-dropdown
                    [items]="pageSwitcherItems()"
                    [value]="activePageRoute()"
                    (valueChange)="onSectionSelect($event)"
                  />
                  @if (pageTitle !== 'Dashboard') {
                    <span class="text-muted-foreground/50 select-none">/</span>
                    <a
                      [routerLink]="activePageRoute()"
                      class="text-foreground hover:text-primary hover:underline transition-colors truncate"
                      >Dashboard</a
                    >
                  }
                  <span class="text-muted-foreground/50 select-none">/</span>
                  <span class="text-muted-foreground truncate">{{ pageTitle }}</span>
                  @if (breadcrumbService.entityId(); as eid) {
                    <button
                      type="button"
                      class="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-mono text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer shrink-0"
                      (click)="copyEntityId(eid)"
                    >
                      {{ eid }}
                      <ui-icon
                        [name]="justCopied() ? Check : Copy"
                        [size]="12"
                        [strokeWidth]="2"
                        [class]="justCopied() ? 'text-green-500' : ''"
                      />
                    </button>
                  }
                }
              } @else {
                <!-- Legacy breadcrumb trail -->
                @for (crumb of effectiveBreadcrumbs(); track crumb.url; let last = $last) {
                  <span class="text-muted-foreground/50 select-none">/</span>
                  @if (last) {
                    <span class="text-muted-foreground truncate">{{ crumb.label }}</span>
                    @if (breadcrumbService.entityId(); as eid) {
                      <button
                        type="button"
                        class="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-mono text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer shrink-0"
                        (click)="copyEntityId(eid)"
                      >
                        {{ eid }}
                        <ui-icon
                          [name]="justCopied() ? Check : Copy"
                          [size]="12"
                          [strokeWidth]="2"
                          [class]="justCopied() ? 'text-green-500' : ''"
                        />
                      </button>
                    }
                  } @else {
                    <a
                      [routerLink]="crumb.url"
                      class="text-muted-foreground hover:text-foreground truncate transition-colors"
                    >
                      {{ crumb.label }}
                    </a>
                  }
                }
              }
            </div>
          </nav>

          <!-- Search trigger -->
          @if (showSearch()) {
            <button
              type="button"
              (click)="onSearch()"
              class="relative hidden lg:inline-flex items-center h-9 w-60 rounded-lg border border-border bg-background pl-9 pr-10 text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              <ui-icon
                [name]="Search"
                [size]="16"
                [strokeWidth]="1.5"
                class="absolute left-3 text-muted-foreground pointer-events-none"
              />
              Search...
              <kbd
                class="absolute right-3 pointer-events-none flex items-center text-[10px] font-medium text-muted-foreground border border-border rounded px-1 py-0.5"
              >
                ⌘K
              </kbd>
            </button>
          }

          <!-- Notification bell -->
          <ui-dropdown align="end">
            <button
              uiDropdownTrigger
              class="relative flex items-center justify-center size-9 rounded-lg border border-border hover:bg-accent transition-colors text-foreground"
            >
              <ui-icon [name]="Bell" [size]="18" [strokeWidth]="1.5" />
              @if (notificationCount() > 0) {
                <span
                  class="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive ring-2 ring-background"
                ></span>
              }
            </button>

            <div
              uiDropdownContent
              class="w-80 rounded-lg border border-border bg-popover shadow-lg text-popover-foreground"
            >
              <div class="flex items-center justify-between px-4 py-3 border-b border-border">
                <p class="font-semibold">Notifications</p>
                @if (notificationCount() > 0) {
                  <span class="text-xs text-primary font-medium">{{ notificationCount() }} new</span>
                }
              </div>
              <div class="py-10 text-center">
                <ui-icon [name]="Bell" [size]="32" [strokeWidth]="1.5" class="mx-auto mb-2 text-muted-foreground/30" />
                <p class="text-muted-foreground">No notifications</p>
              </div>
            </div>
          </ui-dropdown>

          <!-- Theme selector (palette button) -->
          <ui-dropdown align="end" #themeDropdown>
            <button
              uiDropdownTrigger
              class="relative flex items-center justify-center size-9 rounded-lg border border-border hover:bg-accent transition-colors text-foreground"
            >
              <ui-icon [name]="Paintbrush" [size]="18" [strokeWidth]="1.5" />
            </button>

            <div uiDropdownContent class="rounded-lg border border-border bg-popover shadow-lg text-popover-foreground">
              <ui-theme-selector />
            </div>
          </ui-dropdown>

          <!-- User avatar (header right) -->
          <ui-dropdown align="end" #userDropdown>
            <button
              uiDropdownTrigger
              class="flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
            >
              <ui-avatar class="size-8">
                <ui-avatar-fallback class="bg-primary text-primary-foreground text-xs font-semibold">
                  {{ userInitials() }}
                </ui-avatar-fallback>
              </ui-avatar>
            </button>

            <div
              uiDropdownContent
              class="w-56 rounded-lg border border-border bg-popover shadow-lg py-1 text-popover-foreground"
            >
              <div class="px-3 py-2.5 border-b border-border mb-1">
                <p class="font-semibold">{{ userName() }}</p>
                <p class="text-xs text-muted-foreground mt-0.5">{{ userEmail() }}</p>
              </div>
              <ng-container *ngTemplateOutlet="userMenuItems; context: { $implicit: userDropdown }" />
            </div>
          </ui-dropdown>
        </header>

        <!-- ─────────────────────── Page content -->
        <main class="flex-1 overflow-y-auto bg-background pb-12">
          <router-outlet (activate)="routeActivated.emit($event)" />
        </main>
      </div>
    </div>

    <!-- ─────────────────────────────── Shared user dropdown items template -->
    <ng-template #userMenuItems let-hostDropdown>
      <!-- Custom menu items from consuming app -->
      @if (userMenuDir()) {
        <ng-container *ngTemplateOutlet="userMenuDir()!.templateRef" />
        <div class="my-1 h-px bg-border"></div>
      }

      <!-- Customize Style -->
      <button
        type="button"
        (click)="openThemeSelector(); hostDropdown?.animatedClose()"
        class="flex items-center gap-x-2.5 w-full px-3 py-2 hover:bg-accent transition-colors text-foreground"
      >
        <ui-icon [name]="Paintbrush" [size]="16" [strokeWidth]="1.5" class="text-muted-foreground" />
        Change Theme
      </button>

      <div class="my-1 h-px bg-border"></div>

      <!-- Settings -->
      <button
        type="button"
        (click)="onSettings()"
        class="flex items-center gap-x-2.5 w-full px-3 py-2 hover:bg-accent transition-colors text-foreground"
      >
        <ui-icon [name]="Settings" [size]="16" [strokeWidth]="1.5" class="text-muted-foreground" />
        Settings
      </button>

      <!-- Logout -->
      <button
        type="button"
        (click)="onLogout()"
        class="flex items-center gap-x-2.5 w-full px-3 py-2 hover:bg-accent transition-colors text-destructive"
      >
        <ui-icon [name]="LogOut" [size]="16" [strokeWidth]="1.5" />
        Log out
      </button>
    </ng-template>
  `,
})
export class AdminShellComponent {
  @ViewChild('themeDropdown') private _themeDropdown!: DropdownComponent;

  // ── Icons ─────────────────────────────────────────────────────
  protected readonly Bell = Bell;
  protected readonly Check = Check;
  protected readonly ChevronDown = ChevronDown;
  protected readonly ChevronUp = ChevronUp;
  protected readonly ChevronsUpDown = ChevronsUpDown;
  protected readonly Copy = Copy;
  protected readonly LogOut = LogOut;
  protected readonly Paintbrush = Paintbrush;
  protected readonly PanelLeft = PanelLeft;
  protected readonly Search = Search;
  protected readonly Settings = Settings;

  // ── Inputs ────────────────────────────────────────────────────
  readonly navItems = input.required<AdminNavItem[]>();
  readonly userName = input.required<string>();
  readonly userEmail = input.required<string>();
  readonly userInitials = input.required<string>();
  readonly userAvatarSrc = input<string>('');
  readonly notificationCount = input<number>(0);
  readonly appName = input<string>('LAZAR');
  readonly appLogo = input<string>('');
  readonly showSearch = input<boolean>(true);
  readonly breadcrumbLabels = input<Record<string, string>>({});
  readonly homeRoute = input<string>('/dashboard');
  readonly homeLabel = input<string>('Dashboard');

  // ── Outputs ───────────────────────────────────────────────────
  readonly logoutClicked = output<void>();
  readonly settingsClicked = output<void>();
  readonly searchClicked = output<void>();
  readonly routeActivated = output<unknown>();

  // ── Content projection ────────────────────────────────────────
  protected readonly userMenuDir = contentChild(AdminUserMenuDirective);

  // ── Services ──────────────────────────────────────────────────
  protected readonly breadcrumbService = inject(BreadcrumbService);
  protected readonly themeService = inject(ThemeService);
  protected readonly sidebarService = inject(SidebarService);

  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // ── Nav expansion state ───────────────────────────────────────
  private static readonly EXPANDED_KEY = 'lazar-sidebar-expanded';
  protected readonly navAccordion = viewChild(AccordionComponent);
  private inputsReady = false;

  /** Routes of groups that should be open on initial render (persisted + active) */
  protected readonly initiallyExpandedRoutes = computed<string[]>(() => {
    const stored = this.loadExpandedState();
    const activeGroups = this.navItems()
      .filter((item) => item.children?.length && this.isGroupActive(item))
      .map((item) => item.route);
    return [...new Set([...stored, ...activeGroups])];
  });

  // ── Breadcrumbs ───────────────────────────────────────────────
  protected readonly breadcrumbs = signal<AdminBreadcrumb[]>([]);

  /** Computed current URL so active-route checks react to navigation */
  protected readonly currentUrl = signal(this.router.url);

  /** The top-level nav item matching the current URL (checks children too) */
  protected readonly activeSection = computed(() => {
    this.currentUrl(); // track URL changes
    return this.navItems().find((item) => this.isGroupActive(item)) ?? null;
  });

  /** Nav items mapped to DropdownItem[] for the section switcher */
  protected readonly switcherItems = computed<DropdownItem[]>(() =>
    this.navItems().map((item) => ({
      label: item.label,
      value: item.route,
      icon: item.icon,
      href: item.route,
    })),
  );

  /** Breadcrumbs to display after the section switcher */
  protected readonly displayBreadcrumbs = computed(() => {
    const crumbs = this.breadcrumbs();
    // Strip the first segment (active section, already shown in switcher)
    return crumbs.length > 1 ? crumbs.slice(1) : [];
  });

  /** Use service-provided crumbs when set, otherwise fall back to auto-built */
  protected readonly effectiveBreadcrumbs = computed(
    () => this.breadcrumbService.customCrumbs() ?? this.displayBreadcrumbs(),
  );

  /** Page switcher items — children of the active section, mapped to DropdownItem[] */
  protected readonly pageSwitcherItems = computed<DropdownItem[]>(() =>
    (this.activeSection()?.children ?? []).map((child) => ({
      label: child.label,
      value: child.route,
    })),
  );

  /** The active child route within the current section */
  protected readonly activePageRoute = computed(() => {
    const children = this.activeSection()?.children ?? [];
    return children.find((c) => this.isRouteActive(c.route, c.exact))?.route ?? '';
  });

  protected readonly justCopied = signal(false);

  constructor() {
    this.breadcrumbs.set(this.buildBreadcrumbs(this.router.url));
    afterNextRender(() => {
      this.inputsReady = true;
      this.autoExpandForUrl(this.router.url);
    });

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => {
        this.currentUrl.set(e.urlAfterRedirects);
        this.breadcrumbs.set(this.buildBreadcrumbs(e.urlAfterRedirects));
        this.autoExpandForUrl(e.urlAfterRedirects);
      });
  }

  // ── Route helpers ─────────────────────────────────────────────
  protected isRouteActive(route: string, exact = false): boolean {
    const url = this.currentUrl();
    if (route === '/' || exact) return url === route;
    return url === route || url.startsWith(route + '/');
  }

  // ── Nav expansion ─────────────────────────────────────────────
  /** Whether this nav item or any of its children matches the current URL */
  protected isGroupActive(item: AdminNavItem): boolean {
    if (this.isRouteActive(item.route)) return true;
    return item.children?.some((c) => this.isRouteActive(c.route)) ?? false;
  }

  protected isExpanded(item: AdminNavItem): boolean {
    return this.navAccordion()?.isOpen(item.route) ?? false;
  }

  protected toggleExpanded(item: AdminNavItem): void {
    // When collapsed, navigate to first child instead of toggling submenu
    if (this.sidebarService.isCollapsed() && item.children?.length) {
      void this.router.navigate([item.children[0].route]);
      return;
    }
    this.navAccordion()?.toggle(item.route);
    this.saveExpandedState();
  }

  private loadExpandedState(): string[] {
    try {
      const stored = localStorage.getItem(AdminShellComponent.EXPANDED_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveExpandedState(): void {
    try {
      const acc = this.navAccordion();
      if (!acc) return;
      const open = this.navItems()
        .filter((item) => item.children?.length && acc.isOpen(item.route))
        .map((item) => item.route);
      localStorage.setItem(AdminShellComponent.EXPANDED_KEY, JSON.stringify(open));
    } catch {
      /* ignore quota errors */
    }
  }

  /** Auto-expand the parent group when navigating to a child route */
  private autoExpandForUrl(url: string): void {
    if (!this.inputsReady) return;
    for (const item of this.navItems()) {
      if (!item.children?.length) continue;
      const isActive =
        url === item.route ||
        url.startsWith(item.route + '/') ||
        item.children.some((c) => url === c.route || url.startsWith(c.route + '/'));
      if (isActive && !(this.navAccordion()?.isOpen(item.route) ?? false)) {
        this.navAccordion()?.toggle(item.route);
        this.saveExpandedState();
      }
    }
  }

  /** Opens the theme selector dropdown (called from user menu "Customize Style") */
  protected openThemeSelector(): void {
    this._themeDropdown?.toggle();
  }

  // ── Section switcher ─────────────────────────────────────────
  protected onSectionSelect(route: string): void {
    if (this.isRouteActive(route)) {
      // Force reload by navigating away and back
      void this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        void this.router.navigate([route]);
      });
    } else {
      void this.router.navigate([route]);
    }
  }

  // ── Output handlers ───────────────────────────────────────────
  protected onLogout(): void {
    this.logoutClicked.emit();
  }

  protected onSettings(): void {
    this.settingsClicked.emit();
  }

  protected onSearch(): void {
    this.searchClicked.emit();
  }

  protected copyEntityId(id: string): void {
    void navigator.clipboard.writeText(id).then(() => {
      this.justCopied.set(true);
      setTimeout(() => this.justCopied.set(false), 2000);
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.onSearch();
    }
  }

  // ── Breadcrumb builder ────────────────────────────────────────
  private buildBreadcrumbs(url: string): AdminBreadcrumb[] {
    const labels = this.breadcrumbLabels();
    const clean = url.split('?')[0].split('#')[0];
    const segments = clean.split('/').filter(Boolean);
    // Filter out ID-like segments (MongoDB ObjectIds, UUIDs, numeric IDs) from display,
    // but preserve original URL paths so crumb links remain correct.
    const isId = (s: string) => /^[a-f0-9]{24}$/.test(s) || /^[0-9a-f-]{36}$/.test(s) || /^\d+$/.test(s);
    return segments
      .map((seg, i) => ({ seg, url: '/' + segments.slice(0, i + 1).join('/') }))
      .filter(({ seg }) => !isId(seg))
      .map(({ seg, url }) => ({
        label:
          labels[seg] ??
          seg
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' '),
        url,
      }));
  }
}
