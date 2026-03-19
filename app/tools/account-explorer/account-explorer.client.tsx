"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { BlurFade } from "@/components/ui/blur-fade";
import { BreadcrumbSchema } from "@/components/seo";

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
  { name: "Account Explorer", url: "/tools/account-explorer" },
];

const accounts = [
  {
    id: "wallet",
    name: "Wallet Account",
    type: "System Account",
    owner: "System Program",
    lamports: "2.45 SOL",
    dataSize: "0 bytes",
    description: "Stores SOL balance and pays transaction fees.",
    fields: [
      { label: "Owner", value: "11111111111111111111111111111111", tip: "System Program" },
      { label: "Signer", value: "Yes", tip: "The wallet signs transactions." },
      { label: "Writable", value: "Yes", tip: "Balance changes when you pay fees." },
    ],
  },
  {
    id: "program",
    name: "Program State",
    type: "Program Account",
    owner: "Your Program",
    lamports: "0.18 SOL",
    dataSize: "128 bytes",
    description: "Holds custom state for your program.",
    fields: [
      { label: "Owner", value: "Program ID", tip: "Only the program can write to it." },
      { label: "Rent", value: "Exempt", tip: "Minimum balance to stay alive." },
      { label: "Bump", value: "255", tip: "PDA bump used in seeds." },
    ],
  },
  {
    id: "mint",
    name: "Token Mint",
    type: "SPL Mint",
    owner: "Token Program",
    lamports: "0.08 SOL",
    dataSize: "82 bytes",
    description: "Defines token supply and mint authority.",
    fields: [
      { label: "Decimals", value: "9", tip: "Token precision." },
      { label: "Mint Authority", value: "Wallet A", tip: "Who can mint more tokens." },
      { label: "Supply", value: "1,000,000", tip: "Total minted so far." },
    ],
  },
  {
    id: "token-account",
    name: "Token Account",
    type: "SPL Token Account",
    owner: "Token Program",
    lamports: "0.04 SOL",
    dataSize: "165 bytes",
    description: "Holds a wallet's token balance.",
    fields: [
      { label: "Owner", value: "Wallet A", tip: "Who controls the tokens." },
      { label: "Mint", value: "Token Mint", tip: "Which token this account holds." },
      { label: "Amount", value: "42", tip: "Current token balance." },
    ],
  },
];

