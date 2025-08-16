import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ProcessedSection {
  content: string;
  title: string;
  headingId: string;
  level: number;
}

export interface MDXContent {
  content: string;
  frontmatter: Record<string, any>;
  filePath: string;
  title: string;
  pageUrl: string;
  pageTitle: string;
  sectionTitle?: string;
  headingId?: string;
  headingLevel?: number;
  chunkIndex?: number;
}

export async function processMDXFiles(docsDirectory: string): Promise<MDXContent[]> {
  const files = getAllMDXFiles(docsDirectory);
  const processedFiles: MDXContent[] = [];

  for (const filePath of files) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);
    
    const relativePath = path.relative(docsDirectory, filePath);
    const pageUrl = convertFilePathToUrl(relativePath);
    const pageTitle = frontmatter.title || path.basename(filePath, '.mdx');
    
    // Extract sections with proper heading hierarchy
    const sections = extractSections(content);
    
    if (sections.length === 0) {
      // If no sections found, treat entire content as one section
      const cleanContent = cleanContentForEmbedding(content);
      if (cleanContent.length > 100) {
        processedFiles.push({
          content: cleanContent,
          frontmatter,
          filePath: relativePath,
          title: pageTitle,
          pageUrl,
          pageTitle,
          chunkIndex: 0,
        });
      }
    } else {
      // Process each section separately for better granular search
      sections.forEach((section, index) => {
        const cleanContent = cleanContentForEmbedding(section.content);
        
        if (cleanContent.length > 100) {
          processedFiles.push({
            content: cleanContent,
            frontmatter: {
              ...frontmatter,
              sectionTitle: section.title,
              headingId: section.headingId,
              headingLevel: section.level,
            },
            filePath: relativePath,
            title: pageTitle,
            pageUrl,
            pageTitle,
            sectionTitle: section.title,
            headingId: section.headingId,
            headingLevel: section.level,
            chunkIndex: index,
          });
        }
      });
    }
  }

  return processedFiles;
}

function extractSections(content: string): ProcessedSection[] {
  const sections: ProcessedSection[] = [];
  const lines = content.split('\n');
  let currentSection: ProcessedSection | null = null;
  let contentBuffer = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    
    if (headingMatch) {
      // Save previous section if it exists
      if (currentSection && contentBuffer.trim()) {
        currentSection.content = contentBuffer.trim();
        sections.push(currentSection);
      }
      
      // Start new section
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();
      const headingId = generateHeadingId(title);
      
      currentSection = {
        title,
        headingId,
        level,
        content: '',
      };
      contentBuffer = '';
    } else {
      // Add line to current section content
      contentBuffer += line + '\n';
    }
  }
  
  // Add the last section if it exists
  if (currentSection && contentBuffer.trim()) {
    currentSection.content = contentBuffer.trim();
    sections.push(currentSection);
  }
  
  return sections;
}

function generateHeadingId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
}

function convertFilePathToUrl(filePath: string): string {
  return '/learn/' + filePath
    .replace(/\.mdx?$/, '')
    .replace(/\\/g, '/')
    .replace(/index$/, '');
}

function cleanContentForEmbedding(content: string): string {
  return content
    // Remove import/export statements
    .replace(/^import\s+.*$/gm, '')
    .replace(/^export\s+.*$/gm, '')
    
    // Handle JSX components while preserving content
    .replace(/<Callout[^>]*>([\s\S]*?)<\/Callout>/g, 'Important: $1')
    .replace(/<Steps[^>]*>([\s\S]*?)<\/Steps>/g, '$1')
    .replace(/<Step[^>]*>([\s\S]*?)<\/Step>/g, 'Step: $1')
    .replace(/<Tabs[^>]*>([\s\S]*?)<\/Tabs>/g, '$1')
    .replace(/<Tab[^>]*>([\s\S]*?)<\/Tab>/g, '$1')
    .replace(/<Accordion[^>]*>([\s\S]*?)<\/Accordion>/g, '$1')
    
    // Remove remaining HTML tags but keep content
    .replace(/<[^>]*>/g, '')
    
    // Handle JSX expressions more carefully
    .replace(/\{[^}]*\}/g, '')
    
    // Preserve code blocks but mark them clearly
    .replace(/```[\s\S]*?```/g, '[CODE_EXAMPLE]')
    .replace(/`([^`]+)`/g, '`$1`') // Keep inline code
    
    // Clean markdown formatting while preserving meaning
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
    .replace(/\*([^*]+)\*/g, '$1') // Italic
    .replace(/_([^_]+)_/g, '$1') // Underscore italic
    
    // Handle links - keep the text and note it's a link
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1 (link)')
    
    // Clean up list markers but keep structure
    .replace(/^\s*[-*+]\s+/gm, '• ')
    .replace(/^\s*\d+\.\s+/gm, '1. ')
    
    // Clean up excessive whitespace
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+/g, ' ')
    .trim();
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

// Enhanced chunking with overlap for better context
export function generateChunks(input: string, maxChunkSize: number = 1000, overlap: number = 100): string[] {
  if (input.length <= maxChunkSize) {
    return [input];
  }

  const chunks: string[] = [];
  const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let currentChunk = '';
  let overlapBuffer = '';
  
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim() + '. ';
    
    if ((currentChunk + sentence).length > maxChunkSize) {
      if (currentChunk.trim()) {
        chunks.push((overlapBuffer + currentChunk).trim());
        
        // Create overlap buffer from the end of current chunk
        const words = currentChunk.split(' ');
        const overlapWords = words.slice(-Math.floor(overlap / 6)); // Approximate overlap
        overlapBuffer = overlapWords.join(' ') + ' ';
      }
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push((overlapBuffer + currentChunk).trim());
  }
  
  return chunks.filter(chunk => chunk.length > 50);
}
