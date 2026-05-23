import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  input,
  output,
  signal,
} from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { InputComponent } from '../../../../components/input/input.component';

@Component({
  selector: 'ui-filter-text-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [InputComponent],
  template: `
    <input
      uiInput
      type="text"
      size="sm"
      [placeholder]="placeholder()"
      [value]="localValue()"
      (input)="onInput($event)"
    />
  `,
})
export class FilterTextSearchComponent implements OnInit, OnDestroy {
  readonly placeholder = input<string>('Search...');
  readonly value = input<string>('');
  readonly valueChange = output<string>();

  protected readonly localValue = signal('');
  private readonly _input$ = new Subject<string>();
  private readonly _destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.localValue.set(this.value() ?? '');
    this._input$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this._destroy$))
      .subscribe((val) => this.valueChange.emit(val));
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  protected onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.localValue.set(val);
    this._input$.next(val);
  }
}
