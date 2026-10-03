# Excalation ($!) — website

Sito ufficiale del token **$! (Excalation)** su Solana / pump.fun. Angular 22, standalone components, signals, nessuna libreria esterna.

## Avvio

```bash
npm install
npm start          # http://localhost:4200
npm run build      # output in dist/excalation/browser (sito statico)
```

## Cosa modificare al lancio

Tutto in `src/app/core/token.config.ts`:

- `contractAddress` → incolla il mint address dopo il lancio (compare nell'hero con il tasto "Copia" e i link puntano a `pump.fun/coin/<CA>`)
- `links.x`, `links.telegram`, `links.dexscreener` → i link social (vuoti = "presto")

Testi IT/EN: `src/app/core/i18n/it.ts` e `en.ts`.

## Easter egg

- Clicca il grande "!" nell'hero (ogni 10 click piovono punti esclamativi)
- Premi `!` o `1` ovunque
- Scrivi `excalation` sulla tastiera
