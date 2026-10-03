import { Component, inject, signal } from '@angular/core';
import { LangService } from '../core/i18n/lang.service';
import { FxService } from '../core/fx.service';
import { TOKEN, pumpFunUrl } from '../core/token.config';
import { Bang } from '../shared/bang';
import { CountUpDirective } from '../shared/count-up.directive';

@Component({
  selector: 'app-hero',
  imports: [Bang, CountUpDirective],
  template: `
    <section id="top" class="hero container">
      <div class="copy">
        <span class="badge"><i class="pulse"></i>{{ t().hero.badge }}</span>

        <h1 class="name" aria-label="Excalation">
          @for (ch of letters; track $index) {
            <span class="letter" [style.animation-delay.ms]="$index * 70">{{ ch }}</span>
          }
        </h1>
        <div class="ticker"><span>$</span><span class="mark">!</span></div>

        <p class="tagline">{{ t().hero.tagline }}</p>
        <p class="desc">{{ t().hero.desc }}</p>

        <div class="ca card">
          <span class="ca-label">{{ t().hero.caLabel }}</span>
          @if (ca) {
            <code>{{ ca }}</code>
            <button class="btn small teal" (click)="copy($event)">
              {{ copied() ? t().hero.copied : t().hero.copy }}
            </button>
          } @else {
            <code class="soon">{{ t().hero.caSoon }}</code>
            <span class="lock">🔒</span>
          }
        </div>

        <div class="ctas">
          <a class="btn" [href]="pumpUrl" target="_blank" rel="noopener">🚀 {{ t().hero.ctaBuy }}</a>
          <a class="btn alt" href="#about">🤓 {{ t().hero.ctaLearn }}</a>
        </div>
      </div>

      <div class="stage">
        <div class="hill"></div>
        <div class="bubble b1">WOW!</div>
        <div class="bubble b2">LFG!</div>
        <div class="bubble b3">OMG!!</div>
        <div class="orbit">
          <span>★</span><span>!</span><span>✦</span><span>!</span>
        </div>
        <button class="bang-btn" (click)="smash($event)" [attr.aria-label]="t().hero.hint">
          <app-bang [excited]="excited()" />
        </button>
        <div class="hint">{{ t().hero.hint }} <b>×{{ smashes() }}</b></div>
      </div>
    </section>

    <div class="stats container">
      @for (s of t().hero.stats; track $index) {
        <div class="stat card" [style.--i]="$index">
          <strong [appCountUp]="s.value" [suffix]="s.suffix"></strong>
          <span>{{ s.label }}</span>
        </div>
      }
    </div>
  `,
  styleUrl: './hero.scss',
})
export class Hero {
  private readonly fx = inject(FxService);
  protected readonly t = inject(LangService).t;
  protected readonly ca = TOKEN.contractAddress;
  protected readonly pumpUrl = pumpFunUrl();
  protected readonly letters = 'Excalation'.split('');
  protected readonly copied = signal(false);
  protected readonly excited = signal(false);
  protected readonly smashes = signal(0);

  smash(e: MouseEvent): void {
    this.fx.burst(e.clientX, e.clientY, 18);
    this.fx.shake();
    this.smashes.update((n) => n + 1);
    this.excited.set(false);
    requestAnimationFrame(() => this.excited.set(true));
    setTimeout(() => this.excited.set(false), 650);
    if (this.smashes() % 10 === 0) this.fx.rain(50);
  }

  async copy(e: MouseEvent): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.ca);
      this.copied.set(true);
      this.fx.burst(e.clientX, e.clientY, 10);
      setTimeout(() => this.copied.set(false), 1800);
    } catch {}
  }
}