export function AccountExplorerClient() {
  const [activeId, setActiveId] = useState(accounts[0]?.id ?? "wallet");
  const [activeFieldIndex, setActiveFieldIndex] = useState(0);
  const activeAccount = accounts.find((account) => account.id === activeId) ?? accounts[0];
  const activeField = activeAccount.fields[activeFieldIndex] ?? activeAccount.fields[0];

  useEffect(() => {
    setActiveFieldIndex(0);
  }, [activeId]);

  return (
    <div className="min-h-screen w-full relative text-white">
      <BreadcrumbSchema items={breadcrumbItems} />
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(circle 500px at 40% 10%, rgba(153, 69, 255, 0.12), transparent),
            radial-gradient(circle 450px at 85% 40%, rgba(34, 211, 238, 0.1), transparent),
            radial-gradient(circle 400px at 15% 80%, rgba(20, 241, 149, 0.08), transparent),
            #000000
          `,
        }}
      />

      <Navbar />

      <div className="pt-28 pb-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <BlurFade delay={0.05} inView>
            <nav className="text-sm text-zinc-400 mb-8" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#14f195] transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/tools" className="hover:text-[#14f195] transition-colors">
                Tools
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">Account Explorer</span>
            </nav>
          </BlurFade>

          <BlurFade delay={0.1} inView>
            <div className="mb-10">
              <div className="text-xs tracking-[0.25em] text-[#14f195] uppercase font-medium">[BEGINNER MODE]</div>
              <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                Account Explorer
              </h1>
              <p className="mt-4 text-lg text-zinc-300 max-w-3xl">
                Click through common Solana accounts and learn what each field means in plain language.
              </p>
            </div>
          </BlurFade>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <BlurFade delay={0.15} inView>
              <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
                <h2 className="text-lg font-semibold text-white">Account Types</h2>
                <p className="mt-2 text-xs text-zinc-400">Pick an account to explore its fields.</p>

                <div className="mt-6 space-y-3">
                  {accounts.map((account) => (
                    <button
                      key={account.id}
                      onClick={() => setActiveId(account.id)}
                      className={`w-full text-left rounded-2xl border px-4 py-4 transition ${
                        account.id === activeId
                          ? "border-[#14f195]/50 bg-[#14f195]/10"
                          : "border-white/10 bg-black/40 hover:border-white/30"
                      }`}
                    >
                      <div className="text-xs uppercase tracking-[0.2em] text-white/50">{account.type}</div>
                      <div className="mt-1 text-base font-semibold text-white">{account.name}</div>
                      <p className="mt-2 text-xs text-white/60">{account.description}</p>
                    </button>
                  ))}
                </div>
              </section>
            </BlurFade>

            <BlurFade delay={0.2} inView>
              <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
                <h2 className="text-lg font-semibold text-white">Account Details</h2>
                <p className="mt-2 text-xs text-zinc-400">Live breakdown of the selected account.</p>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-black/60 px-4 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-white/50">Account Lens</div>
                        <div className="mt-2 text-lg font-semibold text-white">{activeAccount.name}</div>
                        <p className="mt-1 text-xs text-white/60">{activeAccount.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-white/50">
                        <span className="rounded-full border border-white/10 px-2 py-1">{activeAccount.type}</span>
                        <span className="rounded-full border border-[#14f195]/30 bg-[#14f195]/10 px-2 py-1 text-[#14f195]">
                          {activeAccount.owner}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-3 text-xs text-white/70">
                        <div className="text-white/50">Lamports</div>
                        <div className="mt-1 text-sm text-white">{activeAccount.lamports}</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-3 text-xs text-white/70">
                        <div className="text-white/50">Data size</div>
                        <div className="mt-1 text-sm text-white">{activeAccount.dataSize}</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-3 text-xs text-white/70">
                        <div className="text-white/50">Write access</div>
                        <div className="mt-1 text-sm text-white">Owner controlled</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/50">Field Breakdown</div>
                    <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                      <div className="space-y-2">
                        {activeAccount.fields.map((field, index) => (
                          <button
                            key={field.label}
                            onClick={() => setActiveFieldIndex(index)}
                            className={`w-full rounded-xl border px-3 py-2 text-left text-xs transition ${
                              index === activeFieldIndex
                                ? "border-[#14f195]/60 bg-[#14f195]/10 text-[#14f195]"
                                : "border-white/10 bg-black/40 text-white/60 hover:border-white/30"
                            }`}
                          >
                            <div className="font-semibold text-white">{field.label}</div>
                            <div className="text-white/50">{field.value}</div>
                          </button>
                        ))}
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/60 px-4 py-4 text-xs text-white/70">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Selected Field</div>
                        <div className="mt-2 text-sm text-white">{activeField?.label}</div>
                        <div className="mt-2 text-white/80">{activeField?.value}</div>
                        <div className="mt-2 text-white/50">{activeField?.tip}</div>
                        <div className="mt-4 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full w-2/3 bg-gradient-to-r from-[#14f195] via-[#38bdf8] to-[#14f195] animate-flow" />
                        </div>
                        <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
                          Visual emphasis
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/50">Data Layout Preview</div>
                    <p className="mt-2 text-xs text-white/60">
                      Visualize how bytes are packed inside the account data buffer.
                    </p>
                    <div className="mt-4 grid grid-cols-12 gap-1">
                      {Array.from({ length: 36 }).map((_, index) => (
                        <div
                          key={`byte-${index}`}
                          className={`h-4 rounded-sm ${
                            index % 5 === 0 ? "bg-[#14f195]/60" : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/40">
                      Highlighted bytes = key fields
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4 text-xs text-white/70">
                    Tip: Account owners decide who can write data. If the owner doesn’t match your program, Anchor will
                    reject the instruction.
                  </div>
                </div>
              </section>
            </BlurFade>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountExplorerClient;
