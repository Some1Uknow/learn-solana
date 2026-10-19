"use client";

import { useEffect, useId, useState } from "react";
import {
  generateKeyPair,
  getAddressEncoder,
  getAddressFromPublicKey,
  getProgramDerivedAddress,
  isAddress,
  type ReadonlyUint8Array,
} from "@solana/kit";
import { cn } from "@/lib/utils";

type Seed = { kind: "string" | "pubkey"; value: string };
type Derived = { pda: string; bump: number } | { error: string };

// Placeholder program id that older `anchor init` templates shipped with.
const DEFAULT_PROGRAM_ID = "Fg6PaFpoGXkYsidMpWTK6W2BcZ7FEfcYkg476zPFsLnS";
const DEFAULT_SEEDS: Seed[] = [
  { kind: "string", value: "profile" },
  { kind: "pubkey", value: "JVdDvPipFionfYg4LoSTSK9FZwnfKTvkLUJ3tb5tDKs" },
];

async function derive(programId: string, seeds: Seed[]): Promise<Derived> {
  if (!isAddress(programId)) {
    return { error: "Program ID is not a valid base58 address." };
  }
  const seedBytes: ReadonlyUint8Array[] = [];
  for (const seed of seeds) {
    if (seed.kind === "pubkey") {
      if (!isAddress(seed.value)) {
        return { error: "Authority is not a valid base58 public key." };
      }
      seedBytes.push(getAddressEncoder().encode(seed.value));
    } else {
      const bytes = new TextEncoder().encode(seed.value);
      if (bytes.length > 32) {
        return { error: "A single seed can be at most 32 bytes." };
      }
      seedBytes.push(bytes);
    }
  }
  const [pda, bump] = await getProgramDerivedAddress({
    programAddress: programId,
    seeds: seedBytes,
  });
  return { pda, bump };
}

const inputClass =
  "w-full rounded-lg border border-fd-border bg-fd-background px-3 py-2 font-mono text-[13px] text-fd-foreground outline-none focus:border-fd-primary";
const buttonClass =
  "rounded-lg border border-fd-border bg-fd-background px-3 py-1.5 text-xs font-medium text-fd-foreground transition-colors hover:bg-fd-muted";

export function PdaPlayground() {
  const [programId, setProgramId] = useState(DEFAULT_PROGRAM_ID);
  const [seeds, setSeeds] = useState(DEFAULT_SEEDS);
  const [result, setResult] = useState<Derived | null>(null);
  const [originalPda, setOriginalPda] = useState<string | null>(null);
  const id = useId();

  useEffect(() => {
    let cancelled = false;
    derive(programId, seeds)
      .catch((): Derived => ({ error: "These seeds cannot produce a PDA." }))
      .then((derived) => {
        if (cancelled) return;
        setResult(derived);
        if ("pda" in derived && programId === DEFAULT_PROGRAM_ID && seeds === DEFAULT_SEEDS) {
          setOriginalPda(derived.pda);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [programId, seeds]);

  const updateSeed = (index: number, value: string) =>
    setSeeds((current) =>
      current.map((seed, i) => (i === index ? { ...seed, value } : seed))
    );

  const randomAuthority = async () => {
    try {
      const { publicKey } = await generateKeyPair();
      const value = await getAddressFromPublicKey(publicKey);
      setSeeds((current) =>
        current.map((seed) => (seed.kind === "pubkey" ? { ...seed, value } : seed))
      );
    } catch {
      setResult({ error: "This browser cannot generate Ed25519 keys." });
    }
  };

  const reset = () => {
    setProgramId(DEFAULT_PROGRAM_ID);
    setSeeds(DEFAULT_SEEDS);
  };

  const seedExpression = seeds
    .map((seed) =>
      seed.kind === "string" ? `b"${seed.value}"` : "authority.key().as_ref()"
    )
    .join(", ");
  const pda = result && "pda" in result ? result.pda : null;
  const matchesOriginal = pda !== null && pda === originalPda;

  return (
    <section className="ls-pda-playground not-prose my-8 overflow-hidden rounded-xl border border-fd-border bg-fd-card text-fd-foreground">
      <div className="flex flex-wrap items-center gap-2 border-b border-fd-border px-5 py-4">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-fd-muted-foreground">
          Try it: derive a PDA
        </span>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => setSeeds((current) => [...current].reverse())}
            className={buttonClass}
          >
            Swap seed order
          </button>
          <button type="button" onClick={reset} className={buttonClass}>
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-fd-muted-foreground">Program ID</span>
          <input
            value={programId}
            onChange={(event) => setProgramId(event.target.value.trim())}
            spellCheck={false}
            className={inputClass}
          />
        </label>

        {seeds.map((seed, index) => (
          <div key={seed.kind} className="space-y-1.5">
            <div className="flex items-center gap-2">
              <label
                htmlFor={`${id}-${seed.kind}`}
                className="text-xs font-medium text-fd-muted-foreground"
              >
                Seed {index + 1}:{" "}
                {seed.kind === "string" ? "namespace (UTF-8 string)" : "authority (public key)"}
              </label>
              {seed.kind === "pubkey" && (
                <button
                  type="button"
                  onClick={randomAuthority}
                  className={cn(buttonClass, "ml-auto py-1")}
                >
                  Random user
                </button>
              )}
            </div>
            <input
              id={`${id}-${seed.kind}`}
              value={seed.value}
              onChange={(event) =>
                updateSeed(
                  index,
                  seed.kind === "pubkey" ? event.target.value.trim() : event.target.value
                )
              }
              spellCheck={false}
              className={inputClass}
            />
          </div>
        ))}

        <div className="rounded-lg bg-fd-muted px-3 py-3" aria-live="polite">
          <div className="font-mono text-xs text-fd-muted-foreground break-all">
            seeds = [{seedExpression}]
          </div>
          {result && "error" in result ? (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400">{result.error}</div>
          ) : (
            <>
              <div className="mt-2 font-mono text-sm text-fd-foreground break-all">
                {pda ?? "Deriving..."}
              </div>
              <div className="mt-1 text-xs text-fd-muted-foreground">
                bump: {result && "bump" in result ? result.bump : "-"}
              </div>
            </>
          )}
          {pda && originalPda && (
            <div
              className={cn(
                "mt-2 text-xs font-medium",
                matchesOriginal ? "text-fd-primary" : "text-amber-700 dark:text-amber-400"
              )}
            >
              {matchesOriginal
                ? "Same inputs as the starting example, so the same address."
                : "Inputs changed, so the address changed. Reset to get the original back."}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-fd-border px-5 py-3 text-xs text-fd-muted-foreground">
        Example based on a{" "}
        <a
          href="https://plgrnd.io"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-fd-foreground"
        >
          PLGRND
        </a>{" "}
        flow.
      </div>
    </section>
  );
}
