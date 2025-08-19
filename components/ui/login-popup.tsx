"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWeb3Auth } from "@/hooks/use-web3-auth";
import { useRouter } from "next/navigation";

interface LoginPopupProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  redirectAfterLogin?: string;
  onLoginSuccess?: () => void;
  onCancel?: () => void;
}

export function LoginPopup({
  isOpen,
  onOpenChange,
  title = "Login Required",
  description = "You need to login to access this feature. Please connect your wallet to continue.",
  redirectAfterLogin,
  onLoginSuccess,
  onCancel
}: LoginPopupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalClosed, setIsModalClosed] = useState(false);
  const { login, isLoggedIn } = useWeb3Auth();
  const router = useRouter();

  // Watch for login state changes
  useEffect(() => {
    if (isLoggedIn && (isModalClosed || isLoading)) {
      // User successfully logged in
      if (onLoginSuccess) {
        onLoginSuccess();
      }

      if (redirectAfterLogin) {
        router.push(redirectAfterLogin);
      }

      setIsLoading(false);
      setIsModalClosed(false);
    }
  }, [isLoggedIn, isModalClosed, isLoading, onLoginSuccess, redirectAfterLogin, router]);

  const handleLogin = async () => {
    setIsLoading(true);
    
    // Close our modal FIRST to avoid stacking issues
    onOpenChange(false);
    setIsModalClosed(true);
    
    try {
      await login();
      // Success handling is now done in useEffect
    } catch (error) {
      console.error("Login failed:", error);
      // Reopen our modal on error
      onOpenChange(true);
      setIsModalClosed(false);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setIsLoading(false);
    setIsModalClosed(false);
    
    // Call custom cancel handler if provided
    if (onCancel) {
      onCancel();
    } else {
      // Default behavior: navigate back or to home page
      router.back();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md z-[9999]">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-3">
          <Button 
            onClick={handleLogin}
            disabled={isLoading || isLoggedIn}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Opening Wallet Connection..." : "Connect Wallet"}
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
        
        {isLoading && (
          <div className="text-center text-sm text-muted-foreground">
            Please complete the connection in the Web3Auth popup
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
