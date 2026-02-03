import type { Edge, Node, Viewport } from "reactflow";
import type { BlockKind } from "./blocks";

export interface VisualBuilderNodeData {
  kind: BlockKind;
  label: string;
  description: string;
}

export type VisualBuilderNode = Node<VisualBuilderNodeData>;
export type VisualBuilderEdge = Edge;

export interface VisualBuilderGraph {
  version: 1;
  nodes: VisualBuilderNode[];
  edges: VisualBuilderEdge[];
  viewport?: Viewport;
}
