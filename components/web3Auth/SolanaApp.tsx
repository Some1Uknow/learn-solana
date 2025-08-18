"use client";

import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
  useWeb3Auth,
} from "@web3auth/modal/react";
import { useState, useMemo, useEffect } from "react";
import { SolanaWallet } from "@web3auth/solana-provider";
import {
  getSolanaBalance,
  createTransferTransaction,
  isValidSolanaAddress,
  connection,
} from "../../lib/solana-utils";
import { PublicKey } from "@solana/web3.js";

function SolanaApp() {
  const [balance, setBalance] = useState<number | null>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [txStatus, setTxStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  // WORKAROUND: Store recovered userInfo in local state
  const [recoveredUserInfo, setRecoveredUserInfo] = useState<any>(null);

  // IMP START - Web3Auth Hooks
  const {
    connect,
    isConnected,
    loading: connectLoading,
    error: connectError,
  } = useWeb3AuthConnect();

  const {
    disconnect,
    loading: disconnectLoading,
    error: disconnectError,
  } = useWeb3AuthDisconnect();

  const { userInfo } = useWeb3AuthUser();

  const { provider, web3Auth } = useWeb3Auth();
  // IMP END - Web3Auth Hooks

  // NEW: Memoize SolanaWallet instance when provider is available
  const solanaWallet = useMemo(() => {
    if (provider) {
      return new SolanaWallet(provider);
    }
    return null;
  }, [provider]);

  // IMP START - Hydration and State Management Effects
  // Handle client-side hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Handle Web3Auth initialization and state restoration
  useEffect(() => {
    const initializeAuth = async () => {
      if (!isHydrated || !web3Auth) return;
      
      try {
        setIsInitializing(true);
        
        // Give Web3Auth time to restore state from cookies
        setTimeout(() => {
          setIsInitializing(false);
        }, 1000);
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [isHydrated, web3Auth]);

  // CRITICAL FIX: Force hooks to re-evaluate after initialization
  useEffect(() => {
    if (isHydrated && !isInitializing && isConnected) {
      // Force a re-render after a short delay to allow Web3Auth to settle
      const timer = setTimeout(() => {
        // This will trigger all Web3Auth hooks to re-evaluate
        if (!userAddress) {
          // Try to get address even if hooks are null
          getSolanaAddressFromWeb3Auth();
        }
      }, 1500); // Give more time for Web3Auth to fully restore state
      
      return () => clearTimeout(timer);
    }
  }, [isHydrated, isInitializing, isConnected, userAddress]);

  // Monitor for state recovery after SSR hydration  
  useEffect(() => {
    if (isHydrated && isConnected && !userInfo && web3Auth) {
      // Set up a polling mechanism to check for state recovery
      const checkInterval = setInterval(async () => {
        try {
          const recoveredUserInfo = await web3Auth.getUserInfo();
          if (recoveredUserInfo && !userAddress) {
            uiConsole("Detected state recovery - getting address...");
            clearInterval(checkInterval);
            getSolanaAddressFromWeb3Auth();
          }
        } catch (error) {
          // Ignore errors during polling
        }
      }, 1000); // Check every second
      
      // Clean up after 15 seconds to avoid infinite polling
      const cleanup = setTimeout(() => {
        clearInterval(checkInterval);
      }, 15000);
      
      return () => {
        clearInterval(checkInterval);
        clearTimeout(cleanup);
      };
    }
  }, [isHydrated, isConnected, userInfo, userAddress, web3Auth]);
  
  // Handle connection state changes
  useEffect(() => {
    if (!isConnected) {
      // Reset user address when disconnected
      setUserAddress("");
      setBalance(null);
    }
  }, [isConnected]);
  // IMP END - Hydration and State Management Effects

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  // Get Solana Address from Web3Auth Provider
  const getSolanaAddressFromWeb3Auth = async () => {
    try {
      setLoading(true);
      uiConsole("Getting Solana address from Web3Auth...");

      // Manual state recovery for SSR hydration issues
      let currentUserInfo = userInfo;
      let currentProvider = provider;
      
      // If hooks return null after hydration, try manual recovery
      if (!currentUserInfo && web3Auth && isConnected) {
        try {
          uiConsole("Manually recovering userInfo after SSR hydration...");
          currentUserInfo = await web3Auth.getUserInfo();
          uiConsole("✅ Manually recovered userInfo:", currentUserInfo);
        } catch (error) {
          uiConsole("❌ Failed to manually recover userInfo:", error);
        }
      }
      
      if (!currentProvider && web3Auth && isConnected) {
        try {
          uiConsole("Manually recovering provider after SSR hydration...");
          currentProvider = web3Auth.provider;
          uiConsole("✅ Manually recovered provider:", !!currentProvider);
        } catch (error) {
          uiConsole("❌ Failed to manually recover provider:", error);
        }
      }
      
      // If we still don't have required info, try waiting and retrying
      if (!currentProvider) {
        uiConsole("Provider not available - please connect first");
        setLoading(false);
        
        // Try one more time with a delay for hydration
        if (web3Auth && isConnected && isHydrated) {
          uiConsole("Retrying in 2 seconds after hydration...");
          setTimeout(() => getSolanaAddressFromWeb3Auth(), 2000);
        }
        return;
      }

      if (!currentUserInfo) {
        uiConsole("User info not available - waiting for Web3Auth to restore state...");
        setLoading(false);
        
        // Wait a bit and try again if we're still initializing
        if (isInitializing || !isHydrated) {
          setTimeout(() => getSolanaAddressFromWeb3Auth(), 2000);
        }
        return;
      }

      // First, let's extract the public key from userInfo
      if (currentUserInfo && typeof currentUserInfo === "object") {
        const userInfoObj = currentUserInfo as any;

        // Log the full userInfo structure to understand it better
        uiConsole(
          "Full user info structure:",
          JSON.stringify(userInfoObj, null, 2)
        );

        // Check for wallets in userInfo
        if (userInfoObj.wallets && Array.isArray(userInfoObj.wallets)) {
          uiConsole("Found wallets in user info:", userInfoObj.wallets);

          // Look for Solana wallet (ed25519 curve)
          const solanaWalletInfo = userInfoObj.wallets.find(
            (w: any) => w.curve === "ed25519" || w.type === "web3auth_app_key"
          );

          if (solanaWalletInfo && solanaWalletInfo.public_key) {
            try {
              uiConsole("Found Solana wallet info:", solanaWalletInfo);

              // Try to create PublicKey from the hex string
              let publicKeyBytes;
              if (solanaWalletInfo.public_key.startsWith("0x")) {
                // Remove 0x prefix and convert hex to bytes
                const hexString = solanaWalletInfo.public_key.slice(2);
                publicKeyBytes = new Uint8Array(Buffer.from(hexString, "hex"));
              } else {
                // Try direct hex conversion
                publicKeyBytes = new Uint8Array(
                  Buffer.from(solanaWalletInfo.public_key, "hex")
                );
              }

              const publicKey = new PublicKey(publicKeyBytes);
              const address = publicKey.toBase58();

              setUserAddress(address);
              uiConsole("✅ Solana Address derived from user info:", address);
              setLoading(false);
              return;
            } catch (conversionError) {
              uiConsole(
                "❌ Failed to convert public key from user info:",
                conversionError
              );
            }
          }
        }
      }

      try {
        const publicKey = await currentProvider.request({
          method: "getAccounts",
          params: {},
        });

        uiConsole("Provider getAccounts result:", publicKey);

        if (publicKey) {
          let address: string;
          if (Array.isArray(publicKey) && publicKey.length > 0) {
            address = publicKey[0];
          } else if (typeof publicKey === "string") {
            address = publicKey;
          } else {
            throw new Error("Unexpected public key format");
          }

          setUserAddress(address);
          uiConsole("✅ Solana Address from getAccounts:", address);
          return;
        }
      } catch (getAccountsError) {
        uiConsole("❌ getAccounts failed:", getAccountsError);

        // Method 2: Use SolanaWallet if availabl
        if (solanaWallet) {
          try {
            uiConsole("Trying SolanaWallet.requestAccounts...");
            const walletAccounts = await solanaWallet.requestAccounts();
            uiConsole("SolanaWallet accounts result:", walletAccounts);

            if (walletAccounts && walletAccounts.length > 0) {
              const address = walletAccounts[0];
              setUserAddress(address);
              uiConsole("✅ Solana Address from SolanaWallet:", address);
              return;
            }
          } catch (walletError) {
            uiConsole("❌ SolanaWallet.requestAccounts failed:", walletError);
          }
        }

        throw new Error("All methods failed to get Solana address");
      }
    } catch (error) {
      uiConsole("❌ Final error getting Solana address:", error);
      uiConsole("💡 Next steps to try:");
      uiConsole(
        "1. Check the 'Debug Info' button to see what data is available"
      );
      uiConsole("2. Ensure Web3Auth is configured for Solana in dashboard");
      uiConsole("3. Try disconnecting and reconnecting");
    } finally {
      setLoading(false);
    }
  };  // IMP START - Get Solana Balance (unchanged)
  const getSolanaBalanceHandler = async () => {
    try {
      if (!userAddress || !isValidSolanaAddress(userAddress)) {
        uiConsole("Need valid Solana address first");
        return;
      }

      setLoading(true);
      const balanceSOL = await getSolanaBalance(userAddress);
      setBalance(balanceSOL);
      uiConsole("Balance:", balanceSOL, "SOL");
    } catch (error) {
      uiConsole("Error getting balance:", error);
    } finally {
      setLoading(false);
    }
  };
  // IMP END - Get Solana Balance

  // UPDATED: Send SOL Transaction using SolanaWallet sign (no privkey export)
  const sendSOLHandler = async () => {
    try {
      if (!recipientAddress || !amount || !solanaWallet || !userAddress) {
        uiConsole("Please fill all fields and ensure wallet is available");
        return;
      }

      if (!isValidSolanaAddress(recipientAddress)) {
        uiConsole("Invalid recipient address");
        return;
      }

      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        uiConsole("Invalid amount");
        return;
      }

      setLoading(true);
      setTxStatus("Creating transaction...");

      // Create unsigned transaction
      const transaction = await createTransferTransaction(
        userAddress,
        recipientAddress,
        amountNum
      );

      setTxStatus("Signing transaction...");

      // Sign with SolanaWallet (secure, no key export)
      const signedTransaction = await solanaWallet.signTransaction(transaction);

      setTxStatus("Sending transaction...");

      // Send signed transaction
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      // Confirm transaction
      await connection.confirmTransaction(signature, "confirmed");

      setTxStatus("Transaction completed!");
      uiConsole("Transaction signature:", signature);

      // Refresh balance
      await getSolanaBalanceHandler();

      // Clear form
      setRecipientAddress("");
      setAmount("");
    } catch (error) {
      uiConsole("Error sending transaction:", error);
      setTxStatus("Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const loggedInView = (
    <div className="grid space-y-4">
      <h2 className="text-xl font-bold">Connected to Solana Devnet</h2>

      {/* Debug Info Panel - Enhanced for SSR debugging */}
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border text-xs">
        <h3 className="font-bold mb-2 text-sm">🔍 Debug Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Hydration State:</strong>
            <ul className="ml-4 list-disc">
              <li>isHydrated: <span className={isHydrated ? 'text-green-600' : 'text-red-600'}>{String(isHydrated)}</span></li>
              <li>isInitializing: <span className={isInitializing ? 'text-yellow-600' : 'text-green-600'}>{String(isInitializing)}</span></li>
            </ul>
          </div>
          <div>
            <strong>Web3Auth State:</strong>
            <ul className="ml-4 list-disc">
              <li>web3Auth: <span className={web3Auth ? 'text-green-600' : 'text-red-600'}>{web3Auth ? 'Available' : 'Not Available'}</span></li>
              <li>isConnected: <span className={isConnected ? 'text-green-600' : 'text-red-600'}>{String(isConnected)}</span></li>
              <li>userInfo (hook): <span className={userInfo ? 'text-green-600' : 'text-red-600'}>{userInfo ? 'Available' : 'null/undefined'}</span></li>
              <li>userInfo (recovered): <span className={recoveredUserInfo ? 'text-green-600' : 'text-orange-600'}>{recoveredUserInfo ? 'Available' : 'not recovered yet'}</span></li>
              <li>provider: <span className={provider ? 'text-green-600' : 'text-red-600'}>{provider ? 'Available' : 'null/undefined'}</span></li>
            </ul>
          </div>
        </div>
        
        {/* SSR Issue Indicator */}
        {isHydrated && isConnected && !userInfo && (
          <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
            <strong>⚠️ SSR Issue Detected:</strong> Connected but userInfo is null. This is the Web3Auth v10.x bug. 
            Manual recovery should trigger automatically.
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <div className="text-sm">
          <strong>Address:</strong>{" "}
          {userAddress ? (
            <span className="font-mono text-xs break-all">{userAddress}</span>
          ) : isInitializing ? (
            <span className="text-gray-500">Loading...</span>
          ) : (
            "Not loaded"
          )}
        </div>
        <div className="text-sm">
          <strong>Balance:</strong>{" "}
          {balance !== null ? `${balance.toFixed(6)} SOL` : "Not loaded"}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            uiConsole("=== USER INFO COMPARISON ===");
            uiConsole("Hook userInfo (often null after refresh):", userInfo);
            uiConsole("Recovered userInfo (should work):", recoveredUserInfo);
            uiConsole("Effective userInfo (what we should use):", recoveredUserInfo || userInfo);
          }}
          disabled={loading || isInitializing}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Get User Info
        </button>

        <button
          onClick={async () => {
            try {
              uiConsole("🔄 Force refreshing Web3Auth state...");
              
              if (web3Auth && isConnected) {
                // Manually call Web3Auth APIs to bypass broken hooks
                const manualUserInfo = await web3Auth.getUserInfo();
                const manualProvider = web3Auth.provider;
                
                uiConsole("✅ Manual userInfo:", manualUserInfo);
                uiConsole("✅ Manual provider:", !!manualProvider);
                
                // Store recovered userInfo in local state
                setRecoveredUserInfo(manualUserInfo);
                
                // Force address recovery with manual data
                if (manualProvider && !userAddress) {
                  uiConsole("🔄 Triggering address recovery with manual data...");
                  getSolanaAddressFromWeb3Auth();
                }
                
                uiConsole("✅ State recovery complete! Check 'Get User Info' button now.");
              } else {
                uiConsole("❌ Web3Auth not available or not connected");
              }
            } catch (error) {
              uiConsole("❌ Force refresh failed:", error);
            }
          }}
          disabled={loading || isInitializing || !isConnected}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          🔄 Force Refresh
        </button>

        <button
          onClick={() => {
            uiConsole("=== DEBUG INFO ===");
            uiConsole("Hydrated:", isHydrated);
            uiConsole("Initializing:", isInitializing);
            uiConsole("Provider available:", !!provider);
            uiConsole("SolanaWallet available:", !!solanaWallet);
            uiConsole("Connected:", isConnected);
            uiConsole("User Info:", userInfo);
            uiConsole(
              "Provider methods:",
              provider ? Object.getOwnPropertyNames(provider) : "No provider"
            );
            if (provider) {
              uiConsole("Provider request method:", typeof provider.request);
            }
          }}
          disabled={loading || isInitializing}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          Debug Info
        </button>

        <button
          onClick={getSolanaAddressFromWeb3Auth}
          disabled={loading || isInitializing}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Get Solana Address"}
        </button>

        <button
          onClick={getSolanaBalanceHandler}
          disabled={
            loading || isInitializing || !userAddress || !isValidSolanaAddress(userAddress)
          }
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Get Balance"}
        </button>
      </div>

  // IMP START - Send SOL Transaction form and logout
      {/* Transaction Form */}
      <div className="border p-4 rounded space-y-2">
        <h3 className="font-semibold">Send SOL</h3>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          disabled={loading || isInitializing}
          className="w-full p-2 border rounded dark:bg-gray-800 disabled:opacity-50"
        />
        <input
          type="number"
          step="0.000000001"
          placeholder="Amount (SOL)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading || isInitializing}
          className="w-full p-2 border rounded dark:bg-gray-800 disabled:opacity-50"
        />
        <button
          onClick={sendSOLHandler}
          disabled={loading || isInitializing || !recipientAddress || !amount || !userAddress}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Send SOL"}
        </button>
        {txStatus && (
          <div className="text-sm mt-2">
            <strong>Status:</strong> {txStatus}
          </div>
        )}
      </div>

      {/* IMP START - Logout */}
      <div>
        <button
          onClick={() => disconnect()}
          disabled={disconnectLoading || isInitializing}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {disconnectLoading ? "Disconnecting..." : "Log Out"}
        </button>
        {disconnectError && (
          <div className="text-red-500 text-sm mt-2">
            {disconnectError.message}
          </div>
        )}
      </div>
      {/* IMP END - Logout */}
    </div>
  );

  const unloggedInView = (
    // IMP START - Login
    <div className="grid space-y-4">
      <div className="text-center space-y-2">
        <p className="text-gray-600 dark:text-gray-400">
          Connect your Web3Auth account to interact with Solana Devnet
        </p>
        <button
          onClick={() => connect()}
          disabled={connectLoading || isInitializing}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {connectLoading ? "Connecting..." : isInitializing ? "Initializing..." : "Login with Web3Auth"}
        </button>
      </div>
      {connectError && (
        <div className="text-red-500 text-sm text-center">
          {connectError.message}
        </div>
      )}
    </div>
    // IMP END - Login
  );

  // IMP START - Handle SSR/Hydration
  // Don't render anything until hydrated to prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          <a
            target="_blank"
            href="https://web3auth.io/docs/sdk/pnp/web/modal"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600"
          >
            Web3Auth
          </a>
          {" & "}
          <a
            target="_blank"
            href="https://solana.com/"
            rel="noopener noreferrer"
            className="text-purple-500 hover:text-purple-600"
          >
            Solana
          </a>
          {" Integration"}
        </h1>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }
  // IMP END - Handle SSR/Hydration

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">
        <a
          target="_blank"
          href="https://web3auth.io/docs/sdk/pnp/web/modal"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600"
        >
          Web3Auth
        </a>
        {" & "}
        <a
          target="_blank"
          href="https://solana.com/"
          rel="noopener noreferrer"
          className="text-purple-500 hover:text-purple-600"
        >
          Solana
        </a>
        {" Integration"}
      </h1>

      {isConnected ? loggedInView : unloggedInView}

      <div
        id="console"
        className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded"
      >
        <h3 className="font-semibold mb-2">Console Output:</h3>
        <p className="whitespace-pre-line text-sm font-mono"></p>
      </div>

      <footer className="mt-8 text-center">
        <a
          href="https://web3auth.io/docs/sdk/pnp/web/modal"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600"
        >
          Web3Auth Docs
        </a>
        {" | "}
        <a
          href="https://docs.solana.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-500 hover:text-purple-600"
        >
          Solana Docs
        </a>
      </footer>
    </div>
  );
}

export default SolanaApp;
