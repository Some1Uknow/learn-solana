"use client";

import dynamic from "next/dynamic";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  preloadDeferredAuth,
  useDeferredAuthRuntime,
} from "@/components/auth/deferred-auth-runtime";

interface NavbarWalletButtonProps {
  isMobile?: boolean;
}

const AuthenticatedNavbarWalletButton = dynamic(
  () =>
    import("./authenticated-wallet-button").then(
      (module) => module.AuthenticatedNavbarWalletButton
    ),
  { ssr: false }
);

function LoginButton({ isMobile = false }: NavbarWalletButtonProps) {
  const { requestLogin } = useDeferredAuthRuntime();
  const warmAuth = () => {
    void preloadDeferredAuth().catch(() => undefined);
  };

  return (
    <Button
      onMouseEnter={warmAuth}
      onFocus={warmAuth}
      onTouchStart={warmAuth}
      onClick={() => void requestLogin()}
      className={`h-10 bg-[var(--ds-accent-control)] text-[#172006] hover:bg-[var(--ds-accent-control-hover)] ${isMobile ? "w-full" : ""}`}
    >
      <UserPlus size={18} className="mr-2" />
      Login
    </Button>
  );
}

export function NavbarWalletButton({ isMobile = false }: NavbarWalletButtonProps) {
  const { active } = useDeferredAuthRuntime();

  if (!active) {
    return <LoginButton isMobile={isMobile} />;
  }

  return <AuthenticatedNavbarWalletButton isMobile={isMobile} />;
}
