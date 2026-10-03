import { Component, inject, signal } from '@angular/core';
import { LangService } from '../core/i18n/lang.service';
import { pumpFunUrl } from '../core/token.config';

@Component({
  selector: 'app-navbar',
  host: { '(window:scroll)': 'onScroll()', '[class.scrolled]': 'scrolled()' },
  template: `
    <nav class="bar container">
      <a href="#top" class="brand" (click)="open.set(false)">
        <img src="logo.jpg" alt="" />
        <span>Excalation <b>$!</b></span>
      </a>

      <div class="links" [class.open]="open()">
        @for (l of links; track l.id) {
          <a [href]="'#' + l.id" (click)="open.set(false)">{{ t().nav[l.key] }}</a>
        }
        <a class="btn small" [href]="pumpUrl" target="_blank" rel="noopener">{{ t().nav.cta }}</a>
      </div>

      <div class="right">
        <button class="lang" (click)="lang.toggle()" [attr.aria-label]="'Language'">
          <span [class.on]="lang.lang() === 'en'">EN</span>
          <span [class.on]="lang.lang() === 'it'">IT</span>
        </button>
        <button class="burger" [class.x]="open()" (click)="open.set(!open())" aria-label="Menu">
          <i></i><i></i><i></i>
        </button>
      </div>
    </nav>
    <div class="progress" [style.transform]="'scaleX(' + progress() + ')'"></div>
  `,
  styles: `
    :host {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      transition: background .3s, box-shadow .3s, padding .3s;
      padding: 14px 0;
    }
    :host(.scrolled) {
      background: rgba(255, 246, 226, .92);
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 0 var(--navy);
      padding: 6px 0;
    }
    .bar { display: flex; align-items: center; gap: 18px; }
    .brand {
      display: flex; align-items: center; gap: 10px; text-decoration: none;
      font-family: var(--font-display); font-size: 24px;
      img {
        width: 46px; height: 46px; object-fit: cover; object-position: 50% 45%;
        border-radius: 50%; border: 3px solid var(--navy); box-shadow: 3px 3px 0 var(--navy);
        transition: transform .4s cubic-bezier(.3,1.8,.5,1);
      }
      b { color: var(--orange); -webkit-text-stroke: 1.5px var(--navy); paint-order: stroke fill; }
      &:hover img { transform: rotate(-20deg) scale(1.15); }
    }
    .links {
      display: flex; align-items: center; gap: 4px; margin-left: auto;
      a:not(.btn) {
        font-weight: 800; text-decoration: none; padding: 6px 12px; border-radius: 999px;
        font-size: 15px; transition: background .2s, transform .2s;
        &:hover { background: var(--yellow); transform: rotate(-3deg) scale(1.06); }
      }
      .btn { margin-left: 8px; }
    }
    .right { display: flex; align-items: center; gap: 10px; }
    .lang {
      display: flex; border: 3px solid var(--navy); border-radius: 999px; overflow: hidden;
      background: var(--white); cursor: pointer; padding: 0; box-shadow: 2px 2px 0 var(--navy);
      font-family: var(--font-display); font-size: 14px; color: var(--navy);
      span { padding: 4px 9px; transition: background .2s, color .2s; }
      span.on { background: var(--teal); color: var(--white); }
    }
    .burger {
      display: none; width: 46px; height: 46px; border: 3px solid var(--navy); border-radius: 14px;
      background: var(--yellow); cursor: pointer; padding: 9px; flex-direction: column; justify-content: space-between;
      box-shadow: 3px 3px 0 var(--navy);
      i { display: block; height: 4px; border-radius: 4px; background: var(--navy); transition: transform .3s, opacity .3s; }
      &.x i:nth-child(1) { transform: translateY(10px) rotate(45deg); }
      &.x i:nth-child(2) { opacity: 0; }
      &.x i:nth-child(3) { transform: translateY(-10px) rotate(-45deg); }
    }
    .progress {
      position: absolute; left: 0; bottom: -4px; height: 4px; width: 100%;
      background: linear-gradient(90deg, var(--orange), var(--yellow), var(--teal));
      transform-origin: left;
    }
    @media (max-width: 1080px) {
      .burger { display: flex; }
      .right { margin-left: auto; }
      .links {
        position: fixed; top: 76px; left: 16px; right: 16px; flex-direction: column; align-items: stretch;
        background: var(--cream); border: var(--border); border-radius: var(--radius); box-shadow: var(--shadow);
        padding: 16px; gap: 6px; margin: 0;
        transform: translateY(-20px) scale(.95); opacity: 0; pointer-events: none;
        transition: transform .3s cubic-bezier(.3,1.6,.5,1), opacity .2s;
        a:not(.btn) { font-size: 18px; padding: 10px 14px; }
        .btn { margin: 8px 0 0; justify-content: center; }
        &.open { transform: none; opacity: 1; pointer-events: auto; }
      }
    }
    @media (max-width: 420px) { .brand span { display: none; } }
  `,
})
export class Navbar {
  protected readonly lang = inject(LangService);
  protected readonly t = this.lang.t;
  protected readonly pumpUrl = pumpFunUrl();
  protected readonly open = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly progress = signal(0);

  protected readonly links = [
    { id: 'about', key: 'about' },
    { id: 'how', key: 'how' },
    { id: 'tokenomics', key: 'tokenomics' },
    { id: 'buy', key: 'buy' },
    { id: 'roadmap', key: 'roadmap' },
    { id: 'game', key: 'game' },
    { id: 'faq', key: 'faq' },
  ] as const;

  onScroll(): void {
    const max = document.documentElement.scrollHeight - innerHeight;
    this.scrolled.set(scrollY > 30);
    this.progress.set(max > 0 ? scrollY / max : 0);
  }
}
