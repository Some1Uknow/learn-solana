<div align="center">
  <img src="public/brand/learnsol-app-icon.png" alt="learn.sol logo" width="112" />

  <h1><strong>learn.sol</strong></h1>
  <p><strong>The onboarding and education layer for Solana builders.</strong></p>

  <p>
    <a href="https://learnsol.site"><strong>Live Site</strong></a>
    ·
    <a href="https://youtu.be/pM1zKL5CbhA"><strong>Demo</strong></a>
    ·
    <a href="https://x.com/learndotsol"><strong>X</strong></a>
  </p>
</div>

<div align="center">
  <a href="https://learnsol.site"><img alt="Live site" src="https://img.shields.io/badge/Live-learnsol.site-A9FF2F?logo=vercel&logoColor=black" /></a>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs" />
  <img alt="Solana" src="https://img.shields.io/badge/Solana-Education-9945FF?logo=solana&logoColor=white" />
  <a href="LICENSE.MD"><img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg" /></a>
</div>

<br />

<img width="1400" height="686" alt="learn.sol product banner" src="https://github.com/user-attachments/assets/794f68fe-8df7-426b-b8b1-10c20123920e" />

## What This Is

learn.sol is a free, open-source learning product for developers who want to understand Solana by building through the stack.

It is not a loose list of tutorials. The product connects structured modules, executable exercises, runtime-focused tools, AI-assisted documentation, and a publishable agent skill into one learning loop:

1. Read a concept.
2. Practice it in code.
3. Inspect how the Solana runtime thinks.
4. Build the same idea visually.
5. Ask for help with source-grounded answers.

The goal is simple: help builders move from "I copied a Solana snippet" to "I can explain what accounts, signers, transactions, PDAs, token flows, and clients are doing."

## Product Surface

### Structured Modules

The curriculum is organized around the real Solana developer stack:

| Module | Focus |
| --- | --- |
| Solana Foundations | CLI workflow, accounts, lamports, transactions, architecture, and a first devnet toolkit with `@solana/kit`. |
| Rust Foundations | Syntax, ownership, borrowing, structs, enums, collections, methods, and Solana-shaped Rust practice. |
| Anchor Programs | Local setup, program anatomy, constraints, PDAs, SPL Token, CPI, token minting, escrow, and ergonomics. |
| Solana Kit Clients | Wallet Standard, account reads, transaction messages, confirmation, Token-2022 flows, Anchor clients, transaction UX, and testing. |

All lesson content lives under [`content/`](content) and is rendered through Fumadocs MDX.

### Executable Challenges

The challenge system is content-first and currently ships a 30-exercise Rust track under [`content/challenges/rust`](content/challenges/rust).

Challenges support:

- MDX-defined titles, descriptions, tags, starter code, and executor metadata.
- Monaco-based editing.
- Server-side validation through the Rust Playground API.
- Authenticated progress and completion tracking through Privy + Postgres.

Key files:

- [`lib/challenges/exercises.ts`](lib/challenges/exercises.ts)
- [`app/challenges`](app/challenges)
- [`app/api/challenges/run/route.ts`](app/api/challenges/run/route.ts)
- [`app/api/challenges/progress/route.ts`](app/api/challenges/progress/route.ts)
- [`app/api/challenges/complete/route.ts`](app/api/challenges/complete/route.ts)

### Runtime Lab

Runtime Lab is an interactive Solana runtime simulator for beginners. Learners predict what the runtime checks, reveal account diffs, inspect logs, and debug failure modes like wrong signers, owner mismatches, and PDA seed errors.

Runtime Lab currently includes a Vault Bootcamp flow and saves signed-in user progress.

Key files:

- [`lib/runtime-lab/flows.ts`](lib/runtime-lab/flows.ts)
- [`app/tools/runtime-lab`](app/tools/runtime-lab)
- [`app/api/tools/runtime-lab/progress/route.ts`](app/api/tools/runtime-lab/progress/route.ts)

### Visual Builder

Visual Builder lets learners sketch Solana program architecture with drag-and-drop blocks for programs, instructions, transactions, signers, accounts, PDAs, token mints, token accounts, and CPIs.

It also includes local graph persistence and Anchor export helpers.

Key files:

- [`components/visual-builder/editor.tsx`](components/visual-builder/editor.tsx)
- [`lib/visual-builder/blocks.ts`](lib/visual-builder/blocks.ts)
- [`lib/visual-builder/export-anchor.ts`](lib/visual-builder/export-anchor.ts)
- [`app/tools/visual-builder`](app/tools/visual-builder)

### AI and LLM-Ready Docs

learn.sol includes a documentation-aware chat route and LLM-friendly text endpoints:

- `/api/chat` streams AI answers with a documentation search tool.
- `/llms.txt` lists the docs corpus with canonical URLs and MDX links.
- `/llms-full.txt` returns a full text dump of the learning content.
- `/learn/<slug>.mdx` exposes markdown-friendly routes for individual docs pages.

Embeddings and search data use Postgres + pgvector.

### Agent Skill

This repo ships a publishable Agent Skill that turns coding agents into Solana teachers.

Install it with:

```bash
npx skills add Some1Uknow/learn-solana --skill learn-solana
```

The skill lives in [`skills/learn-solana`](skills/learn-solana). It teaches Solana concepts from first principles with examples, diagrams, tables, exercises, and temporary HTML explainers.

## Tech Stack

