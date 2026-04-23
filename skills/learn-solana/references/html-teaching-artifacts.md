# HTML Teaching Artifacts

Use this reference when creating temporary visual explanations.

## Artifact Goals

An HTML artifact should make a concept visible. It should not be a decorative landing page.

Prioritize:

- clear labels
- before/after state
- actor relationships
- ordered steps
- compact tables
- one meaningful animation

Avoid:

- vague illustrations
- hidden explanations that only live in prose
- complex frameworks
- dependency installation
- animation that does not teach sequence or causality

## Required Structure

Use one self-contained HTML file:

- `<header>` for the concept name and one-sentence definition
- `<main>` for the diagram, table, or stepper
- `<section>` blocks for before/after state, common mistakes, and recap
- inline `<style>` for CSS
- small inline `<script>` only when interaction or animation improves learning

## Visual Patterns

### Account Relationship Diagram

Use boxes for accounts and arrows for authority or ownership.

Required labels:

- address or role
- owner program
- data stored
- who can modify it

### Transaction Flow

Use lanes for user, wallet, transaction, programs, and accounts.

Required labels:

- signer
- instruction order
- accounts read
- accounts written
- final state

### PDA Derivation

Use a recipe layout:

- seed 1
- seed 2
- program id
- bump
- derived PDA

Add a signer comparison table explaining why a PDA has no private key.

### CPI Flow

Use nested or stacked calls:

- user signs transaction
- program A starts
- program A invokes program B
- program B reads/writes passed accounts
- control returns to program A

Show which signer privileges are forwarded.

## Animation Guidance

Use CSS animations for:

- moving from step 1 to step 2 to step 3
- highlighting the current account being read or written
- showing before/after state changes

Keep animations slow enough to follow. Provide a non-animated table or labels so the artifact still works if animation is missed.

## File Naming

Use descriptive temporary names:

- `tmp/pda-explainer.html`
- `tmp/cpi-flow.html`
- `tmp/spl-token-accounts.html`
- `tmp/transaction-lifecycle.html`

## Completion Checklist

- The artifact opens directly in a browser.
- It has no external runtime dependencies.
- The main idea is understandable from the visual alone.
- The diagram labels match the prose explanation.
- The file path is reported to the user.

