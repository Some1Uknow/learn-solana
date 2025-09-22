"use client";

import React, { useMemo, useRef, useState, useCallback } from "react";
import { useAutoRegisterUser } from "@/hooks/use-auto-register-user";
import { authFetch } from "@/lib/auth/authFetch";
import { useWeb3AuthUser, useWeb3Auth } from "@web3auth/modal/react";
import { SolanaWallet } from "@web3auth/solana-provider";
import { Connection } from "@solana/web3.js";
import { fetchManyNftMetadata } from "@/lib/solana/fetchNftMetadata";
import GameCard, { GameItem } from "@/components/games/GameCard";
import ActiveGameModal from "@/components/games/ActiveGameModal";
import ClaimNftModal from "@/components/games/ClaimNftModal";
import NftsModal from "@/components/games/NftsModal";

// Game is dynamically imported inside ActiveGameModal.

const games: GameItem[] = [
  {
    id: "solana-clicker",
    title: "Solana Clicker",
    description: "Click to mine SOL and upgrade your mining power",
    goal: "Learn about Solana tokenomics while having fun clicking and upgrading",
    icon: "⚡",
    image: "/solanaLogo.png",
    category: "ARCADE",
    difficulty: "BEGINNER",
  },
];

export default function GamesPage() {
  const { userInfo } = useWeb3AuthUser();
  const { provider, isConnected } = useWeb3Auth();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<GameItem | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [completedGames, setCompletedGames] = useState<
    Record<
      string,
      {
        completed: boolean;
        timestamp: number;
        mintAddress?: string;
        canClaim?: boolean;
      }
    >
  >({});
  const [claimingGame, setClaimingGame] = useState<string | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [mintStatus, setMintStatus] = useState<
    "idle" | "minting" | "success" | "error"
  >("idle");
  const [mintError, setMintError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [ownedNfts, setOwnedNfts] = useState<
    Array<{ gameId: string; mintAddress: string; createdAt: string }>
  >([]);
  const [ownedNftMetadata, setOwnedNftMetadata] = useState<
    Record<
      string,
      { image?: string; name?: string; symbol?: string; error?: string }
    >
  >({});
  const [showNftsModal, setShowNftsModal] = useState(false);
  const [nftRefreshing, setNftRefreshing] = useState<Record<string, boolean>>(
    {}
  );

  // Auto-register user & set cookie token once wallet is known
  useAutoRegisterUser(walletAddress || undefined);

  // Server-side completion recorder (idempotent)
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
        return await res.json();
      } catch (e) {
        console.warn("[games] completion API error", e);
        return null;
      }
    },
    [walletAddress]
  );

  // Derive wallet address from provider (similar to navbar) with retry guard
  React.useEffect(() => {
    let cancelled = false;
    async function fetchAddress() {
      if (!provider || !isConnected) return;
      try {
        const accounts = await provider.request({
          method: "getAccounts",
          params: {},
        });
        const addr = Array.isArray(accounts) ? accounts[0] : accounts;
        if (!cancelled && addr) setWalletAddress(addr);
        // Ensure signer available
        if (provider && typeof window !== "undefined") {
          const existing = (window as any).web3authSolanaWallet;
          if (!existing || typeof existing.signTransaction !== "function") {
            try {
              const wallet = new SolanaWallet(provider as any);
              (window as any).web3authSolanaWallet = wallet;
            } catch (e) {
              console.warn("[games] failed to init SolanaWallet", e);
            }
          }
        }
      } catch {}
    }
    fetchAddress();
    return () => {
      cancelled = true;
    };
  }, [provider, isConnected]);

  // Hydrate existing progress when wallet becomes known
  React.useEffect(() => {
    if (!walletAddress) return;
    let ignore = false;
    (async () => {
      try {
        // NOTE: Web3Auth identity token may not be instantly available after connection.
        // useAutoRegisterUser stores it on window + cookie when eventually retrieved.
        // Relying solely on cookie caused 401 races; pulling from window reduces failures.
        const res = await authFetch(
          `/api/games/progress?walletAddress=${walletAddress}`,
          { method: "GET" }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (ignore) return;
        if (data?.progress && Array.isArray(data.progress)) {
          const mapped: Record<
            string,
            { completed: boolean; timestamp: number; mintAddress?: string }
          > = {};
          for (const row of data.progress) {
            mapped[row.gameId] = {
              completed: !!row.completedAt,
              timestamp: row.completedAt
                ? new Date(row.completedAt).getTime()
                : Date.now(),
              mintAddress: undefined,
              canClaim: !!row.canClaim,
            } as any;
          }
          setCompletedGames((prev) => ({ ...mapped, ...prev }));
        }
      } catch (e) {
        console.warn("[games] progress hydration failed", e);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [walletAddress]);

  // Hydrate minted NFTs (server recorded) so claim button disappears after refresh
  React.useEffect(() => {
    if (!walletAddress) return;
    let abort = false;
    (async () => {
      try {
        const res = await authFetch(
          `/api/games/nfts?walletAddress=${walletAddress}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (abort) return;
        if (Array.isArray(data?.nfts)) {
          setOwnedNfts(data.nfts);
          // Kick off metadata fetch (fire & forget)
          const mints = data.nfts.map((n: any) => n.mintAddress);
          if (mints.length) {
            // Use devnet connection (same cluster) for PDA fetch
            try {
              const conn = new Connection("https://api.devnet.solana.com");
              const metas = await fetchManyNftMetadata(
                conn,
                mints.slice(0, 25)
              ); // limit batch
              if (!abort) {
                const mapped: Record<string, any> = {};
                for (const meta of metas) {
                  mapped[meta.mint] = {
                    image: meta.image,
                    name: meta.name,
                    symbol: meta.symbol,
                    error: meta.error,
                  };
                }
                setOwnedNftMetadata(mapped);
              }
            } catch (metaErr) {
              console.warn("[games] nft metadata fetch failed", metaErr);
            }
          }
          // Merge into completedGames state (avoid overriding timestamps newer than existing)
          setCompletedGames((prev) => {
            const merged = { ...prev };
            for (const row of data.nfts) {
              const existing = merged[row.gameId];
              merged[row.gameId] = {
                completed: existing?.completed ?? true,
                timestamp:
                  existing?.timestamp ||
                  new Date(row.createdAt || Date.now()).getTime(),
                mintAddress: row.mintAddress,
              };
            }
            return merged;
          });
        }
      } catch (e) {
        console.warn("[games] nft hydration failed", e);
      }
    })();
    return () => {
      abort = true;
    };
  }, [walletAddress]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const filteredGames = useMemo(() => {
    const q = query.toLowerCase().trim();
    return games.filter(
      (game) =>
        game.title.toLowerCase().includes(q) ||
        game.description.toLowerCase().includes(q) ||
        game.category.toLowerCase().includes(q)
    );
  }, [query]);

  const handleGameAction = (game: GameItem) => {
    setActive(game);
    setGameStarted(false);
  };

  const continueGames = filteredGames.slice(0, 2);
  const restGames = filteredGames.slice(2);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div ref={containerRef}>
          {/* Hero */}
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
            </div>
            {/* Controls row */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="relative block w-full sm:max-w-xl">
                <span className="sr-only">Search</span>
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  🔎
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, category, or difficulty..."
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
                <div className="flex overflow-hidden rounded-xl bg-zinc-900/60">
                  <button
                    className="px-3 py-3 text-zinc-300 hover:bg-zinc-900"
                    aria-label="Grid view"
                  >
                    ▦
                  </button>
                  <button
                    className="px-3 py-3 text-zinc-300 hover:bg-zinc-900"
                    aria-label="List view"
                  >
                    ≡
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Games */}
          <section aria-labelledby="featured" className="mt-8">
            <h3 id="featured" className="text-lg font-medium text-zinc-200">
              Featured Games
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              {continueGames.map((game, idx) => (
                <GameCard
                  key={game.id}
                  game={game}
                  index={idx}
                  onPlay={() => handleGameAction(game)}
                  completed={!!completedGames[game.id]?.completed}
                  minted={!!completedGames[game.id]?.mintAddress}
                  onClaim={() => {
                    setClaimingGame(game.id);
                    setShowClaimModal(true);
                  }}
                  large
                />
              ))}
            </div>
          </section>

          {/* All Games */}
          <section aria-labelledby="all" className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {restGames.map((game, idx) => (
                <GameCard
                  key={game.id}
                  game={game}
                  index={idx + 2}
                  onPlay={() => handleGameAction(game)}
                  completed={!!completedGames[game.id]?.completed}
                  minted={!!completedGames[game.id]?.mintAddress}
                  onClaim={() => {
                    setClaimingGame(game.id);
                    setShowClaimModal(true);
                  }}
                />
              ))}
            </div>
          </section>

          {/* Active Game Modal */}
          {active && (
            <ActiveGameModal
              active={active}
              onClose={() => setActive(null)}
              gameStarted={gameStarted}
              setGameStarted={setGameStarted}
              completed={!!completedGames[active.id]?.completed}
              mintAddress={completedGames[active.id]?.mintAddress}
              onClaimClick={() => {
                setClaimingGame(active.id);
                setShowClaimModal(true);
              }}
              onMarkCompleted={(gameId) => {
                // Optimistic local state
                setCompletedGames((prev) => ({
                  ...prev,
                  [gameId]: {
                    completed: true,
                    timestamp: Date.now(),
                    mintAddress: prev[gameId]?.mintAddress,
                  },
                }));
                // Fire-and-forget server record (no blocking UI)
                markCompleted(gameId);
              }}
            />
          )}

          {/* Claim NFT Modal */}
          {showClaimModal && claimingGame && (
            <ClaimNftModal
              open={showClaimModal}
              gameId={claimingGame}
              walletAddress={walletAddress}
              provider={provider}
              onClose={() => {
                setShowClaimModal(false);
                setClaimingGame(null);
              }}
              setCompleted={(mintAddress) => {
                setCompletedGames((prev) => ({
                  ...prev,
                  [claimingGame]: {
                    ...(prev[claimingGame] || { completed: true, timestamp: Date.now() }),
                    mintAddress,
                    canClaim: false,
                  },
                }));
              }}
            />
          )}
        </div>
      </div>
      <NftsModal
        open={showNftsModal}
        onClose={() => setShowNftsModal(false)}
        walletAddress={walletAddress}
        ownedNfts={ownedNfts}
        ownedNftMetadata={ownedNftMetadata}
        setOwnedNftMetadata={setOwnedNftMetadata}
      />
    </main>
  );
}
 
