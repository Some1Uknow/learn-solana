"use client";

import React, { useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { NumberTicker } from "@/components/ui/number-ticker";
import { authFetch } from "@/lib/auth/authFetch";
import { useWeb3Auth } from "@/hooks/use-web3-auth";
import { Connection } from "@solana/web3.js";
import { fetchManyNftMetadata } from "@/lib/solana/fetchNftMetadata";
import GameCard from "@/components/games/GameCard";
import ActiveGameModal from "@/components/games/ActiveGameModal";
import ClaimNftModal from "@/components/games/ClaimNftModal";
import NftsModal from "@/components/games/NftsModal";
import { LoginRequiredModal } from "@/components/ui/login-required-modal";
import { useLoginGate } from "@/hooks/use-login-gate";
import { GAME_REGISTRY, type GameDefinition } from "@/lib/games/registry";
import type { UserGameStates, NftMetadata, MintedNft, UserStateResponse } from "@/lib/games/types";
import { Search, Trophy } from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo";
import { createWeb3AuthSolanaWallet } from "@/lib/auth/web3auth-solana";

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Games", url: "/games" },
];

export function GamesPageClient() {
  const {
    provider,
    isConnected,
    walletAddress,
    userInfo,
    sessionReady,
    authPhase,
  } = useWeb3Auth();
  const { requireLogin, showModal, setShowModal } = useLoginGate();

  const [query, setQuery] = useState("");
  const [active, setActive] = useState<GameDefinition | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showNftsModal, setShowNftsModal] = useState(false);
  const [totalPlayers, setTotalPlayers] = useState<number | null>(null);

  const [gameStates, setGameStates] = useState<UserGameStates>({});
  const [isLoadingStates, setIsLoadingStates] = useState(false);

  const [ownedNfts, setOwnedNfts] = useState<MintedNft[]>([]);
  const [nftMetadata, setNftMetadata] = useState<Record<string, NftMetadata>>({});

  const [claimingGame, setClaimingGame] = useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setTotalPlayers(data.totalGamePlayers || 0))
      .catch((err) => console.error("Failed to fetch stats:", err));
  }, []);

  React.useEffect(() => {
    if (!provider || !isConnected || typeof window === "undefined") return;
    try {
      (window as any).web3authSolanaWallet = createWeb3AuthSolanaWallet(provider);
    } catch (error) {
      console.warn("[games] failed to init Solana wallet adapter", error);
    }
  }, [provider, isConnected]);

  React.useEffect(() => {
    if (!sessionReady || authPhase !== "idle" || !walletAddress) return;

    let cancelled = false;
    setIsLoadingStates(true);

    (async () => {
      try {
        const res = await authFetch(`/api/games/user-state`, { method: "GET", walletAddress });

        if (!res.ok) {
          setIsLoadingStates(false);
          return;
        }

        const data: UserStateResponse = await res.json();
        if (cancelled) return;

        setGameStates(data.gameStates);
        setOwnedNfts(data.nfts);
        setIsLoadingStates(false);

        const mintAddresses = data.nfts.map((nft) => nft.mintAddress);
        if (mintAddresses.length > 0) {
          try {
            const conn = new Connection("https://api.devnet.solana.com");
            const metas = await fetchManyNftMetadata(conn, mintAddresses.slice(0, 25));

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

    return () => { cancelled = true; };
  }, [authPhase, sessionReady, walletAddress]);

  const markCompleted = useCallback(
    async (gameId: string) => {
      try {
        const res = await authFetch("/api/games/complete", {
          method: "POST",
          walletAddress,
          body: JSON.stringify({ gameId, walletAddress }),
        });
        if (!res.ok) return null;
        const data = await res.json();

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
        return null;
      }
    },
    [walletAddress]
  );

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
    requireLogin(() => {
      setActive(game);
      setGameStarted(false);
    });
  };

  const handleClaim = (gameId: string) => {
    setClaimingGame(gameId);
    setShowClaimModal(true);
  };

  const featuredGames = filteredGames.slice(0, 2);
  const restGames = filteredGames.slice(2);

  return (
    <div className="min-h-screen bg-black text-white">
      <BreadcrumbSchema items={breadcrumbItems} />
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-neutral-500 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Games</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-[#14f195] mb-3">Interactive Games</p>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
              {userInfo ? `Welcome back, ${userInfo?.name || "Player"}` : "Learn Solana Through Games"}
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl">
              Master blockchain concepts through interactive games. Complete challenges and earn NFT achievements.
            </p>

            {totalPlayers !== null && totalPlayers > 0 && (
              <div className="mt-6 flex items-center gap-2">
                <span className="text-2xl font-semibold text-[#14f195]">
                  <NumberTicker value={totalPlayers} />
                </span>
                <span className="text-sm text-neutral-500">developers playing</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search games..."
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-neutral-700"
              />
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-2.5 text-sm text-white transition-colors hover:border-neutral-700 disabled:opacity-50"
              type="button"
              disabled={!walletAddress}
              onClick={() => setShowNftsModal(true)}
            >
              <Trophy className="w-4 h-4" />
              My NFTs ({ownedNfts.length})
            </button>
          </div>

          {isLoadingStates && walletAddress && (
            <div className="mb-6 text-sm text-neutral-500">Loading your progress...</div>
          )}

          {/* Featured Games */}
          {featuredGames.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">Featured</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {featuredGames.map((game, idx) => {
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

          {/* All Games */}
          {restGames.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">All Games</h3>
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

      <Footer />

      {active && (
        <ActiveGameModal
          active={active as any}
          onClose={() => { setActive(null); setGameStarted(false); }}
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
          onClose={() => { setShowClaimModal(false); setClaimingGame(null); }}
          gameId={claimingGame}
          walletAddress={walletAddress}
          provider={provider}
          setCompleted={(mintAddress: string) => {
            setGameStates((prev) => ({
              ...prev,
              [claimingGame]: { ...prev[claimingGame], mintAddress, nftMinted: true, canClaim: false },
            }));
            setOwnedNfts((prev) => [...prev, { gameId: claimingGame, mintAddress, createdAt: new Date().toISOString() } as any]);
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

      <LoginRequiredModal
        open={showModal}
        onOpenChange={setShowModal}
        title="Play to Earn"
        description="Connect your wallet to play games, track progress, and earn NFT achievements."
      />
    </div>
  );
}

export default GamesPageClient;
