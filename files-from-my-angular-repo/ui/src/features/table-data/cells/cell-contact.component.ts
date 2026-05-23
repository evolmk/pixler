import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import {
  AvatarComponent,
  AvatarFallbackComponent,
  AvatarImageComponent,
} from '../../../components/avatar/avatar.component';
import { cn } from '../../../utils/cn';
import { avatarBgFromName } from '../utils/avatar-color';

@Component({
  selector: 'ui-cell-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [AvatarComponent, AvatarImageComponent, AvatarFallbackComponent],
  host: { '[class]': 'computedClass()' },
  template: `
    <ui-avatar size="xs" shape="circle">
      @if (avatarSrc()) {
        <ui-avatar-image [src]="avatarSrc()!" [alt]="name()" />
      }
      <ui-avatar-fallback [class]="fallbackClass()">
        {{ initials() }}
      </ui-avatar-fallback>
    </ui-avatar>
    <div class="flex flex-col min-w-0">
      <span class="text-foreground truncate">{{ name() }}</span>
      @if (description()) {
        <span class="text-muted-foreground text-xs truncate">{{ description() }}</span>
      }
    </div>
  `,
})
export class CellContactComponent {
  readonly name = input.required<string>();
  readonly description = input<string>('');
  /** Optional separate name used for avatar initials and color. Falls back to `name`. */
  readonly initialsFrom = input<string>('');
  readonly avatarSrc = input<string | null>(null);
  readonly class = input<string>('');

  private readonly avatarName = computed(() => this.initialsFrom() || this.name());

  protected readonly initials = computed(() => {
    const parts = this.avatarName().trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return this.avatarName().slice(0, 2).toUpperCase();
  });

  protected readonly fallbackClass = computed(() =>
    cn('text-white text-[10px] font-semibold', avatarBgFromName(this.avatarName())),
  );

  protected readonly computedClass = computed(() => cn('flex items-center gap-2', this.class()));
}
