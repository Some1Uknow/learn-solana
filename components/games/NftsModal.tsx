"use client";

import React from "react";
import Image from "next/image";
import { Connection } from "@solana/web3.js";
import { fetchManyNftMetadata } from "@/lib/solana/fetchNftMetadata";

export interface OwnedNftRecord {
  gameId: string;
  mintAddress: string;
  createdAt: string;
}

export interface NftsModalProps {
  open: boolean;
  onClose: () => void;
  walletAddress: string | null;
  ownedNfts: OwnedNftRecord[];
  ownedNftMetadata: Record<string, { image?: string; name?: string; symbol?: string; error?: string }>;
  setOwnedNftMetadata: React.Dispatch<React.SetStateAction<Record<string, { image?: string; name?: string; symbol?: string; error?: string }>>>;
}

export default function NftsModal({ open, onClose, walletAddress, ownedNfts, ownedNftMetadata, setOwnedNftMetadata }: NftsModalProps) {
  const [nftRefreshing, setNftRefreshing] = React.useState<Record<string, boolean>>({});
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl bg-[#111113] p-6 shadow-xl flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold tracking-tight">Your Game NFTs</h3>
          <button onClick={onClose} className="rounded-lg bg:white/5 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10">
            Close
          </button>
        </div>
        {!walletAddress && <div className="text-sm text-zinc-400">Connect wallet to view NFTs.</div>}
        {walletAddress && ownedNfts.length === 0 && (
          <div className="text-sm text-zinc-400">No NFTs minted yet. Play a game and claim your first reward!</div>
        )}
        {walletAddress && ownedNfts.length > 0 && (
          <div
            className="grid gap-4 overflow-auto pr-2 mt-1"
            style={{ gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))" }}
          >
            {ownedNfts.map((nft) => (
              <div key={nft.mintAddress} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 flex flex-col gap-2">
                <div className="relative w-full h-28 rounded-md overflow-hidden bg-zinc-800/40 flex items-center justify-center text-[10px] text-zinc-500">
                  {ownedNftMetadata[nft.mintAddress]?.image ? (
                    <Image
                      src={ownedNftMetadata[nft.mintAddress].image as string}
                      alt={ownedNftMetadata[nft.mintAddress].name || "nft"}
                      className="object-cover w-full h-full"
                      width={1024}
                      height={1024}
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : ownedNftMetadata[nft.mintAddress]?.error ? (
                    <span>Error</span>
                  ) : (
                    <span>Loading…</span>
                  )}
                </div>
                <div className="text-xs uppercase tracking-wider text-zinc-500 truncate">{nft.gameId}</div>
                <div className="text-[11px] break-all font-mono text-zinc-300">
                  {nft.mintAddress.slice(0, 8)}…{nft.mintAddress.slice(-6)}
                </div>
                <a
                  href={`https://explorer.solana.com/address/${nft.mintAddress}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto text-xs text-cyan-400 hover:underline"
                >
                  Explorer →
                </a>
                <button
                  className="mt-1 rounded-lg bg-white/5 px-2 py-1 text:[11px] text-zinc-300 hover:bg-white/10 disabled:opacity-50"
                  disabled={!!nftRefreshing[nft.mintAddress]}
                  onClick={async () => {
                    setNftRefreshing((prev) => ({ ...prev, [nft.mintAddress]: true }));
                    try {
                      const connection = new Connection("https://api.devnet.solana.com");
                      const metas = await fetchManyNftMetadata(connection, [nft.mintAddress], { forceRefresh: true });
                      setOwnedNftMetadata((prev) => ({
                        ...prev,
                        [nft.mintAddress]: {
                          image: metas[0]?.image,
                          name: metas[0]?.name,
                          symbol: metas[0]?.symbol,
                          error: metas[0]?.error,
                        },
                      }));
                    } catch (e) {
                      console.warn("[games] manual refresh failed", e);
                    } finally {
                      setNftRefreshing((prev) => ({ ...prev, [nft.mintAddress]: false }));
                    }
                  }}
                >
                  {nftRefreshing[nft.mintAddress] ? "Refreshing…" : "Refresh image"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
