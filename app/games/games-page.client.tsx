"use client";

import React, { useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useAutoRegisterUser } from "@/hooks/use-auto-register-user";
import { authFetch } from "@/lib/auth/authFetch";
import { useWeb3AuthUser, useWeb3Auth } from "@web3auth/modal/react";
import { SolanaWallet } from "@web3auth/solana-provider";
import { Connection } from "@solana/web3.js";
import { fetchManyNftMetadata } from "@/lib/solana/fetchNftMetadata";
import GameCard from "@/components/games/GameCard";
import ActiveGameModal from "@/components/games/ActiveGameModal";
import ClaimNftModal from "@/components/games/ClaimNftModal";
import NftsModal from "@/components/games/NftsModal";
import { GAME_REGISTRY, type GameDefinition } from "@/lib/games/registry";
import type { UserGameStates, NftMetadata, MintedNft, UserStateResponse } from "@/lib/games/types";

export function GamesPageClient() {
  const { userInfo } = useWeb3AuthUser();
  const { provider, isConnected } = useWeb3Auth();
  
  // UI State
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<GameDefinition | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showNftsModal, setShowNftsModal] = useState(false);
  const [totalPlayers, setTotalPlayers] = useState<number | null>(null);
  
  // Game State - single source of truth
  const [gameStates, setGameStates] = useState<UserGameStates>({});
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  
  // NFT State
  const [ownedNfts, setOwnedNfts] = useState<MintedNft[]>([]);
  const [nftMetadata, setNftMetadata] = useState<Record<string, NftMetadata>>({});
  const [nftRefreshing, setNftRefreshing] = useState<Record<string, boolean>>({});
  
  // Claim State
  const [claimingGame, setClaimingGame] = useState<string | null>(null);
  const [mintStatus, setMintStatus] = useState<"idle" | "minting" | "success" | "error">("idle");
  const [mintError, setMintError] = useState<string | null>(null);
  
  // Wallet
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useAutoRegisterUser(walletAddress || undefined);

  // Fetch total players stat
  React.useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setTotalPlayers(data.totalGamePlayers || 0))
      .catch((err) => console.error("Failed to fetch stats:", err));
  }, []);

  // Initialize wallet
  React.useEffect(() => {
    let cancelled = false;
    async function fetchAddress() {
      if (!provider || !isConnected) return;
      try {
        const accounts = await provider.request({ method: "getAccounts" });
        if (cancelled) return;
        if (Array.isArray(accounts) && accounts.length > 0) {
          setWalletAddress(accounts[0] as string);
          if (typeof window !== "undefined") {
            try {
              const wallet = new SolanaWallet(provider);
              (window as any).web3authSolanaWallet = wallet;
            } catch (e) {
              console.warn("[games] failed to init SolanaWallet", e);
            }
          }
        }
      } catch (e) {
        console.error("[games] wallet init error", e);
      }
    }
    fetchAddress();
    return () => {
      cancelled = true;
    };
  }, [provider, isConnected]);

  // Single unified API call to fetch all game states + NFTs
  React.useEffect(() => {
    if (!walletAddress) return;
    
    let cancelled = false;
    setIsLoadingStates(true);

    (async () => {
      try {
        const res = await authFetch(
          `/api/games/user-state?walletAddress=${walletAddress}`,
          { method: "GET" }
        );
        
        if (!res.ok) {
          console.warn("[games] user-state fetch failed", res.status);
          setIsLoadingStates(false);
          return;
        }

        const data: UserStateResponse = await res.json();
        
        if (cancelled) return;

        // Set game states - single atomic update
        setGameStates(data.gameStates);
        setOwnedNfts(data.nfts);
        setIsLoadingStates(false);

        // Fetch NFT metadata if we have any minted NFTs
        const mintAddresses = data.nfts.map((nft) => nft.mintAddress);
        if (mintAddresses.length > 0) {
          try {
            const conn = new Connection("https://api.devnet.solana.com");
            const metas = await fetchManyNftMetadata(
              conn,
              mintAddresses.slice(0, 25)
            );
            
            if (!cancelled) {
              const mapped: Record<string, NftMetadata> = {};
              for (const meta of metas) {
                mapped[meta.mint] = {
                  image: meta.image,
                  name: meta.name,
                  symbol: meta.symbol,
                  error: meta.error,
                };
              }
              setNftMetadata(mapped);
            }
          } catch (metaErr) {
            console.warn("[games] nft metadata fetch failed", metaErr);
          }
        }
      } catch (e) {
        console.error("[games] user-state error", e);
        setIsLoadingStates(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [walletAddress]);

  const markCompleted = useCallback(
    async (gameId: string) => {
      try {
        const res = await authFetch("/api/games/complete", {
          method: "POST",
          body: JSON.stringify({ gameId, walletAddress }),
        });
        if (!res.ok) {
          const txt = await res.text();
          console.warn("[games] completion API failed", res.status, txt);
          return null;
        }
        const data = await res.json();
        
        // Update local state immediately
        if (data.progress) {
          setGameStates((prev) => ({
            ...prev,
            [gameId]: {
              completed: !!data.progress.completedAt,
              completedAt: data.progress.completedAt,
              canClaim: !!data.progress.canClaim,
              claimedAt: data.progress.claimedAt,
              mintAddress: prev[gameId]?.mintAddress || null,
              nftMinted: prev[gameId]?.nftMinted || false,
            },
          }));
        }
        
        return data;
      } catch (e) {
        console.warn("[games] completion API error", e);
        return null;
      }
    },
    [walletAddress]
  );

  const containerRef = useRef<HTMLDivElement | null>(null);

  const filteredGames = useMemo(() => {
    const q = query.toLowerCase().trim();
    return GAME_REGISTRY.filter(
      (game) =>
        game.title.toLowerCase().includes(q) ||
        game.description.toLowerCase().includes(q) ||
        game.category.toLowerCase().includes(q) ||
        game.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [query]);

  const handleGameAction = (game: GameDefinition) => {
    setActive(game);
    setGameStarted(false);
  };

  const handleClaim = (gameId: string) => {
    setClaimingGame(gameId);
    setShowClaimModal(true);
    setMintStatus("idle");
    setMintError(null);
  };

  const continueGames = filteredGames.slice(0, 2);
  const restGames = filteredGames.slice(2);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 rounded-lg bg-zinc-900/60 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900"
        >
          ← Back to Home
        </Link>
        <div ref={containerRef}>
          <div className="mb-10">
            <div className="text-xs tracking-[0.25em] text-zinc-400">
              [GAMES]
            </div>
            <div className="mt-3 space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {userInfo ? (
                  <>
                    Hi {userInfo?.name || "Player"}, choose a game to start
                    playing
                  </>
                ) : (
                  "Choose a game to start playing"
                )}
              </h2>
              {totalPlayers !== null && totalPlayers > 0 && (
                <p className="text-sm text-zinc-400">
                  Join <span className="font-semibold text-zinc-200">{totalPlayers.toLocaleString()}+</span> developers mastering Solana through games
                </p>
              )}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="relative block w-full sm:max-w-xl">
                <span className="sr-only">Search</span>
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  🔎
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, category, or tags..."
                  className="w-full rounded-xl bg-zinc-900/60 pl-9 pr-3 py-3 text-sm text-zinc-100 outline-none transition focus:bg-zinc-900"
                />
              </label>
              <div className="flex items-center gap-3">
                <button
                  className="rounded-xl bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-900"
                  type="button"
                >
                  All Categories
                </button>
                <button
                  className="rounded-xl bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-900 disabled:opacity-50"
                  type="button"
                  disabled={!walletAddress}
                  onClick={() => setShowNftsModal(true)}
                >
                  View NFTs ({ownedNfts.length})
                </button>
              </div>
            </div>
          </div>

          {isLoadingStates && walletAddress && (
            <div className="mb-6 text-center text-sm text-zinc-500">
              Loading your progress...
            </div>
          )}

          {continueGames.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Featured
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {continueGames.map((game, idx) => {
                  const state = gameStates[game.id];
                  return (
                    <GameCard
                      key={game.id}
                      game={game}
                      index={idx}
                      large
                      onPlay={() => handleGameAction(game)}
                      completed={state?.completed || false}
                      minted={state?.nftMinted || false}
                      canClaim={state?.canClaim || false}
                      onClaim={() => handleClaim(game.id)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {restGames.length > 0 && (
            <div className="mt-10 space-y-4">
              <h3 className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                All Games
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {restGames.map((game, idx) => {
                  const state = gameStates[game.id];
                  return (
                    <GameCard
                      key={game.id}
                      game={game}
                      index={idx}
                      onPlay={() => handleGameAction(game)}
                      completed={state?.completed || false}
                      minted={state?.nftMinted || false}
                      canClaim={state?.canClaim || false}
                      onClaim={() => handleClaim(game.id)}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {active && (
        <ActiveGameModal
          active={active as any}
          onClose={() => {
            setActive(null);
            setGameStarted(false);
          }}
          gameStarted={gameStarted}
          setGameStarted={setGameStarted}
          completed={gameStates[active.id]?.completed || false}
          mintAddress={gameStates[active.id]?.mintAddress || undefined}
          onClaimClick={() => handleClaim(active.id)}
          onMarkCompleted={markCompleted}
        />
      )}

      {showClaimModal && claimingGame && (
        <ClaimNftModal
          open={showClaimModal}
          onClose={() => {
            setShowClaimModal(false);
            setClaimingGame(null);
            setMintStatus("idle");
            setMintError(null);
          }}
          gameId={claimingGame}
          walletAddress={walletAddress}
          provider={provider}
          setCompleted={(mintAddress: string) => {
            setGameStates((prev) => ({
              ...prev,
              [claimingGame]: {
                ...prev[claimingGame],
                mintAddress,
                nftMinted: true,
                canClaim: false,
              },
            }));
            setOwnedNfts((prev) => [
              ...prev,
              {
                gameId: claimingGame,
                mintAddress,
                createdAt: new Date().toISOString(),
              } as any,
            ]);
            setShowClaimModal(false);
            setClaimingGame(null);
          }}
        />
      )}

      {showNftsModal && (
        <NftsModal
          open={showNftsModal}
          onClose={() => setShowNftsModal(false)}
          walletAddress={walletAddress}
          ownedNfts={ownedNfts}
          ownedNftMetadata={nftMetadata}
          setOwnedNftMetadata={setNftMetadata}
        />
      )}
    </main>
  );
}

export default GamesPageClient;
