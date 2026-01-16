"use client";

import React, { useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
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
import { LoginRequiredModal } from "@/components/ui/login-required-modal";
import { useLoginGate } from "@/hooks/use-login-gate";
import { GAME_REGISTRY, type GameDefinition } from "@/lib/games/registry";
import type { UserGameStates, NftMetadata, MintedNft, UserStateResponse } from "@/lib/games/types";
import { Search, Trophy } from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo";

// Breadcrumb items for structured data
const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Games", url: "/games" },
];

export function GamesPageClient() {
  const { userInfo } = useWeb3AuthUser();
  const { provider, isConnected } = useWeb3Auth();
  const { requireLogin, showModal, setShowModal } = useLoginGate();

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
    requireLogin(() => {
      setActive(game);
      setGameStarted(false);
    });
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
    <div className="min-h-screen w-full relative text-white">
      {/* Structured Data for SEO */}
      <BreadcrumbSchema items={breadcrumbItems} />
      
      {/* Fixed gradient background - Playful/Interactive theme */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(circle 450px at 75% 10%, rgba(236, 72, 153, 0.14), transparent),
            radial-gradient(circle 400px at 20% 35%, rgba(153, 69, 255, 0.16), transparent),
            radial-gradient(circle 350px at 90% 70%, rgba(45, 212, 191, 0.12), transparent),
            radial-gradient(circle 300px at 10% 80%, rgba(20, 241, 149, 0.08), transparent),
            radial-gradient(ellipse 60% 30% at 50% 100%, rgba(153, 69, 255, 0.06), transparent),
            #000000
          `,
        }}
      />

      <Navbar />

      <div className="pt-28 pb-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <BlurFade delay={0.05} inView>
            <nav className="text-sm text-zinc-400 mb-8" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#14f195] transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">Games</span>
            </nav>
          </BlurFade>

          {/* Header */}
          <BlurFade delay={0.1} inView>
            <div ref={containerRef} className="mb-10">
              <div className="text-xs tracking-[0.25em] text-[#14f195] uppercase font-medium">
                [INTERACTIVE GAMES]
              </div>
              <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                {userInfo ? (
                  <>Welcome back, {userInfo?.name || "Player"}</>
                ) : (
                  "Learn Solana Through Games"
                )}
              </h1>
              <p className="mt-4 text-lg text-zinc-400 max-w-2xl">
                Master blockchain concepts through interactive games. Complete challenges and earn NFT achievements.
              </p>

              {/* Stats */}
              {totalPlayers !== null && totalPlayers > 0 && (
                <div className="mt-6 flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#14f195]">
                    <NumberTicker value={totalPlayers} />
                  </span>
                  <span className="text-sm text-zinc-400">developers playing</span>
                </div>
              )}
            </div>
          </BlurFade>

          {/* Controls */}
          <BlurFade delay={0.15} inView>
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="relative block w-full sm:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search games..."
                  className="w-full rounded-xl bg-white/5 border border-white/10 pl-12 pr-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-[#14f195]/50 focus:bg-white/[0.08]"
                />
              </label>
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10 disabled:opacity-50"
                type="button"
                disabled={!walletAddress}
                onClick={() => setShowNftsModal(true)}
              >
                <Trophy className="w-4 h-4" />
                My NFTs ({ownedNfts.length})
              </button>
            </div>
          </BlurFade>

          {isLoadingStates && walletAddress && (
            <BlurFade delay={0.2} inView>
              <div className="mb-6 text-center text-sm text-zinc-500">
                Loading your progress...
              </div>
            </BlurFade>
          )}

          {continueGames.length > 0 && (
            <BlurFade delay={0.25} inView>
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.25em] text-[#14f195]/70 font-medium">
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
            </BlurFade>
          )}

          {restGames.length > 0 && (
            <BlurFade delay={0.3} inView>
              <div className="mt-10 space-y-4">
                <h3 className="text-xs uppercase tracking-[0.25em] text-[#14f195]/70 font-medium">
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
            </BlurFade>
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
