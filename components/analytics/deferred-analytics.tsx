"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const DeferredVercelAnalytics = dynamic(
  () => import("@vercel/analytics/next").then((module) => module.Analytics),
  { ssr: false }
);

export function DeferredAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setEnabled(true), 5000);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return enabled ? <DeferredVercelAnalytics /> : null;
}
