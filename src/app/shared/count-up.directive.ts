import { Directive, ElementRef, OnDestroy, OnInit, effect, inject, input } from '@angular/core';
import { LangService } from '../core/i18n/lang.service';

/** Counts a number up from 0 once it becomes visible. */
@Directive({ selector: '[appCountUp]' })
export class CountUpDirective implements OnInit, OnDestroy {
  readonly appCountUp = input.required<number>();
  readonly suffix = input('');
  readonly duration = input(1600);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly lang = inject(LangService);
  private observer?: IntersectionObserver;
  private done = false;

  constructor() {
    // Re-render with the correct thousands separator when the language changes.
    effect(() => {
      this.lang.lang();
      if (this.done) this.render(this.appCountUp());
    });
  }

  ngOnInit(): void {
    this.render(0);
    this.observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        this.observer?.disconnect();
        this.animate();
      }
    });
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private animate(): void {
    const target = this.appCountUp();
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / this.duration());
      const eased = 1 - Math.pow(1 - p, 4);
      this.render(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
      else this.done = true;
    };
    requestAnimationFrame(step);
  }

  private render(value: number): void {
    const locale = this.lang.lang() === 'it' ? 'it-IT' : 'en-US';
    this.el.nativeElement.textContent = value.toLocaleString(locale) + this.suffix();
  }
}
