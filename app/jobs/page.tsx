"use client";

import { useWeb3AuthUser } from "@web3auth/modal/react";

export default function JobsPage() {
  const { userInfo } = useWeb3AuthUser();

  const handleJobAction = (action: string, jobTitle: string) => {
    console.log(`${action} for ${jobTitle}...`);
    // Add your job application logic here
  };

  const handlePostJob = () => {
    console.log("Opening job posting form...");
    // Add your job posting logic here
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <div className="text-6xl mb-4">💼</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Solana Jobs Board
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find your next opportunity in the Solana ecosystem. Connect with top projects and teams building the future of Web3.
          </p>
          
          {userInfo && (
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                Welcome, {userInfo?.name || 'Developer'}! Your profile is ready for applications.
              </p>
            </div>
          )}
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Job Cards */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-white font-bold">
                  S
                </div>
              </div>
              <span className="text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-xs font-medium">
                Full-time
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Senior Solana Developer
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Build next-generation DeFi protocols on Solana. Work with Rust, Anchor, and Web3.js.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-gray-800 dark:text-gray-200 font-semibold">$120k - $180k</span>
              <button 
                onClick={() => handleJobAction("Apply", "Senior Solana Developer")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
              >
                Apply Now
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                Rust
              </span>
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                Anchor
              </span>
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                DeFi
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold">
                  M
                </div>
              </div>
              <span className="text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded text-xs font-medium">
                Contract
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Frontend Web3 Developer
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Create beautiful user interfaces for Solana dApps using React and Web3.js.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-gray-800 dark:text-gray-200 font-semibold">$80 - $120/hr</span>
              <button 
                onClick={() => handleJobAction("Apply", "Frontend Web3 Developer")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
              >
                Apply Now
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                React
              </span>
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                Web3.js
              </span>
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                UI/UX
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold">
                  P
                </div>
              </div>
              <span className="text-purple-600 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded text-xs font-medium">
                Remote
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Solana DevRel Engineer
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Help developers build on Solana. Create documentation, tutorials, and example code.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-gray-800 dark:text-gray-200 font-semibold">$90k - $130k</span>
              <button 
                onClick={() => handleJobAction("Apply", "Solana DevRel Engineer")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
              >
                Apply Now
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                Technical Writing
              </span>
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                Community
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Post a Job?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Reach thousands of talented Solana developers in our community
          </p>
          <button 
            onClick={handlePostJob}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors font-medium"
          >
            Post a Job - $99
          </button>
        </div>
      </div>
    </main>
  );
}
