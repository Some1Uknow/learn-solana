"use client";

import React from "react";
import { authFetch } from "@/lib/auth/authFetch";

export interface ClaimNftModalProps {
  open: boolean;
  gameId: string;
  walletAddress: string | null;
  onClose: () => void;
  provider: any;
  setCompleted: (mintAddress: string) => void;
}

export default function ClaimNftModal({
  open,
  gameId,
  walletAddress,
  onClose,
  provider,
  setCompleted,
}: ClaimNftModalProps) {
  const [mintStatus, setMintStatus] = React.useState<
    "idle" | "minting" | "success" | "error"
  >("idle");
  const [mintError, setMintError] = React.useState<string | null>(null);
  const [balance, setBalance] = React.useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = React.useState<boolean>(false);

  // Fetch devnet balance when modal opens and wallet is available
  React.useEffect(() => {
    let cancelled = false;
    async function loadBalance() {
      if (!open || !walletAddress) return;
      try {
        setLoadingBalance(true);
        const web3js = await import("@solana/web3.js");
        const endpoint =
          (process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "").trim() ||
          "https://api.devnet.solana.com";
        const connection = new web3js.Connection(endpoint, {
          commitment: "confirmed",
        });
        const pk = new web3js.PublicKey(walletAddress);
        const lamports = await connection.getBalance(pk, { commitment: "confirmed" });
        if (!cancelled) setBalance(lamports / web3js.LAMPORTS_PER_SOL);
      } catch (e) {
        if (!cancelled) setBalance(null);
      } finally {
        if (!cancelled) setLoadingBalance(false);
      }
    }
    loadBalance();
    const interval = setInterval(loadBalance, 15000); // refresh every 15s while open
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [open, walletAddress]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => {
          if (mintStatus !== "minting") onClose();
        }}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-[#111113] p-6 shadow-xl">
        <h3 className="text-lg font-semibold tracking-tight">
          Claim NFT Reward
        </h3>
        <p className="mt-2 text-sm text-zinc-400">
          You completed{" "}
          <span className="font-medium text-zinc-200">{gameId}</span>. Mint a
          commemorative devnet NFT.
        </p>
        <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-xs text-zinc-400">
          Network: <span className="text-zinc-200">Solana Devnet</span>
          {walletAddress && (
            <>
              <span className="mx-2 text-zinc-600">|</span>
              Balance: {loadingBalance ? (
                <span className="text-zinc-500">loading...</span>
              ) : balance != null ? (
                <span className={balance < 0.01 ? "text-amber-400" : "text-zinc-200"}>
                  {balance.toFixed(3)} SOL
                </span>
              ) : (
                <span className="text-zinc-500">n/a</span>
              )}
            </>
          )}
        </div>
        <div className="mt-4 rounded-lg border border-amber-600/40 bg-amber-900/20 p-4 text-xs leading-relaxed text-amber-200">
          <p className="font-medium mb-1">Before Minting: Fund Your Devnet Wallet</p>
          <p className="mb-2 text-amber-100/90">
            You need a small amount of devnet SOL to pay network fees (usually &lt; 0.01 SOL per mint). If your balance is low
            {balance != null && balance < 0.01 ? (
              <span> (currently below recommended) </span>
            ) : (
              <span> </span>
            )}
            request some free tokens using a faucet. These tokens have no real value.
          </p>
          <ul className="list-disc pl-4 space-y-1 text-amber-100/90">
            <li>
              Official Solana Faucet: {""}
              <a
                className="underline hover:text-amber-50"
                href="https://faucet.solana.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                faucet.solana.com
              </a>
            </li>
            <li>
              Alternate UI Faucet: {""}
              <a
                className="underline hover:text-amber-50"
                href="https://solfaucet.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                solfaucet.com
              </a>
            </li>
            <li>
              CLI (installed Solana CLI): <code className="rounded bg-black/30 px-1 py-0.5">solana airdrop 2</code>
            </li>
          </ul>
          <details className="mt-2">
            <summary className="cursor-pointer text-amber-300 hover:text-amber-200">Show Quick Tutorial</summary>
            <ol className="mt-2 list-decimal pl-5 space-y-1 text-amber-100/80">
              <li>Copy your wallet address (it&apos;s connected via Web3Auth).</li>
              <li>Open one of the faucet links above in a new tab.</li>
              <li>Paste your address and request 1–2 SOL (don&apos;t request excessive amounts).</li>
              <li>Wait a few seconds, then come back here; the balance auto-refreshes every 15s or click Close and reopen.</li>
              <li>Once you have &gt;= 0.01 SOL, click Mint NFT.</li>
            </ol>
          </details>
          <p className="mt-2 text-amber-300/80">
            Tip: If a faucet rate limits you, try again later or use the CLI airdrop command.
          </p>
        </div>
        {mintError && (
          <div className="mt-3 rounded-lg bg-red-600/10 border border-red-600/40 p-3 text-xs text-red-300">
            {mintError}
          </div>
        )}
        <div className="mt-6 flex flex-col gap-3">
          {mintStatus === "success" ? (
            <button
              type="button"
              className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-500"
              onClick={onClose}
            >
              Close
            </button>
          ) : (
            <button
              disabled={mintStatus === "minting"}
              className="w-full rounded-xl bg-purple-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-purple-400 disabled:opacity-60 disabled:cursor-not-allowed"
              type="button"
              onClick={async () => {
                setMintStatus("minting");
                setMintError(null);
                try {
                  if (!walletAddress) {
                    setMintError(
                      "Wallet address unavailable. Connect wallet again."
                    );
                    setMintStatus("error");
                    return;
                  }

                  const [{ clientMintGameNft }, web3js] = await Promise.all([
                    import("@/lib/metaplex/clientMintGameNft"),
                    import("@solana/web3.js"),
                  ]);
                  let solanaWallet: any =
                    (window as any).solanaWallet ||
                    (window as any).web3authSolanaWallet;
                  if (!solanaWallet && provider) {
                    try {
                      const mod = await import("@web3auth/solana-provider");
                      solanaWallet = new (mod as any).SolanaWallet(provider);
                      (window as any).web3authSolanaWallet = solanaWallet;
                    } catch {}
                  }
                  if (
                    !solanaWallet ||
                    typeof solanaWallet.signTransaction !== "function"
                  ) {
                    setMintError("Solana wallet signer not found (web3auth).");
                    setMintStatus("error");
                    return;
                  }
                  const primaryRaw =
                    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "";
                  const sanitize = (u: string) =>
                    u.trim().replace(/\s+/g, "").replace(/\/+$/, "");
                  const endpoints: string[] = [];
                  if (primaryRaw) endpoints.push(sanitize(primaryRaw));
                  const apiKeyMatch = primaryRaw.match(/api-key=([^&]+)/);
                  const key = apiKeyMatch?.[1];
                  if (key) {
                    const fast = "https://sender.helius-rpc.com/fast";
                    if (!endpoints.includes(fast)) endpoints.push(fast);
                  }
                  const canonicalDevnet = "https://api.devnet.solana.com";
                  if (!endpoints.includes(canonicalDevnet))
                    endpoints.push(canonicalDevnet);

                  let connection: any = null;
                  let lastErr: any = null;
                  for (const ep of endpoints) {
                    try {
                      const testConn = new web3js.Connection(ep, {
                        commitment: "confirmed",
                      });
                      await testConn.getVersion();
                      connection = testConn;
                      break;
                    } catch (e) {
                      lastErr = e;
                    }
                  }
                  if (!connection) {
                    setMintError(
                      `All RPC endpoints failed (last error: ${
                        lastErr?.message || lastErr
                      }). Check network / API key.`
                    );
                    setMintStatus("error");
                    return;
                  }

                  const sendAndConfirm = async (tx: any): Promise<string> => {
                    // Prefer signAndSendTransaction for broader adapter support (WalletConnect/Phantom via Web3Auth)
                    try {
                      if (
                        typeof (solanaWallet as any).signAndSendTransaction ===
                        "function"
                      ) {
                        // Ensure mintKeypair partial signature is already present (done upstream)
                        const result = await (
                          solanaWallet as any
                        ).signAndSendTransaction(tx);
                        const sig =
                          typeof result === "string"
                            ? result
                            : result?.signature ||
                              result?.result ||
                              result?.txid;
                        if (typeof sig === "string" && sig.length > 0) {
                          // Best-effort confirmation
                          try {
                            await connection.confirmTransaction(
                              sig,
                              "confirmed"
                            );
                          } catch {}
                          return sig;
                        }
                      }
                    } catch (e: any) {
                      const msg = e?.message || String(e);
                      // Some adapters throw generic "Response has no error or result for request"; fall through to signTransaction path
                      if (
                        !/Response has no error or result for request/i.test(
                          msg
                        )
                      ) {
                        // For other errors, continue to alternate paths
                      }
                    }

                    // Fallback: signTransaction then sendRawTransaction
                    let serialized: Uint8Array | null = null;
                    try {
                      if (typeof solanaWallet.signTransaction === "function") {
                        const signed = await solanaWallet.signTransaction(tx);
                        serialized = signed.serialize();
                      } else {
                        throw new Error(
                          "signTransaction not supported by wallet"
                        );
                      }
                    } catch (e: any) {
                      const msg = e?.message || String(e);
                      // Try provider.request based signAndSend as another variant
                      try {
                        if (
                          provider &&
                          typeof (provider as any).request === "function"
                        ) {
                          // Prepare serialized message without requiring all signatures (payer will be added by wallet)
                          const raw = tx.serialize({
                            requireAllSignatures: false,
                          });
                          const base64 =
                            typeof Buffer !== "undefined"
                              ? Buffer.from(raw).toString("base64")
                              : btoa(String.fromCharCode(...raw));
                          const candidates = [
                            {
                              method: "solana_signAndSendTransaction",
                              params: { message: base64 },
                            },
                            {
                              method: "signAndSendTransaction",
                              params: { message: base64 },
                            },
                            {
                              method: "solana_sendTransaction",
                              params: { message: base64 },
                            },
                          ];
                          for (const c of candidates) {
                            try {
                              const res = await (provider as any).request({
                                method: c.method,
                                params: c.params,
                              });
                              const sig =
                                typeof res === "string"
                                  ? res
                                  : res?.signature || res?.result || res?.txid;
                              if (typeof sig === "string" && sig.length > 0) {
                                try {
                                  await connection.confirmTransaction(
                                    sig,
                                    "confirmed"
                                  );
                                } catch {}
                                return sig;
                              }
                            } catch (inner) {
                              // try next candidate
                            }
                          }
                        }
                      } catch {
                        // ignore and continue to manual fallback
                      }

                      if (
                        /method not found/i.test(msg) ||
                        /404/.test(msg) ||
                        /not supported/i.test(msg)
                      ) {
                        // Manual fallback: only works for embedded Web3Auth (not external wallets)
                        try {
                          if (!provider)
                            throw new Error(
                              "Provider unavailable for manual signing"
                            );
                          let privHex: string | null = null;
                          try {
                            privHex = await (provider as any).request({
                              method: "solanaPrivateKey",
                            });
                          } catch {}
                          if (!privHex) {
                            try {
                              privHex = await (provider as any).request({
                                method: "private_key",
                              });
                            } catch {}
                          }
                          if (
                            !privHex ||
                            typeof privHex !== "string" ||
                            privHex.trim() === ""
                          ) {
                            throw new Error(
                              "Provider returned empty private key. External wallets do not expose keys; try a social login or Web3Auth embedded."
                            );
                          }
                          let seed: Buffer | null = null;
                          const raw = privHex.trim();
                          if (/^(0x)?[0-9a-fA-F]{64}$/.test(raw)) {
                            const cleanHex = raw.replace(/^0x/, "");
                            seed = Buffer.from(cleanHex, "hex");
                          } else {
                            try {
                              const { default: bs58 } = await import("bs58");
                              const b58 = bs58.decode(raw);
                              if (b58.length === 32) seed = Buffer.from(b58);
                              else if (b58.length === 64)
                                seed = Buffer.from(b58.slice(0, 32));
                            } catch {}
                            if (!seed) {
                              try {
                                const b64 = Buffer.from(raw, "base64");
                                if (b64.length === 32) seed = b64;
                                else if (b64.length === 64)
                                  seed = b64.subarray(0, 32);
                              } catch {}
                            }
                          }
                          if (!seed || seed.length !== 32) {
                            throw new Error(
                              "Private key not valid hex/base58/base64 32-byte seed (got length " +
                                (seed?.length ?? 0) +
                                ")"
                            );
                          }
                          const nacl = await import("tweetnacl");
                          const kp = nacl.sign.keyPair.fromSeed(seed);
                          const secretKey = new Uint8Array([
                            ...seed,
                            ...kp.publicKey,
                          ]);
                          const { Keypair } = await import("@solana/web3.js");
                          const payerKeypair = Keypair.fromSecretKey(secretKey);
                          if (
                            payerKeypair.publicKey.toBase58() !== walletAddress
                          ) {
                            throw new Error(
                              "Derived key mismatch with wallet address"
                            );
                          }
                          try {
                            tx.partialSign(payerKeypair);
                          } catch {
                            tx.sign(payerKeypair);
                          }
                          serialized = tx.serialize();
                        } catch (inner) {
                          throw new Error(
                            "Signing failed (wallet + fallback). " +
                              (inner as any).message
                          );
                        }
                      } else {
                        throw e;
                      }
                    }
                    if (!serialized) throw new Error("Transaction not signed");
                    const sig = await connection.sendRawTransaction(
                      serialized,
                      { skipPreflight: false }
                    );
                    await connection.confirmTransaction(sig, "confirmed");
                    return sig;
                  };

                  const { mintAddress } = await clientMintGameNft({
                    connection,
                    walletPublicKey: walletAddress,
                    sendAndConfirm,
                    gameId,
                  });

                  const res = await authFetch("/api/mint-game-nft", {
                    method: "POST",
                    body: JSON.stringify({
                      gameId,
                      walletAddress,
                      clientMint: true,
                      mintAddress,
                    }),
                  });
                  if (!res.ok) {
                    const txt = await res.text();
                    throw new Error(`Record failed: ${txt}`);
                  }
                  setCompleted(mintAddress);
                  setMintStatus("success");
                } catch (e: any) {
                  setMintError(e.message || "Unknown error");
                  setMintStatus("error");
                }
              }}
            >
              {mintStatus === "minting" ? "Minting..." : "Mint NFT"}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (mintStatus !== "minting") onClose();
            }}
            className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-700"
          >
            {mintStatus === "success" ? "Close" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
