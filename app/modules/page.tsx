"use client";

import React from "react";
import ModulesGrid from "@/components/learn/modules-grid";
import { contentsData } from '../../data/contents-data';
import { useWeb3AuthUser } from "@web3auth/modal/react";

// Use contentsData directly in your component logic
const modules = contentsData.modules;

export default function ModulesPage() {
  const { userInfo } = useWeb3AuthUser();

  return (
    <div className="min-h-screen w-full relative bg-black">
      {/* Prismatic Aurora Burst - Multi-layered Gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
            radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
            radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
            radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
            #000000
          `,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen p-8">
        <div className="text-center space-y-6 mb-8">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Solana Learning Modules
          </h1>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
            Master Solana development with our structured 5-week curriculum. From blockchain basics to advanced dApp development.
          </p>
          
          {userInfo && (
            <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-green-200 text-sm">
                Welcome back, {userInfo?.name || 'Developer'}! Continue your learning journey.
              </p>
            </div>
          )}
        </div>

        {/* Modules Grid */}
        <div className="w-full max-w-7xl">
          <ModulesGrid modules={modules} />
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => window.location.href = "/"}
            className="px-6 py-2 border border-zinc-600 text-zinc-300 rounded-lg hover:border-zinc-500 hover:text-white"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
