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
    // TEMPORARILY CHANGED - GetBlock sponsorship paused
    featured: "Available",
    icon: "🌐",
    featuredTool: createPlaceholderFeaturedTool(),
    /* ORIGINAL GetBlock featuredTool - uncomment when sponsor returns:
    featuredTool: {
      name: "GetBlock",
      description: "Blockchain-as-a-Service (BaaS) platform providing instant API access to 100+ blockchain protocols. Launched in 2019, GetBlock has grown to serve 100,000+ active users and processes over 50 billion API requests monthly with guaranteed 99.9%+ uptime.",
      logo: "/sponsor/getblock-square.png",
      website: "https://getblock.io",
      features: [
        "Access to 100+ blockchain networks including Solana, Ethereum, Bitcoin, and Layer 2 solutions",
        "Multiple API formats: JSON-RPC, REST, WebSocket, and GraphQL",
        "Both shared and dedicated nodes with fully customized, high-performance solutions",
        "Advanced monitoring and statistics dashboards for tracking method usage",
        "Enterprise-grade infrastructure with 99.9%+ uptime guarantee",
      ],
      stats: [
        { label: "Uptime", value: "99.9%+" },
        { label: "Networks", value: "100+" },
        { label: "Monthly Requests", value: "50B+" },
      ],
      tutorials: [
        {
          title: "Getting Started with GetBlock",
          description: "Learn how to integrate GetBlock's premium RPC infrastructure into your Solana applications in under 5 minutes.",
          slug: "/tutorials/getblock-getting-started",
        },
        {
          title: "Advanced GetBlock Features",
          description: "Master WebSocket subscriptions, load balancing, transaction optimization, and multi-chain development.",
          slug: "/tutorials/getblock-advanced",
        },
        {
          title: "Optimizing RPC Performance",
          description: "Production-grade performance optimization for DeFi, NFTs, and high-throughput applications.",
          slug: "/tutorials/getblock-performance",
        },
      ],
    },
    */
    projectsBuiltWith: [],
    otherTools: [
      {
        name: "Chainstack",
        description: "Enterprise-grade blockchain infrastructure with high-performance Solana RPC endpoints.",
        website: "https://chainstack.com",
        logo: "https://chainstack.com/favicon.ico"
      }, ...createPlaceholderOtherTools(1)
    ],
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
