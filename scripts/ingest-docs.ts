import { config } from 'dotenv';
import { processMDXFiles } from '../lib/mdx/processor';
import { generateEmbeddings } from '../lib/ai/embedding';
import { db } from '../lib/db';
import { resources, embeddings } from '../lib/db/schema';
import path from 'path';

// Load environment variables from .env
config({ path: '.env' });

async function ingestDocumentation() {
  // Check if required environment variables are loaded
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY is not set in .env.local file');
    console.error('Please add your OpenAI API key to .env.local:');
    console.error('OPENAI_API_KEY=sk-your-openai-api-key-here');
    process.exit(1);
  }

  if (!process.env.POSTGRES_URL) {
    console.error('❌ POSTGRES_URL is not set in .env.local file');
    console.error('Please add your PostgreSQL connection string to .env.local:');
    console.error('POSTGRES_URL=postgresql://username:password@host:port/database');
    process.exit(1);
  }

  console.log('✅ Environment variables loaded successfully');

  const docsPath = path.join(process.cwd(), 'content'); // Adjust to your docs path
  console.log('Processing MDX files from:', docsPath);
  
  try {
    const mdxFiles = await processMDXFiles(docsPath);
    console.log(`Found ${mdxFiles.length} MDX sections to process`);
    
    // Clear existing data
    console.log('Clearing existing embeddings and resources...');
    await db.delete(embeddings);
    await db.delete(resources);
    
    let totalChunks = 0;
    const processedResources = new Map<string, string>(); // filePath -> resourceId
    
    for (const file of mdxFiles) {
      console.log(`Processing: ${file.filePath} - ${file.sectionTitle || 'Main Content'}`);
      
      try {
        let resourceId: string;
        
        // Check if we already created a resource for this file
        if (processedResources.has(file.filePath)) {
          resourceId = processedResources.get(file.filePath)!;
        } else {
          // Create resource record for the file
          const [resource] = await db
            .insert(resources)
            .values({
              content: file.content,
              filePath: file.filePath,
              title: file.pageTitle,
            })
            .returning();
          
          resourceId = resource.id;
          processedResources.set(file.filePath, resourceId);
        }
        
        // Generate embeddings for this section
        const fileEmbeddings = await generateEmbeddings(file.content);
        
        if (fileEmbeddings.length > 0) {
          // Store embeddings with enhanced citation data
          await db.insert(embeddings).values(
            fileEmbeddings.map((embedding, index) => ({
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
          console.log(`✅ Processed ${file.filePath}${file.sectionTitle ? ` (${file.sectionTitle})` : ''} with ${fileEmbeddings.length} chunks`);
        } else {
          console.log(`⚠️  No chunks generated for ${file.filePath}${file.sectionTitle ? ` (${file.sectionTitle})` : ''}`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${file.filePath}:`, error);
      }
    }
    
    console.log(`\n🎉 Documentation ingestion complete!`);
    console.log(`📊 Total sections processed: ${mdxFiles.length}`);
    console.log(`📊 Total files processed: ${processedResources.size}`);
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
