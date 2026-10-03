import { Component, inject } from '@angular/core';
import { LangService } from '../core/i18n/lang.service';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-roadmap',
  imports: [RevealDirective],
  template: `
    <section id="roadmap" class="section container">
      <div class="section-head">
        <span class="kicker" appReveal="pop">{{ t().roadmap.kicker }}</span>
        <h2 class="title" appReveal>{{ t().roadmap.title }}</h2>
        <p class="lead" appReveal [revealDelay]="100">{{ t().roadmap.intro }}</p>
      </div>

      <div class="eq" aria-hidden="true">
        @for (b of bars; track $index) {
          <i [style.animation-delay.ms]="b"></i>
        }
      </div>

      <div class="levels">
        @for (lvl of t().roadmap.levels; track $index) {
          <article class="level card" [style.--i]="$index" appReveal="up" [revealDelay]="$index * 150">
            <div class="vol">
              <span class="bang">{{ lvl.bang }}</span>
              <span class="lv">LVL {{ $index + 1 }}</span>
            </div>
            <h3>{{ lvl.name }}</h3>
            <ul>
              @for (item of lvl.items; track $index) {
                <li>{{ item }}</li>
              }
            </ul>
            <div class="meter"><b [style.width.%]="($index + 1) * 25"></b></div>
          </article>
        }
      </div>
      <p class="note" appReveal>⚠️ {{ t().roadmap.note }}</p>
    </section>
  `,
  styles: `
    .eq {
      display: flex; justify-content: center; align-items: flex-end; gap: 6px; height: 70px; margin: -20px 0 40px;
      i {
        width: 12px; height: 100%; border: 3px solid var(--navy); border-radius: 6px; background: var(--orange);
        transform-origin: bottom; animation: eq 0.9s ease-in-out infinite alternate;
      }
      i:nth-child(3n) { background: var(--teal); }
      i:nth-child(4n) { background: var(--yellow); }
    }
    .levels { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; align-items: end; }
    .level {
      padding: 24px 22px; margin-bottom: calc(var(--i) * 30px);
      transition: opacity .7s, transform .4s cubic-bezier(.3,1.8,.5,1);
      &:hover { transform: translateY(-10px) rotate(calc((var(--i) - 1.5) * 1.5deg)); }
      &:hover .bang { animation: shout .5s ease-in-out infinite; }
      &:nth-child(1) { background: var(--white); }
      &:nth-child(2) { background: var(--yellow-soft); }
      &:nth-child(3) { background: #ffd8b0; }
      &:nth-child(4) { background: var(--orange); color: var(--white); h3 { -webkit-text-stroke: 1.5px var(--navy); paint-order: stroke fill; } }
      h3 { font-size: calc(24px + var(--i) * 3px); margin: 6px 0 12px; }
      ul { margin: 0 0 18px; padding-left: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
      li { position: relative; padding-left: 26px; font-weight: 700; font-size: 15.5px; }
      li::before {
        content: '✔'; position: absolute; left: 0; top: 0; width: 20px; height: 20px; font-size: 12px;
        display: grid; place-items: center; border-radius: 6px; background: var(--teal); color: var(--white);
        border: 2px solid var(--navy);
      }
    }
    .vol { display: flex; align-items: center; justify-content: space-between; }
    .bang {
      display: inline-block; font-family: var(--font-display); font-size: calc(40px + var(--i) * 10px); line-height: 1;
      color: var(--orange); -webkit-text-stroke: 2.5px var(--navy); paint-order: stroke fill; letter-spacing: -2px;
    }
    .level:nth-child(4) .bang { color: var(--yellow); }
    .lv {
      font-family: var(--font-display); font-size: 15px; padding: 2px 10px; border-radius: 999px;
      background: var(--navy); color: var(--white);
    }
    .meter {
      height: 14px; border: 3px solid var(--navy); border-radius: 999px; background: var(--white); overflow: hidden;
      b { display: block; height: 100%; background: linear-gradient(90deg, var(--teal), var(--yellow), var(--coral)); }
    }
    .note { text-align: center; margin-top: 40px; font-weight: 800; color: var(--navy-soft); }
    @keyframes eq { from { transform: scaleY(.2); } to { transform: scaleY(1); } }
    @keyframes shout {
      0%, 100% { transform: scale(1) rotate(0); }
      25% { transform: scale(1.15) rotate(-6deg); }
      75% { transform: scale(1.15) rotate(6deg); }
    }
    @media (max-width: 1000px) {
      .levels { grid-template-columns: repeat(2, 1fr); }
      .level { margin-bottom: 0; }
    }
    @media (max-width: 560px) { .levels { grid-template-columns: 1fr; } }
  `,
})
export class Roadmap {
  protected readonly t = inject(LangService).t;
  protected readonly bars = Array.from({ length: 24 }, (_, i) => (i * 137) % 900);
}
