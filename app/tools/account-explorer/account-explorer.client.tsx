"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
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
    <div className="min-h-screen w-full bg-black text-white">
      <BreadcrumbSchema items={breadcrumbItems} />
      <Navbar />

      <div className="pt-28 pb-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <nav className="text-sm text-neutral-400 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2 text-neutral-600">/</span>
            <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
            <span className="mx-2 text-neutral-600">/</span>
            <span className="text-white">Account Explorer</span>
          </nav>

          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-[#14f195] mb-3">Beginner Mode</p>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">Account Explorer</h1>
            <p className="text-lg text-neutral-400 max-w-2xl">
              Click through common Solana accounts and learn what each field means in plain language.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-6">
              <h2 className="font-medium text-white mb-1">Account Types</h2>
              <p className="text-sm text-neutral-500 mb-6">Pick an account to explore its fields.</p>
              <div className="space-y-3">
                {accounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => setActiveId(account.id)}
                    className={`w-full text-left rounded-lg border p-4 transition ${
                      account.id === activeId
                        ? "border-[#14f195]/50 bg-[#14f195]/5"
                        : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700"
                    }`}
                  >
                    <span className="text-xs text-neutral-500 uppercase tracking-wider">{account.type}</span>
                    <h3 className="font-medium text-white mt-1">{account.name}</h3>
                    <p className="text-sm text-neutral-500 mt-1">{account.description}</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-6">
              <h2 className="font-medium text-white mb-1">Account Details</h2>
              <p className="text-sm text-neutral-500 mb-6">Live breakdown of the selected account.</p>

              <div className="space-y-4">
                <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <span className="text-xs text-neutral-500 uppercase tracking-wider">Account Lens</span>
                      <h3 className="font-medium text-white mt-1">{activeAccount.name}</h3>
                      <p className="text-sm text-neutral-500 mt-1">{activeAccount.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-neutral-400">{activeAccount.type}</span>
                      <span className="rounded border border-[#14f195]/30 bg-[#14f195]/10 px-2 py-1 text-[#14f195]">{activeAccount.owner}</span>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3">
                      <span className="text-xs text-neutral-500">Lamports</span>
                      <p className="text-sm text-white mt-1">{activeAccount.lamports}</p>
                    </div>
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3">
                      <span className="text-xs text-neutral-500">Data size</span>
                      <p className="text-sm text-white mt-1">{activeAccount.dataSize}</p>
                    </div>
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3">
                      <span className="text-xs text-neutral-500">Write access</span>
                      <p className="text-sm text-white mt-1">Owner controlled</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Field Breakdown</span>
                  <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="space-y-2">
                      {activeAccount.fields.map((field, index) => (
                        <button
                          key={field.label}
                          onClick={() => setActiveFieldIndex(index)}
                          className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                            index === activeFieldIndex
                              ? "border-[#14f195]/50 bg-[#14f195]/5 text-[#14f195]"
                              : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700"
                          }`}
                        >
                          <span className="font-medium text-white">{field.label}</span>
                          <span className="block text-neutral-500 text-xs mt-0.5">{field.value}</span>
                        </button>
                      ))}
                    </div>
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
                      <span className="text-xs text-neutral-500 uppercase tracking-wider">Selected Field</span>
                      <h4 className="font-medium text-white mt-2">{activeField?.label}</h4>
                      <p className="text-sm text-neutral-400 mt-1">{activeField?.value}</p>
                      <p className="text-sm text-neutral-500 mt-2">{activeField?.tip}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Data Layout Preview</span>
                  <p className="text-sm text-neutral-500 mt-1">Visualize how bytes are packed inside the account data buffer.</p>
                  <div className="mt-4 grid grid-cols-12 gap-1">
                    {Array.from({ length: 36 }).map((_, index) => (
                      <div key={`byte-${index}`} className={`h-3 rounded-sm ${index % 5 === 0 ? "bg-[#14f195]/60" : "bg-neutral-800"}`} />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">Highlighted bytes = key fields</p>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4 text-sm text-neutral-500">
                  <strong className="text-neutral-400">Tip:</strong> Account owners decide who can write data. If the owner does not match your program, Anchor will reject the instruction.
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AccountExplorerClient;
