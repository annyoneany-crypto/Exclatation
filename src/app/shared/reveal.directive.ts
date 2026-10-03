import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

export type RevealAnim = 'up' | 'left' | 'right' | 'pop' | 'tilt';

/** Animates an element in when it scrolls into view. Styles live in styles.scss. */
@Directive({ selector: '[appReveal]' })
export class RevealDirective implements OnInit, OnDestroy {
  readonly appReveal = input<RevealAnim | ''>('');
  readonly revealDelay = input(0);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const node = this.el.nativeElement;
    node.classList.add('reveal', `reveal-${this.appReveal() || 'up'}`);
    node.style.transitionDelay = `${this.revealDelay()}ms`;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add('revealed');
            this.observer?.disconnect();
            // Drop the stagger delay so later hover transitions are instant.
            setTimeout(() => (node.style.transitionDelay = ''), this.revealDelay() + 900);
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px -60px 0px' },
    );
    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
