"use client";

import { useAuthContext } from "@/components/auth/auth-context";

export function useAuth() {
  return useAuthContext();
}
