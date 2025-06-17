"use client";

import { FileSystemNode } from "@/types/file-system";
import { FileCode, Folder, ChevronRight, Plus, FolderPlus } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FileExplorerProps {
  node: FileSystemNode;
  onFileOpen: (node: FileSystemNode) => void;
  onCreateFile: (parentId: string, name: string) => void;
  onCreateFolder: (parentId: string, name: string) => void;
  onDelete: (nodeId: string) => void;
  level?: number;
  currentFileId?: string;
}

export function FileExplorer({
  node,
  onFileOpen,
  onCreateFile,
  onCreateFolder,
  onDelete,
  level = 0,
  currentFileId,
}: FileExplorerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCreateFile = () => {
    const fileName = window.prompt("Enter file name:", "new-file.rs");
    if (fileName) {
      // Check if a file with this name already exists in the current directory
      const fileExists = node.children?.some(child => 
        child.type === "file" && child.name === fileName
      );

      if (fileExists) {
        window.alert("A file with this name already exists in this directory.");
        return;
      }

      onCreateFile(node.id, fileName);
    }
  };

  const handleCreateFolder = () => {
    const folderName = window.prompt("Enter folder name:", "new-folder");
    if (folderName) {
      // Check if a folder with this name already exists in the current directory
      const folderExists = node.children?.some(child => 
        child.type === "directory" && child.name === folderName
      );

      if (folderExists) {
        window.alert("A folder with this name already exists in this directory.");
        return;
      }

      onCreateFolder(node.id, folderName);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${node.name}?`)) {
      onDelete(node.id);
    }
  };

  if (node.type === "file") {
    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              "flex items-center py-1 text-sm rounded cursor-pointer hover:bg-white/5",
              currentFileId === node.id && "bg-white/10",
              level > 0 && "ml-4"
            )}
            onClick={() => onFileOpen(node)}
          >
            <FileCode className={cn(
              "h-4 w-4 mr-2",
              currentFileId === node.id ? "text-[#14F195]" : "text-white/60"
            )} />
            <span className={cn(
              currentFileId === node.id ? "text-white" : "text-white/80"
            )}>{node.name}</span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={() => onFileOpen(node)}>Open</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem className="text-red-500" onClick={handleDelete}>Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className="flex items-center py-1 text-sm rounded cursor-pointer hover:bg-white/5"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronRight 
              className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "rotate-90"
              )} 
            />
            <Folder className="h-4 w-4 mr-2 text-white/60" />
            <span className="text-white/80">{node.name}</span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={handleCreateFile}>
            <Plus className="h-4 w-4 mr-2" />
            New File
          </ContextMenuItem>
          <ContextMenuItem onClick={handleCreateFolder}>
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </ContextMenuItem>
          {node.id !== "root" && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem className="text-red-500" onClick={handleDelete}>Delete</ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>

      {isExpanded && node.children && (
        <div className={cn("mt-1", level > 0 && "ml-4")}>
          {node.children.map((child) => (
            <FileExplorer
              key={child.id}
              node={child}
              onFileOpen={onFileOpen}
              onCreateFile={onCreateFile}
              onCreateFolder={onCreateFolder}
              onDelete={onDelete}
              level={level + 1}
              currentFileId={currentFileId}
            />
          ))}
        </div>
      )}
    </div>
  );
}