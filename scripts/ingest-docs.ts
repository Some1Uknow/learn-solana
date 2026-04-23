import { config } from 'dotenv';
import { processMDXFiles } from '../lib/mdx/processor';
import { generateEmbeddings } from '../lib/ai/embedding';
import { db } from '../lib/db';
import { resources, embeddings } from '../lib/db/schema';
import path from 'path';
import { nanoid } from 'nanoid';

// Load environment variables from .env
config({ path: '.env' });

async function ingestDocumentation() {
  // Check if required environment variables are loaded
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY is not set in .env');
    console.error('Please add your OpenAI API key to .env:');
    console.error('OPENAI_API_KEY=sk-your-openai-api-key-here');
    process.exit(1);
  }

  if (!process.env.POSTGRES_URL) {
    console.error('❌ POSTGRES_URL is not set in .env');
    console.error('Please add your PostgreSQL connection string to .env:');
    console.error('POSTGRES_URL=postgresql://username:password@host:port/database');
    process.exit(1);
  }

  console.log('✅ Environment variables loaded successfully');

  const docsPath = path.join(process.cwd(), 'content');
  console.log('Processing MDX files from:', docsPath);
  
  try {
    const mdxFiles = await processMDXFiles(docsPath);
    console.log(`Found ${mdxFiles.length} MDX sections to process`);

    let totalChunks = 0;
    const resourceIds = new Map<string, string>();
    const resourceRows = new Map<string, typeof resources.$inferInsert>();
    const embeddingRows: Array<typeof embeddings.$inferInsert> = [];
    
    for (const file of mdxFiles) {
      console.log(`Processing: ${file.filePath} - ${file.sectionTitle || 'Main Content'}`);
      
      let resourceId = resourceIds.get(file.filePath);
      if (!resourceId) {
        resourceId = nanoid();
        resourceIds.set(file.filePath, resourceId);
        resourceRows.set(file.filePath, {
          id: resourceId,
          content: file.content,
          filePath: file.filePath,
          title: file.pageTitle,
        });
      }

      const fileEmbeddings = await generateEmbeddings(file.content);

      if (fileEmbeddings.length === 0) {
        console.log(`No chunks generated for ${file.filePath}${file.sectionTitle ? ` (${file.sectionTitle})` : ''}`);
        continue;
      }

      embeddingRows.push(
        ...fileEmbeddings.map((embedding, index) => ({
          resourceId,
          content: embedding.content,
          embedding: embedding.embedding,
          pageUrl: file.pageUrl,
          pageTitle: file.pageTitle,
          sectionTitle: file.sectionTitle || null,
          headingId: file.headingId || null,
          chunkIndex: file.chunkIndex || index,
          headingLevel: file.headingLevel || null,
        }))
      );

      totalChunks += fileEmbeddings.length;
      console.log(`Processed ${file.filePath}${file.sectionTitle ? ` (${file.sectionTitle})` : ''} with ${fileEmbeddings.length} chunks`);
    }

    if (embeddingRows.length === 0) {
      throw new Error('No embeddings were generated. Existing SQL documentation data was not replaced.');
    }

    console.log('Replacing existing embeddings and resources...');
    await db.transaction(async (tx) => {
      await tx.delete(embeddings);
      await tx.delete(resources);
      await tx.insert(resources).values(Array.from(resourceRows.values()));
      await tx.insert(embeddings).values(embeddingRows);
    });
    
    console.log(`\nDocumentation ingestion complete.`);
    console.log(`📊 Total sections processed: ${mdxFiles.length}`);
    console.log(`📊 Total files processed: ${resourceRows.size}`);
    console.log(`📊 Total chunks created: ${totalChunks}`);
    console.log(`📊 Average chunks per section: ${(totalChunks / mdxFiles.length).toFixed(1)}`);
  } catch (error) {
    console.error('❌ Error during ingestion:', error);
    process.exit(1);
  }
}

// Run the ingestion if this script is executed directly
if (require.main === module) {
  ingestDocumentation()
    .then(() => {
      console.log('Ingestion completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Ingestion failed:', error);
      process.exit(1);
    });
}

export { ingestDocumentation };
