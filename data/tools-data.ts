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

// === Updated, web3-centric tool categories for outreach ===
export const toolCategories: ToolCategory[] = [
  {
    id: "rpc",
    name: "RPC Providers",
    description: "High-performance RPC endpoints and developer APIs for reliable Solana network access.",
    featured: "Helius",
    icon: "🌐",
    featuredTool: {
      name: "Helius",
      description: "Developer-first RPC & enhanced APIs (webhooks, DAS). Built to scale for modern Solana apps.",
      // Public GitHub org avatar (reliable, matches brand)
      logo: "https://avatars.githubusercontent.com/u/107892413?s=280&v=4",
      website: "https://helius.dev",
      features: [
        "Enhanced developer APIs & webhooks",
        "Low-latency, high-throughput endpoints",
        "Compression & DAS support",
        "Developer analytics / logs",
      ],
      stats: [
        { label: "Requests / Day", value: "100M+" },
        { label: "Typical Latency", value: "<50ms" },
        { label: "Uptime", value: "99.9%" },
      ],
    },
    projectsBuiltWith: [
      { name: "Tensor", description: "NFT marketplace using fast RPC + webhooks.", category: "NFT Marketplace" },
      { name: "Magic Eden", description: "High-throughput marketplace integrations.", category: "NFT Platform" },
      { name: "Phantom", description: "Wallets rely on low-latency RPC for UX.", category: "Wallet" },
    ],
    otherTools: [
      { name: "QuickNode", description: "Multi-chain RPC provider with monitoring & scaling.", website: "https://quicknode.com" },
      { name: "Triton", description: "High-performance RPC + indexer solutions.", website: "https://triton.one" },
      { name: "GenesysGo", description: "Validator & RPC infra focused on Solana performance.", website: "https://genesysgo.com" },
      { name: "DRPC", description: "Lightweight Solana RPC provider for devs.", website: "https://drpc.io" },
    ],
  },

  {
    id: "indexing",
    name: "Indexing & Data",
    description: "Indexing, query APIs and real-time feeds for on-chain data and NFTs.",
    featured: "Flipside",
    icon: "📡",
    featuredTool: {
      name: "Flipside",
      description: "On-chain analytics, dashboards and collaborative queries to measure growth and conversions.",
      // Flipside public asset (profile / brand)
      logo: "https://pbs.twimg.com/profile_images/1405470156829886216/p3k5Z9-4_400x400.jpg",
      website: "https://flipsidecrypto.com",
      features: [
        "SQL-based on-chain analytics",
        "Custom dashboards for funnels",
        "Alerts & reports",
        "Community notebooks",
      ],
      stats: [
        { label: "Active Dashboards", value: "5K+" },
        { label: "Queries / Day", value: "100K+" },
        { label: "Integrations", value: "50+" },
      ],
    },
    projectsBuiltWith: [
      { name: "Marketplaces", description: "Real-time listings & asset pages.", category: "Marketplace" },
      { name: "Analytics Dashboards", description: "Historical token/trade analytics.", category: "Analytics" },
      { name: "Research", description: "On-chain research & insights.", category: "Research" },
    ],
    otherTools: [
      { name: "Bitquery", description: "Multi-chain blockchain data APIs.", website: "https://bitquery.io" },
      { name: "Dune", description: "Query dashboards for cross-chain on-chain data.", website: "https://dune.com" },
      { name: "The Graph", description: "Indexing / subgraph-style querying (where supported).", website: "https://thegraph.com" },
    ],
  },

  {
    id: "wallets",
    name: "Wallets",
    description: "User wallets that handle signing, key management, and onboarding flows.",
    featured: "Phantom",
    icon: "👛",
    featuredTool: {
      name: "Phantom",
      description: "The leading Solana wallet with a strong focus on UX for developers and users.",
      // Phantom official assets page shows multiple icons — this is a reliable public image (Twitter/profile)
      logo: "https://pbs.twimg.com/profile_images/1482346208893549825/r3p6S2Q9_400x400.jpg",
      website: "https://phantom.app",
      features: [
        "Developer integrations & deep linking",
        "xNFT / metadata support",
        "Hardware wallet compatibility",
        "Large user base for discovery",
      ],
      stats: [
        { label: "Active Users", value: "2M+" },
        { label: "Integrations", value: "1000+" },
        { label: "Rating", value: "4.6★" },
      ],
    },
    projectsBuiltWith: [
      { name: "DEXes", description: "Integrated for easy trade flows.", category: "DeFi" },
      { name: "NFT Marketplaces", description: "One-click checkout & signing.", category: "NFT" },
      { name: "Wallet-first dApps", description: "dApp UX via Phantom SDK.", category: "Apps" },
    ],
    otherTools: [
      { name: "Backpack", description: "Developer-first wallet with xNFT support.", website: "https://backpack.app" },
      { name: "Solflare", description: "Feature-rich non-custodial wallet.", website: "https://solflare.com" },
      { name: "Glow", description: "Simple mobile-first wallet for devs.", website: "https://glow.app" },
    ],
  },

  {
    id: "storage",
    name: "Storage & Archival",
    description: "Decentralized & hybrid storage for metadata, assets, and archival data.",
    featured: "Arweave",
    icon: "🗄️",
    featuredTool: {
      name: "Arweave",
      description: "Permanent, decentralized storage for NFTs, metadata and archival data.",
      // Arweave official brand kit / cryptologos resource (public)
      logo: "https://cryptologos.cc/logos/arweave-ar-logo.png",
      website: "https://arweave.org",
      features: [
        "Permanent data storage",
        "Arweave gateway & SDKs",
        "Optimized for immutable NFT assets",
        "Ecosystem of archival tools",
      ],
      stats: [
        { label: "TB Stored", value: "Thousands+" },
        { label: "Nodes", value: "Global" },
        { label: "Adoption", value: "Widely used by NFT projects" },
      ],
    },
    projectsBuiltWith: [
      { name: "NFT Projects", description: "Immutable asset hosting for collectors.", category: "NFT" },
      { name: "Archival Tools", description: "Data backups for dApps.", category: "Infra" },
      { name: "Marketplaces", description: "Asset hosting + CDN delivery.", category: "Marketplace" },
    ],
    otherTools: [
      { name: "Bundlr", description: "Fast uploads to Arweave/IPFS.", website: "https://bundlr.network" },
      { name: "IPFS", description: "Distributed file storage for dapp assets.", website: "https://ipfs.io" },
      { name: "Filecoin", description: "Large-scale decentralized storage network.", website: "https://filecoin.io" },
    ],
  },

  {
    id: "dev-tools",
    name: "Development Tools",
    description: "Frameworks, CLIs and SDKs that speed up Solana program and client development.",
    featured: "Anchor",
    icon: "⚙️",
    featuredTool: {
      name: "Anchor",
      description: "The most widely-used framework for building Solana programs with safety and developer ergonomics.",
      // Anchor brand asset (site image)
      logo: "https://www.anchor-lang.com/images/anchor-logo.png",
      website: "https://www.anchor-lang.com",
      features: [
        "Macros to reduce boilerplate",
        "IDL generation & TypeScript clients",
        "Local testing harness",
        "Rich docs and examples",
      ],
      stats: [
        { label: "Programs Built", value: "15K+" },
        { label: "GitHub Stars", value: "3K+" },
        { label: "Contributors", value: "200+" },
      ],
    },
    projectsBuiltWith: [
      { name: "DeFi Protocols", description: "Secure program implementations.", category: "DeFi" },
      { name: "NFT Contracts", description: "Token minting & metadata flows.", category: "NFT" },
      { name: "Infra Tools", description: "Program tooling and helpers.", category: "Infrastructure" },
    ],
    otherTools: [
      { name: "Solana CLI", description: "Official CLI for deployments & scripts.", website: "https://docs.solana.com/cli" },
      { name: "Seahorse", description: "Python-first smart contract framework.", website: "https://seahorse.dev" },
      { name: "Metaplex", description: "NFT standard & JS SDKs for creators.", website: "https://www.metaplex.com" },
    ],
  },

  {
    id: "explorers",
    name: "Block Explorers",
    description: "Tools to inspect transactions, accounts, and program interactions.",
    featured: "SolanaFM",
    icon: "🔍",
    featuredTool: {
      name: "SolanaFM",
      description: "Human-readable explorer and analytics for developers and users to debug on-chain activity.",
      // SolanaFM GitHub/org avatar (public)
      logo: "https://avatars.githubusercontent.com/u/53240107?s=200&v=4",
      website: "https://solana.fm",
      features: [
        "Readable transaction parsing",
        "Account & program insights",
        "Embed links for UX flows",
        "Real-time monitoring",
      ],
      stats: [
        { label: "Daily Users", value: "50K+" },
        { label: "Indexed Txns", value: "10B+" },
        { label: "Programs Tracked", value: "8K+" },
      ],
    },
    projectsBuiltWith: [
      { name: "Dev Tooling", description: "Debugging & verification workflows.", category: "Developer" },
      { name: "Audits", description: "Audit trails and evidence generation.", category: "Security" },
      { name: "Dashboards", description: "Linking explorer views to product UIs.", category: "UX" },
    ],
    otherTools: [
      { name: "Solscan", description: "Popular explorer & token analytics.", website: "https://solscan.io" },
      { name: "Solana Beach", description: "Validator and network metrics.", website: "https://solanabeach.io" },
      { name: "XRAY (Helius)", description: "Advanced on-chain analytics layer.", website: "https://xray.helius.xyz" },
    ],
  },

  {
    id: "security",
    name: "Security & Audits",
    description: "Audit firms, static analysis and runtime monitoring for safe deployments.",
    featured: "Neodyme",
    icon: "🔒",
    featuredTool: {
      name: "Neodyme",
      description: "Security-first company offering audits, tooling and best-practice guides for Solana programs.",
      // Neodyme site header asset (public)
      logo: "https://neodyme.io/_astro/neodyme.Bd-rstoT_LSGQt.webp",
      website: "https://neodyme.io",
      features: [
        "Manual audits & reviews",
        "Open-source security tooling",
        "Bug bounty coordination",
        "Developer security training",
      ],
      stats: [
        { label: "Audits", value: "100+" },
        { label: "Clients", value: "50+" },
        { label: "Vulnerabilities Found", value: "500+" },
      ],
    },
    projectsBuiltWith: [
      { name: "DeFi Protocols", description: "Full security reviews prior to launch.", category: "DeFi" },
      { name: "Multisigs", description: "Enterprise-grade wallet audits.", category: "Infrastructure" },
      { name: "Marketplaces", description: "Smart contract safety for NFTs.", category: "NFT" },
    ],
    otherTools: [
      { name: "Sec3", description: "Automated scanning & continuous monitoring.", website: "https://sec3.dev" },
      { name: "OtterSec", description: "Security audits and pentests.", website: "https://osec.io" },
      { name: "Soteria", description: "Static analysis for Solana programs.", website: "https://github.com/blocksecteam/soteria" },
    ],
  },

  {
    id: "analytics",
    name: "Analytics & Observability",
    description: "User behavior, performance metrics and on-chain analytics to measure developer funnels.",
    featured: "Flipside",
    icon: "📈",
    featuredTool: {
      name: "Flipside",
      description: "On-chain analytics, dashboards and collaborative queries to measure growth and conversions.",
      // Flipside public asset (profile / brand)
      logo: "https://pbs.twimg.com/profile_images/1405470156829886216/p3k5Z9-4_400x400.jpg",
      website: "https://flipsidecrypto.com",
      features: [
        "SQL-based on-chain analytics",
        "Custom dashboards for funnels",
        "Alerts & reports",
        "Community notebooks",
      ],
      stats: [
        { label: "Active Dashboards", value: "5K+" },
        { label: "Queries / Day", value: "100K+" },
        { label: "Integrations", value: "50+" },
      ],
    },
    projectsBuiltWith: [
      { name: "Growth Teams", description: "Measure onboarding funnels & conversions.", category: "Growth" },
      { name: "Product", description: "Feature usage & retention analytics.", category: "Product" },
      { name: "Research", description: "Market insights & trends.", category: "Research" },
    ],
    otherTools: [
      { name: "Dune", description: "Query dashboards for on-chain data (multi-chain).", website: "https://dune.com" },
      { name: "Looker / BigQuery", description: "Data warehousing & reporting.", website: "https://cloud.google.com/bigquery" },
      { name: "Amplitude", description: "Product analytics for frontend funnels.", website: "https://amplitude.com" },
    ],
  },

  {
    id: "nft-apis",
    name: "NFT & Asset APIs",
    description: "APIs specifically geared to NFT metadata, marketplaces, and creator tools.",
    featured: "Crossmint",
    icon: "🖼️",
    featuredTool: {
      name: "Crossmint",
      description: "Enterprise-grade minting & NFT APIs for creators and marketplaces.",
      logo: "https://crossmint.io/favicon.png",
      website: "https://crossmint.io",
      features: [
        "Hosted minting APIs",
        "Credit-card to NFT flows",
        "Enterprise minting SDKs",
        "Creator tooling & distribution",
      ],
      stats: [
        { label: "Partners", value: "100+" },
        { label: "Transactions / Month", value: "Millions+" },
        { label: "Avg Latency", value: "<200ms" },
      ],
    },
    projectsBuiltWith: [
      { name: "Marketplaces", description: "Live listings and metadata fetch.", category: "Marketplace" },
      { name: "Wallets", description: "NFT galleries and owner views.", category: "Wallet" },
      { name: "Creator Tools", description: "Minting & distribution dashboards.", category: "Creator" },
    ],
    otherTools: [
      { name: "Magic (Magic SDK)", description: "Minting & wallet abstraction for creators.", website: "https://magic.link" },
      { name: "Crossmint (additional)", description: "Enterprise minting & checkout APIs.", website: "https://crossmint.io" },
      { name: "OpenSea APIs", description: "Market data and indexing (multi-chain where applicable).", website: "https://opensea.io" },
    ],
  },

  {
    id: "hosting",
    name: "Web3 Hosting & Edge",
    description: "Web3-first hosting and edge solutions for docs, play environments, and dApp frontends.",
    featured: "Fleek",
    icon: "🚀",
    featuredTool: {
      name: "Fleek",
      description: "Web3-native hosting & CDN tooling for dapps, docs and developer sandboxes.",
      // public brandfetch/profile assets for Fleek (use as placeholder; better to host local SVGs if you plan to show in product)
      logo: "https://brandfetch-res.cloudinary.com/images/logoog_image/6a6b2d1d1b9c0b4d1063f4f6f0c9b2c6.png",
      website: "https://fleek.xyz",
      features: [
        "Web3 hosting & pinning integrations",
        "Previews & CI for docs/playgrounds",
        "Edge functions & APIs for dapps",
        "CDN + pinning to IPFS/Arweave",
      ],
      stats: [
        { label: "Deploys / Month", value: "10K+" },
        { label: "Sites Hosted", value: "5K+" },
        { label: "Avg Deploy Time", value: "<30s" },
      ],
    },
    projectsBuiltWith: [
      { name: "Interactive Docs", description: "Playground and tutorial hosting.", category: "Education" },
      { name: "DApp Frontends", description: "Production dApp hosting.", category: "Apps" },
      { name: "Static Sites", description: "Landing pages & partner pages.", category: "Marketing" },
    ],
    otherTools: [
      { name: "IPFS Gateways", description: "Public pinning & gateways for assets.", website: "https://ipfs.io" },
      { name: "Arweave Gateways", description: "Permanent hosting via Arweave.", website: "https://arweave.org" },
      { name: "Bundlr", description: "Fast Arweave/IPFS uplinks.", website: "https://bundlr.network" },
    ],
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
