"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Code,
  Check,
  Download,
  Github,
  RefreshCw,
  Maximize2,
  ChevronRight,
  PanelLeft,
  MessageSquare,
  Play,
  Send,
  Settings,
  Save,
  ArrowLeft,
  FileCode,
  Terminal,
  Copy,
  ChevronLeft,
  Eye,
  File,
  FolderOpen,
  Folder,
  Plus,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import CodeEditor from "@/components/ide/code-editor";
import OutputWindow from "@/components/ide/output-window";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { dappBuilderSchema, FileSchema } from "../api/build-dapp/schema";
import Markdown from "react-markdown";
import { useRouter } from "next/navigation";

// File extension to language mapping for syntax highlighting
const FILE_LANGUAGE_MAP: Record<string, string> = {
  ".rs": "rust",
  ".toml": "toml",
  ".json": "json",
  ".ts": "typescript",
  ".tsx": "typescript",
  ".js": "javascript",
  ".jsx": "javascript",
  ".css": "css",
  ".html": "html",
  ".md": "markdown",
};

// Get language from file path
function getLanguageFromPath(path: string): string {
  const ext = path.substring(path.lastIndexOf("."));
  return FILE_LANGUAGE_MAP[ext] || "plaintext";
}

// Sample template options
const SAMPLE_TEMPLATES = [
  {
    name: "Token Project",
    description: "Create a basic SPL token with mint and transfer capabilities",
    type: "token",
  },
  {
    name: "NFT Collection",
    description: "Create an NFT collection with metadata and minting",
    type: "nft",
  },
  {
    name: "Marketplace",
    description: "Build a decentralized marketplace for NFTs on Solana",
    type: "marketplace",
  },
  {
    name: "DAO Project",
    description: "Create a basic DAO with proposal and voting functionality",
    type: "dao",
  },
];

