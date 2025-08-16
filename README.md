# learn.sol

<div align="center">
  <img src="app/icon.ico" alt="Learn SOL Logo" width="120" />
  
  <p>learn.sol — a focused learning platform for Solana blockchain development with an AI-powered documentation assistant and semantic search.</p>

  [![Solana Foundation](https://img.shields.io/badge/Funded%20by-Solana%20Foundation-14F195?style=for-the-badge)](https://solana.com)
  [![CoinDCX](https://img.shields.io/badge/Funded%20by-CoinDCX-3366FF?style=for-the-badge)](https://coindcx.com)

</div>

## Overview

learn.sol is an educational platform to onboard developers into the Solana ecosystem with integrated AI-powered documentation assistance. Funded by the Solana Foundation and CoinDCX in collaboration with Superteam IN, the project aims to make Solana development accessible, practical, and project-focused.

## Features

- Comprehensive Solana development curriculum
- AI-powered documentation chatbot using RAG (Retrieval-Augmented Generation)
- Semantic search over MDX documentation
- Vector database for efficient content retrieval
- Context-aware responses grounded in documentation
- Interactive coding exercises and hands-on projects
- Community-driven learning and contribution workflow
- Achievement and rewards system

## Tech stack

- Frontend: Next.js, React, TypeScript
- UI: Tailwind CSS, shadcn/ui components
- AI: Vercel AI SDK, OpenAI GPT-4
- Database: PostgreSQL with pgvector
- ORM: Drizzle ORM
- Documentation: MDX with gray-matter
- Deployment: Vercel

## Getting started

### Prerequisites

1. OpenAI API key (from https://platform.openai.com/)
2. PostgreSQL with pgvector (Neon recommended)

### Install and run (quick)

1. Clone and install dependencies

```bash
git clone https://github.com/yourusername/learn.sol.git
cd learn.sol
npm install
```

2. Configure environment

```bash
cp .env.example .env.local
# then edit .env.local and set OPENAI_API_KEY and DATABASE_URL
```

3. Database and ingestion

```bash
npm run db:generate
npm run db:push
npm run ingest-docs
npm run dev
```

Open http://localhost:3000 to view the app and the AI chat assistant.

## AI-powered features

### RAG documentation chatbot

The project implements a Retrieval-Augmented Generation pipeline:

1. MDX content ingestion and metadata extraction
2. Vector embeddings (OpenAI embeddings) for semantic matching
3. Semantic search using vector similarity
4. Contextualized responses from GPT-4, grounded in documentation

### Using the AI assistant

- Open the chat control (bottom-right in the UI)
- Ask questions about Solana or the included examples
- Get documentation-cited answers, code explanations and guided tutorials
- Use semantic search to find relevant MDX content

### Available scripts

```bash
# Database management
npm run db:generate
npm run db:push
npm run db:migrate
npm run db:studio

# AI system
npm run ingest-docs

# Development
npm run dev
npm run build
npm run start
```

## Project structure

```
├── app/                    # Next.js app routes and API
├── components/             # React components and UI
├── lib/                    # Utilities, AI, DB helpers, MDX processor
├── scripts/                # Utility scripts (ingest-docs, backup)
├── content/                # MDX learning content
└── drizzle.config.ts       # Drizzle ORM configuration
```

## Preview

<div align="center">
  <img src="public/opengraph-image.png" alt="Learn SOL Preview" width="600" />
</div>

## Adding new content

1. Add MDX files in `content/` following the existing frontmatter format
2. Run `npm run ingest-docs` to update embeddings and the knowledge base
3. The chatbot and semantic search will include the new content

## Contributing

Contributions are welcome: bug fixes, features, docs, UI/UX and AI improvements. Please read contributing guidelines and follow the repository's contribution process.

## Troubleshooting

Common issues:

1. Database connection errors: verify `DATABASE_URL` and pgvector
2. Empty AI responses: run `npm run ingest-docs` to repopulate the index
3. OpenAI API errors: check `OPENAI_API_KEY` and account usage
4. Chat component not showing: ensure it's imported in `app/layout.tsx`

## Acknowledgments

Special thanks to:

- [Solana Foundation](https://solana.com)
- [CoinDCX](https://coindcx.com)
- [Superteam IN](https://superteam.fun/in)
- [Vercel](https://vercel.com)
- [OpenAI](https://openai.com)

Thanks to the community of contributors and early adopters.

## Links

- Live demo: https://learnsol.site
- Twitter: https://x.com/some1uknow25

## License

MIT License — see LICENSE file for details.

## Keywords

Solana, Solana development, blockchain, RAG, retrieval-augmented generation, semantic search, MDX, pgvector, Drizzle ORM, OpenAI, GPT-4, Vercel AI SDK, embeddings, developer learning, tutorials