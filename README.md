# learn.sol - Solana developer curriculum

<div align="center">
  <img src="app/icon.ico" alt="Learn SOL Logo" width="120" />
</div>

Learn Solana by building. Short lessons. Clear tasks. Real projects.

• Live: https://learnsol.site

## Who this is for

- Developers who want a practical path into Solana
- You know basic JS/TS. Rust experience helps but isn’t required

## How to use this repo

- Each module is an MDX lesson in `content/week-*`
- Open the site and follow the modules in order (or read MDX files directly)
- Use the built‑in AI chat to ask questions about any lesson

Minimal local run (optional):
- Copy `.env.example` to `.env.local` and set `OPENAI_API_KEY`
- If you want AI search/chat the same as prod, also set `DATABASE_URL` and run `npm run ingest-docs`
- Start the app and open http://localhost:3000

## Curriculum overview

Start here and move top‑to‑bottom. Expect ~5–10 hours per week.

### Week 1 - Foundations and first transactions

- Devnet setup — wallets, airdrops, RPCs (`content/week-1/devnet-setup.mdx`)
- Accounts and lamports — balances, system program (`content/week-1/accounts-lamports-exercise.mdx`)
- Transaction anatomy — instructions, signatures, fees (`content/week-1/transaction-anatomy.mdx`)
- Program interaction — call on-chain programs from a client (`content/week-1/program-interaction-project.mdx`)
- Challenge — small exploration task (`content/week-1/basic-exploration-challenge.mdx`)

Outcome: You can fund wallets, read accounts, and send basic transactions to Solana devnet.

### Week 2 - Rust for Solana and daily challenges

- Rust fundamentals (day 1) — types, ownership, errors (`content/week-2/day-1-rust-fundamentals.mdx`)
- Day 1 challenges — practice tasks (`content/week-2/day-1-challenges.mdx`)
- Day 2 challenges — more practice (`content/week-2/day-2-challenges.mdx`)

Outcome: You can read and write basic Rust used in Solana programs.

### Weeks 3-5 - Programs, tokens, and real projects

- Advanced topics roll out here (PDAs, CPIs, tokens, testing, deployment)
- Expect one hands‑on project per week (increasing difficulty)

Outcome: You can ship a simple Solana app end‑to‑end.

Note: Weeks 3-5 content is being expanded; follow along in `content/week-3`, `week-4`, `week-5`.

## Built‑in AI helper

- Click the chat button in the app
- Ask anything about the current lesson or code
- Answers are grounded in this repo’s MDX content and examples

## What you’ll need

- Node.js and npm
- Optional for local AI search: PostgreSQL with pgvector

## Contribute

- Lessons live in `content/`
- Add or improve a lesson, then run the doc ingester (`npm run ingest-docs`) to update search

## Credits

Funded by Solana Foundation and CoinDCX with support from Superteam IN. Built with Next.js, Tailwind, Drizzle, and an AI layer for search/chat.

## License

MIT — see LICENSE.

## Game NFT Claim Flow (User-Paid Mint)

The NFT reward system supports a user-paid mint model so the platform does not spend SOL:

1. Player completes a game (Phaser scene emits completion event).
2. UI shows Claim NFT button.
3. On click, client constructs and sends a transaction that:
  - Creates a new mint (0 decimals, supply 1)
  - Creates the player's ATA
  - Mints 1 token to player (no on-chain metadata for simplest path)
4. After confirmation, client POSTs to `/api/mint-game-nft` with `{ clientMint: true, mintAddress, gameId, walletAddress }`.
5. Server verifies auth + uniqueness and records row (no SOL spent).

Environment:
- `NEXT_PUBLIC_SOLANA_RPC_URL` (required) e.g. `https://api.devnet.solana.com`
- `METAPLEX_SECRET_KEY` (optional) only needed for legacy server-authority mint fallback.

If `METAPLEX_SECRET_KEY` is unset and a client attempts server mint (without `clientMint`), the API will return an error instructing client-side mint usage.

Security notes:
- Server currently trusts provided `mintAddress` after base58 validation; optional enhancement: fetch mint + metadata PDA to verify existence and ownership.
- Uniqueness enforced by `(gameId, walletAddress)` in DB prevents double-claim.
- Metadata URI currently points to a static asset; extend to a JSON metadata file for richer attributes.

Future improvements:
- On-chain validation of submitted mint.
- JSON metadata hosting with dynamic attributes.
- Compressed NFT option once stable for browsers without extra dependencies.

### Game Progress Auth Notes

The game completion & claim APIs (`/api/games/complete`, `/api/games/progress`, `/api/mint-game-nft`) require a valid Web3Auth identity JWT. Early implementations relied on the `web3auth_token` cookie alone. Because `getIdentityToken()` can resolve slightly after initial connection/hydration, a race existed where the completion POST fired before the cookie was written, producing intermittent `401 Authentication required` errors.

Mitigation implemented:
- A hook (`useAutoRegisterUser`) aggressively fetches the identity token with retries, sets a cookie, and exposes it on `window.__WEB3AUTH_ID_TOKEN`.
- Client API calls now attach an `Authorization: Bearer <token>` header if available; server still falls back to cookie for robustness.

If you add new authenticated routes, mirror this pattern or centralize in a small `authFetch` helper to avoid similar races.

## Game Progress & Claim State

Persistent progress tracking is stored in the `game_progress` table and separates three concepts:

1. Completion (`completedAt`): The user has finished the game at least once.
2. Claimability (`canClaim`): The user is currently eligible to mint the reward NFT.
3. Claim (`claimedAt`): The user minted (or recorded mint of) the NFT.

### Lifecycle

1. Client game emits completion → optimistic UI update + POST `/api/games/complete { gameId }`.
2. Server upserts row (if first time) with `completedAt` (now) and `canClaim = true` (unless already claimed).
3. User clicks Claim → client performs on-chain mint (user pays) → POST `/api/mint-game-nft`.
4. Mint API records NFT in `minted_nfts` and sets `claimedAt` & `canClaim = false` in `game_progress`.
5. `/api/games/progress` returns all progress rows for the authenticated wallet to hydrate UI on load.

### Why explicit `canClaim`?

Derived logic `(completedAt && !claimedAt)` works today, but a stored flag lets future features like cooldowns, revocation, or multi‑tier rewards without schema changes.

### APIs

| Route | Method | Description |
|-------|--------|-------------|
| `/api/games/complete` | POST | Mark completion / (re)enable claim if unclaimed |
| `/api/games/progress` | GET | List progress rows for current wallet |
| `/api/mint-game-nft` | POST | Record NFT mint & finalize claim state |

### Future Enhancements

- Mint address -> progress join on hydration (currently only completion state is preloaded; mint address comes from `minted_nfts`).
- On-chain PDA verification before marking `claimedAt`.
- Multiple reward tiers per game (introduce `rewardTier` column).
- Rate limiting claim attempts.