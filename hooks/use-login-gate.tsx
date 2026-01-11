"use client";

import { useState, useCallback } from "react";
import { useWeb3Auth } from "@/hooks/use-web3-auth";

export function useLoginGate() {
    const { isLoggedIn, login } = useWeb3Auth();
    const [showModal, setShowModal] = useState(false);

    const requireLogin = useCallback((callback: () => void) => {
        if (isLoggedIn) {
            callback();
        } else {
            setShowModal(true);
        }
    }, [isLoggedIn]);

    return {
        isLoggedIn,
        login,
        showModal,
        setShowModal,
        requireLogin
    };
}
