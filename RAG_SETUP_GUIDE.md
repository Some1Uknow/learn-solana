# RAG Chatbot Setup & Usage Guide

## How the System Works

The RAG (Retrieval-Augmented Generation) chatbot system works by:

1. **Processing MDX Content**: Scans your `content/` directory for `.mdx` and `.md` files
2. **Creating Embeddings**: Converts content into vector embeddings using OpenAI's text-embedding-ada-002
3. **Storing in Database**: Saves embeddings in PostgreSQL with pgvector for similarity search
4. **Real-time Search**: When users ask questions, finds relevant content and provides contextual answers

## Directory Structure

The system processes content from:
```
content/
├── week-1/           ← Your current Solana learning content
├── week-2/
├── week-3/
├── week-4/
├── week-5/
└── meta.json
```

**All `.mdx` and `.md` files in these directories will be processed automatically.**

## Complete Setup Instructions

### Step 1: Environment Configuration

Create a `.env.local` file in your project root:

```bash
# Required: OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key-here

# Required: PostgreSQL Database URL with pgvector support
POSTGRES_URL=postgresql://username:password@host:port/database
```

### Step 2: Database Setup Options

#### Option A: Neon (Recommended - Free)
1. Go to [neon.tech](https://neon.tech) and create account
2. Create new project → Choose your region
3. In your project dashboard, go to "SQL Editor"
4. Run this command to enable pgvector:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
5. Copy connection string to `.env.local` as `POSTGRES_URL`

#### Option B: Local PostgreSQL
```bash
# Install PostgreSQL and pgvector extension
# Then use connection string like:
# POSTGRES_URL=postgresql://postgres:password@localhost:5432/learn_solana
```

### Step 3: Initialize Database Schema

```bash
# Generate migration files
npm run db:generate

# Push schema to database (creates tables)
npm run db:push
```

### Step 4: Process Your Documentation

```bash
# This will process all MDX files in content/ directory and create embeddings
npm run ingest-docs
```

**What happens during ingestion:**
- Scans `content/` directory recursively
- Processes each `.mdx` file (removes MDX syntax, cleans content)
- Breaks content into ~1000 character chunks
- Creates embeddings for each chunk using OpenAI
- Stores in PostgreSQL with pgvector

### Step 5: Start the Application

```bash
npm run dev
```

The chat widget will appear in the bottom-right corner of your application.

## Usage

### For End Users
- Click the chat icon in bottom-right corner
- Ask questions about Solana development
- Examples:
  - "What is the Solana account model?"
  - "How do I set up my development environment?"
  - "Explain lamports and SOL"
  - "What are the steps for creating a transaction?"

### For Content Updates

When you add new MDX files or update existing ones:

```bash
# Re-run the ingestion to update embeddings
npm run ingest-docs
```

This will:
1. Clear old embeddings
2. Process all content again
3. Generate fresh embeddings

## Customization

### Adding More Content Sources

To include additional directories, edit `scripts/ingest-docs.ts`:

```typescript
// Change this line to include more directories
const docsPath = path.join(process.cwd(), 'content'); // Current
// Or add multiple sources:
const docsPaths = [
  path.join(process.cwd(), 'content'),
  path.join(process.cwd(), 'docs'),
  path.join(process.cwd(), 'tutorials'),
];
```

### Adjusting Search Relevance

In `lib/ai/embedding.ts`, you can adjust the similarity threshold:

```typescript
.where(gt(similarity, 0.7)) // Higher = more strict, Lower = more results
```

### Changing Chunk Size

In `lib/mdx/processor.ts`, modify the chunk size:

```typescript
export function generateChunks(input: string, maxChunkSize: number = 1000)
//                                                              ^^^^ Adjust this
```

## Monitoring & Debugging

### Database Studio
```bash
npm run db:studio
```
Opens Drizzle Studio to view your database tables and data.

### Check Ingestion Results
After running ingestion, check the logs for:
- Number of files processed
- Number of chunks created
- Any errors or warnings

### Common Issues

1. **No embeddings created**: Check if MDX files have sufficient content (>50 characters after cleaning)
2. **Database connection errors**: Verify `POSTGRES_URL` is correct and pgvector is enabled
3. **OpenAI API errors**: Check `OPENAI_API_KEY` is valid and has credits

## Cost Considerations

### OpenAI API Usage
- **Embeddings**: ~$0.0001 per 1K tokens
- **Chat**: ~$0.005 per 1K tokens (GPT-4)
- For typical documentation, expect $1-5 for initial embedding creation

### Database Storage
- **Neon Free Tier**: 0.5GB storage (plenty for embeddings)
- **Paid tiers**: Start at $0.12/month per GB

## Advanced Features

The system includes:
- **Automatic content cleaning** (removes MDX syntax, HTML tags)
- **Contextual chunking** (preserves paragraph boundaries)
- **Tool-based search** (AI automatically searches when needed)
- **Responsive chat UI** (works on mobile and desktop)
- **Dark/light theme support**

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all secrets
- Consider rate limiting for production deployments
