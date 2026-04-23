---
name: learn-solana
description: Teach any Solana, Anchor, Rust-for-Solana, SPL Token, PDA, account model, CPI, wallet, transaction, validator, or dApp concept from first principles. Use when the user asks to understand, learn, explain, visualize, compare, practice, or turn a Solana topic into a lesson, tutorial, exercise, diagram, table, or temporary HTML teaching artifact.
license: MIT
metadata:
  author: LearnSol
  version: "1.0.0"
---

# Learn Solana

This skill turns an agent into a Solana teacher. It is for explaining any Solana topic from first principles, then making the idea concrete with examples, diagrams, tables, exercises, and temporary HTML artifacts when useful.

## Activation

Use this skill when the user asks to:

- explain or simplify a Solana concept
- learn Solana, Anchor, SPL Token, PDAs, CPIs, wallets, validators, transactions, programs, or accounts
- compare Solana primitives or developer workflows
- create lessons, MDX tutorials, quizzes, exercises, or checkpoints
- make a temporary visual artifact to teach a Solana idea
- debug confusion about how a Solana mechanism works

Do not use this skill for generic blockchain explanations unless the answer is explicitly tied back to Solana.

## Required Teaching Contract

Every teaching response must follow this shape unless the user asks for a different format:

1. Start with a one-sentence plain-English definition.
2. Explain why the concept exists.
3. Build the mental model with a familiar analogy only if it reduces confusion.
4. Explain the Solana-specific mechanism.
5. Show a concrete example with realistic names, accounts, instructions, or code.
6. Call out common beginner mistakes.
7. End with a short recap and one practice prompt.

Keep the language simple. Define every term before relying on it. Avoid unexplained jargon, vague metaphors, and hype.

## Visual Teaching Rule

If the concept involves movement, ownership, relationships, state changes, or multiple actors, create or propose a visual artifact.

Use visuals for:

- transaction and instruction flow
- account ownership and data layout
- PDA derivation and signer behavior
- CPI call stacks
- token mint, token account, and associated token account relationships
- staking, validator, or consensus flows
- Anchor account validation and instruction lifecycle

For visual work, first read `references/html-teaching-artifacts.md`. Use `assets/teaching-artifact-template.html` as the base for temporary HTML files.

## Reference Loading

Load only what the task needs:

- `references/topic-framework.md` for the canonical explanation structure and topic-specific teaching angles.
- `references/html-teaching-artifacts.md` when creating diagrams, tables, animations, or temporary HTML teaching files.
- `references/quality-rubric.md` before finalizing substantial lesson content or any reusable artifact.

## Temporary HTML Artifacts

When creating a temporary HTML artifact:

- Put it in a scratch location such as `tmp/` or another project-appropriate temporary folder.
- Make it self-contained: one HTML file with inline CSS and minimal inline JavaScript.
- Use semantic sections, readable typography, high contrast, and responsive layout.
- Prefer boxes, arrows, lanes, tables, and step animations over decorative graphics.
- Use animation only to clarify sequence or state change.
- Include labels directly on the diagram so it remains useful without narration.
- Tell the user the local file path when finished.

Do not introduce build dependencies for a teaching artifact unless the user asks for a production component.

## Lesson Output Format

For a reusable lesson, produce:

1. Title
2. Audience level
3. Learning goals
4. Prerequisites
5. First-principles explanation
6. Solana-specific walkthrough
7. Example or exercise
8. Checkpoint questions
9. Common mistakes
10. Extension task

For MDX lessons, keep headings scannable, code blocks short, and diagrams close to the concept they explain.

## Quality Gate

Before finalizing, verify:

- The first sentence is understandable to a beginner.
- Every Solana-specific term is defined before use.
- The example uses realistic Solana primitives.
- The explanation separates mental model from implementation detail.
- Tables or diagrams clarify relationships instead of repeating prose.
- The learner has one concrete next action.