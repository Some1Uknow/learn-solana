"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

import styles from "./challenges-v2.module.css";

const MIN_LEFT_PANE_PERCENT = 34;
const MAX_LEFT_PANE_PERCENT = 66;

type Props = {
  problemPanel: ReactNode;
  editorPanel: ReactNode;
};

export default function ChallengeWorkspaceClient({
  problemPanel,
  editorPanel,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [leftPanePercent, setLeftPanePercent] = useState(48);
  const [isDragging, setIsDragging] = useState(false);

  const clampLeftPanePercent = useCallback((value: number) => {
    return Math.min(Math.max(value, MIN_LEFT_PANE_PERCENT), MAX_LEFT_PANE_PERCENT);
  }, []);

  const updateSplitFromPointer = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0) return;
      const next = ((clientX - rect.left) / rect.width) * 100;
      setLeftPanePercent(clampLeftPanePercent(next));
    },
    [clampLeftPanePercent]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (event: PointerEvent) => {
      event.preventDefault();
      updateSplitFromPointer(event.clientX);
    };

    const stopDragging = () => setIsDragging(false);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    };
  }, [isDragging, updateSplitFromPointer]);

  useEffect(() => {
    if (!isDragging) return;
    const originalCursor = document.body.style.cursor;
    const originalSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    return () => {
      document.body.style.cursor = originalCursor;
      document.body.style.userSelect = originalSelect;
    };
  }, [isDragging]);

  const handleSeparatorPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    updateSplitFromPointer(event.clientX);
    setIsDragging(true);
  };

  const desktopGridTemplate = useMemo(
    () => `${leftPanePercent}% 12px minmax(0, 1fr)`,
    [leftPanePercent]
  );

  return (
    <div
      ref={containerRef}
      className={styles.workspaceBody}
      style={{ ["--workspace-columns" as string]: desktopGridTemplate }}
    >
      <section className={`${styles.workspacePanel} ${styles.workspacePanelLeft}`}>
        {problemPanel}
      </section>

      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize workspace panels"
        onPointerDown={handleSeparatorPointerDown}
        className={`${styles.workspaceResizeHandle} ${
          isDragging ? styles.workspaceResizeHandleActive : ""
        }`}
      >
        <div className={styles.workspaceResizeGrip} />
      </div>

      <section className={`${styles.workspacePanel} ${styles.workspacePanelRight}`}>
        {editorPanel}
      </section>
    </div>
  );
}
