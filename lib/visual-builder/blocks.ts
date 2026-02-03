import type { VisualBuilderGraph, VisualBuilderNode } from "./schema";
import { nanoid } from "nanoid";

export type BlockKind =
  | "program"
  | "instruction"
  | "transaction"
  | "signer"
  | "account"
  | "pda"
  | "tokenMint"
  | "tokenAccount"
  | "cpi";

export interface BlockDefinition {
  kind: BlockKind;
  label: string;
  description: string;
  group: "Core" | "Accounts" | "Tokens" | "Advanced";
  accent: string;
}

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    kind: "program",
    label: "Program",
    description: "The Anchor program container that owns instructions.",
    group: "Core",
    accent: "#14f195",
  },
  {
    kind: "instruction",
    label: "Instruction",
    description: "A callable entrypoint inside your program.",
    group: "Core",
    accent: "#38bdf8",
  },
  {
    kind: "transaction",
    label: "Transaction",
    description: "Groups instructions into a single atomic action.",
    group: "Core",
    accent: "#f59e0b",
  },
  {
    kind: "signer",
    label: "Signer",
    description: "Wallet that signs and pays for the transaction.",
    group: "Accounts",
    accent: "#a855f7",
  },
  {
    kind: "account",
    label: "Account",
    description: "On-chain account holding program state or data.",
    group: "Accounts",
    accent: "#22c55e",
  },
  {
    kind: "pda",
    label: "PDA",
    description: "Program Derived Address managed by the program.",
    group: "Accounts",
    accent: "#f97316",
  },
  {
    kind: "tokenMint",
    label: "Token Mint",
    description: "Defines the token supply and mint authority.",
    group: "Tokens",
    accent: "#22d3ee",
  },
  {
    kind: "tokenAccount",
    label: "Token Account",
    description: "Holds tokens for a wallet or PDA.",
    group: "Tokens",
    accent: "#60a5fa",
  },
  {
    kind: "cpi",
    label: "CPI",
    description: "Cross-program invocation to another program.",
    group: "Advanced",
    accent: "#f472b6",
  },
];

export const BLOCK_GROUP_ORDER: BlockDefinition["group"][] = [
  "Core",
  "Accounts",
  "Tokens",
  "Advanced",
];

export const BLOCKS_BY_GROUP = BLOCK_DEFINITIONS.reduce(
  (acc, block) => {
    acc[block.group] = acc[block.group] ?? [];
    acc[block.group]?.push(block);
    return acc;
  },
  {} as Record<BlockDefinition["group"], BlockDefinition[]>
);

export function getBlockDefinition(kind: BlockKind): BlockDefinition {
  return (
    BLOCK_DEFINITIONS.find((block) => block.kind === kind) ??
    BLOCK_DEFINITIONS[0]
  );
}

export function createNodeFromBlock(
  kind: BlockKind,
  position: { x: number; y: number }
): VisualBuilderNode {
  const definition = getBlockDefinition(kind);

  return {
    id: nanoid(),
    type: "block",
    position,
    data: {
      kind,
      label: definition.label,
      description: definition.description,
    },
  };
}

export function createStarterNodes(): VisualBuilderNode[] {
  return [
    createNodeFromBlock("program", { x: 40, y: 60 }),
    createNodeFromBlock("instruction", { x: 380, y: 40 }),
    createNodeFromBlock("signer", { x: 380, y: 200 }),
    createNodeFromBlock("account", { x: 690, y: 60 }),
    createNodeFromBlock("tokenMint", { x: 690, y: 200 }),
  ];
}

export function createStarterGraph(): VisualBuilderGraph {
  const nodes = createStarterNodes();
  const [programNode, instructionNode, signerNode, accountNode, tokenMintNode] = nodes;

  const edges = [
    {
      id: nanoid(),
      source: programNode.id,
      target: instructionNode.id,
    },
    {
      id: nanoid(),
      source: instructionNode.id,
      target: signerNode.id,
    },
    {
      id: nanoid(),
      source: instructionNode.id,
      target: accountNode.id,
    },
    {
      id: nanoid(),
      source: instructionNode.id,
      target: tokenMintNode.id,
    },
  ];

  return { version: 1, nodes, edges };
}
