import Image from "next/image";

import styles from "./solana-mark.module.css";

export function SolanaMark() {
  return (
    <div className={styles.frame} aria-hidden="true">
      <Image
        className={styles.logo}
        src="/solanaLogo4k.png"
        alt=""
        width={1343}
        height={1171}
        priority
        sizes="(max-width: 767px) 300px, (max-width: 1100px) 380px, 500px"
      />
    </div>
  );
}
