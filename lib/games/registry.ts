/**
 * Game registry - centralized list of all available games.
 * Add new games here as they're developed.
 */

export interface GameDefinition {
  id: string;
  title: string;
  description: string;
  goal: string;
  image?: string;
  icon: string;
  category: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  preGame?: {
    warning?: string;
    controls?: string;
    objective?: string;
    totalLevels?: number;
    notes?: string[];
  };
  // Future extensibility
  nftReward?: {
    enabled: boolean;
    collectionName?: string;
  };
  minCompletionTime?: number; // seconds
  tags?: string[];
}

export const GAME_REGISTRY: GameDefinition[] = [
  {
    id: "solana-clicker",
    title: "Solana Clicker",
    description: "Click to mine SOL and upgrade your mining power",
    goal: "Learn about Solana tokenomics while having fun clicking and upgrading",
    icon: "⚡",
    image: "/solanaLogo.png",
    category: "ARCADE",
    difficulty: "BEGINNER",
    preGame: {
      warning: "Desktop (PC) only for now. Mobile not supported.",
      controls: "Arrow Keys or WASD to move and jump",
      objective: "Collect all SOL coins and pass each level quiz to win",
      totalLevels: 5,
    },
    nftReward: {
      enabled: true,
      collectionName: "Solana Clicker Champions",
    },
    tags: ["tokenomics", "platformer", "nft"],
  },
  // Add future games here:
  // {
  //   id: "nft-adventure",
  //   title: "NFT Adventure",
  //   ...
  // },
];

/**
 * Get game by ID
 */
export function getGameById(gameId: string): GameDefinition | undefined {
  return GAME_REGISTRY.find((game) => game.id === gameId);
}

/**
 * Get all games by category
 */
export function getGamesByCategory(category: string): GameDefinition[] {
  return GAME_REGISTRY.filter((game) => game.category === category);
}

/**
 * Get all games by difficulty
 */
export function getGamesByDifficulty(
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
): GameDefinition[] {
  return GAME_REGISTRY.filter((game) => game.difficulty === difficulty);
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(GAME_REGISTRY.map((game) => game.category)));
}