- Next.js 15 App Router
- React 18
- TypeScript
- Tailwind CSS 4
- Fumadocs MDX
- Privy auth with embedded Solana wallets
- PostgreSQL
- Drizzle ORM
- pgvector for documentation search
- AI SDK + OpenAI
- Monaco Editor
- React Flow
- Radix UI primitives
- OpenNext Cloudflare deployment

## Project Structure

```text
app/                    App Router pages, API routes, OG images, tools, and docs endpoints
components/             UI, layout, auth, challenge, learn, and visual-builder components
content/                MDX curriculum and challenge content
data/                   Module catalog data used by the modules UI
drizzle/                Database migrations
hooks/                  Client hooks for auth, progress, and tool state
lib/                    Auth, DB, challenge, runtime-lab, visual-builder, SEO, AI, and Solana helpers
public/                 Brand assets, logos, social images, and static media
scripts/                Migration, SEO, and docs ingestion scripts
skills/learn-solana/    Publishable Solana teaching agent skill
docs/                   Architecture notes and project documentation
```

## Getting Started

### Requirements

- Node.js 20+
- pnpm 10+
- PostgreSQL if you want auth-backed progress, embeddings, or DB-backed features
- A Privy app for local auth
- An OpenAI API key for chat and docs ingestion

### Install

```bash
pnpm install
```

### Configure Environment

Create a local `.env` file:

```bash
POSTGRES_URL="postgresql://user:password@localhost:5432/learnsol"

NEXT_PUBLIC_SITE_URL="http://localhost:3000"

NEXT_PUBLIC_PRIVY_APP_ID="your-privy-app-id"
NEXT_PUBLIC_PRIVY_CLIENT_ID="your-privy-client-id"
PRIVY_APP_ID="your-privy-app-id"
PRIVY_APP_SECRET="your-privy-app-secret"

OPENAI_API_KEY="your-openai-api-key"

# Optional
NEXT_PUBLIC_CLARITY_ID=""
NEXT_PUBLIC_ENABLE_REACT_SCAN=""
```

### Run Locally

```bash
pnpm dev
```

Open `http://localhost:3000`.

### Database

Generate migrations:

```bash
pnpm db:generate
```

Apply migrations through the safe migration wrapper:

```bash
pnpm db:migrate
```

Open Drizzle Studio:

```bash
pnpm db:studio
```

### Rebuild Documentation Search

If lesson content changes and you need fresh embeddings:

```bash
pnpm ingest-docs
```

This requires `POSTGRES_URL` and `OPENAI_API_KEY`.

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the local Next.js dev server with Turbopack. |
| `pnpm build` | Build the Next.js app. |
| `pnpm start` | Start the production Next.js server. |
| `pnpm seo:check` | Validate SEO route assumptions. |
| `pnpm db:generate` | Generate Drizzle migrations. |
| `pnpm db:migrate` | Apply migrations with the safe wrapper. |
| `pnpm db:studio` | Open Drizzle Studio. |
| `pnpm ingest-docs` | Rebuild the docs search corpus and embeddings. |
| `pnpm preview` | Build and preview with OpenNext Cloudflare. |
| `pnpm deploy` | Build and deploy with OpenNext Cloudflare. |
| `pnpm knip` | Check for unused files, dependencies, and exports. |
| `pnpm find:unused` | Run Next unused checks. |

## Routes Worth Knowing

| Route | Purpose |
| --- | --- |
| `/` | Product home page. |
| `/modules` | Module catalog. |
| `/modules/[moduleId]` | Module detail pages backed by `data/contents-data.ts`. |
| `/learn/[[...slug]]` | Fumadocs MDX lesson reader. |
| `/challenges` | Challenge track catalog. |
| `/challenges/[track]` | Challenge list for a track. |
| `/challenges/[track]/[slug]` | Challenge workspace with editor and validation. |
| `/tools` | Tool catalog. |
| `/tools/runtime-lab` | Runtime Lab program list. |
| `/tools/runtime-lab/[programId]` | Runtime Lab interactive program flow. |
| `/tools/visual-builder` | Visual Solana Builder. |
| `/branding` | Brand kit page. |
| `/partner` | Partner page. |
| `/llms.txt` | LLM-readable docs index. |
| `/llms-full.txt` | Full docs content dump for LLMs. |

## Content Workflow

To add or edit a lesson:

1. Add or update an `.mdx` file in the right module folder under [`content/`](content).
2. Update that module's `meta.json`.
3. If the lesson should appear in the module catalog, update [`data/contents-data.ts`](data/contents-data.ts).
4. Run the app locally and check the lesson route.
5. Run `pnpm ingest-docs` if search embeddings need to be refreshed.

To add a challenge:

1. Add an MDX file under `content/challenges/<track>/`.
2. Include frontmatter for `title`, `description`, `track`, `slug`, `order`, `difficulty`, `tags`, `starterCode`, and optional executor settings.
3. Use the existing Rust challenge files as the reference pattern.

## Contributing

Contributions are welcome across curriculum, examples, UI, product flows, and infrastructure.

Start with [`CONTRIBUTING.md`](CONTRIBUTING.md), but note that the current curriculum structure is module-based under `content/solana-foundations`, `content/rust-foundations`, `content/anchor-programs`, and `content/solana-kit-clients`.

## License

MIT. See [`LICENSE.MD`](LICENSE.MD).

<div align="center">
  <strong>Built for Solana developers who want the model, not just the snippet.</strong>
</div>
