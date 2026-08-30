"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import styles from "./solana-mark.module.css";

const MOBILE_BREAKPOINT = "(max-width: 767px)";
const VIDEO_START_DELAY_MS = 700;

export function SolanaMark() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSource, setVideoSource] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timeoutId = window.setTimeout(() => {
      const isMobile = window.matchMedia(MOBILE_BREAKPOINT).matches;
      setVideoSource(isMobile ? "/solana-ascii-mobile.mp4" : "/solana-ascii-desktop.mp4");
    }, VIDEO_START_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!videoSource) return;

    const video = videoRef.current;
    if (!video) return;

    video.load();
    void video.play().catch(() => {
      // Autoplay can still be blocked by a browser policy; the poster remains visible.
    });
  }, [videoSource]);

  return (
    <div className={styles.frame} aria-hidden="true">
      <Image
        className={styles.poster}
        src="/solana-ascii-poster.webp"
        alt=""
        width={768}
        height={670}
        priority
        fetchPriority="high"
        sizes="(max-width: 767px) 300px, (max-width: 1100px) 380px, 500px"
      />
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload={videoSource ? "metadata" : "none"}
        poster="/solana-ascii-poster.webp"
        tabIndex={-1}
      >
        {videoSource ? <source src={videoSource} type="video/mp4" /> : null}
      </video>
    </div>
  );
}
