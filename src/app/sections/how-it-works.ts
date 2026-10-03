import { Component, computed, inject, signal } from '@angular/core';
import { LangService } from '../core/i18n/lang.service';
import { CURVE } from '../core/token.config';
import { RevealDirective } from '../shared/reveal.directive';

const K = CURVE.virtualSol * CURVE.virtualTokens;
const W = 600;
const H = 300;
const PAD = 20;

const vTok = (sol: number) => K / (CURVE.virtualSol + sol);
const priceAt = (sol: number) => (CURVE.virtualSol + sol) / vTok(sol);
const P0 = priceAt(0);
const P1 = priceAt(CURVE.graduationSol);

const xOf = (sol: number) => PAD + (sol / CURVE.graduationSol) * (W - PAD * 2);
const yOf = (price: number) => H - PAD - ((price - P0) / (P1 - P0)) * (H - PAD * 2);

@Component({
  selector: 'app-how-it-works',
  imports: [RevealDirective],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.scss',
})
export class HowItWorks {
  private readonly lang = inject(LangService);
  protected readonly t = this.lang.t;
  protected readonly icons = ['🧪', '📈', '🎓', '🌍'];
  protected readonly max = CURVE.graduationSol;
  protected readonly W = W;
  protected readonly H = H;

  protected readonly curveSol = signal(12);
  protected readonly buySol = signal(1);
  protected readonly solUsd = signal(150);

  private readonly locale = computed(() => (this.lang.lang() === 'it' ? 'it-IT' : 'en-US'));

  protected readonly sim = computed(() => {
    const s = this.curveSol();
    const net = Math.min(this.buySol() * (1 - CURVE.feePct / 100), CURVE.graduationSol - s);
    const price = priceAt(s);
    const tokens = vTok(s) - vTok(s + net);
    const sold = CURVE.virtualTokens - vTok(s);
    return {
      sold,
      price,
      mcapSol: price * 1e9,
      progress: (s / CURVE.graduationSol) * 100,
      tokens,
      avg: tokens > 0 ? this.buySol() / tokens : 0,
      impact: (priceAt(s + net) / price - 1) * 100,
      graduated: s >= CURVE.graduationSol,
      net,
    };
  });

  protected readonly curvePath = (() => {
    const pts: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const sol = (i / 60) * CURVE.graduationSol;
      pts.push(`${xOf(sol).toFixed(1)},${yOf(priceAt(sol)).toFixed(1)}`);
    }
    return 'M' + pts.join(' L');
  })();

  protected readonly areaPath = this.curvePath + ` L${W - PAD},${H - PAD} L${PAD},${H - PAD} Z`;

  protected readonly buyArea = computed(() => {
    const { net } = this.sim();
    const s = this.curveSol();
    if (net <= 0) return '';
    const pts: string[] = [];
    for (let i = 0; i <= 20; i++) {
      const sol = s + (i / 20) * net;
      pts.push(`${xOf(sol).toFixed(1)},${yOf(priceAt(sol)).toFixed(1)}`);
    }
    return `M${xOf(s)},${H - PAD} L${pts.join(' L')} L${xOf(s + net)},${H - PAD} Z`;
  });

  protected readonly marker = computed(() => ({
    x: xOf(this.curveSol()),
    y: yOf(priceAt(this.curveSol())),
  }));

  protected num(n: number, digits = 0): string {
    return n.toLocaleString(this.locale(), { maximumFractionDigits: digits });
  }

  protected small(n: number): string {
    return n.toLocaleString(this.locale(), { maximumSignificantDigits: 3, maximumFractionDigits: 12 });
  }

  protected usd(n: number): string {
    return n.toLocaleString(this.locale(), {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: n < 1 ? 10 : 0,
      maximumSignificantDigits: n < 1 ? 3 : undefined,
    });
  }

  protected setNum(target: 'curve' | 'buy' | 'usd', e: Event): void {
    const v = Number((e.target as HTMLInputElement).value);
    if (Number.isNaN(v)) return;
    if (target === 'curve') this.curveSol.set(Math.min(Math.max(v, 0), CURVE.graduationSol));
    if (target === 'buy') this.buySol.set(Math.max(v, 0));
    if (target === 'usd') this.solUsd.set(Math.max(v, 0));
  }
}
