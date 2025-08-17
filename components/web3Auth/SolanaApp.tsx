"use client";

import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
  useWeb3Auth,
} from "@web3auth/modal/react";
import { useState, useMemo } from "react";
import { SolanaWallet } from "@web3auth/solana-provider"; // NEW: Import SolanaWallet
import {
  getSolanaBalance,
  createTransferTransaction, // NEW: Use helper to create tx
  isValidSolanaAddress,
  connection, // NEW: Use for sending
} from "../../lib/solana-utils";

function SolanaApp() {
  const [balance, setBalance] = useState<number | null>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [txStatus, setTxStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

  const { provider } = useWeb3Auth();
  // IMP END - Web3Auth Hooks

  // NEW: Memoize SolanaWallet instance when provider is available
  const solanaWallet = useMemo(() => {
    if (provider) {
      return new SolanaWallet(provider);
    }
    return null;
  }, [provider]);

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  // UPDATED: Get Solana Address using SolanaWallet (no privkey export)
  const getSolanaAddressFromWeb3Auth = async () => {
    try {
      if (!solanaWallet) {
        uiConsole("Solana wallet not available");
        return;
      }

      setLoading(true);

      const accounts = await solanaWallet.requestAccounts();
      if (accounts.length === 0) {
        uiConsole("No accounts found");
        return;
      }

      const address = accounts[0];
      setUserAddress(address);
      uiConsole("Solana Address:", address);
    } catch (error) {
      uiConsole("Error getting Solana address:", error);
    } finally {
      setLoading(false);
    }
  };

  // IMP START - Get Solana Balance (unchanged)
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

      <div className="flex flex-col space-y-2">
        <div className="text-sm">
          <strong>Address:</strong>{" "}
          {userAddress ? (
            <span className="font-mono text-xs break-all">{userAddress}</span>
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
          onClick={() => uiConsole(userInfo)}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Get User Info
        </button>

        <button
          onClick={getSolanaAddressFromWeb3Auth}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Get Solana Address"}
        </button>

        <button
          onClick={getSolanaBalanceHandler}
          disabled={
            loading || !userAddress || !isValidSolanaAddress(userAddress)
          }
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Get Balance"}
        </button>
      </div>

      {/* Transaction Form */}
      <div className="border p-4 rounded space-y-2">
        <h3 className="font-semibold">Send SOL</h3>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          disabled={loading}
          className="w-full p-2 border rounded dark:bg-gray-800 disabled:opacity-50"
        />
        <input
          type="number"
          step="0.000000001"
          placeholder="Amount (SOL)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
          className="w-full p-2 border rounded dark:bg-gray-800 disabled:opacity-50"
        />
        <button
          onClick={sendSOLHandler}
          disabled={loading || !recipientAddress || !amount || !userAddress}
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
          disabled={disconnectLoading}
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
          disabled={connectLoading}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {connectLoading ? "Connecting..." : "Login with Web3Auth"}
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
