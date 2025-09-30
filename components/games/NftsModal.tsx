"use client";

import React from "react";
import Image from "next/image";

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

export default function NftsModal({ open, onClose, walletAddress, ownedNfts, ownedNftMetadata }: NftsModalProps) {
  // Track image loading state per mint so we can show a spinner until fully loaded
  const [imageLoading, setImageLoading] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    ownedNfts.forEach((n) => (initial[n.mintAddress] = true));
    return initial;
  });
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
  <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl bg-[#111113] p-10 shadow-2xl flex flex-col">
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
            className="grid gap-8 overflow-auto pr-2 mt-2"
            style={{ gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))" }}
          >
            {ownedNfts.map((nft) => (
              <div key={nft.mintAddress} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 flex flex-col gap-4 shadow-inner">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-zinc-800/40 flex items-center justify-center">
                  {ownedNftMetadata[nft.mintAddress]?.image && (
                    <>
                      {imageLoading[nft.mintAddress] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/30 backdrop-blur-sm">
                          <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-600 border-t-cyan-400" />
                        </div>
                      )}
                      <Image
                        src={ownedNftMetadata[nft.mintAddress].image as string}
                        alt={ownedNftMetadata[nft.mintAddress].name || "nft"}
                        fill
                        sizes="(max-width: 768px) 50vw, 240px"
                        className="object-contain p-2 transition-opacity duration-300 "
                        loading="lazy"
                        onLoadingComplete={() =>
                          setImageLoading((prev) => ({ ...prev, [nft.mintAddress]: false }))
                        }
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                          setImageLoading((prev) => ({ ...prev, [nft.mintAddress]: false }));
                        }}
                      />
                    </>
                  )}
                  {!ownedNftMetadata[nft.mintAddress]?.image && !ownedNftMetadata[nft.mintAddress]?.error && (
                    <div className="flex flex-col items-center gap-2 text-xs text-zinc-500">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-cyan-400" />
                      <span>Loading metadata…</span>
                    </div>
                  )}
                  {ownedNftMetadata[nft.mintAddress]?.error && (
                    <div className="text-[11px] text-red-400 px-2 text-center">Image error</div>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
