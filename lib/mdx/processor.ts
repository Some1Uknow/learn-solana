import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface MDXContent {
  content: string;
  frontmatter: Record<string, any>;
  filePath: string;
  title: string;
}

export async function processMDXFiles(docsDirectory: string): Promise<MDXContent[]> {
  const files = getAllMDXFiles(docsDirectory);
  const processedFiles: MDXContent[] = [];

  for (const filePath of files) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);
    
    // Clean content from MDX syntax for better embedding
    const cleanContent = content
      .replace(/^import\s+.*$/gm, '') // Remove import statements
      .replace(/^export\s+.*$/gm, '') // Remove export statements
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\{[^}]*\}/g, '') // Remove JSX expressions
      .replace(/```[\s\S]*?```/g, '[CODE_BLOCK]') // Replace code blocks with placeholder
      .replace(/`[^`]+`/g, '[INLINE_CODE]') // Replace inline code with placeholder
      .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
      .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
      .replace(/#+\s*/g, '') // Remove heading markers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
      .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Extract link text
      .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
      .trim();

    if (cleanContent.length > 100) { // Only process files with substantial content
      processedFiles.push({
        content: cleanContent,
        frontmatter,
        filePath: path.relative(docsDirectory, filePath),
        title: frontmatter.title || path.basename(filePath, '.mdx'),
      });
    }
  }

  return processedFiles;
}

function getAllMDXFiles(dir: string): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) {
    console.warn(`Directory does not exist: ${dir}`);
    return files;
  }
  
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllMDXFiles(fullPath));
    } else if (item.endsWith('.mdx') || item.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Advanced chunking for better context
export function generateChunks(input: string, maxChunkSize: number = 1000): string[] {
  // First split by paragraphs
  const paragraphs = input.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    // If adding this paragraph would exceed the limit
    if ((currentChunk + paragraph).length > maxChunkSize) {
      // If we have a current chunk, save it
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      
      // If the paragraph itself is too long, split by sentences
      if (paragraph.length > maxChunkSize) {
        const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim().length > 0);
        let sentenceChunk = '';
        
        for (const sentence of sentences) {
          if ((sentenceChunk + sentence).length <= maxChunkSize) {
            sentenceChunk += sentence.trim() + '. ';
          } else {
            if (sentenceChunk.trim()) {
              chunks.push(sentenceChunk.trim());
            }
            sentenceChunk = sentence.trim() + '. ';
          }
        }
        
        currentChunk = sentenceChunk;
      } else {
        currentChunk = paragraph + '\n\n';
      }
    } else {
      currentChunk += paragraph + '\n\n';
    }
  }

  // Add the last chunk if it exists
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(chunk => chunk.length > 50); // Filter out very small chunks
}
