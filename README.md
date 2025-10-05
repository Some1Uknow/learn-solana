<div align="center">
  <img src="app/icon.ico" alt="learn.sol logo" width="120" />
  <h1>learn.sol - Free, Open‑Source Solana & Web3 Curriculum</h1>
  <p><strong>Beginner‑friendly, project‑based curriculum to learn Solana, Rust, Anchor, Tokens, and Full‑Stack dApps.</strong></p>
  <p>
    <a href="https://learnsol.site"><img alt="Live Site" src="https://img.shields.io/badge/Live-learnsol.site-6EE7B7?logo=vercel&logoColor=black" /></a>
    <a href="LICENSE.MD"><img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg" /></a>
    <img alt="Stack" src="https://img.shields.io/badge/Next.js_14-black?logo=next.js&logoColor=white" />
    <img alt="Solana" src="https://img.shields.io/badge/Solana-262626?logo=solana" />
    <img alt="Rust" src="https://img.shields.io/badge/Rust-000000?logo=rust" />
  </p>
</div>

Learn Solana by building. Short lessons. Clear tasks. Real projects. Built for web2 developers moving into web3, and web3 builders leveling up on Solana.

Top keywords: Solana tutorial, Solana course, Solana developer, Rust on Solana, Anchor framework, SPL Token, PDA, CPI, NFT, Web3Auth, Next.js dApp, Metaplex, free Solana curriculum, pgvector RAG AI chat.

— Live site: https://learnsol.site

## Why this curriculum?

- Free, open‑source, and always up‑to‑date with Solana best practices
- Step‑by‑step modules with real code you can ship
- Built‑in AI chat grounded in docs for instant help (RAG with pgvector)
- Gamified learning with Phaser mini‑games and NFT rewards (Metaplex)
- Web3‑native auth (Web3Auth) and fully Solana‑focused (no EVM deps)

## Curriculum overview (beginner → advanced)

Each week is a focused module. Follow in order or jump to what you need.

### Week 1 — Solana Fundamentals (Available)

What you’ll learn:
- Solana architecture essentials: accounts, programs, fees, and clusters
- Using Solana CLI like a pro: keypairs, airdrops, config, RPC checks
- Reading on‑chain data and sending safe transactions on devnet

Lessons:
- Devnet setup, wallets, RPCs → /learn/week-1/devnet-setup
- Accounts & lamports exercise → /learn/week-1/accounts-lamports-exercise
- Transaction anatomy → /learn/week-1/transaction-anatomy
- Program interaction project → /learn/week-1/program-interaction-project
- Exploration challenge → /learn/week-1/basic-exploration-challenge

Outcome: Fund wallets, read accounts, reason about rent/ATAs, and send transactions on devnet.

### Week 2 — Rust for Solana (Available)

What you’ll learn:
- Modern Rust aligned to on‑chain constraints: ownership, lifetimes, enums, traits
- Writing safe, ergonomic APIs and tests you can reuse in programs
- Practical patterns for collections, error handling, and performance

Lessons:
- Day 1: Rust fundamentals → /learn/week-2/day-1-rust-fundamentals
- Day 1: Challenges → /learn/week-2/day-1-challenges
- Day 2: Ownership system → /learn/week-2/day-2-ownership-system
- Day 2: Challenges → /learn/week-2/day-2-challenges
- Day 3: Data structures → /learn/week-2/day-3-data-structures
- Day 3: Challenges → /learn/week-2/day-3-challenges
- Mid‑course projects → /learn/week-2/mid-course-projects
- Day 4: Enums & pattern matching → /learn/week-2/day-4-enums-pattern-matching
- Day 4: Challenges → /learn/week-2/day-4-challenges
- Day 5: Collections & strings → /learn/week-2/day-5-collections-strings
- Day 5: Challenges → /learn/week-2/day-5-challenges

Outcome: Confident Rust skills mapped to Solana program development and testing.

### Week 3 — Anchor Framework (Coming by end of 2025)

What you’ll learn:
- Anchor ergonomics: IDL, constraints, macros, events, and testing
- PDAs, seed strategies, and CPI to compose with other protocols
- Token flows with SPL: mints, ATAs, metadata, and secure authorities

Planned lessons:
- Anchor introduction → /learn/week-3/anchor-introduction
- SPL Token integration → /learn/week-3/spl-token-integration
- Token minting project → /learn/week-3/token-minting-project
- PDA seed derivation → /learn/week-3/pda-seed-derivation
- Escrow mechanism project → /learn/week-3/escrow-mechanism-project
- Cross‑Program Invocations (CPI) → /learn/week-3/cpi-cross-program
- DeFi integration challenge → /learn/week-3/defi-integration-challenge
- Anchor ergonomics & best practices → /learn/week-3/anchor-ergonomics

Outcome: Build real Anchor programs with PDAs, CPIs, and robust token integrations.

### Week 4 — Client‑Side & Full‑Stack dApps (Coming by end of 2025)

What you’ll learn:
- Wallet adapters (Phantom/Solflare/Ledger), connection UX, session management
- React data flows with account subscriptions and optimistic updates
- Testing, CI/CD, deployment strategies, and upgrade‑safe patterns

