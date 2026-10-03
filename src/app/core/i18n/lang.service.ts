import { Injectable, computed, effect, signal } from '@angular/core';
import { EN } from './en';
import { IT } from './it';

export type Lang = 'en' | 'it';

const STORAGE_KEY = 'excalation-lang';

@Injectable({ providedIn: 'root' })
export class LangService {
  readonly lang = signal<Lang>(this.initialLang());
  readonly t = computed(() => (this.lang() === 'it' ? IT : EN));

  constructor() {
    effect(() => {
      document.documentElement.lang = this.lang();
    });
  }

  toggle(): void {
    this.lang.update((l) => (l === 'en' ? 'it' : 'en'));
    // Remember only an explicit choice made with the toggle.
    try {
      localStorage.setItem(STORAGE_KEY, this.lang());
    } catch {}
  }

  /** English by default; Italian only if the visitor picked it before. */
  private initialLang(): Lang {
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'it') return 'it';
    } catch {}
    return 'en';
  }
}
