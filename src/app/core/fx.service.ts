import { Injectable } from '@angular/core';

const COLORS = ['#ff8a1f', '#fcd34d', '#3cc4b4', '#7cc8f2', '#f25f5c'];
const GLYPHS = ['!', '!', '!', '★', '✦', '!!'];

/** Fun DOM effects that live outside Angular's rendering (pure CSS animations). */
@Injectable({ providedIn: 'root' })
export class FxService {
  readonly reducedMotion =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  private lastTrail = 0;

  /** Explosion of exclamation marks / stars from a point. */
  burst(x: number, y: number, count = 14): void {
    if (this.reducedMotion) return;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'fx-burst';
      el.textContent = pick(GLYPHS);
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const dist = 60 + Math.random() * 110;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.color = pick(COLORS);
      el.style.fontSize = `${16 + Math.random() * 22}px`;
      el.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      el.style.setProperty('--dy', `${Math.sin(angle) * dist - 40}px`);
      el.style.setProperty('--rot', `${(Math.random() - 0.5) * 540}deg`);
      this.mount(el, 900);
    }
  }

  /** Exclamation marks raining from the top of the screen. */
  rain(count = 40): void {
    if (this.reducedMotion) return;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'fx-rain';
      el.textContent = '!';
      el.style.left = `${Math.random() * 100}vw`;
      el.style.color = pick(COLORS);
      el.style.fontSize = `${24 + Math.random() * 48}px`;
      el.style.animationDuration = `${1.6 + Math.random() * 1.8}s`;
      el.style.animationDelay = `${Math.random() * 0.9}s`;
      el.style.setProperty('--rot', `${(Math.random() - 0.5) * 120}deg`);
      this.mount(el, 4000);
    }
  }

  /** Little sparkle that follows the cursor. Throttled. */
  trail(x: number, y: number): void {
    if (this.reducedMotion) return;
    const now = performance.now();
    if (now - this.lastTrail < 45) return;
    this.lastTrail = now;
    const el = document.createElement('span');
    el.className = 'fx-trail';
    el.textContent = Math.random() > 0.3 ? '✦' : '!';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.color = pick(COLORS);
    this.mount(el, 700);
  }

  /** Shake the whole page. */
  shake(strength: 'soft' | 'hard' = 'soft'): void {
    if (this.reducedMotion) return;
    const cls = strength === 'hard' ? 'fx-shake-hard' : 'fx-shake';
    const root = document.body;
    root.classList.remove('fx-shake', 'fx-shake-hard');
    void root.offsetWidth; // restart animation
    root.classList.add(cls);
    setTimeout(() => root.classList.remove(cls), 500);
  }

  private mount(el: HTMLElement, ttl: number): void {
    document.body.appendChild(el);
    setTimeout(() => el.remove(), ttl + 1000);
  }
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
