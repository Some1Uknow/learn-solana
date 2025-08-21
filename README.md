# learn.sol — Solana developer curriculum

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

### Week 1 — Foundations and first transactions

- Devnet setup — wallets, airdrops, RPCs (`content/week-1/devnet-setup.mdx`)
- Accounts and lamports — balances, system program (`content/week-1/accounts-lamports-exercise.mdx`)
- Transaction anatomy — instructions, signatures, fees (`content/week-1/transaction-anatomy.mdx`)
- Program interaction — call on-chain programs from a client (`content/week-1/program-interaction-project.mdx`)
- Challenge — small exploration task (`content/week-1/basic-exploration-challenge.mdx`)

Outcome: You can fund wallets, read accounts, and send basic transactions to Solana devnet.

### Week 2 — Rust for Solana and daily challenges

- Rust fundamentals (day 1) — types, ownership, errors (`content/week-2/day-1-rust-fundamentals.mdx`)
- Day 1 challenges — practice tasks (`content/week-2/day-1-challenges.mdx`)
- Day 2 challenges — more practice (`content/week-2/day-2-challenges.mdx`)

Outcome: You can read and write basic Rust used in Solana programs.

### Weeks 3–5 — Programs, tokens, and real projects

- Advanced topics roll out here (PDAs, CPIs, tokens, testing, deployment)
- Expect one hands‑on project per week (increasing difficulty)

Outcome: You can ship a simple Solana app end‑to‑end.

Note: Weeks 3–5 content is being expanded; follow along in `content/week-3`, `week-4`, `week-5`.

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