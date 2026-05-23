import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { cn } from '../../utils/cn';

@Component({
  selector: 'ui-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class CardComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('block rounded-xl border bg-card text-card-foreground shadow', this.class()),
  );
}

@Component({
  selector: 'ui-card-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class CardHeaderComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('flex flex-col space-y-1.5 p-6', this.class()),
  );
}

@Component({
  selector: 'ui-card-title',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class CardTitleComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('font-semibold leading-none tracking-tight', this.class()),
  );
}

@Component({
  selector: 'ui-card-description',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class CardDescriptionComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('text-sm text-muted-foreground', this.class()),
  );
}

@Component({
  selector: 'ui-card-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class CardContentComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('block p-6 pt-0', this.class()));
}

@Component({
  selector: 'ui-card-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class CardFooterComponent {
  readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('flex items-center p-6 pt-0', this.class()),
  );
}