export default function DappBuilderPage() {
  const router = useRouter();
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  
  const [contractType, setContractType] = useState("");
  const [contractName, setContractName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTab, setCurrentTab] = useState("code");
  const [codeTab, setCodeTab] = useState<"contract" | "frontend">(() => {
    // Initialize from URL query parameter if available
    const tabParam = searchParams.get('tab');
    return (tabParam === 'frontend' ? 'frontend' : 'contract') as "contract" | "frontend";
  });
  
  // Custom handler for tab change that updates URL and preserves file context
  const handleCodeTabChange = (value: string) => {
    const newTab = value as "contract" | "frontend";
    setCodeTab(newTab);
    
    // Update the URL to reflect the current tab
    if (typeof window !== 'undefined') {
      const newParams = new URLSearchParams(window.location.search);
      newParams.set('tab', newTab);
      const newRelativePathQuery = window.location.pathname + '?' + newParams.toString();
      router.replace(newRelativePathQuery, { scroll: false });
    }
    
    // If we have an active file and switching tabs causes it to be filtered out,
    // try to find and select an appropriate file for the new tab
    if (activeFilePath && files.length > 0) {
      const isCurrentFileVisible = newTab === "contract" 
        ? isContractFile(activeFilePath)
        : !isContractFile(activeFilePath);
      
      if (!isCurrentFileVisible) {
        // Find the first file matching the new tab type
        const matchingFile = files.find(file => 
          newTab === "contract" 
            ? isContractFile(file.path)
            : !isContractFile(file.path)
        );
        
        if (matchingFile) {
          setActiveFilePath(matchingFile.path);
        }
      }
    }
  };
  
  const [files, setFiles] = useState<FileSchema[]>([]);
  const [activeFilePath, setActiveFilePath] = useState<string>("");
  const [contractTerminal, setContractTerminal] = useState<string>("");
  const [frontendTerminal, setFrontendTerminal] = useState<string>("");
  const [isRunningContract, setIsRunningContract] = useState(false);
  const [isRunningFrontend, setIsRunningFrontend] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [sidebarView, setSidebarView] = useState<"files" | "projects">("projects");
  const [userMessages, setUserMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "Hi! I'm your Solana dApp assistant. How can I help you build your decentralized application today?",
    },
  ]);

  // Refs for resizable elements
  const horizontalResizeRef = useRef<HTMLDivElement>(null);
  const aiSectionRef = useRef<HTMLDivElement>(null);
  const codeSectionRef = useRef<HTMLDivElement>(null);

  // State for dragging
  const [horizontalDragging, setHorizontalDragging] = useState(false);
  const [aiWidth, setAiWidth] = useState(30); // percentage

  // Use AI SDK hook for dApp generation
  const { object, submit, isLoading } = useObject({
    api: "/api/build-dapp",
    schema: dappBuilderSchema,
  });

  // File system helpers
  const getActiveFile = () => {
    return files.find(file => file.path === activeFilePath);
  };

  const getFileContent = (path: string) => {
    const file = files.find(file => file.path === path);
    return file?.content || "";
  };

  const getFolderStructure = () => {
    const structure: Record<string, string[]> = {
      "": [] // Root folder
    };
    
    // Group files by folders
    files.forEach(file => {
      if (!file || !file.path) return; // Skip if file or path is undefined
      
      const path = file.path;
      const lastSlashIndex = path.lastIndexOf('/');
      
      if (lastSlashIndex === -1) {
        // File is in root
        structure[""].push(path);
      } else {
        const folder = path.substring(0, lastSlashIndex);
        const fileName = path.substring(lastSlashIndex + 1);
        
        // Create folder structure if it doesn't exist
        if (!structure[folder]) {
          structure[folder] = [];
          
          // Add parent folders
          let parentFolder = folder;
          while (parentFolder.lastIndexOf('/') !== -1) {
            const parentFolderPath = parentFolder.substring(0, parentFolder.lastIndexOf('/'));
            if (!structure[parentFolderPath]) {
              structure[parentFolderPath] = [];
            }
            parentFolder = parentFolderPath;
          }
        }
        
        structure[folder].push(fileName);
      }
    });
    
    return structure;
  };

  // Check if a path is a contract file
  const isContractFile = (path: string) => {
    const contractPaths = ["programs", "anchor", "Cargo.toml", ".rs"];
    return contractPaths.some(p => path.includes(p));
  };

  // Check if a path is a frontend file
  const isFrontendFile = (path: string) => {
    return !isContractFile(path);
  };

  // Handle code execution for contracts
  const handleRunContract = () => {
    setIsRunningContract(true);
    setContractTerminal(""); // Clear previous output

    // Simulate code execution
    setTimeout(() => {
      setContractTerminal(
        "Building program...\nCompiling program...\nDeploying to localnet...\nProgram deployed successfully!\nTransaction signature: 5KmWoS9vJJRuBRdiNZmn4ytq9G4DSRdL8kZVdJ1uKSHCZLgGZ4XcaDgCz7KSDTaMbdQHTwkmHGG5PCQbgSwFbLAN"
      );
      setIsRunningContract(false);
    }, 2000);
  };

  // Handle code execution for frontend
  const handleRunFrontend = () => {
    setIsRunningFrontend(true);
    setFrontendTerminal(""); // Clear previous output

    // Simulate code execution
    setTimeout(() => {
      setFrontendTerminal(
        "> next dev\n" +
        "- ready started server on 0.0.0.0:3000, url: http://localhost:3000\n" +
        "- event compiled client and server successfully in 268 ms (17 modules)\n" +
        "- wait compiling...\n" +
        "- event compiled client and server successfully in 316 ms (23 modules)"
      );
      setIsRunningFrontend(false);
    }, 2000);
  };

  // Handle template selection
  const handleSelectTemplate = (template: typeof SAMPLE_TEMPLATES[0]) => {
    setContractType(template.type);
    setContractName(template.name);
    setShowTemplateModal(false);

    // Add template selection message to chat
    const templateMessage = {
      role: "user" as const,
      content: `I want to create a ${template.name} on Solana.`,
    };
    setUserMessages((prev) => [...prev, templateMessage]);

    // Submit to AI to get template code
    submit({
      config: {
        contractType: template.type,
        contractName: template.name,
      },
      messages: [...userMessages, templateMessage],
    });
  };

  // Handle chat submission
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentInput.trim()) return;

    // Add user message to chat
    const newUserMessage = {
      role: "user" as const,
      content: currentInput,
    };

    setUserMessages((prev) => [...prev, newUserMessage]);

    // Create configuration context for the AI
    const configContext = {
      contractType,
      contractName,
    };

    // Submit to AI with current context and existing files
    submit({
      config: configContext,
      files: files,
      messages: [...userMessages, newUserMessage],
    });

    // Clear the input
    setCurrentInput("");
  };

  // Update editor code and chat when AI response arrives
  useEffect(() => {
    if (object?.notification) {
      const notification = object.notification;
      
      // Update files if we have files from the AI
      if (notification.files && notification.files.length > 0) {
        setFiles(notification.files);
        
        // Set active file to the one specified by the AI or the first one
        const newActiveFile = notification.activeFile || notification.files[0]?.path;
        if (newActiveFile) {
          setActiveFilePath(newActiveFile);
        }
      }

      // Add AI response to chat if we have a followUp message
      if (notification.followUp) {
        setUserMessages((prev) => [
          ...prev,
          { role: "assistant", content: notification.followUp },
        ]);
      }

      // Mark generation as complete
      if (notification.dappGenerated) {
        setIsGenerating(false);
        setGenerationComplete(true);
      }
    }
  }, [object]);

  // Handle deploy to devnet simulation
  const deployToDevnet = () => {
    setIsRunningContract(true);
    setContractTerminal(""); // Clear previous output

    // Simulate deployment
    setTimeout(() => {
      setContractTerminal(
        "Building for deployment...\nCompiling program for deployment...\nDeploying to devnet...\nThis may take a few minutes...\nProgram deployed to devnet successfully!\nProgram ID: BvtE4MNNpJ9Nv8QzsQQcBTnf8ZkVk9SXM8voznzvW4Ed\nTransaction signature: 41AVCdwFfdjDxKiv2AeRRxhLfEpNYJhCHMUrBHDGvYRBCPBfCFGR5mMewZjHnXyZk5XrFQP2CiDP7Vj8VPcaLw4q"
      );
      setIsRunningContract(false);
    }, 5000);
  };

  // Horizontal resize handler for AI and Code sections
  useEffect(() => {
    const handleHorizontalMouseMove = (e: MouseEvent) => {
      if (!horizontalDragging) return;

      const container = document.querySelector(
        ".main-content-container"
      ) as HTMLElement;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const mouseX = e.clientX - container.getBoundingClientRect().left;
      let newWidth = (mouseX / containerWidth) * 100;

      // Limit minimum and maximum sizes
      newWidth = Math.max(20, Math.min(80, newWidth));
      setAiWidth(newWidth);
    };

    const handleHorizontalMouseUp = () => {
      setHorizontalDragging(false);
    };

    if (horizontalDragging) {
      document.addEventListener("mousemove", handleHorizontalMouseMove);
      document.addEventListener("mouseup", handleHorizontalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleHorizontalMouseMove);
      document.removeEventListener("mouseup", handleHorizontalMouseUp);
    };
  }, [horizontalDragging]);

  // Handle project selection
  const handleSelectProject = (projectId: string) => {
    const project = existingProjects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(projectId);
      setContractName(project.name);
      setContractType(project.type);
      
      // In a real app, we would load the project files here
      // For now, let's simulate some file loading with a delay
      setIsGenerating(true);
      setFiles([]);
      
      setTimeout(() => {
        // Simulate loading project files based on the project type
        const simulatedFiles: FileSchema[] = generateSampleFiles(project.type, project.name);
        setFiles(simulatedFiles);
        if (simulatedFiles.length > 0) {
          setActiveFilePath(simulatedFiles[0].path);
        }
        setIsGenerating(false);
        setGenerationComplete(true);
        setSidebarView("files");
      }, 1000);
    }
  };

  // Sample file generator function (for demo purposes)
  const generateSampleFiles = (type: string, name: string): FileSchema[] => {
    const baseName = name.toLowerCase().replace(/\s+/g, '-');
    
    switch (type) {
      case "token":
        return [
          {
            path: `programs/token-program/lib.rs`,
            content: `// Token Program for ${name}\nuse anchor_lang::prelude::*;\nuse anchor_spl::token;\n\ndeclare_id!("TokenProgramID12345");\n\n#[program]\npub mod token_program {\n    use super::*;\n    \n    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {\n        Ok(())\n    }\n    \n    pub fn mint_token(ctx: Context<MintToken>, amount: u64) -> Result<()> {\n        Ok(())\n    }\n}\n\n#[derive(Accounts)]\npub struct Initialize<'info> {\n    #[account(mut)]\n    pub authority: Signer<'info>,\n    pub system_program: Program<'info, System>,\n}\n\n#[derive(Accounts)]\npub struct MintToken<'info> {\n    #[account(mut)]\n    pub authority: Signer<'info>,\n    #[account(mut)]\n    pub mint: Account<'info, token::Mint>,\n}\n`,
            type: "file"
          },
          {
            path: `app/token-interface.tsx`,
            content: `// Frontend interface for ${name}\nimport { FC, useState } from 'react';\nimport { useWallet } from '@solana/wallet-adapter-react';\n\nconst TokenInterface: FC = () => {\n  const { publicKey } = useWallet();\n  const [amount, setAmount] = useState('');\n  \n  const handleMint = async () => {\n    // Mint token logic\n    console.log('Minting tokens:', amount);\n  }\n  \n  return (\n    <div className="p-4">\n      <h2 className="text-xl font-bold mb-4">${name} Token Interface</h2>\n      <div className="mb-4">\n        <label className="block text-sm mb-1">Amount to Mint</label>\n        <input \n          type="text" \n          value={amount} \n          onChange={(e) => setAmount(e.target.value)} \n          className="w-full p-2 border rounded"\n        />\n      </div>\n      <button \n        onClick={handleMint}\n        className="bg-gradient-to-r from-[#14F195] to-[#9945FF] text-white px-4 py-2 rounded"\n      >\n        Mint Tokens\n      </button>\n    </div>\n  );\n};\n\nexport default TokenInterface;\n`,
            type: "file"
          }
        ];
      case "nft":
        return [
          {
            path: `programs/nft-program/lib.rs`,
            content: `// NFT Program for ${name}\nuse anchor_lang::prelude::*;\nuse anchor_spl::token;\nuse mpl_token_metadata::instruction as token_metadata_instruction;\n\ndeclare_id!("NftProgramID12345");\n\n#[program]\npub mod nft_program {\n    use super::*;\n    \n    pub fn mint_nft(\n        ctx: Context<MintNFT>,\n        name: String,\n        symbol: String,\n        uri: String,\n    ) -> Result<()> {\n        Ok(())\n    }\n}\n\n#[derive(Accounts)]\npub struct MintNFT<'info> {\n    #[account(mut)]\n    pub authority: Signer<'info>,\n    #[account(mut)]\n    pub mint: Account<'info, token::Mint>,\n    pub token_program: Program<'info, token::Token>,\n    pub system_program: Program<'info, System>,\n}\n`,
            type: "file"
          },
          {
            path: `app/nft-gallery.tsx`,
            content: `// NFT Gallery for ${name}\nimport { FC, useState, useEffect } from 'react';\nimport { useWallet } from '@solana/wallet-adapter-react';\n\ninterface NFT {\n  id: string;\n  name: string;\n  image: string;\n}\n\nconst NftGallery: FC = () => {\n  const { publicKey } = useWallet();\n  const [nfts, setNfts] = useState<NFT[]>([]);\n  const [loading, setLoading] = useState(true);\n  \n  useEffect(() => {\n    // Simulate loading NFTs\n    setTimeout(() => {\n      setNfts([\n        { id: '1', name: '${name} #1', image: '' },\n        { id: '2', name: '${name} #2', image: '' },\n        { id: '3', name: '${name} #3', image: '' },\n      ]);\n      setLoading(false);\n    }, 1000);\n  }, []);\n  \n  return (\n    <div className="p-4">\n      <h2 className="text-xl font-bold mb-4">${name} Collection</h2>\n      {loading ? (\n        <p>Loading your NFTs...</p>\n      ) : (\n        <div className="grid grid-cols-3 gap-4">\n          {nfts.map(nft => (\n            <div key={nft.id} className="border rounded-lg p-3">\n              <div className="aspect-square bg-gray-200 mb-2"></div>\n              <p className="font-medium">{nft.name}</p>\n            </div>\n          ))}\n        </div>\n      )}\n    </div>\n  );\n};\n\nexport default NftGallery;\n`,
            type: "file"
          }
        ];
      case "dao":
        return [
          {
            path: `programs/dao-program/lib.rs`,
            content: `// DAO Program for ${name}\nuse anchor_lang::prelude::*;\n\ndeclare_id!("DaoProgramID12345");\n\n#[program]\npub mod dao_program {\n    use super::*;\n    \n    pub fn create_proposal(\n        ctx: Context<CreateProposal>,\n        title: String,\n        description: String,\n        voting_period: i64,\n    ) -> Result<()> {\n        Ok(())\n    }\n    \n    pub fn cast_vote(\n        ctx: Context<CastVote>,\n        vote: bool,\n    ) -> Result<()> {\n        Ok(())\n    }\n}\n\n#[derive(Accounts)]\npub struct CreateProposal<'info> {\n    #[account(mut)]\n    pub authority: Signer<'info>,\n    pub system_program: Program<'info, System>,\n}\n\n#[derive(Accounts)]\npub struct CastVote<'info> {\n    #[account(mut)]\n    pub voter: Signer<'info>,\n    pub system_program: Program<'info, System>,\n}\n`,
            type: "file"
          },
          {
            path: `app/governance-app.tsx`,
            content: `// Governance App for ${name}\nimport { FC, useState } from 'react';\nimport { useWallet } from '@solana/wallet-adapter-react';\n\ninterface Proposal {\n  id: string;\n  title: string;\n  description: string;\n  votesFor: number;\n  votesAgainst: number;\n  status: 'active' | 'passed' | 'rejected';\n}\n\nconst GovernanceApp: FC = () => {\n  const { publicKey } = useWallet();\n  const [proposals, setProposals] = useState<Proposal[]>([\n    {\n      id: '1',\n      title: 'Treasury Funding',\n      description: 'Allocate 500 SOL for marketing',\n      votesFor: 65,\n      votesAgainst: 35,\n      status: 'active'\n    },\n    {\n      id: '2',\n      title: 'New Developer Hire',\n      description: 'Hire another Rust developer',\n      votesFor: 80,\n      votesAgainst: 20,\n      status: 'passed'\n    }\n  ]);\n  \n  return (\n    <div className="p-4">\n      <h2 className="text-xl font-bold mb-4">${name} Governance</h2>\n      <div className="mb-6">\n        <h3 className="text-lg font-medium mb-2">Active Proposals</h3>\n        {proposals.map(proposal => (\n          <div key={proposal.id} className="border rounded-lg p-4 mb-3">\n            <div className="flex justify-between">\n              <h4 className="font-bold">{proposal.title}</h4>\n              <span className={\`px-2 py-1 text-xs rounded \${proposal.status === 'active' ? 'bg-blue-100 text-blue-800' : proposal.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}\`}>\n                {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}\n              </span>\n            </div>\n            <p className="text-sm mt-1">{proposal.description}</p>\n            <div className="mt-3">\n              <div className="w-full bg-gray-200 rounded-full h-2.5">\n                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: \`\${proposal.votesFor}%\` }}></div>\n              </div>\n              <div className="flex justify-between text-sm mt-1">\n                <span>Yes: {proposal.votesFor}%</span>\n                <span>No: {proposal.votesAgainst}%</span>\n              </div>\n            </div>\n          </div>\n        ))}\n      </div>\n      <button className="bg-gradient-to-r from-[#14F195] to-[#9945FF] text-white px-4 py-2 rounded">\n        Create New Proposal\n      </button>\n    </div>\n  );\n};\n\nexport default GovernanceApp;\n`,
            type: "file"
          }
        ];
      default:
        return [];
    }
  };

  // File tree component
  const RenderFileTree = ({
    folderPath = "",
    folderStructure,
    level = 0,
  }: {
    folderPath?: string;
    folderStructure: Record<string, string[]>;
    level?: number;
  }) => {
    // Get subfolders in this folder
    const subfolders = Object.keys(folderStructure)
      .filter(
        (path) =>
          path !== folderPath &&
          path.startsWith(folderPath) &&
          path.substring(folderPath.length + (folderPath ? 1 : 0)).indexOf("/") === -1
      )
      .sort();

    // Get direct files in this folder
    const folderFiles = folderPath === "" 
      ? folderStructure[""] || [] 
      : folderStructure[folderPath] || [];

    if (!subfolders.length && !folderFiles.length) {
      return null;
    }

    return (
      <div className={level > 0 ? "ml-3 pl-2 border-l border-white/10" : ""}>
        {subfolders.map((subfolder) => {
          const folderName = folderPath
            ? subfolder.substring(folderPath.length + 1)
            : subfolder;
          
          return (
            <div key={subfolder}>
              <div 
                className="flex items-center py-1 text-sm rounded cursor-pointer hover:bg-white/5"
                onClick={() => {
                  // Toggle folder open/closed logic would go here
                }}
              >
                <Folder className="w-4 h-4 mr-1 text-white/60" />
                <span className="font-medium text-white/80">{folderName}</span>
              </div>
              <RenderFileTree
                folderPath={subfolder}
                folderStructure={folderStructure}
                level={level + 1}
              />
            </div>
          );
        })}

        {folderFiles.map((file) => {
          const filePath = folderPath ? `${folderPath}/${file}` : file;
          const isActive = filePath === activeFilePath;
          
          return (
            <div
              key={filePath}
              className={`flex items-center py-1 text-sm rounded cursor-pointer ${
                isActive ? "bg-white/10" : "hover:bg-white/5"
              }`}
              onClick={() => setActiveFilePath(filePath)}
            >
              <File className={`w-4 h-4 mr-1 ${isActive ? "text-[#14F195]" : "text-white/60"}`} />
              <span className={isActive ? "text-white" : "text-white/80"}>{file}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // File tree component with filtering AND showing the presence of hidden files
  const RenderFilteredFileTree = ({
    folderPath = "",
    folderStructure,
    fileType,
    level = 0,
  }: {
    folderPath?: string;
    folderStructure: Record<string, string[]>;
    fileType: "contract" | "frontend";
    level?: number;
  }) => {
    // Get subfolders in this folder
    const subfolders = Object.keys(folderStructure)
      .filter(
        (path) =>
          path !== folderPath &&
          path.startsWith(folderPath) &&
          path.substring(folderPath.length + (folderPath ? 1 : 0)).indexOf("/") === -1
      )
      .sort();

    // Get direct files in this folder
    const folderFiles = folderPath === "" 
      ? folderStructure[""] || [] 
      : folderStructure[folderPath] || [];
    
    // Filter files based on the selected fileType but maintain the structure
    const filteredSubfolders = subfolders.filter(folder => {
      // Check if this folder or any of its subfolders contain files of the specified type
      const hasMatchingFile = (checkFolder: string): boolean => {
        // Check files directly in this folder
        const filesInFolder = folderStructure[checkFolder] || [];
        for (const file of filesInFolder) {
          const filePath = checkFolder ? `${checkFolder}/${file}` : file;
          const matchesType = fileType === "contract" ? isContractFile(filePath) : !isContractFile(filePath);
          if (matchesType) return true;
        }
        
        // Check subfolders
        const subfoldersToCheck = Object.keys(folderStructure)
          .filter(path => path !== checkFolder && path.startsWith(checkFolder + "/"));
        
        return subfoldersToCheck.some(hasMatchingFile);
      };
      
      return hasMatchingFile(folder);
    });
    
    const filteredFiles = folderFiles.filter(file => {
      const filePath = folderPath ? `${folderPath}/${file}` : file;
      return fileType === "contract" ? isContractFile(filePath) : !isContractFile(filePath);
    });

    // Count total files of the other type that are hidden
    const otherTypeFiles = folderFiles.filter(file => {
      const filePath = folderPath ? `${folderPath}/${file}` : file;
      return fileType === "contract" ? !isContractFile(filePath) : isContractFile(filePath);
    }).length;

    if (!filteredSubfolders.length && !filteredFiles.length && !otherTypeFiles) {
      return null;
    }

    return (
      <div className={level > 0 ? "ml-3 pl-2 border-l border-white/10" : ""}>
        {filteredSubfolders.map((subfolder) => {
          const folderName = folderPath
            ? subfolder.substring(folderPath.length + 1)
            : subfolder;
          
          return (
            <div key={subfolder}>
              <div 
                className="flex items-center py-1 text-sm rounded cursor-pointer hover:bg-white/5"
                onClick={() => {
                  // Toggle folder open/closed logic could go here
                }}
              >
                <Folder className="w-4 h-4 mr-1 text-white/60" />
                <span className="font-medium text-white/80">{folderName}</span>
              </div>
              <RenderFilteredFileTree
                folderPath={subfolder}
                folderStructure={folderStructure}
                fileType={fileType}
                level={level + 1}
              />
            </div>
          );
        })}

        {filteredFiles.map((file) => {
          const filePath = folderPath ? `${folderPath}/${file}` : file;
          const isActive = filePath === activeFilePath;
          
          return (
            <div
              key={filePath}
              className={`flex items-center py-1 text-sm rounded cursor-pointer ${
                isActive ? "bg-white/10" : "hover:bg-white/5"
              }`}
              onClick={() => setActiveFilePath(filePath)}
            >
              <File className={`w-4 h-4 mr-1 ${isActive ? "text-[#14F195]" : "text-white/60"}`} />
              <span className={isActive ? "text-white" : "text-white/80"}>{file}</span>
            </div>
          );
        })}
        
        {/* Display a note about hidden files of the other type */}
        {otherTypeFiles > 0 && (
          <div className="mt-1 text-xs text-white/40 italic pl-2">
            + {otherTypeFiles} hidden {fileType === "contract" ? "frontend" : "contract"} {otherTypeFiles === 1 ? "file" : "files"}
          </div>
        )}
      </div>
    );
  };

  // Get folder structure for file tree display
  const folderStructure = getFolderStructure();

  // Active file content
  const activeFile = getActiveFile();
  const activeFileContent = activeFile ? activeFile.content : "";
  const activeFileLanguage = activeFile ? getLanguageFromPath(activeFile.path) : "typescript";
  const isActiveFileContract = activeFile ? isContractFile(activeFile.path) : false;

  return (
    <div className="h-screen bg-[#0c0c10] text-white flex flex-col overflow-hidden">
      {/* Gradient background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[50%] h-[70%] bg-[#14F195]/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[60%] bg-[#9945FF]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[40%] bg-[#00C2FF]/20 blur-[120px] rounded-full" />
      </div>

      {/* Header Bar */}
      <header className="border-b border-white/10 p-4 relative z-10">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold font-space-grotesk flex items-center gap-2">
              Solana AI dApp Builder
              <div className="h-2 w-2 rounded-full bg-[#14F195] animate-pulse" />
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="outline"
                className="border-white/10 text-white/80 hover:text-white"
                onClick={() => setShowTemplateModal(!showTemplateModal)}
              >
                <FileCode className="h-4 w-4 mr-2" />
                Templates
              </Button>

              {showTemplateModal && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg shadow-lg p-4 z-50">
                  <h3 className="text-sm font-medium mb-2">Template Gallery</h3>
                  <div className="space-y-2">
                    {SAMPLE_TEMPLATES.map((template, index) => (
                      <button
                        key={index}
                        className="w-full text-left p-2 hover:bg-white/10 rounded-md transition-colors"
                        onClick={() => handleSelectTemplate(template)}
                      >
                        <p className="text-sm font-medium">{template.name}</p>
                        <p className="text-xs text-white/60">
                          {template.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              className="border-white/10 text-white/80 hover:text-white"
              onClick={() => {
                // Save project
                alert("Project saved!");
              }}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              variant={isRunningContract || isRunningFrontend ? "outline" : "default"}
              className={
                isRunningContract || isRunningFrontend
                  ? "border-white/10 text-white/50"
                  : "bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black"
              }
              onClick={() => isActiveFileContract ? handleRunContract() : handleRunFrontend()}
              disabled={isRunningContract || isRunningFrontend}
            >
              {isRunningContract || isRunningFrontend ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="border-white/10 text-white/80 hover:text-white"
              onClick={() => document.getElementById("settings-tab")?.click()}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Main IDE Area with collapsible sidebar */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Collapsible File Explorer - Left Side */}
        <div
          className={`border-r border-white/10 bg-black/20 ${
            sidebarCollapsed ? "w-10" : "w-64"
          } 
                    transition-all duration-300 md:flex flex-col relative`}
        >
          <button
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-[#14F195] rounded-full p-1 z-10"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-3 w-3 text-black" />
            ) : (
              <ChevronLeft className="h-3 w-3 text-black" />
            )}
          </button>

          {sidebarCollapsed ? (
            <div className="flex flex-col items-center py-4 space-y-6">
              <FileCode className="h-5 w-5 text-[#14F195]" />
              <Code className="h-5 w-5 text-white/60" />
              <Settings className="h-5 w-5 text-white/60" />
            </div>
          ) : (
            <>
              <div className="p-4 flex items-center justify-between">
                <div className="flex space-x-2">
                  <button 
                    className={`text-sm font-medium px-2 py-1 rounded ${sidebarView === "projects" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
                    onClick={() => setSidebarView("projects")}
                  >
                    Projects
                  </button>
                  <button 
                    className={`text-sm font-medium px-2 py-1 rounded ${sidebarView === "files" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
                    onClick={() => setSidebarView("files")}
                    disabled={files.length === 0}
                  >
                    Files
                  </button>
                </div>
                {sidebarView === "files" && files.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    title="New File"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">New File</span>
                  </Button>
                )}
              </div>

              <ScrollArea className="flex-1">
                <div className="p-2">
                  {sidebarView === "projects" ? (
                    <div className="text-center py-10 text-white/40 text-sm">
                      <FileCode className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p>No projects yet</p>
                      <p className="text-xs mt-1">
                        Create your first Solana project
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 border-white/20"
                        onClick={() => setShowTemplateModal(true)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        New Project
                      </Button>
                    </div>
                  ) : (
                    files.length > 0 ? (
                      <RenderFileTree folderStructure={folderStructure} />
                    ) : (
                      <div className="text-center py-10 text-white/40 text-sm">
                        <FileCode className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p>No files yet</p>
                        <p className="text-xs mt-1">
                          Generate your first dApp from a template
                        </p>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>

              <div className="mt-auto p-4 border-t border-white/10">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs text-white/70 block">
                      Project Name
                    </label>
                    <Input
                      className="bg-white/5 border-white/10 h-8 text-xs"
                      placeholder="My Solana dApp"
                      value={contractName}
                      onChange={(e) => setContractName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white/70 block">
                      Contract Type
                    </label>
                    <Select
                      value={contractType}
                      onValueChange={setContractType}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 h-8 text-xs">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="token">SPL Token</SelectItem>
                        <SelectItem value="nft">NFT Collection</SelectItem>
                        <SelectItem value="marketplace">Marketplace</SelectItem>
                        <SelectItem value="dao">DAO</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-white/10 text-white/80 hover:text-white h-8"
                    onClick={deployToDevnet}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Deploy to Devnet
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main content area with AI chat and code editor */}
        <div className="flex-1 flex flex-row overflow-hidden main-content-container">
          {/* AI Chat Section */}
          <div
            ref={aiSectionRef}
            className="h-full border-r border-white/10 flex flex-col bg-black/20 overflow-hidden"
            style={{ width: `${aiWidth}%` }}
          >
            <div className="border-b border-white/10 p-2 bg-black/30 flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-[#14F195]" />
                AI Assistant
              </h3>
            </div>

            <ScrollArea className="flex-1 w-full">
              <div className="p-3 space-y-4">
                {userMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-[#9945FF]/20 rounded-tr-none"
                          : "bg-[#14F195]/10 rounded-tl-none"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">
                        <Markdown>{message.content}</Markdown>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] p-3 rounded-lg bg-[#14F195]/10 rounded-tl-none">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#14F195]/60 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-[#14F195]/60 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-[#14F195]/60 rounded-full animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t border-white/10 p-3 bg-black/30">
              <form
                onSubmit={handleChatSubmit}
                className="flex items-center space-x-2"
              >
                <Textarea
                  placeholder="Ask the AI assistant about your dApp..."
                  className="min-h-[60px] resize-none bg-black/30 border-white/10"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleChatSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-8 w-8 bg-[#14F195] hover:bg-[#14F195]/80 text-black"
                  disabled={isLoading || !currentInput.trim()}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Vertical Resize Handle */}
          <div
            ref={horizontalResizeRef}
            className="w-1 bg-white/5 hover:bg-[#14F195]/50 cursor-col-resize transition-colors"
            onMouseDown={() => setHorizontalDragging(true)}
          />

          {/* Code Editor and Output Section */}
          <div
            ref={codeSectionRef}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Tab navigation */}
            <Tabs
              defaultValue="code"
              className="flex-1 flex flex-col"
              onValueChange={setCurrentTab}
            >
              <div className="border-b border-white/10 bg-black/40">
                <div className="container mx-auto px-4">
                  <TabsList className="bg-transparent border-b-0 h-10">
                    <TabsTrigger
                      value="code"
                      className="data-[state=active]:bg-white/10 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-[#14F195] h-10"
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger
                      value="preview"
                      className="data-[state=active]:bg-white/10 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-[#14F195] h-10"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger
                      id="settings-tab"
                      value="settings"
                      className="data-[state=active]:bg-white/10 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-[#14F195] h-10"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                <TabsContent
                  value="code"
                  className="flex-1 flex flex-col p-0 mt-0 h-full"
                >
                  {/* Code type tabs (Contract/Frontend) */}
                  <div className="px-4 py-2 bg-black/30 border-b border-white/10">
                    <Tabs 
                      value={codeTab} 
                      onValueChange={handleCodeTabChange}
                      className="w-full"
                    >
                      <TabsList className="bg-black/30 h-8">
                        <TabsTrigger 
                          value="contract" 
                          className="text-xs h-7 data-[state=active]:bg-[#14F195]/20"
                        >
                          <FileCode className="h-3 w-3 mr-1" />
                          Contract
                        </TabsTrigger>
                        <TabsTrigger 
                          value="frontend" 
                          className="text-xs h-7 data-[state=active]:bg-[#9945FF]/20"
                        >
                          <Code className="h-3 w-3 mr-1" />
                          Frontend
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  {/* Two-panel layout with file explorer and code editor */}
                  <div className="flex-1 flex overflow-hidden">
                    {/* File sidebar specific to the selected code type */}
                    <div className="w-48 border-r border-white/10 flex flex-col overflow-hidden bg-black/20">
                      <div className="p-2 border-b border-white/10">
                        <h3 className="text-xs font-medium text-white/70">
                          {codeTab === "contract" ? "Contract Files" : "Frontend Files"}
                        </h3>
                      </div>
                      <ScrollArea className="flex-1">
                        <div className="p-2">
                          {files.length > 0 ? (
                            <RenderFilteredFileTree 
                              folderStructure={folderStructure} 
                              fileType={codeTab}
                            />
                          ) : (
                            <div className="text-center py-6 text-white/40 text-xs">
                              <FileCode className="h-8 w-8 mx-auto mb-2 opacity-30" />
                              <p>No {codeTab} files</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                    
                    {/* Code editor and terminal */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                      {/* File path display */}
                      {activeFilePath && (
                        <div className="px-4 py-2 text-xs text-white/50 border-b border-white/10 bg-black/30 flex items-center">
                          <FileCode className="h-3.5 w-3.5 mr-2 text-white/40" />
                          {activeFilePath}
                        </div>
                      )}
                      
                      {activeFilePath ? (
                        <div className="flex-1 flex flex-col overflow-hidden">
                          {/* Code Editor */}
                          <div className="flex-1 overflow-hidden">
                            <CodeEditor code={activeFileContent} language={activeFileLanguage} />
                          </div>

                          {/* Terminal for Contract or Frontend */}
                          <div className="h-40 border-t border-white/10 flex flex-col overflow-hidden">
                            <div className="flex justify-between items-center p-2 border-b border-white/10 bg-black/30">
                              <h3 className="text-sm font-medium flex items-center">
                                <Terminal className="h-4 w-4 mr-2 text-white/60" />
                                {isActiveFileContract ? "Contract Terminal" : "Frontend Terminal"}
                              </h3>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-xs text-white/70 hover:text-white"
                                onClick={() => {
                                  if (isActiveFileContract) {
                                    setContractTerminal("");
                                  } else {
                                    setFrontendTerminal("");
                                  }
                                }}
                              >
                                Clear
                              </Button>
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <OutputWindow output={isActiveFileContract ? contractTerminal : frontendTerminal} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-white/30">
                          <FileCode className="h-16 w-16 mb-4" />
                          <h3 className="text-lg font-medium">No File Selected</h3>
                          <p className="mt-2 text-sm max-w-md text-center">
                            Select a file from the file explorer or generate a dApp using one of our templates
                          </p>
                          <Button
                            variant="outline"
                            className="mt-4 border-white/10"
                            onClick={() => setShowTemplateModal(true)}
                          >
                            <FileCode className="h-4 w-4 mr-2" />
                            Choose a Template
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="preview"
                  className="flex-1 p-0 mt-0 h-full w-full"
                >
                  <div className="flex-1 h-full w-full overflow-auto bg-slate-100 p-4">
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-lg border border-gray-200 p-6 text-black">
                      <div className="w-full max-w-4xl bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl font-semibold">
                            {contractName || "My Solana App"}
                          </h2>
                          <div className="flex space-x-1">
                            <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                          </div>
                        </div>

                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 mb-2">
                            <span className="text-gray-500">Connection</span>
                            <span className="text-green-500">Connected</span>
                          </div>
                          <div className="text-gray-700 text-xs truncate">
                            <span className="text-gray-400 mr-1">
                              Wallet:
                            </span>
                            5YNmS...WbN
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <button className="bg-gradient-to-r from-[#14F195] to-[#9945FF] text-white font-medium py-2 px-4 rounded">
                            Connect Wallet
                          </button>
                          
                          <div className="flex space-x-2">
                            <button className="border border-gray-200 text-gray-600 font-medium py-2 px-4 rounded">
                              Transactions
                            </button>
                            <button className="border border-gray-200 text-gray-600 font-medium py-2 px-4 rounded">
                              Settings
                            </button>
                          </div>
                        </div>

                        {contractType === "token" && (
                          <div className="mt-8 grid grid-cols-3 gap-6">
                            <div className="p-4 border rounded-xl">
                              <h3 className="font-semibold mb-2">Token Info</h3>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Name:</span>
                                  <span>{contractName || "Solana Token"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Symbol:</span>
                                  <span>SOL</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Supply:</span>
                                  <span>1,000,000</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4 border rounded-xl">
                              <h3 className="font-semibold mb-2">Balance</h3>
                              <div className="text-2xl font-bold">250.5 SOL</div>
                              <div className="text-sm text-gray-500">$12,525.00 USD</div>
                            </div>
                            
                            <div className="p-4 border rounded-xl">
                              <h3 className="font-semibold mb-2">Actions</h3>
                              <div className="space-y-2 text-sm">
                                <button className="w-full text-left py-1 px-2 hover:bg-gray-50 rounded">
                                  Mint Tokens
                                </button>
                                <button className="w-full text-left py-1 px-2 hover:bg-gray-50 rounded">
                                  Transfer Tokens
                                </button>
                                <button className="w-full text-left py-1 px-2 hover:bg-gray-50 rounded">
                                  Burn Tokens
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {contractType === "nft" && (
                          <div className="mt-8">
                            <div className="flex justify-between mb-4">
                              <h3 className="text-lg font-semibold">NFT Collection</h3>
                              <button className="text-[#14F195] hover:underline text-sm font-medium">
                                Mint New NFT
                              </button>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="border rounded-xl overflow-hidden">
                                  <div className="aspect-square bg-gray-100"></div>
                                  <div className="p-3">
                                    <div className="font-medium">NFT #{i}</div>
                                    <div className="text-xs text-gray-500">Owner: 5YNmS...WbN</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {contractType === "marketplace" && (
                          <div className="mt-8">
                            <div className="flex justify-between mb-4">
                              <h3 className="text-lg font-semibold">NFT Marketplace</h3>
                              <div className="flex space-x-2">
                                <button className="text-gray-600 hover:underline text-sm font-medium">
                                  My Listings
                                </button>
                                <button className="text-[#14F195] hover:underline text-sm font-medium">
                                  Sell an NFT
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="border rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                                  <div className="aspect-square bg-gray-100"></div>
                                  <div className="p-3">
                                    <div className="font-medium">Solana #{i}</div>
                                    <div className="text-xs text-gray-500">Collection X</div>
                                    <div className="mt-2 flex justify-between items-center">
                                      <div className="font-semibold">{(i * 0.5).toFixed(1)} SOL</div>
                                      <button className="text-xs bg-[#14F195] text-white px-2 py-1 rounded">
                                        Buy
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {contractType === "dao" && (
                          <div className="mt-8 grid grid-cols-2 gap-6">
                            <div className="p-4 border rounded-xl">
                              <h3 className="font-semibold mb-4">Governance Dashboard</h3>
                              <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                  <span>Your Voting Power:</span>
                                  <span className="font-bold">15.4%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>DAO Treasury:</span>
                                  <span className="font-bold">2,500 SOL</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Total Members:</span>
                                  <span className="font-bold">124</span>
                                </div>
                                <button className="w-full mt-2 bg-[#14F195] text-white py-2 rounded font-medium">
                                  Create Proposal
                                </button>
                              </div>
                            </div>
                            
                            <div className="p-4 border rounded-xl">
                              <h3 className="font-semibold mb-4">Active Proposals</h3>
                              <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                  <div key={i} className="p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                    <div className="font-medium text-sm">Proposal #{i}: Fund Development</div>
                                    <div className="flex justify-between mt-1 text-xs">
                                      <span className="text-gray-500">Ends in 2 days</span>
                                      <span className="font-medium text-green-600">76% For</span>
                                    </div>
                                  </div>
                                ))}
                                <button className="w-full mt-1 text-[#14F195] text-sm hover:underline">
                                  View All Proposals
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="settings"
                  className="flex-1 p-4 mt-0 overflow-auto"
                >
                  <h2 className="text-xl font-medium mb-4">dApp Settings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Project</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-sm text-white/70">
                            Solana Cluster
                          </label>
                          <Select defaultValue="localnet">
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select cluster" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="localnet">Localnet</SelectItem>
                              <SelectItem value="devnet">Devnet</SelectItem>
                              <SelectItem value="testnet">Testnet</SelectItem>
                              <SelectItem value="mainnet">Mainnet</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm text-white/70">
                            Anchor Version
                          </label>
                          <Select defaultValue="0.29.0">
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select version" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0.29.0">0.29.0</SelectItem>
                              <SelectItem value="0.28.0">0.28.0</SelectItem>
                              <SelectItem value="0.27.0">0.27.0</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Environment</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-sm text-white/70">
                            Wallet Adapter
                          </label>
                          <Select defaultValue="react">
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select wallet adapter" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="react">
                                @solana/wallet-adapter-react
                              </SelectItem>
                              <SelectItem value="walletconnect">
                                WalletConnect
                              </SelectItem>
                              <SelectItem value="custom">
                                Custom Adapter
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm text-white/70">
                            UI Framework
                          </label>
                          <Select defaultValue="default">
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select UI framework" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">
                                Tailwind CSS
                              </SelectItem>
                              <SelectItem value="shadcn">shadcn/ui</SelectItem>
                              <SelectItem value="mui">Material UI</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">AI Assistant</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-sm text-white/70">
                            AI Model
                          </label>
                          <Select defaultValue="gemini">
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select AI model" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gemini">
                                Gemini 1.5 Flash
                              </SelectItem>
                              <SelectItem value="claude">
                                Claude Opus
                              </SelectItem>
                              <SelectItem value="gpt-4">
                                GPT-4
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm text-white/70">
                            Code Generation
                          </label>
                          <Select defaultValue="complete">
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select generation mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="complete">
                                Complete Projects
                              </SelectItem>
                              <SelectItem value="components">
                                Components Only
                              </SelectItem>
                              <SelectItem value="snippets">
                                Code Snippets
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Mobile bottom action bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md border-t border-white/10 p-3">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-white/80 h-9"
          >
            <FileCode className="h-4 w-4 mr-1" />
            Files
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black h-9"
            onClick={() => isActiveFileContract ? handleRunContract() : handleRunFrontend()}
            disabled={isRunningContract || isRunningFrontend}
          >
            {isRunningContract || isRunningFrontend ? (
              <>
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Run dApp
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-white/80 h-9"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            AI Chat
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper function to get project type color
function getProjectTypeColor(type: string): string {
  switch (type) {
    case "token":
      return "bg-green-500/20 text-green-400";
    case "nft":
      return "bg-purple-500/20 text-purple-400";
    case "marketplace":
      return "bg-blue-500/20 text-blue-400";
    case "dao":
      return "bg-orange-500/20 text-orange-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
}

// Helper function to get project type label
function getProjectTypeLabel(type: string): string {
  switch (type) {
    case "token":
      return "Token";
    case "nft":
      return "NFT";
    case "marketplace":
      return "Market";
    case "dao":
      return "DAO";
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
}
