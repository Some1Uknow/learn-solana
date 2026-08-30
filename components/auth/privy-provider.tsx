"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import type { ReactNode } from "react";
import { PrivyAuthBridge } from "@/components/auth/privy-auth-bridge";

export default function PrivyAppProvider({
  children,
  onReady,
}: {
  children: ReactNode;
  onReady?: () => void;
}) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const clientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID;

  if (!appId || !clientId) {
    throw new Error(
      "Missing Privy client configuration. Restart the Next.js dev server after setting NEXT_PUBLIC_PRIVY_APP_ID and NEXT_PUBLIC_PRIVY_CLIENT_ID."
    );
  }

  return (
    <PrivyProvider
      appId={appId}
      clientId={clientId}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#a9ff2f",
        },
        embeddedWallets: {
          solana: {
            createOnLogin: "users-without-wallets",
          },
          showWalletUIs: true,
        },
        loginMethods: ["email", "google", "github", "passkey"],
      }}
    >
      <PrivyAuthBridge onReady={onReady}>{children}</PrivyAuthBridge>
    </PrivyProvider>
  );
}
