"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export function useLoginGate() {
    const { authenticated, login, ready } = useAuth();
    const [showModal, setShowModalState] = useState(false);
    const pendingActionRef = useRef<(() => void) | null>(null);

    const requireLogin = useCallback((callback: () => void) => {
        if (ready && authenticated) {
            callback();
        } else {
            pendingActionRef.current = callback;
            setShowModalState(true);
        }
    }, [authenticated, ready]);

    useEffect(() => {
        if (!ready || !authenticated || !pendingActionRef.current) return;
        const action = pendingActionRef.current;
        pendingActionRef.current = null;
        setShowModalState(false);
        action();
    }, [authenticated, ready]);

    const setShowModal = useCallback((open: boolean) => {
        if (!open && !authenticated) {
            pendingActionRef.current = null;
        }
        setShowModalState(open);
    }, [authenticated]);

    return {
        isLoggedIn: authenticated,
        login,
        showModal,
        setShowModal,
        requireLogin
    };
}
