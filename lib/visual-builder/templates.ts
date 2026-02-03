import type { VisualBuilderGraph } from "./schema";
import type { BlockKind } from "./blocks";
import { createNodeFromBlock } from "./blocks";
import { nanoid } from "nanoid";

export interface TemplateStepRequirement {
  nodeKinds?: BlockKind[];
  edges?: Array<{ from: BlockKind; to: BlockKind }>;
}

export interface TemplateStep {
  id: string;
  title: string;
  description: string;
  requires?: TemplateStepRequirement;
}

export interface VisualBuilderTemplate {
  id: string;
  name: string;
  description: string;
  graph: VisualBuilderGraph;
  steps: TemplateStep[];
}

interface TemplateNodeSpec {
  kind: BlockKind;
  position: { x: number; y: number };
}

interface TemplateEdgeSpec {
  from: number;
  to: number;
}

function buildTemplateGraph(
  nodes: TemplateNodeSpec[],
  edges: TemplateEdgeSpec[]
): VisualBuilderGraph {
  const createdNodes = nodes.map((node) => createNodeFromBlock(node.kind, node.position));
  const createdEdges = edges.map((edge) => ({
    id: nanoid(),
    source: createdNodes[edge.from]?.id ?? "",
    target: createdNodes[edge.to]?.id ?? "",
  }));

  return {
    version: 1,
    nodes: createdNodes,
    edges: createdEdges,
  };
}

export const VISUAL_BUILDER_TEMPLATES: VisualBuilderTemplate[] = [
  {
    id: "quickstart",
    name: "Quick Start",
    description: "Program + Instruction + Signer + Account",
    graph: buildTemplateGraph(
      [
        { kind: "program", position: { x: 60, y: 80 } },
        { kind: "instruction", position: { x: 340, y: 60 } },
        { kind: "signer", position: { x: 620, y: 40 } },
        { kind: "account", position: { x: 620, y: 200 } },
      ],
      [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 1, to: 3 },
      ]
    ),
    steps: [
      {
        id: "qs-1",
        title: "Program + Instruction",
        description: "Make sure you have a Program and Instruction block on the canvas.",
        requires: { nodeKinds: ["program", "instruction"] },
      },
      {
        id: "qs-2",
        title: "Connect Program → Instruction",
        description: "Draw a connection from Program to Instruction.",
        requires: { edges: [{ from: "program", to: "instruction" }] },
      },
      {
        id: "qs-3",
        title: "Add a Signer",
        description: "Add a Signer block (the wallet paying fees).",
        requires: { nodeKinds: ["signer"] },
      },
      {
        id: "qs-4",
        title: "Connect Instruction → Signer",
        description: "Connect your Instruction to the Signer.",
        requires: { edges: [{ from: "instruction", to: "signer" }] },
      },
      {
        id: "qs-5",
        title: "Add an Account",
        description: "Add an Account block to store program state.",
        requires: { nodeKinds: ["account"] },
      },
      {
        id: "qs-6",
        title: "Connect Instruction → Account",
        description: "Connect the Instruction to the Account.",
        requires: { edges: [{ from: "instruction", to: "account" }] },
      },
      {
        id: "qs-7",
        title: "Export Anchor",
        description: "Click Export Anchor to download your lib.rs starter code.",
      },
    ],
  },
  {
    id: "token-mint",
    name: "Token Mint Flow",
    description: "Create a mint and a token account",
    graph: buildTemplateGraph(
      [
        { kind: "program", position: { x: 60, y: 80 } },
        { kind: "instruction", position: { x: 340, y: 60 } },
        { kind: "signer", position: { x: 620, y: 40 } },
        { kind: "tokenMint", position: { x: 620, y: 200 } },
        { kind: "tokenAccount", position: { x: 860, y: 200 } },
      ],
      [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 1, to: 4 },
      ]
    ),
    steps: [
      {
        id: "tm-1",
        title: "Program + Instruction",
        description: "Ensure Program and Instruction are present.",
        requires: { nodeKinds: ["program", "instruction"] },
      },
      {
        id: "tm-2",
        title: "Add Mint + Token Account",
        description: "Add Token Mint and Token Account blocks.",
        requires: { nodeKinds: ["tokenMint", "tokenAccount"] },
      },
      {
        id: "tm-3",
        title: "Connect Instruction → Token Mint",
        description: "Connect Instruction to Token Mint.",
        requires: { edges: [{ from: "instruction", to: "tokenMint" }] },
      },
      {
        id: "tm-4",
        title: "Connect Instruction → Token Account",
        description: "Connect Instruction to Token Account.",
        requires: { edges: [{ from: "instruction", to: "tokenAccount" }] },
      },
      {
        id: "tm-5",
        title: "Add a Signer",
        description: "Add or connect a Signer for transaction fees.",
        requires: { nodeKinds: ["signer"] },
      },
      {
        id: "tm-6",
        title: "Export Anchor",
        description: "Export your starter Anchor program.",
      },
    ],
  },
  {
    id: "pda-vault",
    name: "PDA Vault",
    description: "Store state in a PDA",
    graph: buildTemplateGraph(
      [
        { kind: "program", position: { x: 60, y: 80 } },
        { kind: "instruction", position: { x: 340, y: 60 } },
        { kind: "signer", position: { x: 620, y: 40 } },
        { kind: "pda", position: { x: 620, y: 200 } },
        { kind: "account", position: { x: 860, y: 200 } },
      ],
      [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 1, to: 4 },
      ]
    ),
    steps: [
      {
        id: "pv-1",
        title: "Program + Instruction",
        description: "Ensure Program and Instruction are present.",
        requires: { nodeKinds: ["program", "instruction"] },
      },
      {
        id: "pv-2",
        title: "Add a PDA",
        description: "Add a PDA block to represent program-owned state.",
        requires: { nodeKinds: ["pda"] },
      },
      {
        id: "pv-3",
        title: "Connect Instruction → PDA",
        description: "Connect the Instruction to the PDA.",
        requires: { edges: [{ from: "instruction", to: "pda" }] },
      },
      {
        id: "pv-4",
        title: "Add an Account",
        description: "Add an Account block for additional state.",
        requires: { nodeKinds: ["account"] },
      },
      {
        id: "pv-5",
        title: "Connect Instruction → Account",
        description: "Connect the Instruction to the Account.",
        requires: { edges: [{ from: "instruction", to: "account" }] },
      },
      {
        id: "pv-6",
        title: "Export Anchor",
        description: "Export your Anchor starter code.",
      },
    ],
  },
];
