import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function getTopicContent(moduleId: string, topicId: string) {
  try {
    // Construct the path to the MDX file
    const fullPath = path.join(process.cwd(), 'content', 'learn', moduleId, topicId, 'index.mdx');
    
    // Check if the file exists
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    // Read the file content
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // Use gray-matter to parse the frontmatter and content
    const { data, content } = matter(fileContents);
    
    // Return both the frontmatter and the content
    return {
      frontMatter: data,
      content,
    };
  } catch (error) {
    console.error(`Error loading MDX content for ${moduleId}/${topicId}:`, error);
    return null;
  }
}

export function getAllTopicPaths() {
  const basePath = path.join(process.cwd(), 'content', 'learn');
  const moduleFolders = fs.readdirSync(basePath);
  
  const paths: { moduleId: string; topicId: string }[] = [];
  
  for (const moduleId of moduleFolders) {
    const modulePath = path.join(basePath, moduleId);
    
    // Check if it's a directory
    if (fs.statSync(modulePath).isDirectory()) {
      const topicFolders = fs.readdirSync(modulePath);
      
      for (const topicId of topicFolders) {
        const topicPath = path.join(modulePath, topicId);
        
        // Check if it's a directory with an index.mdx file
        if (
          fs.statSync(topicPath).isDirectory() && 
          fs.existsSync(path.join(topicPath, 'index.mdx'))
        ) {
          paths.push({ moduleId, topicId });
        }
      }
    }
  }
  
  return paths;
}
