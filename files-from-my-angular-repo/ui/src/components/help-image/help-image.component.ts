import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { cn } from '../../utils/cn';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';
import { HoverCardComponent, type HoverCardPlacement } from '../hover-card/hover-card.component';
import { HoverCardContentComponent } from '../hover-card/hover-card.component';
import { DialogService } from '../../services/dialog.service';
import { HelpImageDialogComponent } from './help-image-dialog.component';
import { Info } from 'lucide-angular';

@Component({
  selector: 'ui-help-image',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [IconComponent, ButtonComponent, HoverCardComponent, HoverCardContentComponent],
  host: { '[class]': 'computedClass()' },
  template: `
    <!-- Desktop: hover to preview -->
    <ui-hover-card class="hidden md:inline-block">
      <button
        type="button"
        uiButton
        variant="ghost"
        size="sm"
        class="!h-6 !px-2 !text-xs text-amber-600 hover:!text-amber-700 hover:!bg-amber-50"
      >
        <ui-icon [name]="infoIcon" size="sm" class="mr-1" />
        {{ label() }}
      </button>
      <ui-hover-card-content [placement]="placement()" [class]="'!w-auto p-2 ' + contentClass()">
        <img [src]="imageUrl()" [alt]="title()" class="h-auto rounded" [style.max-width]="maxWidth()" />
      </ui-hover-card-content>
    </ui-hover-card>
    <!-- Mobile: click to open dialog -->
    <button
      type="button"
      uiButton
      variant="ghost"
      size="sm"
      class="!h-6 !px-2 !text-xs text-amber-600 hover:!text-amber-700 hover:!bg-amber-50 md:hidden"
      (click)="_openDialog()"
    >
      <ui-icon [name]="infoIcon" size="sm" class="mr-1" />
      {{ label() }}
    </button>
  `,
})
export class HelpImageComponent {
  readonly title = input.required<string>();
  readonly imageUrl = input.required<string>();
  readonly label = input<string>('Help');
  readonly placement = input<HoverCardPlacement>('auto');
  readonly maxWidth = input<string>('400px');
  readonly class = input<string>('');
  readonly contentClass = input<string>('');

  protected readonly infoIcon = Info;
  private readonly dialogService = inject(DialogService);

  protected readonly computedClass = computed(() => cn('inline-flex', this.class()));

  protected _openDialog(): void {
    this.dialogService.open(HelpImageDialogComponent, {
      data: { title: this.title(), imageUrl: this.imageUrl() },
      size: 'lg',
    });
  }
}
