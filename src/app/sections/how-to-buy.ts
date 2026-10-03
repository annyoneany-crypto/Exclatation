import { Component, inject } from '@angular/core';
import { LangService } from '../core/i18n/lang.service';
import { pumpFunUrl } from '../core/token.config';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-how-to-buy',
  imports: [RevealDirective],
  template: `
    <section id="buy" class="section container">
      <div class="section-head">
        <span class="kicker" appReveal="pop">{{ t().buy.kicker }}</span>
        <h2 class="title" appReveal>{{ t().buy.title }}</h2>
        <p class="lead" appReveal [revealDelay]="100">{{ t().buy.intro }}</p>
      </div>

      <div class="path">
        <svg class="road" viewBox="0 0 100 400" preserveAspectRatio="none" aria-hidden="true">
          <path d="M50 0 C 90 60, 10 140, 50 200 S 90 340, 50 400" />
        </svg>
        @for (s of t().buy.steps; track $index) {
          <div class="step" [class.right]="$index % 2 === 1">
            <div class="bubble" appReveal="pop">{{ s.icon }}</div>
            <article class="card" [appReveal]="$index % 2 ? 'right' : 'left'">
              <span class="n">{{ $index + 1 }}</span>
              <h3>{{ s.title }}</h3>
              <p>{{ s.text }}</p>
            </article>
          </div>
        }
      </div>

      <div class="extra">
        <div class="after card" appReveal="left">
          <h3>🎓 {{ t().buy.afterTitle }}</h3>
          <p>{{ t().buy.afterText }}</p>
          <a class="btn" [href]="pumpUrl" target="_blank" rel="noopener">🚀 {{ t().nav.cta }}</a>
        </div>
        <div class="safety card" appReveal="right">
          <h3>🛡️ {{ t().buy.safetyTitle }}</h3>
          <ul>
            @for (tip of t().buy.safety; track $index) {
              <li><span>!</span>{{ tip }}</li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
  styles: `
    .path { position: relative; display: flex; flex-direction: column; gap: 36px; }
    .road {
      position: absolute; left: 50%; top: 0; width: 160px; height: 100%; transform: translateX(-50%);
      overflow: visible; z-index: 0;
      path { fill: none; stroke: var(--navy); stroke-width: 5; stroke-dasharray: 2 14; stroke-linecap: round;
             vector-effect: non-scaling-stroke; animation: march 1s linear infinite; }
    }
    .step {
      position: relative; z-index: 1; display: grid; grid-template-columns: 1fr 110px 1fr; align-items: center;
      .card { grid-column: 1; grid-row: 1; }
      .bubble { grid-column: 2; grid-row: 1; }
      &.right .card { grid-column: 3; }
    }
    .bubble {
      justify-self: center; width: 90px; height: 90px; display: grid; place-items: center; font-size: 42px;
      background: var(--yellow); border: var(--border); border-radius: 50%; box-shadow: var(--shadow-sm);
      animation: float 3s ease-in-out infinite;
    }
    .step:nth-child(odd) .bubble { background: var(--sky); animation-delay: -1s; }
    .card {
      position: relative; padding: 26px 26px 22px; transition: opacity .7s, transform .4s cubic-bezier(.3,1.8,.5,1);
      &:hover { transform: scale(1.03) rotate(-1deg); }
      h3 { font-size: 28px; margin-bottom: 8px; }
      p { margin: 0; color: var(--navy-soft); }
    }
    .n {
      position: absolute; top: -20px; right: 20px; font-family: var(--font-display); font-size: 22px;
      background: var(--orange); color: var(--white); border: 3px solid var(--navy); border-radius: 12px;
      padding: 0 12px; box-shadow: 3px 3px 0 var(--navy); transform: rotate(6deg);
    }
    .extra { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-top: 70px; }
    .after, .safety { padding: 28px; transition: opacity .7s, transform .8s cubic-bezier(.2,1.4,.4,1); }
    .after { background: var(--sky-soft); h3 { font-size: 30px; margin-bottom: 10px; } }
    .safety {
      background: #ffe1df;
      h3 { font-size: 30px; margin-bottom: 14px; }
      ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
      li { display: flex; gap: 12px; align-items: center; font-weight: 800; }
      li span {
        flex: none; width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%;
        background: var(--coral); color: var(--white); border: 3px solid var(--navy); font-family: var(--font-display);
        animation: wiggle 1.6s ease-in-out infinite;
      }
      li:nth-child(2) span { animation-delay: .2s; }
      li:nth-child(3) span { animation-delay: .4s; }
      li:nth-child(4) span { animation-delay: .6s; }
    }
    @keyframes march { to { stroke-dashoffset: -16; } }
    @media (max-width: 800px) {
      .road { left: 45px; width: 60px; }
      .step, .step.right { grid-template-columns: 90px 1fr; gap: 12px; }
      .step .card, .step.right .card { grid-column: 2; }
      .step .bubble { grid-column: 1; width: 72px; height: 72px; font-size: 34px; }
      .extra { grid-template-columns: 1fr; }
    }
  `,
})
export class HowToBuy {
  protected readonly t = inject(LangService).t;
  protected readonly pumpUrl = pumpFunUrl();
}
