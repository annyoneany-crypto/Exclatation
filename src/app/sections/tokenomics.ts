import { Component, computed, inject, signal } from '@angular/core';
import { LangService } from '../core/i18n/lang.service';
import { RevealDirective } from '../shared/reveal.directive';

const R = 80;
const C = 2 * Math.PI * R;
const COLORS = ['#ff8a1f', '#3cc4b4', '#fcd34d'];

@Component({
  selector: 'app-tokenomics',
  imports: [RevealDirective],
  template: `
    <section id="tokenomics" class="section container">
      <div class="section-head">
        <span class="kicker" appReveal="pop">{{ t().tokenomics.kicker }}</span>
        <h2 class="title" appReveal>{{ t().tokenomics.title }}</h2>
        <p class="lead" appReveal [revealDelay]="100">{{ t().tokenomics.intro }}</p>
      </div>

      <div class="grid">
        <div class="donut-wrap" appReveal="pop">
          <svg class="donut" viewBox="0 0 200 200">
            <circle cx="100" cy="100" [attr.r]="R" class="base" />
            <circle cx="100" cy="100" r="58" class="hole" />
            @for (s of segments(); track $index) {
              <circle
                cx="100" cy="100" [attr.r]="R"
                class="seg" [class.active]="active() === $index"
                [style.stroke]="s.color"
                [style.--len]="s.len"
                [style.--c]="C"
                [style.transition-delay.ms]="300 + $index * 400"
                [attr.transform]="'rotate(' + s.rot + ' 100 100)'"
                (mouseenter)="active.set($index)" />
            }
          </svg>
          <div class="center">
            <b>{{ activeSlice().pct }}%</b>
            <span>{{ activeSlice().label }}</span>
          </div>
          <span class="floaty f1">!</span>
          <span class="floaty f2">★</span>
        </div>

        <div class="legend">
          @for (s of t().tokenomics.slices; track $index) {
            <button
              class="item card"
              [class.active]="active() === $index"
              (mouseenter)="active.set($index)"
              (focus)="active.set($index)"
              (click)="active.set($index)"
              appReveal="right"
              [revealDelay]="$index * 120">
              <i [style.background]="colors[$index]"></i>
              <div>
                <h4>{{ s.label }} <small>{{ s.pct }}%</small></h4>
                <strong>{{ s.amount }} $!</strong>
                <p>{{ s.text }}</p>
              </div>
            </button>
          }
        </div>
      </div>

      <div class="id-card card" appReveal="tilt">
        <div class="id-head">
          <img src="logo.jpg" alt="" />
          <h3>{{ t().tokenomics.detailsTitle }}</h3>
          <span class="stamp">VERIFIED<br />LOUD</span>
        </div>
        <dl>
          @for (row of t().tokenomics.details; track $index) {
            <div class="row">
              <dt>{{ row[0] }}</dt>
              <dd>{{ row[1] }}</dd>
            </div>
          }
        </dl>
      </div>
    </section>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center; margin-bottom: 70px; }
    .donut-wrap { position: relative; max-width: 440px; margin: 0 auto; width: 100%; }
    .donut { width: 100%; transform: rotate(-90deg); overflow: visible; filter: drop-shadow(6px 6px 0 var(--navy)); }
    .base { fill: none; stroke: var(--navy); stroke-width: 48; }
    .hole { fill: var(--white); }
    .seg {
      fill: none; stroke-width: 40; cursor: pointer;
      stroke-dasharray: 0 var(--c);
      transition: stroke-dasharray 1.2s cubic-bezier(.5,0,.2,1), stroke-width .3s;
    }
    .seg.active { stroke-width: 46; }
    .donut-wrap.revealed .seg { stroke-dasharray: var(--len) var(--c); }
    .center {
      position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
      text-align: center; pointer-events: none;
      b { font-family: var(--font-display); font-weight: 400; font-size: clamp(40px, 6vw, 64px); line-height: 1;
          color: var(--orange); -webkit-text-stroke: 3px var(--navy); paint-order: stroke fill; }
      span { font-weight: 900; max-width: 140px; }
    }
    .floaty {
      position: absolute; font-family: var(--font-display); font-size: 54px; color: var(--yellow);
      -webkit-text-stroke: 2px var(--navy); paint-order: stroke fill; animation: float 3s ease-in-out infinite;
    }
    .f1 { top: -10px; right: 10px; color: var(--orange); }
    .f2 { bottom: 0; left: 0; animation-delay: -1.5s; }

    .legend { display: flex; flex-direction: column; gap: 18px; }
    .item {
      display: flex; gap: 16px; align-items: flex-start; text-align: left; padding: 18px 20px; cursor: pointer;
      font: inherit; color: inherit;
      transition: opacity .7s, transform .3s cubic-bezier(.3,1.8,.5,1), background .2s;
      i { flex: none; width: 28px; height: 28px; border-radius: 50%; border: 3px solid var(--navy); margin-top: 4px; }
      h4 { font-size: 24px; small { font-family: var(--font-body); font-weight: 900; font-size: 16px; color: var(--teal-dark); } }
      strong { display: block; font-weight: 900; margin: 2px 0 4px; }
      p { margin: 0; font-size: 15px; color: var(--navy-soft); }
      &.active { background: var(--yellow-soft); transform: translateX(-10px) rotate(-1deg); }
    }

    .id-card {
      max-width: 820px; margin: 0 auto; padding: 30px; background: var(--white);
      background-image: radial-gradient(var(--cream-2) 2px, transparent 2px); background-size: 22px 22px;
    }
    .id-head {
      display: flex; align-items: center; gap: 16px; margin-bottom: 18px; position: relative;
      img { width: 64px; height: 64px; border-radius: 16px; object-fit: cover; border: 3px solid var(--navy); }
      h3 { font-size: clamp(26px, 3vw, 36px); }
    }
    .stamp {
      margin-left: auto; font-family: var(--font-display); font-size: 16px; line-height: 1.1; text-align: center;
      color: var(--coral); border: 4px solid var(--coral); border-radius: 12px; padding: 6px 12px;
      transform: rotate(12deg); opacity: .85; animation: stamp 2.5s ease-in-out infinite;
    }
    dl { margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 0 30px; }
    .row {
      display: flex; justify-content: space-between; gap: 12px; padding: 12px 4px;
      border-bottom: 3px dashed rgba(30, 43, 79, .2);
      dt { font-weight: 800; color: var(--navy-soft); }
      dd { margin: 0; font-weight: 900; text-align: right; }
    }
    @keyframes stamp {
      0%, 100% { transform: rotate(12deg) scale(1); }
      50% { transform: rotate(8deg) scale(1.08); }
    }
    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
      dl { grid-template-columns: 1fr; }
    }
    @media (max-width: 480px) {
      .stamp { display: none; }
      .id-card { padding: 20px 16px; }
    }
  `,
})
export class Tokenomics {
  protected readonly t = inject(LangService).t;
  protected readonly R = R;
  protected readonly C = C;
  protected readonly colors = COLORS;
  protected readonly active = signal(0);

  protected readonly segments = computed(() => {
    let acc = 0;
    return this.t()
      .tokenomics.slices.filter((s) => s.pct > 0)
      .map((s, i) => {
        const seg = { color: COLORS[i], len: (s.pct / 100) * C, rot: (acc / 100) * 360 };
        acc += s.pct;
        return seg;
      });
  });

  protected readonly activeSlice = computed(() => this.t().tokenomics.slices[this.active()]);
}
