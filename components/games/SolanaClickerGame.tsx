"use client";
import { useEffect, useRef } from "react";
import * as Phaser from "phaser";

import { GameScene } from "./GameScene";

interface SolanaClickerGameProps {
  onGameComplete?: () => void;
}


export default function SolanaClickerGame({
  onGameComplete,
}: SolanaClickerGameProps) {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current || typeof window === "undefined") return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      // ✅ Set fixed game dimensions
      width: 800,
      height: 600,
      parent: gameRef.current,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 300 },
          debug: false,
        },
      },
      scene: GameScene,
      backgroundColor: "#34495e",
      // ✅ Add the scale manager configuration
      scale: {
        mode: Phaser.Scale.FIT, // This mode automatically scales the canvas to fit the parent
        autoCenter: Phaser.Scale.CENTER_BOTH, // This centers the game canvas
        parent: gameRef.current,
      },
    };

    phaserGameRef.current = new Phaser.Game(config);

    // Ensure canvas can receive focus for keyboard input
    if (phaserGameRef.current.canvas) {
      phaserGameRef.current.canvas.tabIndex = 0;
      phaserGameRef.current.canvas.focus();
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  const handleClick = () => {
    if (phaserGameRef.current && phaserGameRef.current.canvas) {
      phaserGameRef.current.canvas.focus();
    }
  };

  if (typeof window === "undefined") {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-200 rounded-lg">
        <p>Loading Solana Clicker Game...</p>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      onClick={handleClick}
      tabIndex={0}
    >
      <div
        ref={gameRef}
        className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg"
      />
    </div>
  );
}
