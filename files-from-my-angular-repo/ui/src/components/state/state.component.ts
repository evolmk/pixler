import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { cn } from '../../utils/cn';

export type StateType = 'empty' | 'error' | 'warning' | 'success';

const STATE_DEFAULTS: Record<StateType, { title: string }> = {
  empty: { title: 'No data' },
  error: { title: 'Something went wrong' },
  warning: { title: 'Careful, human' },
  success: { title: 'Mission accomplished' },
};

@Component({
  selector: 'ui-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    <!-- Icon or image slot -->
    @if (image()) {
      <img [src]="image()" [alt]="displayTitle()" class="mx-auto mb-4 h-24 w-24 object-contain" />
    } @else {
      <div class="mb-4">
        <ng-content select="[icon]">
          @switch (state()) {
            @case ('empty') {
              <!-- Robot: curious look, magnifying glass -->
              <svg
                class="h-24 w-24 drop-shadow-sm text-muted-foreground"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g stroke="currentColor" stroke-width="5" stroke-linecap="round">
                  <rect x="50" y="40" width="100" height="80" rx="16" fill="transparent" />
                  <line x1="50" y1="70" x2="30" y2="70" />
                  <circle cx="25" cy="70" r="6" fill="transparent" />
                  <line x1="150" y1="70" x2="170" y2="70" />
                  <circle cx="175" cy="70" r="6" fill="transparent" />
                  <circle cx="80" cy="80" r="6" fill="currentColor" />
                  <circle cx="120" cy="80" r="4" fill="currentColor" />
                  <path d="M65 60 L85 65" />
                  <path d="M115 65 L135 60" />
                  <path d="M85 120 L85 130 M115 120 L115 130" />
                  <rect x="80" y="120" width="40" height="10" rx="2" fill="transparent" />
                  <path
                    d="M70 130 C70 130 60 160 70 180 C80 200 120 200 130 180 C140 160 130 130 130 130 H70 Z"
                    fill="transparent"
                  />
                  <path d="M70 145 C50 145 40 160 40 170" />
                  <path d="M35 170 A 5 5 0 0 0 45 170" />
                  <path d="M130 145 C150 145 160 160 160 170" />
                  <g transform="translate(165, 185) rotate(30) scale(1)">
                    <circle cx="0" cy="0" r="15" fill="transparent" />
                    <line x1="0" y1="15" x2="0" y2="35" />
                    <path d="M-5 -5 Q 0 -10 5 -5" stroke-width="2" opacity="0.5" />
                  </g>
                  <line x1="85" y1="180" x2="85" y2="200" />
                  <line x1="115" y1="180" x2="115" y2="200" />
                  <path d="M75 200 H95" />
                  <path d="M105 200 H125" />
                </g>
              </svg>
            }
            @case ('error') {
              <!-- Robot: chevron eyes, straight arms -->
              <svg
                class="h-24 w-24 drop-shadow-sm text-muted-foreground"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g stroke="currentColor" stroke-width="5" stroke-linecap="round">
                  <rect x="50" y="40" width="100" height="80" rx="16" fill="transparent" />
                  <line x1="50" y1="70" x2="30" y2="70" />
                  <circle cx="25" cy="70" r="6" fill="transparent" />
                  <line x1="150" y1="70" x2="170" y2="70" />
                  <circle cx="175" cy="70" r="6" fill="transparent" />
                  <g stroke-linejoin="round">
                    <path d="M70 70 L85 80 L70 90" fill="none" />
                    <path d="M130 70 L115 80 L130 90" fill="none" />
                  </g>
                  <rect x="90" y="100" width="20" height="12" rx="4" fill="none" />
                  <path d="M85 120 L85 130 M115 120 L115 130" />
                  <rect x="80" y="120" width="40" height="10" rx="2" fill="transparent" />
                  <path
                    d="M70 130 C70 130 60 160 70 180 C80 200 120 200 130 180 C140 160 130 130 130 130 H70 Z"
                    fill="transparent"
                  />
                  <path d="M70 145 L20 145" />
                  <path d="M15 140 A 5 5 0 0 0 15 150" />
                  <path d="M130 145 L180 145" />
                  <path d="M185 140 A 5 5 0 0 1 185 150" />
                  <line x1="85" y1="180" x2="85" y2="200" />
                  <line x1="115" y1="180" x2="115" y2="200" />
                  <path d="M75 200 H95" />
                  <path d="M105 200 H125" />
                </g>
              </svg>
            }
            @case ('warning') {
              <!-- Robot: raised brows, crooked mouth, arms up -->
              <svg
                class="h-24 w-24 drop-shadow-sm text-muted-foreground"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g stroke="currentColor" stroke-width="5" stroke-linecap="round">
                  <rect x="50" y="40" width="100" height="80" rx="16" fill="transparent" />
                  <line x1="50" y1="70" x2="30" y2="70" />
                  <circle cx="25" cy="70" r="6" fill="transparent" />
                  <line x1="150" y1="70" x2="170" y2="70" />
                  <circle cx="175" cy="70" r="6" fill="transparent" />
                  <path d="M70 80 L90 80" />
                  <path d="M110 80 L130 80" />
                  <path d="M75 80 A 5 5 0 0 0 85 80" fill="none" />
                  <path d="M115 80 A 5 5 0 0 0 125 80" fill="none" />
                  <path d="M90 105 L110 100" fill="none" />
                  <path d="M85 120 L85 130 M115 120 L115 130" />
                  <rect x="80" y="120" width="40" height="10" rx="2" fill="transparent" />
                  <path
                    d="M70 130 C70 130 60 160 70 180 C80 200 120 200 130 180 C140 160 130 130 130 130 H70 Z"
                    fill="transparent"
                  />
                  <path d="M70 145 C50 145 30 130 20 120" />
                  <path d="M15 115 A 5 5 0 0 0 25 125" />
                  <path d="M130 145 C150 145 170 130 180 120" />
                  <path d="M175 125 A 5 5 0 0 0 185 115" />
                  <line x1="85" y1="180" x2="85" y2="200" />
                  <line x1="115" y1="180" x2="115" y2="200" />
                  <path d="M75 200 H95" />
                  <path d="M105 200 H125" />
                </g>
              </svg>
            }
            @case ('success') {
              <!-- Robot: happy eyes, smile -->
              <svg
                class="h-24 w-24 drop-shadow-sm text-muted-foreground"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                stroke-width="5"
                stroke-linecap="round"
              >
                <rect x="50" y="40" width="100" height="80" rx="16" fill="transparent" />
                <line x1="50" y1="70" x2="30" y2="70" />
                <circle cx="25" cy="70" r="6" fill="transparent" />
                <line x1="150" y1="70" x2="170" y2="70" />
                <circle cx="175" cy="70" r="6" fill="transparent" />
                <path d="M70 80 Q 80 70 90 80" fill="none" />
                <path d="M110 80 Q 120 70 130 80" fill="none" />
                <path d="M90 100 Q 100 110 110 100" />
                <path d="M85 120 L85 130 M115 120 L115 130" />
                <rect x="80" y="120" width="40" height="10" rx="2" fill="transparent" />
                <path
                  d="M70 130 C70 130 60 160 70 180 C80 200 120 200 130 180 C140 160 130 130 130 130 H70 Z"
                  fill="transparent"
                />
                <path d="M70 145 C50 145 30 160 20 170" />
                <path d="M15 170 A 5 5 0 0 0 25 170" />
                <path d="M130 145 C150 145 170 160 180 170" />
                <path d="M175 170 A 5 5 0 0 0 185 170" />
                <line x1="85" y1="180" x2="85" y2="200" />
                <line x1="115" y1="180" x2="115" y2="200" />
                <path d="M75 200 H95" />
                <path d="M105 200 H125" />
              </svg>
            }
          }
        </ng-content>
      </div>
    }

    @if (displayTitle()) {
      <h3 class="text-base font-semibold text-foreground">{{ displayTitle() }}</h3>
    }
    @if (displayDescription()) {
      <p class="mt-1 text-sm text-muted-foreground">{{ displayDescription() }}</p>
    }

    <!-- Action slot -->
    <ng-content select="[actions]" />
    <ng-content />
  `,
})
export class StateComponent {
  readonly state = input<StateType>('empty');
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly image = input<string>('');
  readonly class = input<string>('');

  protected readonly displayTitle = computed(() => this.title() || STATE_DEFAULTS[this.state()].title);
  protected readonly displayDescription = computed(() => this.description());

  protected readonly computedClass = computed(() =>
    cn('flex flex-col items-center justify-center py-12 text-center', this.class()),
  );
}
