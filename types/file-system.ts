export interface FileSystemNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  content?: string;
  parentId?: string;
  children?: FileSystemNode[];
  path?: string; // Add path for better navigation
}

export interface Project {
  name: string;
  root: FileSystemNode;
}