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
    console.log(`Found ${mdxFiles.length} MDX files to process`);
    
    // Clear existing data
    console.log('Clearing existing embeddings and resources...');
    await db.delete(embeddings);
    await db.delete(resources);
    
    let totalChunks = 0;
    
    for (const file of mdxFiles) {
      console.log(`Processing: ${file.filePath}`);
      
      try {
        // Create resource record
        const [resource] = await db
          .insert(resources)
          .values({
            content: file.content,
            filePath: file.filePath,
            title: file.title,
          })
          .returning();
        
        // Generate embeddings
        const fileEmbeddings = await generateEmbeddings(file.content);
        
        if (fileEmbeddings.length > 0) {
          // Store embeddings
          await db.insert(embeddings).values(
            fileEmbeddings.map(embedding => ({
              resourceId: resource.id,
              ...embedding,
            }))
          );
          
          totalChunks += fileEmbeddings.length;
          console.log(`✅ Processed ${file.filePath} with ${fileEmbeddings.length} chunks`);
        } else {
          console.log(`⚠️  No chunks generated for ${file.filePath}`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${file.filePath}:`, error);
      }
    }
    
    console.log(`\n🎉 Documentation ingestion complete!`);
    console.log(`📊 Total files processed: ${mdxFiles.length}`);
    console.log(`📊 Total chunks created: ${totalChunks}`);
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
