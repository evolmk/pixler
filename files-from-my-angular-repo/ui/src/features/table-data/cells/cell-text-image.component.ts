import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  inject,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'ui-cell-text-image',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '"block w-full h-full -m-4 p-4"',
    '(mouseenter)': 'onEnter()',
    '(mouseleave)': 'onLeave()',
  },
  template: `
    @if (text()) {
      <span class="text-foreground whitespace-nowrap">{{ text() }}</span>
      @if (imageSrc() && visible()) {
        <div
          class="pointer-events-none fixed z-[9999] rounded-md border border-border bg-popover p-1 shadow-lg transition-opacity duration-200"
          [class.opacity-0]="!shown()"
          [class.opacity-100]="shown()"
          [style.top.px]="popY()"
          [style.left.px]="popX()"
        >
          <img [src]="imageSrc()!" [alt]="text()" class="max-w-[200px] max-h-[200px] rounded object-contain" />
        </div>
      }
    } @else {
      <span class="text-muted-foreground">—</span>
    }
  `,
})
export class CellTextImageComponent {
  readonly text = input<string>('');
  readonly imageSrc = input<string | null>(null);

  protected readonly visible = signal(false);
  protected readonly shown = signal(false);
  protected readonly popX = signal(0);
  protected readonly popY = signal(0);

  private readonly el = inject(ElementRef);
  private delayTimer: ReturnType<typeof setTimeout> | null = null;

  protected onEnter(): void {
    if (!this.imageSrc()) return;
    const rect = (this.el.nativeElement as HTMLElement).getBoundingClientRect();
    this.popX.set(rect.left);
    this.popY.set(rect.bottom + 4);
    this.visible.set(true);
    this.delayTimer = setTimeout(() => this.shown.set(true), 300);
  }

  protected onLeave(): void {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
    this.shown.set(false);
    this.visible.set(false);
  }
}
