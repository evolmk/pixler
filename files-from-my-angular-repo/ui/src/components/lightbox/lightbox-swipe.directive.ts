import { Directive, ElementRef, NgZone, OnDestroy, OnInit, inject, input, output } from '@angular/core';

export interface SwipeEvent {
  direction: 'left' | 'right' | 'up' | 'down';
  deltaX: number;
  deltaY: number;
  velocity: number;
}

export interface DragMoveEvent {
  deltaX: number;
  deltaY: number;
}

/**
 * Pointer-events based swipe/drag directive (no HammerJS, no external gesture lib).
 *
 * - Horizontal swipe: emits (swipe) with direction 'left' | 'right'
 * - Vertical drag: emits (dragMove) continuously; (dragEnd) on release
 * - Used by ui-lightbox for slide navigation (horizontal) and drag-to-close (vertical)
 */
@Directive({
  selector: '[lbSwipe]',
  standalone: true,
})
export class LightboxSwipeDirective implements OnInit, OnDestroy {
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _zone = inject(NgZone);

  /** Minimum horizontal px before a horizontal swipe is registered. */
  readonly swipeThreshold = input<number>(50);

  /** Minimum vertical drag px before dragMove events fire. */
  readonly dragThreshold = input<number>(10);

  /** When true, pointer events are ignored (e.g., when zoomed in). */
  readonly disabled = input<boolean>(false);

  /** Fired once when horizontal swipe threshold is crossed. */
  readonly swipe = output<SwipeEvent>();

  /** Fired continuously during vertical drag (for drag-to-close visual feedback). */
  readonly dragMove = output<DragMoveEvent>();

  /** Fired on pointer-up after a vertical drag. DeltaY is total distance. */
  readonly dragEnd = output<DragMoveEvent>();

  // ─── Internal pointer state ───────────────────────────────────────────────────

  private _startX = 0;
  private _startY = 0;
  private _startTime = 0;
  private _isDragging = false;
  private _axis: 'h' | 'v' | null = null; // locked axis once determined
  private _pointerId: number | null = null;

  // Bound listeners (stored for cleanup)
  private readonly _onDown = this._handlePointerDown.bind(this);
  private readonly _onMove = this._handlePointerMove.bind(this);
  private readonly _onUp = this._handlePointerUp.bind(this);
  private readonly _onCancel = this._handlePointerCancel.bind(this);

  ngOnInit(): void {
    // Run outside Angular zone to avoid triggering CD on every pointer event
    this._zone.runOutsideAngular(() => {
      const el: HTMLElement = this._el.nativeElement;
      el.addEventListener('pointerdown', this._onDown, { passive: true });
      el.addEventListener('pointermove', this._onMove, { passive: true });
      el.addEventListener('pointerup', this._onUp);
      el.addEventListener('pointercancel', this._onCancel);
    });
  }

  ngOnDestroy(): void {
    const el: HTMLElement = this._el.nativeElement;
    el.removeEventListener('pointerdown', this._onDown);
    el.removeEventListener('pointermove', this._onMove);
    el.removeEventListener('pointerup', this._onUp);
    el.removeEventListener('pointercancel', this._onCancel);
  }

  private _handlePointerDown(event: PointerEvent): void {
    if (this.disabled()) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    this._pointerId = event.pointerId;
    this._startX = event.clientX;
    this._startY = event.clientY;
    this._startTime = Date.now();
    this._isDragging = true;
    this._axis = null;
  }

  private _handlePointerMove(event: PointerEvent): void {
    if (!this._isDragging || event.pointerId !== this._pointerId) return;

    const deltaX = event.clientX - this._startX;
    const deltaY = event.clientY - this._startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Lock axis on first significant movement
    if (this._axis === null) {
      const minMovement = Math.max(this.dragThreshold(), 5);
      if (absX > minMovement || absY > minMovement) {
        this._axis = absX > absY ? 'h' : 'v';
      }
    }

    // Emit drag move for vertical axis (drag-to-close feedback)
    if (this._axis === 'v' && absY > this.dragThreshold()) {
      this._zone.run(() => this.dragMove.emit({ deltaX, deltaY }));
    }
  }

  private _handlePointerUp(event: PointerEvent): void {
    if (!this._isDragging || event.pointerId !== this._pointerId) return;

    const deltaX = event.clientX - this._startX;
    const deltaY = event.clientY - this._startY;
    const elapsed = Date.now() - this._startTime;
    const absX = Math.abs(deltaX);
    const velocity = absX / Math.max(elapsed, 1); // px/ms

    if (this._axis === 'h' && absX >= this.swipeThreshold()) {
      this._zone.run(() =>
        this.swipe.emit({
          direction: deltaX < 0 ? 'left' : 'right',
          deltaX,
          deltaY,
          velocity,
        }),
      );
    } else if (this._axis === 'v') {
      this._zone.run(() => this.dragEnd.emit({ deltaX, deltaY }));
    }

    this._reset();
  }

  private _handlePointerCancel(): void {
    if (this._isDragging) {
      this._zone.run(() => this.dragEnd.emit({ deltaX: 0, deltaY: 0 }));
    }
    this._reset();
  }

  private _reset(): void {
    this._isDragging = false;
    this._axis = null;
    this._pointerId = null;
  }
}
