import { Component, inject } from '@angular/core';
import { LangService } from '../core/i18n/lang.service';
import { FxService } from '../core/fx.service';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-about',
  imports: [RevealDirective],
  template: `
    <section id="about" class="section container">
      <div class="grid">
        <div class="logo-wrap" appReveal="left">
          <div class="frame card" (click)="boom($event)">
            <img src="logo.jpg" alt="Excalation $! logo" />
            <span class="sticker">$!</span>
          </div>
          <p class="caption">{{ t().about.logoCaption }}</p>
        </div>

        <div class="text">
          <span class="kicker" appReveal="pop">{{ t().about.kicker }}</span>
          <h2 class="title" appReveal>
            <span class="hl">Excl</span>amation + Es<span class="hl">calation</span>
            <br />= <span class="hl">Excalation</span>
          </h2>
          <div class="equation" appReveal="pop" [revealDelay]="150">
            <span class="eq a">!</span><span class="op">+</span><span class="eq b">📈</span><span class="op">=</span><span class="eq c">$!</span>
          </div>
          <p appReveal [revealDelay]="100">{{ t().about.p1 }}</p>
          <p appReveal [revealDelay]="200">{{ t().about.p2 }}</p>
          <p appReveal [revealDelay]="300">{{ t().about.p3 }}</p>
        </div>
      </div>

      <h3 class="features-title" appReveal>{{ t().about.featuresTitle }}</h3>
      <div class="features">
        @for (f of t().about.features; track $index) {
          <article class="feature card" appReveal="tilt" [revealDelay]="$index * 120">
            <div class="icon">{{ f.icon }}</div>
            <h4>{{ f.title }}</h4>
            <p>{{ f.text }}</p>
          </article>
        }
      </div>
    </section>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: 1fr 1.15fr; gap: 60px; align-items: center; }
    .frame {
      position: relative; padding: 12px; transform: rotate(-3deg); cursor: pointer;
      transition: transform .4s cubic-bezier(.3,1.6,.5,1);
      img { border-radius: 18px; border: 3px solid var(--navy); }
      &:hover { transform: rotate(2deg) scale(1.03); }
    }
    .sticker {
      position: absolute; top: -26px; right: -18px; width: 92px; height: 92px; display: grid; place-items: center;
      font-family: var(--font-display); font-size: 36px; color: var(--white);
      -webkit-text-stroke: 2px var(--navy); paint-order: stroke fill;
      background: var(--coral); border: var(--border); border-radius: 50%; box-shadow: var(--shadow-sm);
      animation: spin-wobble 4s ease-in-out infinite;
    }
    .caption { margin-top: 22px; text-align: center; font-weight: 700; font-style: italic; color: var(--navy-soft); }
    .title { font-size: clamp(32px, 4.6vw, 54px); }
    .text p { font-size: 18px; }
    .equation {
      display: flex; align-items: center; gap: 12px; margin: 10px 0 24px;
      font-family: var(--font-display); font-size: 34px;
      .eq {
        width: 66px; height: 66px; display: grid; place-items: center; border: var(--border);
        border-radius: 18px; box-shadow: var(--shadow-sm); animation: float 3s ease-in-out infinite;
      }
      .a { background: var(--yellow); color: var(--orange); -webkit-text-stroke: 2px var(--navy); paint-order: stroke fill; }
      .b { background: var(--sky); animation-delay: -1s; }
      .c { background: var(--orange); color: var(--white); -webkit-text-stroke: 2px var(--navy); paint-order: stroke fill; animation-delay: -2s; width: 86px; }
    }
    .features-title { text-align: center; font-size: clamp(30px, 4vw, 44px); margin: 100px 0 40px; }
    .features { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
    .feature {
      padding: 28px 22px; transition: opacity .7s, transform .4s cubic-bezier(.3,1.8,.5,1), box-shadow .3s;
      &:nth-child(odd) { rotate: -1.5deg; }
      &:nth-child(even) { rotate: 1.5deg; }
      &:hover { transform: translateY(-10px) scale(1.03); rotate: 0deg; box-shadow: 10px 10px 0 var(--navy); }
      &:hover .icon { animation: wiggle .6s ease-in-out; }
      h4 { font-size: 24px; margin: 14px 0 10px; }
      p { margin: 0; font-size: 16px; color: var(--navy-soft); }
    }
    .icon {
      width: 70px; height: 70px; display: grid; place-items: center; font-size: 36px;
      border: var(--border); border-radius: 20px; background: var(--yellow-soft); box-shadow: var(--shadow-sm);
    }
    .feature:nth-child(2) .icon { background: var(--sky-soft); }
    .feature:nth-child(3) .icon { background: #ffd8b0; }
    .feature:nth-child(4) .icon { background: #c8f1ea; }
    @keyframes spin-wobble {
      0%, 100% { transform: rotate(-12deg) scale(1); }
      50% { transform: rotate(12deg) scale(1.1); }
    }
    @media (max-width: 960px) {
      .grid { grid-template-columns: 1fr; }
      .logo-wrap { max-width: 520px; margin: 0 auto; }
      .features { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 560px) { .features { grid-template-columns: 1fr; } }
  `,
})
export class About {
  private readonly fx = inject(FxService);
  protected readonly t = inject(LangService).t;

  boom(e: MouseEvent): void {
    this.fx.burst(e.clientX, e.clientY, 16);
  }
}
