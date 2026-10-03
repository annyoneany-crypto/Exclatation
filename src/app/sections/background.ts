import { Component, ElementRef, inject } from '@angular/core';

interface Shape {
  kind: 'blob' | 'star' | 'swirl' | 'dot';
  x: number;
  y: number;
  size: number;
  color: string;
  depth: number;
  dur: number;
  delay: number;
}

const COLORS = ['#7cc8f2', '#3cc4b4', '#fcd34d', '#fde68a', '#bfe6fa', '#ffb04a'];

/** Fixed, parallax background full of blobs, stars and swirls like the logo. */
@Component({
  selector: 'app-background',
  host: { '(window:pointermove)': 'onMove($event)', 'aria-hidden': 'true' },
  template: `
    @for (s of shapes; track $index) {
      <div
        class="shape {{ s.kind }}"
        [style.left.%]="s.x"
        [style.top.%]="s.y"
        [style.width.px]="s.size"
        [style.height.px]="s.size"
        [style.--c]="s.color"
        [style.--d]="s.depth"
        [style.animation-duration.s]="s.dur"
        [style.animation-delay.s]="s.delay">
        @switch (s.kind) {
          @case ('star') {
            <svg viewBox="0 0 100 100"><path d="M50 5 L62 36 L95 38 L69 59 L78 92 L50 73 L22 92 L31 59 L5 38 L38 36 Z" /></svg>
          }
          @case ('swirl') {
            <svg viewBox="0 0 100 100"><path d="M50 50 m0 -6 a6 6 0 1 1 -6 6 a12 12 0 1 1 12 12 a20 20 0 1 1 -20 -20 a30 30 0 1 1 30 30" /></svg>
          }
        }
      </div>
    }
  `,
  styles: `
    :host {
      position: fixed; inset: 0; z-index: -1; overflow: hidden; pointer-events: none;
      background:
        radial-gradient(circle at 50% 40%, #fffaf0 0%, transparent 60%),
        var(--cream);
      --mx: 0; --my: 0;
    }
    .shape {
      position: absolute;
      translate: calc(var(--mx) * var(--d) * -30px) calc(var(--my) * var(--d) * -30px);
      transition: translate 0.6s ease-out;
      animation: drift ease-in-out infinite alternate;
    }
    .blob {
      background: var(--c);
      border-radius: 42% 58% 63% 37% / 41% 44% 56% 59%;
      opacity: .55;
      filter: blur(2px);
      animation-name: morph;
    }
    .dot { background: var(--c); border-radius: 50%; opacity: .7; }
    .star svg path { fill: var(--c); opacity: .85; }
    .star { animation-name: spin-float; }
    .swirl svg path { fill: none; stroke: var(--c); stroke-width: 7; stroke-linecap: round; opacity: .8; }
    .swirl { animation-name: spin-slow; animation-timing-function: linear; }
    svg { width: 100%; height: 100%; overflow: visible; }

    @keyframes drift {
      from { transform: translate(0, 0) rotate(0); }
      to { transform: translate(20px, -30px) rotate(10deg); }
    }
    @keyframes morph {
      0% { border-radius: 42% 58% 63% 37% / 41% 44% 56% 59%; transform: translate(0,0) scale(1); }
      50% { border-radius: 63% 37% 39% 61% / 55% 62% 38% 45%; }
      100% { border-radius: 38% 62% 45% 55% / 62% 35% 65% 38%; transform: translate(30px,-20px) scale(1.08); }
    }
    @keyframes spin-float {
      from { transform: translateY(0) rotate(-15deg) scale(1); }
      to { transform: translateY(-30px) rotate(25deg) scale(1.15); }
    }
    @keyframes spin-slow { to { transform: rotate(360deg); } }
  `,
})
export class Background {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly shapes: Shape[] = this.generate();

  onMove(e: PointerEvent): void {
    if (e.pointerType !== 'mouse') return;
    this.host.style.setProperty('--mx', (e.clientX / innerWidth - 0.5).toFixed(3));
    this.host.style.setProperty('--my', (e.clientY / innerHeight - 0.5).toFixed(3));
  }

  private generate(): Shape[] {
    // Seeded random so the layout is stable between reloads.
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const shapes: Shape[] = [];
    const add = (kind: Shape['kind'], n: number, min: number, max: number) => {
      for (let i = 0; i < n; i++) {
        shapes.push({
          kind,
          x: rnd() * 100 - 5,
          y: rnd() * 100 - 5,
          size: min + rnd() * (max - min),
          color: COLORS[Math.floor(rnd() * COLORS.length)],
          depth: 0.3 + rnd() * 1.4,
          dur: kind === 'swirl' ? 20 + rnd() * 20 : 6 + rnd() * 8,
          delay: -rnd() * 10,
        });
      }
    };
    add('blob', 9, 140, 360);
    add('dot', 18, 14, 50);
    add('star', 8, 30, 70);
    add('swirl', 4, 60, 110);
    return shapes;
  }
}
