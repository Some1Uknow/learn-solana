import type { VisualBuilderGraph, VisualBuilderNode } from "./schema";
import type { BlockKind } from "./blocks";

interface ExportResult {
  filename: string;
  contents: string;
  warnings: string[];
}

const RESERVED_IDENTIFIERS = new Set([
  "self",
  "super",
  "crate",
  "mod",
  "type",
  "pub",
  "fn",
  "struct",
]);

function toSnakeCase(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function toPascalCase(value: string): string {
  return toSnakeCase(value)
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function normalizeIdentifier(value: string, fallback: string): string {
  const normalized = toSnakeCase(value);
  if (!normalized) return fallback;
  if (/^[0-9]/.test(normalized)) return `${fallback}_${normalized}`;
  if (RESERVED_IDENTIFIERS.has(normalized)) return `${normalized}_value`;
  return normalized;
}

function getConnectedNodes(node: VisualBuilderNode, nodes: VisualBuilderNode[], edges: VisualBuilderGraph["edges"]) {
  const connectedIds = new Set<string>();
  edges.forEach((edge) => {
    if (edge.source === node.id) connectedIds.add(edge.target);
    if (edge.target === node.id) connectedIds.add(edge.source);
  });

  return nodes.filter((candidate) => connectedIds.has(candidate.id));
}

function isTokenKind(kind: BlockKind) {
  return kind === "tokenMint" || kind === "tokenAccount";
}

export function exportAnchorProgram(graph: VisualBuilderGraph): ExportResult {
  const warnings: string[] = [];
  const nodes = graph.nodes ?? [];

  const programNode = nodes.find((node) => node.data.kind === "program");
  const moduleName = normalizeIdentifier(programNode?.data.label ?? "", "learnsol_program");
  if (!programNode) {
    warnings.push("No Program block found. Using learnsol_program as default module name.");
  }

  let instructionNodes = nodes.filter((node) => node.data.kind === "instruction");
  if (instructionNodes.length === 0) {
    warnings.push("No Instruction blocks found. Added a default initialize instruction.");
    instructionNodes = [
      {
        id: "default-instruction",
        type: "block",
        position: { x: 0, y: 0 },
        data: {
          kind: "instruction",
          label: "Initialize",
          description: "Default instruction",
        },
      },
    ];
  }

  const usesTokenProgram = nodes.some((node) => isTokenKind(node.data.kind));

  const lines: string[] = [];
  lines.push("use anchor_lang::prelude::*;");
  if (usesTokenProgram) {
    lines.push("use anchor_spl::token::{Mint, Token, TokenAccount};");
  }
  lines.push("");
  lines.push('declare_id!("11111111111111111111111111111111");');
  lines.push("");
  lines.push("#[program]");
  lines.push(`pub mod ${moduleName} {`);
  lines.push("    use super::*;");
  lines.push("");

  instructionNodes.forEach((instruction) => {
    const fnName = normalizeIdentifier(instruction.data.label || "instruction", "instruction");
    const structName = toPascalCase(fnName);
    lines.push(`    pub fn ${fnName}(ctx: Context<${structName}>) -> Result<()> {`);
    lines.push("        Ok(())");
    lines.push("    }");
    lines.push("");
  });

  lines.push("}");
  lines.push("");

  instructionNodes.forEach((instruction) => {
    const fnName = normalizeIdentifier(instruction.data.label || "instruction", "instruction");
    const structName = toPascalCase(fnName);
    const connectedNodes = getConnectedNodes(instruction, nodes, graph.edges ?? []);

    const signerNodes = connectedNodes.filter((node) => node.data.kind === "signer");
    const accountNodes = connectedNodes.filter(
      (node) =>
        !["program", "instruction", "transaction", "signer"].includes(node.data.kind)
    );
    const usedFields = new Set<string>(["system_program", "token_program"]);

    lines.push("#[derive(Accounts)]");
    lines.push(`pub struct ${structName}<'info> {`);

    if (signerNodes.length > 0) {
      signerNodes.forEach((node, index) => {
        const baseName = normalizeIdentifier(node.data.label, `signer_${index + 1}`);
        let fieldName = baseName;
        let suffix = 1;
        while (usedFields.has(fieldName)) {
          suffix += 1;
          fieldName = `${baseName}_${suffix}`;
        }
        usedFields.add(fieldName);
        lines.push(`    pub ${fieldName}: Signer<'info>,`);
      });
    } else {
      usedFields.add("payer");
      lines.push("    pub payer: Signer<'info>,");
    }

    accountNodes.forEach((node, index) => {
      const fallbackName = `${node.data.kind}_${index + 1}`;
      const baseName = normalizeIdentifier(node.data.label, fallbackName);
      let fieldName = baseName;
      let suffix = 1;
      while (usedFields.has(fieldName)) {
        suffix += 1;
        fieldName = `${baseName}_${suffix}`;
      }
      usedFields.add(fieldName);

      if (node.data.kind === "tokenMint") {
        lines.push(`    pub ${fieldName}: Account<'info, Mint>,`);
        return;
      }

      if (node.data.kind === "tokenAccount") {
        lines.push("    #[account(mut)]");
        lines.push(`    pub ${fieldName}: Account<'info, TokenAccount>,`);
        return;
      }

      if (node.data.kind === "pda") {
        lines.push("    /// CHECK: Replace seeds + bump once your PDA design is finalized.");
        lines.push("    #[account(mut)]");
        lines.push(`    pub ${fieldName}: AccountInfo<'info>,`);
        return;
      }

      if (node.data.kind === "cpi") {
        lines.push("    /// CHECK: Replace with Program<'info, YourProgram> for CPI.");
        lines.push(`    pub ${fieldName}: AccountInfo<'info>,`);
        return;
      }

      if (node.data.kind === "account") {
        lines.push("    /// CHECK: Replace with Account<'info, YourAccount> once defined.");
        lines.push("    #[account(mut)]");
        lines.push(`    pub ${fieldName}: AccountInfo<'info>,`);
        return;
      }
    });

    if (usesTokenProgram) {
      lines.push("    pub token_program: Program<'info, Token>,");
    }
    lines.push("    pub system_program: Program<'info, System>,");
    lines.push("}");
    lines.push("");
  });

  lines.push("// Notes:");
  lines.push("// - Replace the program ID with your deployed program address.");
  lines.push("// - Rename account placeholders and add constraints as you learn Anchor.");
  lines.push("// - Add anchor-spl to Cargo.toml if you use token accounts.");

  return {
    filename: "lib.rs",
    contents: lines.join("\n"),
    warnings,
  };
}
