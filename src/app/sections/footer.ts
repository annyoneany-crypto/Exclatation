import { Component, inject } from '@angular/core';
import { LangService } from '../core/i18n/lang.service';
import { TOKEN, pumpFunUrl } from '../core/token.config';
import { Bang } from '../shared/bang';

@Component({
  selector: 'app-footer',
  imports: [Bang],
  template: `
    <div class="disclaimer container">
      <div class="card">
        <h3>⚠️ {{ t().footer.disclaimerTitle }}</h3>
        <p>{{ t().footer.disclaimer }}</p>
      </div>
    </div>

    <footer>
      <svg class="wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40 C 240 0, 480 80, 720 40 S 1200 0, 1440 40 V80 H0 Z" />
      </svg>
      <div class="inner container">
        <div class="brand">
          <app-bang class="mini" [decorated]="false" />
          <div>
            <strong>Excalation <span>$!</span></strong>
            <p>{{ t().footer.made }}</p>
          </div>
        </div>

        <nav class="socials">
          @for (s of socials; track s.label) {
            @if (s.url) {
              <a [href]="s.url" target="_blank" rel="noopener" class="social">{{ s.icon }} {{ s.label }}</a>
            } @else {
              <span class="social off">{{ s.icon }} {{ s.label }} <small>{{ t().footer.soon }}</small></span>
            }
          }
        </nav>

        <a href="#top" class="top">↑ {{ t().footer.top }}</a>
      </div>
      <p class="copy">© {{ year }} Excalation · $! · Solana · pump.fun</p>
    </footer>
  `,
  styles: `
    .disclaimer { margin-bottom: 90px; }
    .disclaimer .card {
      padding: 26px 30px; background: #fff3c4; border-style: dashed;
      h3 { font-size: 26px; margin-bottom: 8px; }
      p { margin: 0; font-size: 15px; color: var(--navy-soft); }
    }
    footer { position: relative; background: var(--navy); color: var(--cream); padding: 40px 0 26px; }
    .wave { position: absolute; top: -79px; left: 0; width: 100%; height: 80px; path { fill: var(--navy); } }
    .inner { display: flex; align-items: center; justify-content: space-between; gap: 26px; flex-wrap: wrap; }
    .brand {
      display: flex; align-items: center; gap: 16px;
      .mini { width: 46px; }
      strong { font-family: var(--font-display); font-weight: 400; font-size: 30px; }
      strong span { color: var(--orange); }
      p { margin: 0; font-weight: 700; opacity: .8; }
    }
    .socials { display: flex; gap: 12px; flex-wrap: wrap; }
    .social {
      font-weight: 800; text-decoration: none; padding: 8px 16px; border-radius: 999px;
      border: 3px solid var(--cream); transition: transform .2s, background .2s, color .2s;
      &:not(.off):hover { background: var(--orange); transform: rotate(-4deg) scale(1.06); }
      &.off { opacity: .5; }
      small { font-size: 11px; text-transform: uppercase; }
    }
    .top {
      font-family: var(--font-display); text-decoration: none; font-size: 18px; background: var(--orange);
      color: var(--white); padding: 10px 20px; border-radius: 999px; border: 3px solid var(--cream);
      &:hover { animation: wiggle .5s ease-in-out; }
    }
    .copy { text-align: center; margin: 30px 0 0; opacity: .6; font-size: 14px; }
  `,
})
export class Footer {
  protected readonly t = inject(LangService).t;
  protected readonly year = new Date().getFullYear();
  protected readonly socials = [
    { icon: '💊', label: 'pump.fun', url: pumpFunUrl() },
    { icon: '𝕏', label: 'X / Twitter', url: TOKEN.links.x },
    { icon: '✈️', label: 'Telegram', url: TOKEN.links.telegram },
    { icon: '🦅', label: 'DexScreener', url: TOKEN.links.dexscreener },
  ];
}
