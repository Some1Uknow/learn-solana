"use client";

import { useEffect, useRef } from "react";
import { useWeb3Auth } from "@web3auth/modal/react";
import { registerUserAfterLogin } from "@/lib/auth/registerUserAfterLogin";

/**
 * This hook listens for Web3Auth connection events and triggers
 * user registration. It serves as a safety net in case the direct
 * registration in the wallet button fails.
 * 
 * Uses the CONNECTED event from Web3Auth's event emitter which is
 * more reliable than depending on hook state updates.
 */
export function useWeb3AuthConnectionListener() {
  const { web3Auth, provider, isConnected } = useWeb3Auth();
  const registeredRef = useRef(false);
  const listenerAttachedRef = useRef(false);

  useEffect(() => {
    if (!web3Auth || listenerAttachedRef.current) return;

    const handleConnected = async () => {
      // Small delay to ensure provider is fully ready
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (registeredRef.current) {
        console.log("[ConnectionListener] Already registered, skipping");
        return;
      }

      const currentProvider = (web3Auth as any).provider;
      if (!currentProvider) {
        console.warn("[ConnectionListener] No provider after CONNECTED event");
        return;
      }

      console.log("[ConnectionListener] CONNECTED event received, registering user...");
      registeredRef.current = true;

      try {
        const result = await registerUserAfterLogin(
          currentProvider,
          web3Auth as any,
          (user) => {
            console.log("[ConnectionListener] User registered via event:", user?.walletAddress);
          }
        );

        if (!result.success) {
          console.warn("[ConnectionListener] Registration failed:", result.error);
          registeredRef.current = false; // Allow retry
        }
      } catch (err) {
        console.error("[ConnectionListener] Registration error:", err);
        registeredRef.current = false;
      }
    };

    const handleDisconnected = () => {
      console.log("[ConnectionListener] DISCONNECTED event received");
      registeredRef.current = false;
    };

    // Listen to Web3Auth events
    try {
      (web3Auth as any).on?.("connected", handleConnected);
      (web3Auth as any).on?.("disconnected", handleDisconnected);
      listenerAttachedRef.current = true;

      console.log("[ConnectionListener] Event listeners attached");
    } catch (err) {
      console.warn("[ConnectionListener] Could not attach event listeners:", err);
    }

    // Cleanup
    return () => {
      try {
        (web3Auth as any).off?.("connected", handleConnected);
        (web3Auth as any).off?.("disconnected", handleDisconnected);
        listenerAttachedRef.current = false;
      } catch (err) {
        // Ignore cleanup errors
      }
    };
  }, [web3Auth]);

  // Also handle case where we're already connected when component mounts
  useEffect(() => {
    if (isConnected && provider && !registeredRef.current) {
      console.log("[ConnectionListener] Already connected on mount, registering...");
      registeredRef.current = true;

      registerUserAfterLogin(
        provider as any,
        web3Auth as any,
        (user) => {
          console.log("[ConnectionListener] User registered on mount:", user?.walletAddress);
        }
      ).catch((err) => {
        console.error("[ConnectionListener] Registration on mount failed:", err);
        registeredRef.current = false;
      });
    }
  }, [isConnected, provider, web3Auth]);

  return null;
}