Planned lessons:
- Wallet integration exercise → /learn/week-4/wallet-integration-exercise
- React integration project → /learn/week-4/react-integration-project
- UX enhancements → /learn/week-4/ux-enhancements
- Testing & CI/CD → /learn/week-4/testing-cicd-setup
- Deployment strategies → /learn/week-4/deployment-strategies
- Architecture & optimization → /learn/week-4/architecture-optimization
- Upgrades & maintenance challenge → /learn/week-4/upgrades-maintenance-challenge

Outcome: Ship production‑ready, wallet‑connected frontends with strong DX.

### Week 5 — Capstone & Portfolio (Planned)

What you’ll build:
- A showcase‑ready Solana application with docs, tests, analytics, and demos
- Professional presentation materials and a solid case study write‑up

Planned lessons:
- Advanced features → /learn/week-5/advanced-features-implementation
- Full‑stack integration → /learn/week-5/fullstack-integration
- Testing & security audit → /learn/week-5/testing-security-audit
- Deployment → /learn/week-5/deployment-production
- Documentation polish → /learn/week-5/documentation-polish
- Performance optimization → /learn/week-5/performance-optimization
- Portfolio presentation → /learn/week-5/portfolio-presentation

Outcome: A portfolio‑ready Solana application you can demo and extend.

> Status note: Weeks 1–2 are available now. Weeks 3–4 are targeted by end of 2025. Week 5 follows after that milestone.

## Features at a glance

- MDX lessons with rich components (Fumadocs UI)
- Documentation search & AI chat (OpenAI + pgvector RAG)
- Web3 login with Web3Auth (Ed25519 → Solana)
- Gamified exercises (Phaser) with NFT rewards (Metaplex)
- Devnet‑first: all on Solana devnet RPC

## Quick start

Requirements:
- Node.js 18+ and npm
- Optional (AI search/chat): PostgreSQL + pgvector, OpenAI API Key

1) Install deps
```bash
npm install
```

2) Environment

Create `.env.local` in the project root. Use the sample below and adjust for your setup.

Required:
- OPENAI_API_KEY: for embeddings + AI chat (RAG)
- POSTGRES_URL: PostgreSQL connection string with pgvector
- NEXT_PUBLIC_SOLANA_RPC_URL: Solana devnet RPC endpoint
- NEXT_PUBLIC_WEB3AUTH_CLIENT_ID: Web3Auth Client ID from your dashboard

Recommended (URLs for metadata, robots, and sitemaps):
- NEXT_PUBLIC_SITE_URL: canonical site URL (e.g., https://learnsol.site)
- NEXT_PUBLIC_BASE_URL: base URL for robots/sitemap (e.g., https://learnsol.site)

Optional (analytics / developer toggles):
- NEXT_PUBLIC_CLARITY_ID: Microsoft Clarity site ID
- NEXT_PUBLIC_ENABLE_REACT_SCAN: set to 1 to enable React Scan overlay in dev
- DEBUG_LOGS: set to 1 to enable verbose debug logs in dev

```bash
# .env.local

# Required
OPENAI_API_KEY=sk-...
POSTGRES_URL=postgresql://user:pass@host:5432/db
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=YOUR_WEB3AUTH_CLIENT_ID

# Recommended
NEXT_PUBLIC_SITE_URL=https://learnsol.site
NEXT_PUBLIC_BASE_URL=https://learnsol.site

# Optional
NEXT_PUBLIC_CLARITY_ID=
NEXT_PUBLIC_ENABLE_REACT_SCAN=
DEBUG_LOGS=
```

3) Run dev server
```bash
npm run dev
# open http://localhost:3000
```

Search index (optional, when content changes):
```bash
npm run ingest-docs
```

## Content authoring

- Add or edit MDX in `content/week-*`
- Control ordering and visibility via `content/week-*/meta.json` (`pages` array)
- Rebuild embeddings after content changes with `npm run ingest-docs`

## Architecture

- Next.js App Router + Fumadocs MDX for content
- Drizzle ORM + Postgres (pgvector) for embeddings
- AI chat: user query → vector search → OpenAI → citations
- Web3Auth for Solana keypairs (Ed25519 → @solana/web3.js)
- Phaser mini‑games → NFT mint via Metaplex on devnet

## Topics you’ll learn 

Solana devnet, wallets, airdrops, RPC; accounts, lamports, rent; transactions, instructions; PDAs, seeds, bumps; CPIs; SPL Token (ATA, mint, metadata); Anchor framework (IDL, macros, constraints); Rust ownership, borrowing, lifetimes, enums, traits; Next.js wallet integration; Web3Auth; Metaplex NFTs; Drizzle ORM; pgvector RAG search; Phaser games.

## Contributing

Pull requests welcome! Improve lessons, fix typos, add examples, or propose new modules.

Content contributions (tutorials/lessons):
- Add or edit MDX in `content/week-*` and update the week’s `meta.json` `pages` array to include your new slug in the correct order.
- Preview locally with `npm run dev`.
- Open a PR and include screenshots and a short summary of the learning goals and outcomes.
- Important: do not run embeddings ingestion on CI. After your PR is opened, ping @Some1Uknow for review. Ingestion (`npm run ingest-docs`) will be run by the maintainer after approval to update search indexes.

## License

MIT — see [LICENSE.MD](LICENSE.MD)

---

Built by the community for the community. If this helps you learn Solana faster, ⭐ star the repo and share it with other builders.
