"use client";

import React, { useMemo, useRef, useState, useCallback } from "react";
import { useAutoRegisterUser } from '@/hooks/use-auto-register-user';
import { authFetch } from '@/lib/auth/authFetch';
import Image from "next/image";
import { cn } from "@/lib/cn";
import { useWeb3AuthUser, useWeb3Auth } from "@web3auth/modal/react";
import { SolanaWallet } from '@web3auth/solana-provider';
import dynamic from "next/dynamic";

const SolanaClickerGame = dynamic(
  () => import("@/components/games/SolanaClickerGame"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-zinc-400">
        Loading game...
      </div>
    ),
  }
);

interface GameItem {
  id: string;
  title: string;
  description: string;
  goal: string;
  image?: string;
  icon: string;
  category: string;
  difficulty: string;
}

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
  const [completedGames, setCompletedGames] = useState<Record<string, { completed: boolean; timestamp: number; mintAddress?: string }>>({});
  const [claimingGame, setClaimingGame] = useState<string | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [mintStatus, setMintStatus] = useState<'idle' | 'minting' | 'success' | 'error'>('idle');
  const [mintError, setMintError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Auto-register user & set cookie token once wallet is known
  useAutoRegisterUser(walletAddress || undefined);

  // Server-side completion recorder (idempotent)
  const markCompleted = useCallback(async (gameId: string) => {
    try {
      const res = await authFetch('/api/games/complete', {
        method: 'POST',
        body: JSON.stringify({ gameId, walletAddress }),
      });
      if (!res.ok) {
        const txt = await res.text();
        console.warn('[games] completion API failed', res.status, txt);
        return null;
      }
      return await res.json();
    } catch (e) {
      console.warn('[games] completion API error', e);
      return null;
    }
  }, [walletAddress]);

  // Derive wallet address from provider (similar to navbar) with retry guard
  React.useEffect(() => {
    let cancelled = false;
    async function fetchAddress() {
      if (!provider || !isConnected) return;
      try {
        const accounts = await provider.request({ method: 'getAccounts', params: {} });
        const addr = Array.isArray(accounts) ? accounts[0] : accounts;
        if (!cancelled && addr) setWalletAddress(addr);
        // Ensure signer available
        if (provider && typeof window !== 'undefined') {
          const existing = (window as any).web3authSolanaWallet;
          if (!existing || typeof existing.signTransaction !== 'function') {
            try {
              const wallet = new SolanaWallet(provider as any);
              (window as any).web3authSolanaWallet = wallet;
            } catch (e) {
              console.warn('[games] failed to init SolanaWallet', e);
            }
          }
        }
      } catch {}
    }
    fetchAddress();
    return () => { cancelled = true; };
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
        const res = await authFetch(`/api/games/progress?walletAddress=${walletAddress}`, { method: 'GET' });
        if (!res.ok) return;
        const data = await res.json();
        if (ignore) return;
        if (data?.progress && Array.isArray(data.progress)) {
          const mapped: Record<string, { completed: boolean; timestamp: number; mintAddress?: string }> = {};
            for (const row of data.progress) {
              mapped[row.gameId] = {
                completed: !!row.completedAt,
                timestamp: row.completedAt ? new Date(row.completedAt).getTime() : Date.now(),
                mintAddress: undefined, // mint address hydration from mintedNfts endpoint could be added later
              };
            }
          setCompletedGames(prev => ({ ...mapped, ...prev }));
        }
      } catch (e) {
        console.warn('[games] progress hydration failed', e);
      }
    })();
    return () => { ignore = true; };
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

          {/* Immersive Modal */}
          {active && (
            <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
              <button
                aria-label="Close"
                onClick={() => setActive(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
              />
              <div className="fixed inset-0 mx-auto w-full max-w-4xl translate-y-0 p-4 sm:translate-y-4">
                <div className="relative overflow-hidden rounded-2xl bg-[#0f0f12] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
                  {gameStarted ? (
                    <div className="h-[600px]">
                      <SolanaClickerGame
                        onGameComplete={() => {
                          setGameStarted(false);
                          if (active) {
                            // Optimistic local state
                            setCompletedGames(prev => ({
                              ...prev,
                              [active.id]: { completed: true, timestamp: Date.now(), mintAddress: prev[active.id]?.mintAddress }
                            }));
                            // Fire-and-forget server record (no blocking UI)
                            markCompleted(active.id);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                            {active.category}
                          </div>
                          <h3 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100">
                            {active.title}
                          </h3>
                          <p className="mt-1 text-sm text-zinc-400">
                            {active.description}
                          </p>
                        </div>
                        <button
                          onClick={() => setActive(null)}
                          className="rounded-xl bg-white/5 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10"
                          aria-label="Close"
                        >
                          Close
                        </button>
                      </div>

                      <div className="mt-5 rounded-xl bg-white/[0.02] p-4">
                        <h4 className="text-sm font-medium text-zinc-200">
                          Game Goal
                        </h4>
                        <p className="mt-1 text-sm text-zinc-400">
                          {active.goal}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500">
                            Difficulty:
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em]",
                              active.difficulty === "BEGINNER" &&
                                "bg-green-500/10 text-green-300",
                              active.difficulty === "INTERMEDIATE" &&
                                "bg-yellow-500/10 text-yellow-300",
                              active.difficulty === "ADVANCED" &&
                                "bg-red-500/10 text-red-300"
                            )}
                          >
                            ● {active.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500">
                            Category:
                          </span>
                          <span className="text-xs text-zinc-300">
                            {active.category}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        <button
                          className="w-full rounded-xl bg-cyan-500 px-6 py-3 text-sm font-medium text-black transition hover:bg-cyan-400"
                          type="button"
                          onClick={() => setGameStarted(true)}
                        >
                          {completedGames[active.id]?.completed ? 'PLAY AGAIN' : 'START GAME →'}
                        </button>
                        {completedGames[active.id]?.completed && !completedGames[active.id]?.mintAddress && (
                          <button
                            className="w-full rounded-xl bg-purple-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-purple-400"
                            type="button"
                            onClick={() => {
                              setClaimingGame(active.id);
                              setShowClaimModal(true);
                            }}
                          >
                            CLAIM NFT REWARD
                          </button>
                        )}
                        {completedGames[active.id]?.mintAddress && (
                          <a
                            href={`https://explorer.solana.com/address/${completedGames[active.id]?.mintAddress}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full rounded-xl bg-green-600 px-6 py-3 text-sm font-medium text-white text-center hover:bg-green-500"
                          >
                            VIEW NFT →
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {showClaimModal && claimingGame && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => { if (mintStatus !== 'minting') { setShowClaimModal(false); setClaimingGame(null); } }}
              />
              <div className="relative w-full max-w-md rounded-2xl bg-[#111113] p-6 shadow-xl">
                <h3 className="text-lg font-semibold tracking-tight">Claim NFT Reward</h3>
                <p className="mt-2 text-sm text-zinc-400">You completed <span className="font-medium text-zinc-200">{claimingGame}</span>. Mint a commemorative devnet NFT.</p>
                <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-xs text-zinc-400">
                  Network: <span className="text-zinc-200">Solana Devnet</span>
                </div>
                {mintError && (
                  <div className="mt-3 rounded-lg bg-red-600/10 border border-red-600/40 p-3 text-xs text-red-300">
                    {mintError}
                  </div>
                )}
                <div className="mt-6 flex flex-col gap-3">
                  {mintStatus === 'success' && completedGames[claimingGame]?.mintAddress ? (
                    <a
                      href={`https://explorer.solana.com/address/${completedGames[claimingGame]?.mintAddress}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white text-center hover:bg-green-500"
                    >
                      View on Explorer →
                    </a>
                  ) : (
                    <button
                      disabled={mintStatus === 'minting'}
                      className="w-full rounded-xl bg-purple-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-purple-400 disabled:opacity-60 disabled:cursor-not-allowed"
                      type="button"
                      onClick={async () => {
                        if (!claimingGame) return;
                        setMintStatus('minting');
                        setMintError(null);
                        try {
                          // We assume walletAddress can be derived later; for now require userInfo not needed.
                          // The actual walletAddress not stored here; future enhancement: pass it from state.
                          // For now prompt user if unknown.
                          if (!walletAddress) {
                            setMintError('Wallet address unavailable. Connect wallet again.');
                            setMintStatus('error');
                            return;
                          }

                          // Dynamic import to avoid loading on initial page
                          const [{ clientMintGameNft }, web3js] = await Promise.all([
                            import('@/lib/metaplex/clientMintGameNft'),
                            import('@solana/web3.js')
                          ]);
                          const solanaWallet: any = (window as any).solanaWallet || (window as any).web3authSolanaWallet;
                          if (!solanaWallet || typeof solanaWallet.signTransaction !== 'function') {
                            setMintError('Solana wallet signer not found (web3auth).');
                            setMintStatus('error');
                            return;
                          }
                          // Resolve RPC endpoint with fallback to devnet
                          // Build prioritized RPC list (configured -> helius sender fast -> devnet public)
                          const primaryRaw = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || '';
                          const sanitize = (u: string) => u.trim().replace(/\s+/g, '').replace(/\/+$/,'');
                          const endpoints: string[] = [];
                          if (primaryRaw) endpoints.push(sanitize(primaryRaw));
                          // Add Helius sender fast endpoint only if not already primary and key present
                          const apiKeyMatch = primaryRaw.match(/api-key=([^&]+)/);
                          const key = apiKeyMatch?.[1];
                          if (key) {
                            const fast = 'https://sender.helius-rpc.com/fast';
                            if (!endpoints.includes(fast)) endpoints.push(fast);
                          }
                          const canonicalDevnet = 'https://api.devnet.solana.com';
                          if (!endpoints.includes(canonicalDevnet)) endpoints.push(canonicalDevnet);

                          let connection: any = null;
                          let selectedEndpoint: string | null = null;
                          let lastErr: any = null;
                          for (const ep of endpoints) {
                            try {
                              console.log('[mint][rpc-test] trying endpoint', ep);
                              const testConn = new web3js.Connection(ep, { commitment: 'confirmed' });
                              // Validate endpoint by requesting version (universal JSON-RPC method)
                              await testConn.getVersion();
                              selectedEndpoint = ep;
                              connection = testConn;
                              console.log('[mint][rpc-test] using endpoint', ep);
                              break;
                            } catch (e) {
                              console.warn('[mint][rpc-test] endpoint failed', ep, e);
                              lastErr = e;
                            }
                          }
                          if (!connection || !selectedEndpoint) {
                            setMintError(`All RPC endpoints failed (last error: ${lastErr?.message || lastErr}). Check network / API key.`);
                            setMintStatus('error');
                            return;
                          }
                          const sendAndConfirm: (tx: any) => Promise<string> = async (tx: any) => {
                            let serialized: Uint8Array | null = null;
                            // Primary path: use wallet's signTransaction
                            try {
                              const signed = await solanaWallet.signTransaction(tx);
                              serialized = signed.serialize();
                            } catch (e: any) {
                              const msg = e?.message || String(e);
                              console.warn('[mint][sign] wallet signTransaction failed – attempting manual fallback', msg);
                              // Fallback only for method not found / 404 style errors
                              if (/method not found/i.test(msg) || /404/.test(msg)) {
                                try {
                                  // Attempt to pull raw private key from provider (Web3Auth Solana method)
                                  if (!provider) throw new Error('Provider unavailable for manual signing');
                                  // Some Web3Auth versions expose solanaPrivateKey or private_key
                                  let privHex: string | null = null;
                                  try { privHex = await (provider as any).request({ method: 'solanaPrivateKey' }); } catch (pk1) {
                                    console.warn('[mint][sign-fallback] solanaPrivateKey request error', pk1);
                                  }
                                  if (!privHex) {
                                    try { privHex = await (provider as any).request({ method: 'private_key' }); } catch (pk2) {
                                      console.warn('[mint][sign-fallback] private_key request error', pk2);
                                    }
                                  }
                                  if (!privHex || typeof privHex !== 'string' || privHex.trim() === '') {
                                    throw new Error('Provider returned empty private key. Check Web3Auth Solana chain configuration.');
                                  }
                                  let seed: Buffer | null = null;
                                  const raw = privHex.trim();
                                  // Case 1: hex (32-byte seed)
                                  if (/^(0x)?[0-9a-fA-F]{64}$/.test(raw)) {
                                    const cleanHex = raw.replace(/^0x/, '');
                                    seed = Buffer.from(cleanHex, 'hex');
                                  } else {
                                    // Case 2: base58 Ed25519 secret or seed
                                    try {
                                      const { default: bs58 } = await import('bs58');
                                      const b58 = bs58.decode(raw);
                                      if (b58.length === 32) {
                                        seed = Buffer.from(b58);
                                      } else if (b58.length === 64) {
                                        // Some providers may return 64-byte secret key; take first 32 as seed
                                        seed = Buffer.from(b58.slice(0,32));
                                      }
                                    } catch (b58err) {
                                      console.warn('[mint][sign-fallback] base58 decode failed', b58err);
                                    }
                                    // Case 3: base64 (try decode)
                                    if (!seed) {
                                      try {
                                        const b64 = Buffer.from(raw, 'base64');
                                        if (b64.length === 32) seed = b64; else if (b64.length === 64) seed = b64.subarray(0,32);
                                      } catch (b64err) {
                                        console.warn('[mint][sign-fallback] base64 decode failed', b64err);
                                      }
                                    }
                                  }
                                  if (!seed || seed.length !== 32) {
                                    throw new Error('Private key not valid hex/base58/base64 32-byte seed (got length ' + (seed?.length ?? 0) + ')');
                                  }
                                  const nacl = await import('tweetnacl');
                                  const kp = nacl.sign.keyPair.fromSeed(seed);
                                  const secretKey = new Uint8Array([...seed, ...kp.publicKey]);
                                  const { Keypair } = await import('@solana/web3.js');
                                  const payerKeypair = Keypair.fromSecretKey(secretKey);
                                  // Ensure payer pubkey matches walletAddress for safety
                                  if (payerKeypair.publicKey.toBase58() !== walletAddress) {
                                    throw new Error('Derived key mismatch with wallet address');
                                  }
                                  // Use partialSign to append payer signature without discarding prior mint keypair partial signature
                                  try {
                                    tx.partialSign(payerKeypair);
                                  } catch (psErr) {
                                    console.warn('[mint][sign-fallback] partialSign error, retrying with full sign (may drop others)', psErr);
                                    tx.sign(payerKeypair);
                                  }
                                  try {
                                    const missing = tx.signatures.filter(s=>!s.signature).map(s=>s.publicKey.toBase58());
                                    if (missing.length) {
                                      console.warn('[mint][sign-fallback] still missing signatures for', missing);
                                    }
                                  } catch {}
                                  serialized = tx.serialize();
                                  console.log('[mint][sign-fallback] manual signing succeeded');
                                } catch (inner) {
                                  console.error('[mint][sign-fallback] failed', inner);
                                  throw new Error('Signing failed (wallet + fallback). ' + (inner as any).message);
                                }
                              } else {
                                throw e; // propagate non-method-not-found errors
                              }
                            }
                            if (!serialized) throw new Error('Transaction not signed');
                            let attempt = 0;
                            let sig: string = '';
                            const maxAttempts = 2;
                            while (attempt < maxAttempts) {
                              try {
                                sig = await connection.sendRawTransaction(serialized, { skipPreflight: false });
                                await connection.confirmTransaction(sig, 'confirmed');
                                if (!sig) throw new Error('Missing signature');
                                return sig;
                              } catch (e: any) {
                                console.warn('[mint][send] attempt failed', attempt + 1, e?.message || e);
                                if (attempt === maxAttempts - 1) throw e;
                                attempt++;
                              }
                            }
                            throw new Error('Failed to send transaction after retries');
                          };
                          const { mintAddress, metadataOk } = await clientMintGameNft({
                            connection,
                            walletPublicKey: walletAddress,
                            sendAndConfirm,
                            gameId: claimingGame
                          });
                          if (!metadataOk) {
                            console.warn('NFT metadata or master edition creation failed; minted bare token.');
                          }
                          const res = await authFetch('/api/mint-game-nft', {
                            method: 'POST',
                            body: JSON.stringify({ gameId: claimingGame, walletAddress, clientMint: true, mintAddress })
                          });
                          if (!res.ok) {
                            const txt = await res.text();
                            throw new Error(`Record failed: ${txt}`);
                          }
                          const data = await res.json();
                          setCompletedGames(prev => ({
                            ...prev,
                            [claimingGame]: {
                              ...(prev[claimingGame] || { completed: true, timestamp: Date.now() }),
                              mintAddress: data.mintAddress
                            }
                          }));
                          setMintStatus('success');
                        } catch (e: any) {
                          setMintError(e.message || 'Unknown error');
                          setMintStatus('error');
                        }
                      }}
                    >
                      {mintStatus === 'minting' ? 'Minting...' : 'Mint NFT'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { if (mintStatus !== 'minting') { setShowClaimModal(false); setClaimingGame(null); setMintStatus('idle'); setMintError(null);} }}
                    className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-700"
                  >
                    {mintStatus === 'success' ? 'Close' : 'Cancel'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function GameCard({
  game,
  index,
  large,
  onPlay,
  completed,
  minted,
  onClaim,
}: {
  game: GameItem;
  index: number;
  large?: boolean;
  onPlay: () => void;
  completed?: boolean;
  minted?: boolean;
  onClaim?: () => void;
}) {
  const img = game.image || "/placeholder.jpg";
  const category = game.category;

  return (
    <article
      className={cn(
        "relative isolate rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0))] p-5 text-zinc-100 shadow-[0_8px_40px_rgba(0,0,0,0.15),_0_0_0_1px_rgba(255,255,255,0.02)] transition-transform duration-300 hover:-translate-y-1",
        large ? "min-h-[220px]" : "min-h-[220px]"
      )}
    >
      <div className="absolute inset-0 rounded-2xl bg-zinc-950/60" />
      <div className="relative z-10 flex h-full flex-col">
        {/* Top Row: badge */}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em]",
              game.difficulty === "BEGINNER" &&
                "bg-green-500/10 text-green-300",
              game.difficulty === "INTERMEDIATE" &&
                "bg-yellow-500/10 text-yellow-300",
              game.difficulty === "ADVANCED" && "bg-red-500/10 text-red-300"
            )}
          >
            ● {game.difficulty}
          </span>
        </div>

        {/* Middle */}
        <div className="mt-4 flex items-start gap-4">
          <div className="relative h-20 w-20 shrink-0">
            <Image
              src={img}
              alt="game"
              fill
              sizes="80px"
              className="rounded-xl object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              {category}
            </div>
            <h4 className="mt-1 text-xl font-semibold tracking-tight">
              {game.title}
            </h4>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-auto flex items-center justify-between pt-6">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>{game.icon}</span>
            <span>Play Now</span>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-400"
              type="button"
              onClick={onPlay}
            >
              {completed ? 'PLAY' : 'PLAY →'}
            </button>
            {completed && !minted && (
              <button
                className="rounded-xl bg-purple-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-400"
                type="button"
                onClick={onClaim}
              >
                CLAIM NFT
              </button>
            )}
            {minted && (
              <span className="rounded-xl bg-green-600/20 px-3 py-2 text-xs font-medium text-green-400 border border-green-600/30">MINTED</span>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </article>
  );
}
