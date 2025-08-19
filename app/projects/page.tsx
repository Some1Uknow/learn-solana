"use client";

import { useWeb3AuthUser } from "@web3auth/modal/react";
import { useState } from "react";

export default function ProjectsPage() {
  const { userInfo } = useWeb3AuthUser();
  const [activeTab, setActiveTab] = useState<'my-projects' | 'explore'>('my-projects');

  const myProjects = [
    {
      id: 1,
      name: "DeFi Lending Platform",
      description: "A decentralized lending platform built on Solana",
      status: "In Progress",
      lastUpdated: "2 days ago",
      technologies: ["Rust", "Anchor", "React"],
      progress: 65
    },
    {
      id: 2,
      name: "NFT Marketplace",
      description: "Buy and sell NFTs with low transaction fees",
      status: "Completed",
      lastUpdated: "1 week ago", 
      technologies: ["Solana Web3.js", "Next.js", "Tailwind"],
      progress: 100
    }
  ];

  const exploreProjects = [
    {
      id: 1,
      name: "Solana Token Swap",
      description: "Learn to build a token swap interface",
      difficulty: "Beginner",
      duration: "2-3 hours",
      technologies: ["Web3.js", "React"],
      students: 1234
    },
    {
      id: 2,
      name: "DAO Voting System",
      description: "Create a decentralized voting system",
      difficulty: "Intermediate",
      duration: "4-6 hours",
      technologies: ["Rust", "Anchor"],
      students: 856
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Solana Projects
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Build, learn, and showcase your Solana development skills with hands-on projects.
          </p>
          {userInfo && (
            <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-indigo-800 dark:text-indigo-200 text-sm">
                Welcome back, {userInfo?.name || 'Developer'}! Ready to build something amazing?
              </p>
            </div>
          )}
        </header>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('my-projects')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'my-projects'
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-500'
              }`}
            >
              My Projects
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'explore'
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-500'
              }`}
            >
              Explore Projects
            </button>
          </div>
        </div>

        {/* My Projects Tab */}
        {activeTab === 'my-projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Projects</h2>
              <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                + New Project
              </button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {myProjects.map((project) => (
                <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {project.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="text-gray-900 dark:text-white">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Updated {project.lastUpdated}</span>
                    <div className="space-x-2">
                      <button className="px-3 py-1 text-indigo-500 border border-indigo-500 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-sm">
                        View
                      </button>
                      <button className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors text-sm">
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explore Projects Tab */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Explore Projects</h2>
              <div className="flex space-x-2">
                <select 
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  title="Filter by difficulty level"
                  aria-label="Filter projects by difficulty level"
                >
                  <option>All Levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {exploreProjects.map((project) => (
                <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.difficulty === 'Beginner' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : project.difficulty === 'Intermediate'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {project.difficulty}
                    </span>
                    <span className="text-sm text-gray-500">{project.duration}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {project.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{project.students.toLocaleString()} students</span>
                    <button className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors text-sm">
                      Start Project
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
