import Image from "next/image";

import styles from "./solana-mark.module.css";

export function SolanaMark() {
  return (
    <div className={styles.frame} aria-hidden="true">
      <Image
        className={styles.poster}
        src="/solana-ascii-poster.png"
        alt=""
        width={768}
        height={670}
        priority
        sizes="(max-width: 767px) 300px, (max-width: 1100px) 380px, 500px"
      />
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/solana-ascii-poster.png"
        tabIndex={-1}
      >
        <source src="/solana-ascii.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
