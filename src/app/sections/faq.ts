import { Component, inject, signal } from '@angular/core';
import { LangService } from '../core/i18n/lang.service';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-faq',
  imports: [RevealDirective],
  template: `
    <section id="faq" class="section container">
      <div class="section-head">
        <span class="kicker" appReveal="pop">{{ t().faq.kicker }}</span>
        <h2 class="title" appReveal>{{ t().faq.title }}</h2>
      </div>

      <div class="list">
        @for (item of t().faq.items; track $index) {
          <div class="item card" [class.open]="open() === $index" appReveal="up" [revealDelay]="($index % 4) * 80">
            <button class="q" (click)="toggle($index)" [attr.aria-expanded]="open() === $index">
              <span class="mark">?</span>
              <span class="text">{{ item.q }}</span>
              <span class="plus">+</span>
            </button>
            <div class="a"><div><p>{{ item.a }}</p></div></div>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .list { max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }
    .item {
      border-radius: 22px; overflow: hidden; transition: opacity .7s, transform .5s cubic-bezier(.2,1.4,.4,1), background .3s;
      &.open { background: var(--yellow-soft); }
    }
    .q {
      width: 100%; display: flex; align-items: center; gap: 14px; padding: 18px 20px; border: 0; background: none;
      text-align: left; font: inherit; color: inherit; cursor: pointer;
      .text { flex: 1; font-family: var(--font-display); font-size: clamp(19px, 2.2vw, 23px); line-height: 1.2; }
      &:hover .mark { animation: wiggle .5s ease-in-out; }
    }
    .mark, .plus {
      flex: none; width: 40px; height: 40px; display: grid; place-items: center; border-radius: 50%;
      border: 3px solid var(--navy); font-family: var(--font-display); font-size: 24px; line-height: 1;
    }
    .mark { background: var(--teal); color: var(--white); transition: background .3s; }
    .plus { background: var(--white); transition: transform .4s cubic-bezier(.3,1.8,.5,1), background .3s; }
    .open .mark { background: var(--orange); }
    .open .plus { transform: rotate(135deg); background: var(--orange); color: var(--white); }
    .a {
      display: grid; grid-template-rows: 0fr; transition: grid-template-rows .4s ease;
      > div { overflow: hidden; }
      p { margin: 0; padding: 0 22px 22px 74px; font-size: 16.5px; color: var(--navy-soft); }
    }
    .open .a { grid-template-rows: 1fr; }
    @media (max-width: 560px) { .a p { padding-left: 22px; } }
  `,
})
export class Faq {
  protected readonly t = inject(LangService).t;
  protected readonly open = signal<number | null>(0);

  toggle(i: number): void {
    this.open.update((cur) => (cur === i ? null : i));
  }
}
