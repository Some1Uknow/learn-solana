"use client";

import { useWeb3AuthConnectionListener } from "@/hooks/use-web3auth-connection-listener";

/**
 * Component that sets up Web3Auth connection event listeners.
 * Must be placed inside the Web3AuthProvider.
 * 
 * This provides a safety net for user registration by:
 * 1. Listening to CONNECTED events from Web3Auth
 * 2. Automatically triggering registration when connection is established
 * 3. Handling the case where user is already connected on page load
 */
export function Web3AuthConnectionListener() {
  useWeb3AuthConnectionListener();
  return null;
}
