import { Component, input } from '@angular/core';

const STAR = 'M0 -14 C2 -4 4 -2 14 0 C4 2 2 4 0 14 C-2 4 -4 2 -14 0 C-4 -2 -2 -4 0 -14Z';

/** The $! mascot: a glossy cartoon exclamation mark drawn in SVG, same style as the logo. */
@Component({
  selector: 'app-bang',
  host: { '[class.animated]': 'animated()', '[class.excited]': 'excited()' },
  template: `
    <svg viewBox="0 0 240 400" role="img" aria-label="$!">
      <defs>
        <linearGradient [attr.id]="uid + 'g'" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ffb04a" />
          <stop offset="0.55" stop-color="#ff8a1f" />
          <stop offset="1" stop-color="#ef6c0c" />
        </linearGradient>
        <radialGradient [attr.id]="uid + 'b'" cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stop-color="#ffb04a" />
          <stop offset="1" stop-color="#ee6a0a" />
        </radialGradient>
      </defs>

      <ellipse class="shadow" cx="130" cy="388" rx="70" ry="9" />

      @if (decorated()) {
        <g class="wiggles" fill="none" stroke="#1e2b4f" stroke-width="5" stroke-linecap="round">
          <path class="w1" d="M52 30 q-14 22 -4 46" />
          <path class="w1" d="M36 44 q-8 16 -2 30" />
          <path class="w2" d="M212 70 q12 18 4 40" />
          <path class="w2" d="M226 84 q6 12 0 24" />
          <path class="w1" d="M62 300 q-12 16 -4 34" />
          <path class="w2" d="M200 300 q12 16 2 36" />
        </g>
        <g class="sparkles" fill="#ff8a1f">
          <path class="s s1" [attr.d]="star" transform="translate(28 140) scale(1.3)" />
          <path class="s s2" [attr.d]="star" transform="translate(214 160) scale(1)" />
          <path class="s s3" [attr.d]="star" transform="translate(40 230) scale(0.8)" />
          <path class="s s4" [attr.d]="star" transform="translate(206 260) scale(1.2)" />
          <circle class="s s2" cx="58" cy="100" r="5" />
          <circle class="s s3" cx="198" cy="216" r="6" />
        </g>
      }

      <g class="bar">
        <path
          d="M82 46 C82 24 98 14 120 14 L172 14 C194 14 206 28 202 50 L172 238 C169 256 158 264 140 264 L122 264 C104 264 94 254 96 236 Z"
          fill="#d75f08" stroke="#1e2b4f" stroke-width="7" stroke-linejoin="round" />
        <path
          d="M70 40 C70 18 86 8 108 8 L160 8 C182 8 194 22 190 44 L160 232 C157 250 146 258 128 258 L110 258 C92 258 82 248 84 230 Z"
          [attr.fill]="'url(#' + uid + 'g)'" stroke="#1e2b4f" stroke-width="7" stroke-linejoin="round" />
        <path d="M96 36 L92 150" stroke="#fff" stroke-opacity="0.6" stroke-width="12" stroke-linecap="round" />
        <circle cx="124" cy="28" r="6" fill="#fff" fill-opacity="0.75" />
        <path d="M172 60 L156 190" stroke="#c45406" stroke-opacity="0.35" stroke-width="8" stroke-linecap="round" />
      </g>

      <g class="ball">
        <circle cx="137" cy="332" r="46" fill="#d75f08" stroke="#1e2b4f" stroke-width="7" />
        <circle cx="126" cy="326" r="46" [attr.fill]="'url(#' + uid + 'b)'" stroke="#1e2b4f" stroke-width="7" />
        <path d="M100 312 Q106 294 124 290" fill="none" stroke="#fff" stroke-opacity="0.7" stroke-width="9" stroke-linecap="round" />
        <circle cx="140" cy="294" r="4" fill="#fff" fill-opacity="0.7" />
      </g>
    </svg>
  `,
  styles: `
    :host { display: inline-block; line-height: 0; }
    svg { width: 100%; height: auto; overflow: visible; }
    .shadow { fill: #1e2b4f; opacity: 0.18; transform-box: fill-box; transform-origin: center; }
    .bar, .ball { transform-box: fill-box; transform-origin: 50% 100%; }

    :host(.animated) .bar { animation: bar-bounce 1.6s cubic-bezier(.3,.6,.4,1) infinite; }
    :host(.animated) .ball { animation: ball-bounce 1.6s cubic-bezier(.3,.6,.4,1) infinite 0.12s; }
    :host(.animated) .shadow { animation: shadow-pulse 1.6s cubic-bezier(.3,.6,.4,1) infinite 0.12s; }
    :host(.animated) .w1 { animation: flicker 0.8s steps(2) infinite; }
    :host(.animated) .w2 { animation: flicker 0.8s steps(2) infinite 0.4s; }
    .s { transform-box: fill-box; transform-origin: center; }
    :host(.animated) .s { animation: twinkle 1.8s ease-in-out infinite; }
    :host(.animated) .s2 { animation-delay: .45s; }
    :host(.animated) .s3 { animation-delay: .9s; }
    :host(.animated) .s4 { animation-delay: 1.35s; }

    :host(.excited) .bar { animation: boing 0.6s cubic-bezier(.3,1.6,.5,1); }
    :host(.excited) .ball { animation: boing 0.6s cubic-bezier(.3,1.6,.5,1) 0.08s; }

    @keyframes bar-bounce {
      0%, 100% { transform: translateY(0) scale(1, 1); }
      12% { transform: translateY(0) scale(1.06, 0.92); }
      45% { transform: translateY(-26px) scale(0.96, 1.05) rotate(-3deg); }
      75% { transform: translateY(0) scale(1.04, 0.96); }
    }
    @keyframes ball-bounce {
      0%, 100% { transform: translateY(0) scale(1, 1); }
      10% { transform: translateY(0) scale(1.14, 0.84); }
      45% { transform: translateY(-34px) scale(0.94, 1.06); }
      75% { transform: translateY(0) scale(1.1, 0.9); }
    }
    @keyframes shadow-pulse {
      0%, 100% { transform: scale(1); opacity: .2; }
      45% { transform: scale(.7); opacity: .1; }
    }
    @keyframes flicker { 0% { opacity: 1; } 100% { opacity: .25; } }
    @keyframes twinkle {
      0%, 100% { transform: scale(.6) rotate(0); opacity: .5; }
      50% { transform: scale(1.25) rotate(45deg); opacity: 1; }
    }
    @keyframes boing {
      0% { transform: scale(1, 1); }
      25% { transform: scale(1.25, 0.75); }
      50% { transform: scale(0.85, 1.2) translateY(-20px); }
      75% { transform: scale(1.08, 0.94); }
      100% { transform: scale(1, 1); }
    }
    @media (prefers-reduced-motion: reduce) {
      :host(.animated) * { animation: none !important; }
    }
  `,
})
export class Bang {
  readonly animated = input(true);
  readonly decorated = input(true);
  readonly excited = input(false);

  protected readonly star = STAR;
  protected readonly uid = 'bang' + Math.random().toString(36).slice(2, 8);
}
