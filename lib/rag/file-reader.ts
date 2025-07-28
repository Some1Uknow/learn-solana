// This file will contain functions to read and process files for the RAG pipeline.

import fs from 'fs/promises';
import path from 'path';

/**
 * Reads all files in a directory recursively and returns their content.
 * @param dir The directory to read.
 * @returns A promise that resolves to an array of file contents.
 */
export async function readFilesRecursively(dir: string): Promise<{ filePath: string; content: string }[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(async (dirent) => {
      const res = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        return readFilesRecursively(res);
      } else {
        const content = await fs.readFile(res, 'utf-8');
        return [{ filePath: res, content }];
      }
    }),
  );
  return Array.prototype.concat(...files);
}

/**
 * Chunks text into sentences.
 * @param text The text to chunk.
 * @returns An array of sentences.
 */
export function chunkText(text: string): string[] {
  // Simple sentence splitting, can be improved with more sophisticated NLP libraries
  return text.match(/[^.!?]+[.!?]*/g) || [];
}