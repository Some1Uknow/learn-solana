# <div align="center">learn.sol</div>

<div align="center">
  <img src="app/icon.ico" alt="Learn SOL Logo" width="120" />
  
  <p>Your gateway to Solana blockchain development with AI-powered learning assistance</p>

  [![Solana Foundation](https://img.shields.io/badge/Funded%20by-Solana%20Foundation-14F195?style=for-the-badge)](https://solana.com)
  [![CoinDCX](https://img.shields.io/badge/Funded%20by-CoinDCX-3366FF?style=for-the-badge)](https://coindcx.com)

</div>

## 🚀 Overview

learn.sol is an innovative educational platform designed to onboard developers into the Solana ecosystem with integrated AI-powered documentation assistance. Funded by the Solana Foundation and CoinDCX, in collaboration with Superteam IN, our mission is to make Solana development accessible, engaging, and rewarding for developers of all skill levels.

## ✨ Features

- 📚 Comprehensive Solana development curriculum
- 🤖 **AI-powered documentation chatbot using RAG (Retrieval-Augmented Generation)**
- 🔍 **Semantic search through MDX documentation**
- 💾 **Vector database for efficient content retrieval**
- 🎯 **Context-aware responses based on actual documentation**
- 💻 Interactive coding exercises
- 🎯 Real-world project-based learning
- 🤝 Community-driven learning environment
- 🏆 Achievement system with rewards

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **UI**: Tailwind CSS, Shadcn UI Components
- **AI**: Vercel AI SDK, OpenAI GPT-4
- **Database**: PostgreSQL with pgvector extension
- **ORM**: Drizzle ORM
- **Documentation**: MDX with gray-matter processing
- **Deployment**: Vercel

## 🔥 Getting Started

### Prerequisites

1. **OpenAI API Key**: Get your API key from [OpenAI](https://platform.openai.com/)
2. **PostgreSQL Database with pgvector**: You can use:
   - [Neon](https://neon.tech/) (recommended, has pgvector built-in)
   - [Railway](https://railway.app/)
   - Local PostgreSQL with pgvector extension

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/learn.sol.git
cd learn.sol

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Configuration

Edit `.env.local` with your credentials:

```env
# AI SDK Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=your_postgres_connection_string_here
```

### Database Setup

```bash
# Generate database migrations
npm run db:generate

# Push schema to database
npm run db:push

# Ingest documentation (populate the AI knowledge base)
npm run ingest-docs

# Start the development server
npm run dev
```

Visit `http://localhost:3000` to see the application with AI chat assistance!

## 🤖 AI-Powered Features

### RAG Documentation Chatbot

The platform includes an advanced RAG (Retrieval-Augmented Generation) system that:

1. **Processes MDX Content**: Automatically ingests all learning materials
2. **Creates Vector Embeddings**: Uses OpenAI's text-embedding-ada-002 for semantic understanding
3. **Enables Semantic Search**: Finds relevant content using cosine similarity
4. **Provides Contextual Responses**: GPT-4 answers questions based on actual documentation

### Using the AI Assistant

- Click the chat button in the bottom-right corner
- Ask questions about Solana development concepts
- Get explanations of code examples
- Receive guided tutorials and best practices
- Search through all documentation content semantically

### Available Scripts

```bash
# Database management
npm run db:generate       # Generate migrations
npm run db:push          # Push schema changes
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio (database GUI)

# AI system
npm run ingest-docs      # Process and embed documentation

# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
```

## � Project Structure

```
├── app/
│   ├── api/chat/           # AI chat API endpoint
│   ├── layout.tsx          # Root layout with chat component
│   └── ...
├── components/
│   ├── docs-chat.tsx       # AI chatbot component
│   └── ...
├── lib/
│   ├── ai/
│   │   └── embedding.ts    # Vector embedding utilities
│   ├── db/
│   │   ├── index.ts        # Database connection
│   │   └── schema/         # Database schemas
│   └── mdx/
│       └── processor.ts    # MDX content processing
├── scripts/
│   └── ingest-docs.ts      # Documentation ingestion script
├── content/                # MDX learning content
│   ├── week-1/
│   ├── week-2/
│   └── ...
└── drizzle.config.ts       # Drizzle ORM configuration
```

## �📸 Preview

<div align="center">
  <img src="public/opengraph-image.png" alt="Learn SOL Preview" width="600" />
</div>

## 🔧 Adding New Content

1. Add MDX files to the `content/` directory
2. Follow the existing structure and frontmatter format
3. Run `npm run ingest-docs` to update the AI knowledge base
4. The chatbot will automatically have access to new content

## 🤝 Contributing

We welcome contributions from the community! Whether it's:

- 🐛 Bug fixes
- ✨ New features (especially AI enhancements)
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🤖 AI model optimizations

Please read our contributing guidelines before submitting your PR.

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Errors**: Verify your `DATABASE_URL` and ensure pgvector extension is enabled
2. **Empty AI Responses**: Run `npm run ingest-docs` to populate the knowledge base
3. **OpenAI API Errors**: Check your API key and account credits
4. **Chat Component Not Loading**: Ensure it's imported in `app/layout.tsx`

## 💫 Acknowledgments

Special thanks to:
- [Solana Foundation](https://solana.com) for their primary funding support
- [CoinDCX](https://coindcx.com) for their funding support
- [Superteam IN](https://superteam.fun/in) for their ecosystem support
- [Vercel](https://vercel.com) for the AI SDK
- [OpenAI](https://openai.com) for the powerful language models
- Our amazing community of early adopters

## 🔗 Links

- [Live Demo](https://learnsol.site)
- [Twitter](https://x.com/some1uknow25)

## 📄 License

MIT License - see LICENSE file for details.