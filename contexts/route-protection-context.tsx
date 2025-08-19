"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3Auth as useWeb3AuthCore } from '@/hooks/use-web3-auth';
import { LoginPopup } from '@/components/ui/login-popup';

interface RouteProtectionContextType {
  protectedNavigate: (href: string, title?: string, description?: string) => void;
  isProtectedRoute: (href: string) => boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  pendingNavigation: string | null;
}

const RouteProtectionContext = createContext<RouteProtectionContextType | null>(null);

// Define which routes require authentication
const PROTECTED_ROUTES = [
  '/games',
  '/jobs', 
  '/modules',
  '/projects',
  '/test-auth',
  '/dashboard',
  '/admin'
];

interface RouteProtectionProviderProps {
  children: React.ReactNode;
}

export function RouteProtectionProvider({ children }: RouteProtectionProviderProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [modalConfig, setModalConfig] = useState({
    title: "Authentication Required",
    description: "Please connect your wallet to access this feature."
  });
  
  const router = useRouter();
  const { isLoggedIn, isLoading } = useWeb3AuthCore();

  const isProtectedRoute = useCallback((href: string) => {
    return PROTECTED_ROUTES.some(route => href.startsWith(route));
  }, []);

  const protectedNavigate = useCallback((
    href: string, 
    title = "Authentication Required",
    description = "Please connect your wallet to access this page."
  ) => {
    if (isLoading) return;
    
    if (isProtectedRoute(href) && !isLoggedIn) {
      setPendingNavigation(href);
      setModalConfig({ title, description });
      setShowAuthModal(true);
    } else {
      router.push(href);
    }
  }, [isLoggedIn, isLoading, router, isProtectedRoute]);

  const handleAuthSuccess = useCallback(() => {
    setShowAuthModal(false);
    if (pendingNavigation) {
      router.push(pendingNavigation);
      setPendingNavigation(null);
    }
  }, [pendingNavigation, router]);

  const handleAuthCancel = useCallback(() => {
    setShowAuthModal(false);
    setPendingNavigation(null);
  }, []);

  const contextValue: RouteProtectionContextType = {
    protectedNavigate,
    isProtectedRoute,
    showAuthModal,
    setShowAuthModal,
    pendingNavigation
  };

  return (
    <RouteProtectionContext.Provider value={contextValue}>
      {children}
      <LoginPopup
        isOpen={showAuthModal}
        onOpenChange={setShowAuthModal}
        title={modalConfig.title}
        description={modalConfig.description}
        onLoginSuccess={handleAuthSuccess}
        onCancel={handleAuthCancel}
      />
    </RouteProtectionContext.Provider>
  );
}

export function useRouteProtection() {
  const context = useContext(RouteProtectionContext);
  if (!context) {
    throw new Error('useRouteProtection must be used within RouteProtectionProvider');
  }
  return context;
}
