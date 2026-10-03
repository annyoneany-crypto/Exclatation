/**
 * Everything you need to edit when the token goes live lives here.
 * Leave a field empty ('') to show "coming soon" / hide the link.
 */
export const TOKEN = {
  name: 'Excalation',
  ticker: '$!',
  /** Paste the Solana mint address here after launching on pump.fun */
  contractAddress: '',
  totalSupply: 1_000_000_000,
  decimals: 6,
  links: {
    pumpfun: 'https://pump.fun',
    x: '',
    telegram: '',
    dexscreener: '',
  },
};

/** Direct link to the coin page on pump.fun (falls back to the homepage). */
export function pumpFunUrl(): string {
  return TOKEN.contractAddress
    ? `https://pump.fun/coin/${TOKEN.contractAddress}`
    : TOKEN.links.pumpfun;
}

/**
 * pump.fun bonding curve parameters (constant product x*y=k with virtual reserves).
 * Values reflect pump.fun's public mechanics and may change on their side.
 */
export const CURVE = {
  virtualSol: 30,
  virtualTokens: 1_073_000_000,
  curveTokens: 793_100_000,
  liquidityTokens: 206_900_000,
  /** SOL collected when the curve completes (~85 SOL) */
  graduationSol: 85,
  feePct: 1,
};
