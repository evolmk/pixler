import { Injectable, signal, type WritableSignal } from '@angular/core';
import type { EmblaPluginType } from 'embla-carousel-angular';
import type { CarouselPluginConfig } from './carousel.types';

/**
 * Builds the Embla plugin array from the carousel's plugin inputs.
 * Uses dynamic import() for each plugin so unused plugins are tree-shaken
 * and code-split from the initial bundle.
 *
 * Provided per CarouselComponent instance (not root-level).
 */
@Injectable()
export class CarouselPluginService {
  /** Reactive array of built plugin instances — updates after async load completes. */
  readonly builtPlugins: WritableSignal<EmblaPluginType[]> = signal<EmblaPluginType[]>([]);

  /**
   * Rebuilds the plugin array from the given config.
   * Call this in an effect whenever plugin inputs change.
   */
  load(config: CarouselPluginConfig): void {
    void this._build(config).then((plugins) => this.builtPlugins.set(plugins));
  }

  private async _build(config: CarouselPluginConfig): Promise<EmblaPluginType[]> {
    const plugins: EmblaPluginType[] = [];

    // ── Autoplay ──────────────────────────────────────────────────────────────
    if (config.autoplay) {
      const { default: Autoplay } = await import('embla-carousel-autoplay');
      plugins.push(
        Autoplay({
          delay: config.autoplayDelay,
          playOnInit: true,
          stopOnInteraction: config.autoplayStopOnInteraction,
          stopOnMouseEnter: false, // Handled at component level for delayed resume
          stopOnLastSnap: config.autoplayStopOnLastSnap,
        }),
      );
    }

    // ── Auto Scroll (continuous, no snap) ─────────────────────────────────────
    if (config.autoScroll) {
      const { default: AutoScroll } = await import('embla-carousel-auto-scroll');
      plugins.push(
        AutoScroll({
          speed: config.autoScrollSpeed,
          direction: config.autoScrollDirection,
          playOnInit: true,
          stopOnInteraction: config.autoScrollStopOnInteraction,
        }),
      );
    }

    // ── Auto Height ───────────────────────────────────────────────────────────
    if (config.autoHeight) {
      const { default: AutoHeight } = await import('embla-carousel-auto-height');
      plugins.push(AutoHeight());
    }

    // ── Fade / Crossfade ─────────────────────────────────────────────────────
    if (config.transition === 'fade' || config.transition === 'crossfade') {
      const { default: Fade } = await import('embla-carousel-fade');
      plugins.push(Fade());
    }

    // ── Class Names ───────────────────────────────────────────────────────────
    if (config.classNames) {
      const { default: ClassNames } = await import('embla-carousel-class-names');
      plugins.push(
        ClassNames({
          snapped: config.classNameSnapped,
          inView: config.classNameInView,
          draggable: config.classNameDraggable,
          dragging: config.classNamePointerDown,
        }),
      );
    }

    // ── Wheel Gestures ────────────────────────────────────────────────────────
    if (config.wheelGestures) {
      const { WheelGesturesPlugin } = await import('embla-carousel-wheel-gestures');
      const opts: Record<string, unknown> = {};
      if (config.wheelForceAxis !== undefined) opts['forceWheelAxis'] = config.wheelForceAxis;
      plugins.push(WheelGesturesPlugin(opts));
    }

    return plugins;
  }
}
