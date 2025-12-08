export interface Tool {
  name: string;
  description: string;
  website: string;
  logo?: string;
  category?: string;
}

export interface FeaturedTool extends Tool {
  features: string[];
  stats: Array<{
    label: string;
    value: string;
  }>;
  tutorials?: Array<{
    title: string;
    description: string;
    slug: string;
  }>;
}

export interface ProjectBuiltWith {
  name: string;
  description: string;
  category: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  featured: string;
  icon: string;
  featuredTool: FeaturedTool;
  projectsBuiltWith: ProjectBuiltWith[];
  otherTools: Tool[];
}

// Placeholder featured tool template for open partnership slots
const createPlaceholderFeaturedTool = (): FeaturedTool => ({
  name: "Available Slot",
  description: "This category's Featured Partner slot is currently open.",
  logo: "/placeholder.jpg",
  website: "#",
  features: [
    "References in all related tutorials",
    "AI bot recommends your tool to learners",
    "Default tool in upcoming video content",
    "3 dedicated tutorials for your product",
    "Much more on your demand!",
  ],
  stats: [
    { label: "Status", value: "Open" },
    { label: "Tutorials", value: "Exclusive" },
    { label: "Promotion", value: "Maximum" },
  ],
});

// Placeholder tools for "Other Providers" section
const createPlaceholderOtherTools = (count: number): Tool[] => {
  const placeholders: Tool[] = [];
  const letters = ["A", "B", "C"];
  for (let i = 0; i < count; i++) {
    placeholders.push({
      name: `Partner Slot ${letters[i] || i + 1}`,
      description: "This listing slot is available for partners.",
      website: "#",
    });
  }
  return placeholders;
};

// === Updated, web3-centric tool categories for outreach ===
export const toolCategories: ToolCategory[] = [
  {
    id: "rpc",
    name: "RPC Providers",
    description: "High-performance RPC endpoints and developer APIs for reliable Solana network access.",
    featured: "Available",
    icon: "🌐",
    featuredTool: createPlaceholderFeaturedTool(),
    projectsBuiltWith: [],
    otherTools: createPlaceholderOtherTools(3),
  
  },

  {
    id: "indexing",
    name: "Indexing & Data",
    description: "Indexing, query APIs and real-time feeds for on-chain data and NFTs.",
    featured: "Available",
    icon: "📡",
    featuredTool: createPlaceholderFeaturedTool(),
    projectsBuiltWith: [],
    otherTools: createPlaceholderOtherTools(3),
  },

  {
    id: "wallets",
    name: "Wallets",
    description: "User wallets that handle signing, key management, and onboarding flows.",
    featured: "Available",
    icon: "👛",
    featuredTool: createPlaceholderFeaturedTool(),
    projectsBuiltWith: [],
    otherTools: createPlaceholderOtherTools(3),
  },

  {
    id: "dev-tools",
    name: "Development Tools",
    description: "Frameworks, CLIs and SDKs that speed up Solana program and client development.",
    featured: "Available",
    icon: "⚙️",
    featuredTool: createPlaceholderFeaturedTool(),
    projectsBuiltWith: [],
    otherTools: createPlaceholderOtherTools(3),
  },

];

// Helper functions (unchanged)
export function getToolCategory(categoryId: string): ToolCategory | undefined {
  return toolCategories.find((cat) => cat.id === categoryId);
}

export function getAllCategoryIds(): string[] {
  return toolCategories.map((cat) => cat.id);
}

export function getCategoryMetadata(categoryId: string) {
  const category = getToolCategory(categoryId);
  if (!category) return null;

  return {
    id: category.id,
    name: category.name,
    description: category.description,
    featured: category.featured,
    icon: category.icon,
  };
}
