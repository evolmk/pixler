import { ChangeDetectionStrategy, Component, HostListener, input, signal, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterComponent } from '../../components/toast';
import type { ToasterPosition } from '../../components/toast';
import { DialogContainerComponent } from '../../components/dialog';

@Component({
  selector: 'ui-frontend-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet, ToasterComponent, DialogContainerComponent],
  host: { class: 'flex flex-col min-h-screen block' },
  template: `
    <ng-content select="[header]" />
    <main class="flex-1">
      <router-outlet />
    </main>
    <ng-content select="[footer]" />

    <!-- Scroll-to-top button -->
    <button
      class="fixed bottom-8 right-8 w-12 h-12 bg-brand border-none rounded-full shadow-[0_4px_12px_rgba(22,163,74,0.4),0_2px_6px_rgba(0,0,0,0.2)] cursor-pointer z-[999] flex items-center justify-center transition-all duration-300 pb-safe"
      [class.opacity-100]="showScrollButton()"
      [class.visible]="showScrollButton()"
      [class.opacity-0]="!showScrollButton()"
      [class.invisible]="!showScrollButton()"
      [class.translate-y-5]="!showScrollButton()"
      [class.translate-y-0]="showScrollButton()"
      (click)="scrollToTop()"
      aria-label="Scroll to top of page"
      [attr.aria-hidden]="!showScrollButton()"
    >
      <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>

    <ui-toaster [position]="toasterPosition()" />
    <ui-dialog-container />
  `,
  styles: [
    `
      ui-frontend-shell button[aria-label='Scroll to top of page']:hover {
        background-color: #15803d;
        transform: translateY(-4px);
        box-shadow:
          0 6px 16px rgba(22, 163, 74, 0.5),
          0 2px 8px rgba(0, 0, 0, 0.3);
      }
      ui-frontend-shell button[aria-label='Scroll to top of page']:active {
        transform: translateY(-2px);
      }
    `,
  ],
})
export class FrontendShellComponent {
  readonly toasterPosition = input<ToasterPosition>('bottom-center');

  protected readonly showScrollButton = signal(false);

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showScrollButton.set(window.pageYOffset > 300);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
