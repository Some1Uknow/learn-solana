"use client";

import { useState } from "react";
import { Check, Code, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

export default function DappBuilder() {
  const [contractType, setContractType] = useState("");
  const [contractName, setContractName] = useState("");
  const [frontendFramework, setFrontendFramework] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  
  const featureOptions = [
    { id: "wallet", label: "Wallet Integration" },
    { id: "transactions", label: "Transaction History" },
    { id: "admin", label: "Admin Dashboard" },
    { id: "analytics", label: "Analytics" },
    { id: "darkMode", label: "Dark/Light Mode" },
  ];
  
  const contractOptions = [
    { value: "token", label: "SPL Token" },
    { value: "nft", label: "NFT Collection" },
    { value: "marketplace", label: "Marketplace" },
    { value: "dao", label: "DAO" },
    { value: "custom", label: "Custom Program" },
  ];
  
  const frontendOptions = [
    { value: "nextjs", label: "Next.js" },
    { value: "react", label: "React" },
    { value: "vue", label: "Vue.js" },
    { value: "vanilla", label: "Vanilla JS" },
  ];

  const handleFeatureToggle = (id: string) => {
    setFeatures(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationComplete(true);
    }, 3000);
  };

  const previewCode = `// Sample generated contract code
use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod ${contractName.toLowerCase() || "my_program"} {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let ${contractType === "token" ? "token" : contractType === "nft" ? "collection" : "account"} = &mut ctx.accounts.${contractType === "token" ? "token" : contractType === "nft" ? "collection" : "account"};
        ${contractType === "token" ? "token" : contractType === "nft" ? "collection" : "account"}.authority = ctx.accounts.authority.key();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32)]
    pub ${contractType === "token" ? "token" : contractType === "nft" ? "collection" : "account"}: Account<'info, ${contractType === "token" ? "Token" : contractType === "nft" ? "Collection" : "MyAccount"}>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct ${contractType === "token" ? "Token" : contractType === "nft" ? "Collection" : "MyAccount"} {
    pub authority: Pubkey,
}`;

  const previewFrontend = `// Sample generated frontend code
${frontendFramework === "react" || frontendFramework === "nextjs" 
  ? `import { FC, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program } from '@project-serum/anchor';

const App: FC = () => {
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      // Initialize connection to program
    }
  }, [connected, publicKey]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">${contractName || "My Solana App"}</h1>
      {connected ? (
        <div className="p-4 border rounded-lg">
          <p>Connected: {publicKey?.toString()}</p>
          ${features.includes("transactions") ? 
            `<div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Transaction History</h2>
              <p>Loading transactions...</p>
            </div>` : ''
          }
        </div>
      ) : (
        <button className="bg-purple-600 text-white px-4 py-2 rounded">
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default App;`
  : frontendFramework === "vue" 
    ? `<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">${contractName || "My Solana App"}</h1>
    <div v-if="connected" class="p-4 border rounded-lg">
      <p>Connected: {{ publicKey }}</p>
      ${features.includes("transactions") ? 
        `<div class="mt-4">
          <h2 class="text-xl font-semibold mb-2">Transaction History</h2>
          <p>Loading transactions...</p>
        </div>` : ''
      }
    </div>
    <button v-else @click="connect" class="bg-purple-600 text-white px-4 py-2 rounded">
      Connect Wallet
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      connected: false,
      publicKey: null
    }
  },
  methods: {
    connect() {
      // Connect wallet logic
    }
  }
}
</script>`
    : `// Vanilla JS implementation
document.addEventListener('DOMContentLoaded', function() {
  const app = document.getElementById('app');
  
  // Check if wallet is connected
  const isConnected = false;
  const publicKey = null;
  
  if (isConnected) {
    app.innerHTML = \`
      <h1 class="text-3xl font-bold mb-6">${contractName || "My Solana App"}</h1>
      <div class="p-4 border rounded-lg">
        <p>Connected: \${publicKey}</p>
        ${features.includes("transactions") ? 
          `<div class="mt-4">
            <h2 class="text-xl font-semibold mb-2">Transaction History</h2>
            <p>Loading transactions...</p>
          </div>` : ''
        }
      </div>
    \`;
  } else {
    app.innerHTML = \`
      <h1 class="text-3xl font-bold mb-6">${contractName || "My Solana App"}</h1>
      <button id="connect" class="bg-purple-600 text-white px-4 py-2 rounded">
        Connect Wallet
      </button>
    \`;
    
    document.getElementById('connect').addEventListener('click', function() {
      // Connect wallet logic
    });
  }
});`}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left side - Form */}
      <div>
        <Card className="bg-black/30 border-white/10">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription className="text-white/70">
              Customize your Solana dApp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Project Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Project Details</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input 
                    id="project-name" 
                    placeholder="My Solana Project" 
                    className="bg-white/5 border-white/10"
                    value={contractName}
                    onChange={(e) => setContractName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-description">Description (optional)</Label>
                  <Input 
                    id="project-description" 
                    placeholder="A brief description of your project" 
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Contract Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contract</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contract-type">Contract Type</Label>
                  <Select 
                    value={contractType} 
                    onValueChange={setContractType}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select contract type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Frontend Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Frontend</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="frontend-framework">Framework</Label>
                  <Select 
                    value={frontendFramework} 
                    onValueChange={setFrontendFramework}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select frontend framework" />
                    </SelectTrigger>
                    <SelectContent>
                      {frontendOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Features</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {featureOptions.map(option => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={option.id} 
                          checked={features.includes(option.id)}
                          onCheckedChange={() => handleFeatureToggle(option.id)}
                          className="border-white/30 data-[state=checked]:bg-[#14F195] data-[state=checked]:text-black"
                        />
                        <label
                          htmlFor={option.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black hover:opacity-90"
              onClick={handleGenerate}
              disabled={isGenerating || !contractType || !frontendFramework}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : generationComplete ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Generated! Download
                </>
              ) : (
                "Generate dApp"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Right side - Code preview */}
      <div>
        <Card className="bg-black/30 border-white/10 h-full flex flex-col">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription className="text-white/70">
              Code preview updates as you configure your project
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <Tabs defaultValue="contract" className="h-full flex flex-col">
              <TabsList className="bg-white/5 border border-white/10 w-auto self-start">
                <TabsTrigger value="contract" className="flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  Contract
                </TabsTrigger>
                <TabsTrigger value="frontend" className="flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  Frontend
                </TabsTrigger>
              </TabsList>
              <TabsContent value="contract" className="flex-1 mt-4">
                <div className="bg-black/70 p-4 rounded-lg overflow-auto h-full">
                  <pre className="text-sm text-white/90 font-mono">
                    <code>{previewCode}</code>
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="frontend" className="flex-1 mt-4">
                <div className="bg-black/70 p-4 rounded-lg overflow-auto h-full">
                  <pre className="text-sm text-white/90 font-mono">
                    <code>{previewFrontend}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}