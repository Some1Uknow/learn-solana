import type { VisualBuilderGraph } from "./schema";

const STORAGE_KEY = "learnsol.visualBuilder.v1";

export function loadGraph(): VisualBuilderGraph | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as VisualBuilderGraph;
    if (!parsed || parsed.version !== 1) return null;
    return parsed;
  } catch (error) {
    console.warn("Failed to load visual builder graph", error);
    return null;
  }
}

export function saveGraph(graph: VisualBuilderGraph): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(graph));
  } catch (error) {
    console.warn("Failed to save visual builder graph", error);
  }
}

export function clearGraph(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear visual builder graph", error);
  }
}
