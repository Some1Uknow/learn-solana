# Contributing to learn.sol

Thanks for contributing.

learn.sol is an open-source Solana learning product built around structured curriculum, interactive tools, executable challenges, and source-grounded AI help. Good contributions make the product clearer, more correct, and more useful for builders trying to understand how Solana actually works.

This guide covers the current repo structure and contribution workflow.

## Before You Start

### Requirements

- Node.js 20+
- pnpm 10+
- Git
- PostgreSQL if you need auth-backed progress, docs ingestion, or local DB features
- A Privy app if you need to test login flows
- An OpenAI API key if you need to rebuild embeddings or test the assistant end to end

### Core Areas of the Repo

```text
app/                    App Router pages, API routes, tools, docs endpoints
components/             UI, auth, challenge, learn, and visual-builder components
content/                MDX lesson content and challenge definitions
data/                   Module catalog data
drizzle/                Database migrations
hooks/                  Client hooks
lib/                    Auth, AI, DB, Solana helpers, challenge and tool logic
public/                 Brand assets and static files
scripts/                Migrations, SEO checks, docs ingestion
skills/learn-solana/    Publishable Solana teaching agent skill
```

### Current Curriculum Structure

The curriculum is module-based, not week-based.

Main lesson content currently lives in:

- `content/solana-foundations`
- `content/rust-foundations`
- `content/anchor-programs`
- `content/solana-kit-clients`

Challenge content currently lives in:

- `content/challenges/rust`

There is also a `content/tutorials` area for additional content.

## Types of Contributions

You can help in a few different ways:

- Improve lesson clarity, correctness, or examples
- Add or expand challenges
- Improve Runtime Lab or Visual Builder behavior
- Fix bugs in docs rendering, auth, AI, or tooling
- Improve navigation, page UX, or content discoverability
- Tighten scripts, ingestion, or database workflows
- Add better source material for the `learn-solana` skill

## Content Contributions

### Editing Existing Lessons

Lessons are MDX files inside the appropriate module directory under `content/`.

Examples:

```text
content/solana-foundations/solana-architecture.mdx
content/anchor-programs/pda-seed-derivation.mdx
content/solana-kit-clients/wallet-standard-clients.mdx
```

When editing lessons:

- keep the writing direct and beginner-friendly
- prefer concrete examples over long explanation
- explain Solana-specific terms the first time they appear
- avoid cargo-cult snippets without explaining why they work
- keep links and code samples current

### Adding a New Lesson

1. Add the `.mdx` file in the correct module folder under `content/`.
2. Update that module's `meta.json` so the page appears in the docs nav.
3. If the lesson should also appear in the module catalog UI, update `data/contents-data.ts`.
4. Run the app locally and verify the page renders under `/learn/...`.
5. If the assistant search corpus should include the new content immediately, run `pnpm ingest-docs`.

### Adding a Challenge

Challenges are content-driven and live under `content/challenges/<track>/`.

Each challenge file should follow the existing frontmatter pattern used in the Rust challenge set, including fields like:

- `title`
- `description`
- `track`
- `slug`
- `order`
- `difficulty`
- `tags`
- `starterCode`

Before submitting a challenge change:

- make sure the starter code is coherent
- make sure the validator behavior still matches the prompt
- keep the challenge scoped enough for learners to complete

## Product and Code Contributions

### Interactive Tools

If you change Runtime Lab, Visual Builder, or challenge UX:

- preserve the current product tone and visual system
- avoid adding explanatory chrome where the interaction itself can teach
- make sure controls and text still fit on mobile and desktop
- verify auth-required actions still behave correctly when signed out

### AI Assistant and Docs Search

The assistant is source-grounded and backed by embedded docs content in Postgres + pgvector.

Relevant areas:

- `app/api/chat/route.ts`
- `lib/ai/`
- `scripts/ingest-docs.ts`
- `lib/mdx/processor.ts`

When changing this area:

- do not bypass authentication for assistant usage
- keep documentation URLs canonical
- avoid changes that would wipe existing docs rows before embeddings are ready
- verify unauthenticated requests fail cleanly

## Local Development

Install dependencies:

```bash
pnpm install
```

Create a local `.env` file with the variables described in the README.

Start the app:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

### Useful Commands

```bash
pnpm build
pnpm db:generate
pnpm db:migrate
pnpm db:studio
pnpm ingest-docs
pnpm seo:check
pnpm knip
pnpm find:unused
```

## Database and Ingestion Notes

If your change affects:

- lesson content
- challenge content used by search
- docs URL structure
- assistant retrieval behavior

then you may need to rebuild embeddings locally:

```bash
pnpm ingest-docs
```

Do not commit generated database state. Commit the source changes, not local DB output.

If you touch migrations:

- keep them narrowly scoped
- make sure the migration matches the schema change
- avoid bundling unrelated schema changes into one PR

## Standards

### Writing

- write for builders, not marketers
- keep explanations clear and concrete
- define Solana-specific vocabulary
- prefer real workflows, real account models, and real transaction reasoning
- do not add fluff to lesson content

### Code

- follow the existing patterns in the repo
- keep changes scoped to the feature you are touching
- prefer simple, explicit code over new abstractions
- do not mix unrelated refactors into contribution PRs

### UI

- match the existing visual language
- keep interactions stable on mobile and desktop
- avoid generic placeholder UX
- make auth-gated actions fail clearly and predictably

## Pull Requests

1. Fork the repo.
2. Create a branch for your change.
3. Make a scoped change.
4. Verify the relevant path locally.
5. Open a PR with a clear summary.

Good PR descriptions include:

- what changed
- why it changed
- any routes or files that should be reviewed first
- screenshots or recordings for UI changes
- notes about migrations, ingestion, or env requirements if relevant

## What to Avoid

- committing unrelated file churn
- reviving the old week-based structure in docs
- mixing content rewrites, migrations, and UI redesigns into one PR unless they are tightly connected
- checking in generated local artifacts
- weakening assistant auth requirements

## Questions and Issues

If you hit a blocker or want to propose a bigger change, open an issue first:

[https://github.com/Some1Uknow/learn-solana/issues](https://github.com/Some1Uknow/learn-solana/issues)

## License

By contributing, you agree that your contributions are licensed under the MIT License.

<div align="center">
  <strong>Thanks for helping builders learn Solana with better mental models.</strong>
</div>
