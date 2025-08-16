import { config } from 'dotenv';
import { db } from '../lib/db';
import { embeddings, resources } from '../lib/db/schema';
import { sql } from 'drizzle-orm';

config({ path: '.env' });

async function backupAndMigrate() {
  console.log('🔄 Starting backup and migration...');

  try {
    // 1. Backup existing data
    console.log('📦 Backing up existing data...');
    const existingEmbeddings = await db.select().from(embeddings);
    const existingResources = await db.select().from(resources);
    
    console.log(`Found ${existingEmbeddings.length} embeddings and ${existingResources.length} resources`);

    // 2. Clear tables to avoid schema conflicts
    console.log('🗑️ Clearing existing data...');
    await db.delete(embeddings);
    await db.delete(resources);

    // 3. Add new columns with default values temporarily
    console.log('🔧 Adding new schema columns...');
    await db.execute(sql`
      ALTER TABLE embeddings 
      ADD COLUMN IF NOT EXISTS page_url TEXT DEFAULT '/unknown',
      ADD COLUMN IF NOT EXISTS page_title TEXT DEFAULT 'Unknown Page',
      ADD COLUMN IF NOT EXISTS section_title TEXT,
      ADD COLUMN IF NOT EXISTS heading_id TEXT,
      ADD COLUMN IF NOT EXISTS chunk_index INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS heading_level INTEGER DEFAULT 1;
    `);

    // 4. Restore data with default values
    console.log('📥 Restoring data with default values...');
    for (const resource of existingResources) {
      await db.insert(resources).values(resource);
    }

    for (const embedding of existingEmbeddings) {
      await db.insert(embeddings).values({
        ...embedding,
        pageUrl: '/unknown',
        pageTitle: 'Unknown Page',
        chunkIndex: 0,
      });
    }

    // 5. Remove default values and make required fields NOT NULL
    console.log('🔒 Finalizing schema...');
    await db.execute(sql`
      ALTER TABLE embeddings 
      ALTER COLUMN page_url SET NOT NULL,
      ALTER COLUMN page_title SET NOT NULL,
      ALTER COLUMN page_url DROP DEFAULT,
      ALTER COLUMN page_title DROP DEFAULT;
    `);

    console.log('✅ Migration completed successfully!');
    console.log('⚠️  Note: Existing embeddings have placeholder values. Re-run ingestion for proper citations.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

backupAndMigrate();
