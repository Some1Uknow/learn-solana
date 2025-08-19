"use client";

export default function GamesPage() {
  const handleGameAction = (gameName: string) => {
    console.log(`Starting ${gameName}...`);
    // Add your game logic here
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-6 p-8">
        <div className="text-6xl">🎮</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Solana Games</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">
          Learn Solana development through interactive games and challenges. Build your skills while having fun!
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Wallet Quiz</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Test your knowledge of Solana wallets and transactions
            </p>
            <button 
              onClick={() => handleGameAction("Wallet Quiz")}
              className="w-full py-2 px-4 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              Play Now
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Code Challenges</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Solve coding puzzles using Solana Web3.js
            </p>
            <button 
              onClick={() => handleGameAction("Code Challenges")}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Start Challenge
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">NFT Builder</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Create and mint your first Solana NFT
            </p>
            <button 
              onClick={() => handleGameAction("NFT Builder")}
              className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Create NFT
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
