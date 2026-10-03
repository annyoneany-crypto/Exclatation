import { Component, computed, inject, input } from '@angular/core';
import { LangService } from '../core/i18n/lang.service';

/** Two tilted, endlessly scrolling ribbons. */
@Component({
  selector: 'app-marquee',
  host: { '[class.flip]': 'flip()' },
  template: `
    <div class="ribbon r1">
      <div class="track">
        @for (w of words(); track $index) {
          <span>{{ w }}</span><b>!</b>
        }
      </div>
    </div>
    <div class="ribbon r2">
      <div class="track reverse">
        @for (w of words(); track $index) {
          <span>{{ w }}</span><b>★</b>
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; height: 170px; overflow: hidden; margin: 40px 0; }
    .ribbon {
      position: absolute; left: -5%; width: 110%; top: 50%;
      border-block: var(--border); padding: 12px 0; overflow: hidden;
    }
    .r1 { background: var(--orange); transform: translateY(-50%) rotate(-3deg); z-index: 2; box-shadow: 0 6px 0 var(--navy); }
    .r2 { background: var(--teal); transform: translateY(-50%) rotate(2.5deg); }
    :host(.flip) .r1 { transform: translateY(-50%) rotate(3deg); }
    :host(.flip) .r2 { transform: translateY(-50%) rotate(-2.5deg); }
    .track {
      display: flex; gap: 26px; align-items: center; width: max-content;
      animation: scroll 30s linear infinite;
      font-family: var(--font-display); font-size: 34px; color: var(--white);
      -webkit-text-stroke: 2px var(--navy); paint-order: stroke fill; white-space: nowrap;
    }
    .reverse { animation-direction: reverse; animation-duration: 38s; }
    b { font-weight: 400; color: var(--yellow); display: inline-block; animation: wiggle 1s ease-in-out infinite; }
    @keyframes scroll { to { transform: translateX(-50%); } }
  `,
})
export class Marquee {
  readonly flip = input(false);
  private readonly t = inject(LangService).t;
  // Duplicated so the -50% loop is seamless.
  protected readonly words = computed(() => {
    const w = this.t().marquee;
    return [...w, ...w, ...w, ...w];
  });
}
