import { Component, computed, inject, signal } from '@angular/core';
import { LangService } from '../core/i18n/lang.service';
import { FxService } from '../core/fx.service';
import { RevealDirective } from '../shared/reveal.directive';
import { Bang } from '../shared/bang';

const BEST_KEY = 'excalation-best';
const MAX = 400;

@Component({
  selector: 'app-game',
  imports: [RevealDirective, Bang],
  template: `
    <section id="game" class="section container">
      <div class="arcade card" appReveal="pop">
        <div class="screen">
          <span class="kicker">{{ t().game.kicker }}</span>
          <h2 class="title">{{ t().game.title }}</h2>
          <p class="desc">{{ t().game.desc }}</p>

          <div class="display" [class.hot]="count() >= 100">
            <div class="mini-bang" [style.transform]="'scale(' + bangScale() + ') rotate(' + tilt() + 'deg)'">
              <app-bang [decorated]="count() >= 30" [excited]="pop()" />
            </div>
            <div class="readout">
              <div class="level" [class.bump]="pop()">{{ level().label }}</div>
              <div class="bangs">{{ bangs() }}</div>
              <div class="meter"><b [style.width.%]="fill()"></b></div>
              <div class="scores">
                <span>{{ t().game.clicks }}: <b>{{ count() }}</b></span>
                <span>🏆 {{ t().game.best }}: <b>{{ best() }}</b></span>
              </div>
            </div>
          </div>

          <div class="buttons">
            <button class="shout" (click)="shout($event)">{{ t().game.button }}</button>
            <button class="btn alt small" (click)="reset()">↺ {{ t().game.reset }}</button>
          </div>
          <p class="tip">{{ t().game.tip }}</p>
        </div>
      </div>
    </section>
  `,
  styles: `
    .arcade {
      max-width: 900px; margin: 0 auto; padding: 18px; background: var(--teal);
      transition: opacity .7s, transform .8s cubic-bezier(.2,1.4,.4,1);
    }
    .screen {
      border: var(--border); border-radius: 22px; padding: 40px 30px; text-align: center;
      background: var(--cream);
      background-image: radial-gradient(rgba(30,43,79,.08) 2px, transparent 2px); background-size: 20px 20px;
    }
    .desc { max-width: 560px; margin: 0 auto 26px; font-size: 18px; color: var(--navy-soft); }
    .display {
      display: grid; grid-template-columns: 160px 1fr; gap: 26px; align-items: center; text-align: left;
      padding: 22px; border: var(--border); border-radius: 22px; background: var(--white); box-shadow: var(--shadow-sm);
      transition: background .3s;
      &.hot { background: #fff1d6; animation: glow 1s ease-in-out infinite alternate; }
    }
    .mini-bang { width: 120px; margin: 0 auto; transition: transform .25s cubic-bezier(.3,1.8,.5,1); }
    .level { font-family: var(--font-display); font-size: clamp(22px, 3vw, 32px); color: var(--orange-dark); }
    .level.bump { animation: bump .3s ease; }
    .bangs {
      font-family: var(--font-display); font-size: 40px; line-height: 1.1; color: var(--orange); letter-spacing: -2px;
      -webkit-text-stroke: 2px var(--navy); paint-order: stroke fill; min-height: 46px; overflow-wrap: anywhere;
    }
    .meter {
      height: 22px; border: 3px solid var(--navy); border-radius: 999px; background: var(--cream); overflow: hidden; margin: 10px 0;
      b { display: block; height: 100%; transition: width .2s ease;
          background: linear-gradient(90deg, var(--teal), var(--yellow), var(--orange), var(--coral)); }
    }
    .scores { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-weight: 800; }
    .buttons { display: flex; justify-content: center; align-items: center; gap: 18px; margin-top: 30px; flex-wrap: wrap; }
    .shout {
      font-family: var(--font-display); font-size: 40px; letter-spacing: 1px; color: var(--white);
      padding: 18px 54px; border: 5px solid var(--navy); border-radius: 999px; cursor: pointer;
      background: radial-gradient(circle at 35% 30%, #ffb04a, var(--orange) 50%, var(--orange-dark));
      box-shadow: 0 10px 0 var(--navy); -webkit-text-stroke: 2px var(--navy); paint-order: stroke fill;
      transition: transform .08s, box-shadow .08s; user-select: none;
      animation: breathe 1.6s ease-in-out infinite;
      &:hover { filter: brightness(1.06); }
      &:active { transform: translateY(8px) scale(.97); box-shadow: 0 2px 0 var(--navy); animation: none; }
    }
    .tip { margin: 22px 0 0; font-weight: 800; color: var(--navy-soft); }
    @keyframes bump { 50% { transform: scale(1.15) rotate(-3deg); } }
    @keyframes breathe { 50% { transform: scale(1.04); } }
    @keyframes glow { to { box-shadow: 4px 4px 0 var(--navy), 0 0 40px rgba(255,138,31,.6); } }
    @media (max-width: 600px) {
      .display { grid-template-columns: 1fr; text-align: center; }
      .scores { justify-content: center; }
      .screen { padding: 30px 16px; }
      .shout { font-size: 32px; padding: 16px 40px; }
    }
  `,
})
export class Game {
  private readonly fx = inject(FxService);
  protected readonly t = inject(LangService).t;

  protected readonly count = signal(0);
  protected readonly best = signal(this.loadBest());
  protected readonly pop = signal(false);

  protected readonly level = computed(() => {
    const levels = this.t().game.levels;
    return [...levels].reverse().find((l) => this.count() >= l.min) ?? levels[0];
  });
  protected readonly bangs = computed(() => '!'.repeat(Math.min(24, Math.ceil(this.count() / 8))));
  protected readonly fill = computed(() => Math.min(100, (this.count() / MAX) * 100));
  protected readonly bangScale = computed(() => 1 + Math.min(0.5, this.count() / 800));
  protected readonly tilt = computed(() => (this.count() % 2 ? -6 : 6) * Math.min(1, this.count() / 50));

  shout(e: MouseEvent): void {
    const before = this.level();
    this.count.update((n) => n + 1);
    if (this.count() > this.best()) {
      this.best.set(this.count());
      try {
        localStorage.setItem(BEST_KEY, String(this.count()));
      } catch {}
    }

    this.fx.burst(e.clientX, e.clientY, 6 + Math.min(14, Math.floor(this.count() / 20)));
    this.pop.set(false);
    requestAnimationFrame(() => this.pop.set(true));

    if (this.level() !== before) {
      this.fx.rain(30 + this.count() / 4);
      this.fx.shake(this.count() >= 100 ? 'hard' : 'soft');
    }
  }

  reset(): void {
    this.count.set(0);
  }

  private loadBest(): number {
    try {
      return Number(localStorage.getItem(BEST_KEY)) || 0;
    } catch {
      return 0;
    }
  }
}
