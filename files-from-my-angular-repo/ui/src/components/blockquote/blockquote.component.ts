import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

type BlockquoteVariant = 'default' | 'accent' | 'destructive' | 'muted';

const VARIANT_CLASS: Record<BlockquoteVariant, string> = {
  default: 'border-l-border text-foreground',
  accent: 'border-l-primary text-foreground',
  destructive: 'border-l-destructive text-foreground',
  muted: 'border-l-muted-foreground/30 text-muted-foreground',
};

@Component({
  selector: 'ui-blockquote, blockquote[uiBlockquote]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `
    <ng-content />
    @if (cite()) {
      <footer class="mt-2 text-sm text-muted-foreground">— {{ cite() }}</footer>
    }
  `,
})
export class BlockquoteComponent {
  readonly variant = input<BlockquoteVariant>('default');
  readonly cite = input<string>('');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'block border-l-4 pl-4 italic leading-relaxed',
      VARIANT_CLASS[this.variant()],
      this.class(),
    ),
  );
}
