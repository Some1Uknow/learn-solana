"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import styles from "./homepage.module.css";

export function CopySkillCommandButton({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      className={styles.copyButton}
      onClick={copyCommand}
      aria-label="Copy skills CLI install command"
    >
      {copied ? (
        <Check className={styles.copyIcon} aria-hidden="true" />
      ) : (
        <Copy className={styles.copyIcon} aria-hidden="true" />
      )}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
