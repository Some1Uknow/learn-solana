"use client";

import { useWeb3AuthUser, useIdentityToken } from "@web3auth/modal/react";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const { userInfo } = useWeb3AuthUser();
  const { token } = useIdentityToken();
  const [serverVerification, setServerVerification] = useState<any>(null);

  // Example of additional server-side verification
  useEffect(() => {
    const verifyWithServer = async () => {
      if (!token) return;

      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setServerVerification(result);
        }
      } catch (error) {
        console.error("Server verification failed:", error);
      }
    };

    verifyWithServer();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Protected Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome to your secure dashboard. This page is protected by Web3Auth.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* User Information Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              User Information
            </h2>
            {userInfo && (
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Name: </span>
                  <span className="text-gray-900 dark:text-white">{userInfo.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Email: </span>
                  <span className="text-gray-900 dark:text-white">{userInfo.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Verifier: </span>
                  <span className="text-gray-900 dark:text-white">{(userInfo as any)?.verifier || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Verifier ID: </span>
                  <span className="text-gray-900 dark:text-white font-mono text-sm">
                    {(userInfo as any)?.verifierId || 'N/A'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Authentication Status Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Authentication Status
            </h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-900 dark:text-white">Authenticated via Web3Auth</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-900 dark:text-white">JWT Token Valid</span>
              </div>
              {serverVerification && (
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-900 dark:text-white">Server Verification Passed</span>
                </div>
              )}
            </div>

            {token && (
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">ID Token</h3>
                <p className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
                  {token.substring(0, 100)}...
                </p>
              </div>
            )}
          </div>

          {/* Wallet Information Card */}
          {(userInfo as any)?.wallets && (userInfo as any).wallets.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Connected Wallets
              </h2>
              <div className="space-y-3">
                {(userInfo as any).wallets.map((wallet: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Type: </span>
                        <span className="text-gray-900 dark:text-white">{wallet.type}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Curve: </span>
                        <span className="text-gray-900 dark:text-white">{wallet.curve}</span>
                      </div>
                      {wallet.public_key && (
                        <div className="col-span-2">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Public Key: </span>
                          <span className="text-gray-900 dark:text-white font-mono text-xs break-all">
                            {wallet.public_key}
                          </span>
                        </div>
                      )}
                      {wallet.address && (
                        <div className="col-span-2">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Address: </span>
                          <span className="text-gray-900 dark:text-white font-mono text-xs break-all">
                            {wallet.address}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Server Verification Details */}
        {serverVerification && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Server Verification Details
            </h2>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(serverVerification, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
