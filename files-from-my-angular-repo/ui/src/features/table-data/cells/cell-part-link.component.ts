import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, output } from '@angular/core';

@Component({
  selector: 'ui-cell-part-link',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': '"flex flex-col gap-0.5"' },
  template: `
    @if (partNumber() || partName()) {
      <a
        class="text-xs font-medium text-primary hover:underline cursor-pointer leading-tight"
        (click)="onLinkClick($event)"
      >
        {{ partNumber() }}
      </a>
      <span class="text-xs text-muted-foreground leading-tight">{{ partName() }}</span>
    } @else {
      <span class="text-muted-foreground">—</span>
    }
  `,
})
export class CellPartLinkComponent {
  readonly partNumber = input<string>('');
  readonly partName = input<string>('');
  readonly linkClick = output<void>();

  protected onLinkClick(event: MouseEvent): void {
    event.stopPropagation();
    this.linkClick.emit();
  }
}
