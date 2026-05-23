// @ts-nocheck
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Meta, StoryObj } from '@storybook/angular';

import { ButtonComponent } from '../components/button/button.component';
import { StateComponent } from '../components/state/state.component';

type OverlayMode = 'offline' | 'error' | 'success';

// ── Inline demo component ───────────────────────────────────────────────────

@Component({
  selector: 'demo-error-handling',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StateComponent, ButtonComponent],
  template: `
    <!-- Mode toggle bar -->
    <div class="fixed left-0 right-0 top-0 z-[10000] flex items-center gap-3 border-b border-border bg-card px-6 py-3">
      <span class="text-sm font-medium text-foreground">Simulate:</span>
      <button uiButton [variant]="mode() === 'offline' ? 'default' : 'outline'" size="sm" (click)="setMode('offline')">
        Offline
      </button>
      <button uiButton [variant]="mode() === 'error' ? 'default' : 'outline'" size="sm" (click)="setMode('error')">
        Server Error
      </button>
      <button uiButton [variant]="showAdminDetail() ? 'default' : 'outline'" size="sm" (click)="toggleAdminDetail()">
        Server Error (Admin)
      </button>
      <button uiButton [variant]="mode() === 'success' ? 'default' : 'outline'" size="sm" (click)="setMode('success')">
        Success
      </button>
      <div class="ml-auto text-xs text-muted-foreground">
        Toggle between overlay modes. Server Error (Admin) shows raw error info.
      </div>
    </div>

    <!-- Full-page overlay preview -->
    <div class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background pt-14">
      <!-- Close button -->
      <button
        class="absolute right-4 top-16 flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Close overlay"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>

      <ui-state class="py-6" [state]="stateType()" [title]="stateTitle()" [description]="stateDescription()" />

      <!-- Admin error detail -->
      @if (mode() === 'error' && showAdminDetail()) {
        <pre
          class="mt-4 max-w-2xl overflow-auto rounded-md bg-muted px-6 py-4 font-mono text-xs text-muted-foreground"
          >{{ sampleError }}</pre
        >
      }

      <!-- Action button -->
      <button uiButton size="lg" class="mt-8 rounded-full px-8">
        {{ mode() === 'success' ? 'Continue' : 'Refresh' }}
      </button>
    </div>
  `,
})
class DemoErrorHandlingComponent {
  readonly mode = signal<OverlayMode>('offline');
  readonly showAdminDetail = signal(false);

  readonly stateType = computed(() => {
    const m = this.mode();
    if (m === 'offline') return 'warning';
    if (m === 'success') return 'success';
    return 'error';
  });

  readonly stateTitle = computed(() => {
    const m = this.mode();
    if (m === 'offline') return "You're Offline";
    if (m === 'success') return 'Success';
    return 'Failed to load data';
  });

  readonly stateDescription = computed(() => {
    const m = this.mode();
    if (m === 'offline') return 'Please connect to the internet and try again.';
    if (m === 'success') return 'Your order #12345 has been submitted successfully and is now being processed.';
    return 'An unexpected error occurred. Please try again or contact support.';
  });

  readonly sampleError = `Error: connect ECONNREFUSED 127.0.0.1:3000
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1555:16)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)

Request: GET /api/v1/customers?page=1&limit=25
Status: 500 Internal Server Error
Timestamp: 2026-03-09T14:23:07.412Z`;

  setMode(mode: OverlayMode): void {
    this.mode.set(mode);
  }

  toggleAdminDetail(): void {
    this.showAdminDetail.update((v) => !v);
  }
}

// ── Story config ────────────────────────────────────────────────────────────

const meta: Meta<DemoErrorHandlingComponent> = {
  title: 'Demos/Error Handling',
  component: DemoErrorHandlingComponent,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<DemoErrorHandlingComponent>;

export const Default: Story = {
  name: 'Error Handling',
};
