import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

type ProseSize = 'sm' | 'default' | 'lg';

const SIZE_CLASS: Record<ProseSize, string> = {
  sm: 'prose-sm',
  default: 'prose',
  lg: 'prose-lg',
};

@Component({
  selector: 'ui-prose',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class ProseComponent {
  readonly size = input<ProseSize>('default');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      // Base prose styles using Tailwind arbitrary values since @tailwindcss/typography may not be installed
      'max-w-none text-foreground',
      '[&_h1]:scroll-m-20 [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:tracking-tight',
      '[&_h2]:scroll-m-20 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:mt-6',
      '[&_h3]:scroll-m-20 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:mt-4',
      '[&_p]:leading-7 [&_p]:mt-4 first:[&_p]:mt-0',
      '[&_ul]:ml-6 [&_ul]:mt-4 [&_ul]:list-disc',
      '[&_ol]:ml-6 [&_ol]:mt-4 [&_ol]:list-decimal',
      '[&_li]:mt-1',
      '[&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-muted-foreground',
      '[&_code]:relative [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm',
      '[&_pre]:mt-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4',
      '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
      '[&_hr]:my-6 [&_hr]:border-border',
      '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary/80',
      '[&_strong]:font-semibold',
      '[&_table]:w-full [&_table]:border-collapse',
      '[&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-sm [&_th]:font-medium',
      '[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm',
      SIZE_CLASS[this.size()],
      this.class(),
    ),
  );
}
