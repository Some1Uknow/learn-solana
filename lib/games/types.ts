/**
 * Type definitions for game-related data structures
 */

export interface GameState {
  completed: boolean;
  completedAt: string | null;
  canClaim: boolean;
  claimedAt: string | null;
  mintAddress: string | null;
  nftMinted: boolean;
}

export interface UserGameStates {
  [gameId: string]: GameState;
}

export interface NftMetadata {
  image?: string;
  name?: string;
  symbol?: string;
  error?: string;
}

export interface MintedNft {
  id: number;
  gameId: string;
  walletAddress: string;
  mintAddress: string;
  createdAt: string;
}

export interface UserStateResponse {
  walletAddress: string;
  gameStates: UserGameStates;
  nfts: MintedNft[];
}
