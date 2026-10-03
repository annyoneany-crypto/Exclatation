import { Component, inject } from '@angular/core';
import { FxService } from './core/fx.service';
import { Background } from './sections/background';
import { Navbar } from './sections/navbar';
import { Hero } from './sections/hero';
import { Marquee } from './sections/marquee';
import { About } from './sections/about';
import { HowItWorks } from './sections/how-it-works';
import { Tokenomics } from './sections/tokenomics';
import { HowToBuy } from './sections/how-to-buy';
import { Roadmap } from './sections/roadmap';
import { Game } from './sections/game';
import { Faq } from './sections/faq';
import { Footer } from './sections/footer';

const SECRET = 'excalation';

@Component({
  selector: 'app-root',
  imports: [Background, Navbar, Hero, Marquee, About, HowItWorks, Tokenomics, HowToBuy, Roadmap, Game, Faq, Footer],
  host: {
    '(window:keydown)': 'onKey($event)',
    '(window:pointermove)': 'onMove($event)',
    '(window:click)': 'onClick($event)',
  },
  template: `
    <app-background />
    <app-navbar />
    <main>
      <app-hero />
      <app-marquee />
      <app-about />
      <app-how-it-works />
      <app-marquee [flip]="true" />
      <app-tokenomics />
      <app-how-to-buy />
      <app-roadmap />
      <app-game />
      <app-faq />
    </main>
    <app-footer />
  `,
})
export class App {
  private readonly fx = inject(FxService);
  private typed = '';

  onKey(e: KeyboardEvent): void {
    if ((e.target as HTMLElement).closest('input, textarea')) return;
    if (e.key === '!' || e.key === '1') this.fx.rain(25);

    // Easter egg: type "excalation" anywhere.
    this.typed = (this.typed + e.key.toLowerCase()).slice(-SECRET.length);
    if (this.typed === SECRET) {
      this.fx.rain(160);
      this.fx.shake('hard');
      this.typed = '';
    }
  }

  onMove(e: PointerEvent): void {
    if (e.pointerType === 'mouse') this.fx.trail(e.clientX, e.clientY);
  }

  onClick(e: MouseEvent): void {
    // Buttons and links already have their own effects.
    if ((e.target as HTMLElement).closest('button, a, input, label')) return;
    this.fx.burst(e.clientX, e.clientY, 7);
  }
}
