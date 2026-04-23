# HTML Teaching Artifacts

Use this reference when creating temporary HTML explainers.

## Artifact Goals

An HTML artifact should be a minimal one-page teaching note. It should feel like a polished Vercel-style technical article: calm typography, strong structure, white space, thin borders, and no visual noise.

The default output is not a diagram dashboard. It is a condensed master-teacher notes page for someone who does not know the topic at all.

Prioritize:

- one-sentence first-principles definition
- why the concept exists
- simple mental model
- compact Solana-specific mechanics
- one realistic example
- tiny tables for relationships or before/after state
- common mistakes
- one practice prompt

Avoid:

- decorative illustrations
- dashboard-style cards
- large visual systems when text would teach better
- complex frameworks
- dependency installation
- gradients, glows, shadows, bokeh, and stock decorative backgrounds
- animation unless the user explicitly asks for it

## Required Structure

Use one self-contained HTML file:

- `<header>` for the concept name, level, and one-sentence definition
- `<main>` for the notes content
- `<section>` blocks for mental model, mechanics, example, mistakes, and practice
- inline `<style>` for CSS
- no JavaScript unless the user explicitly asks for interactivity

## Required Page Sections

Use this sequence unless the user requests a different teaching format:

1. `What this is` - one plain-English definition and a tiny glossary if needed.
2. `Why it exists` - the problem this concept solves.
3. `Mental model` - a simple model, clearly marked as a simplification.
4. `How Solana does it` - concrete mechanics and vocabulary.
5. `Walkthrough` - ordered steps using realistic account/program names.
6. `Tiny table` - comparison, before/after state, or actor responsibility.
7. `Common mistakes` - short bullets.
8. `Practice` - one exercise that checks understanding.

## Minimal Visual Patterns

Use these only as compact teaching aids inside the notes page.

### Relationship Table

Use for account ownership, token roles, authority, or CPI privileges.

Columns should usually be:

- thing
- what it means
- who controls it
- beginner translation

### Before/After Table

Use when state changes.

Columns should usually be:

- step
- account or actor
- what changed

### Recipe List

Use for PDA seeds, transaction construction, or Anchor validation.

Keep it as an ordered list or a two-column table. Avoid giant arrows unless the user asks.

## Style Rules

Use a restrained system:

- background: `#fff`
- text: near black
- muted text: neutral gray
- accent: one restrained blue or black
- borders: `1px solid #e5e7eb`
- radius: 12px or less
- no heavy shadows

Typography:

- system sans for prose
- system mono for code and addresses
- body text around 16px
- readable line-height
- max content width around 920px
- no huge hero typography

## File Naming

Use descriptive temporary names:

- `tmp/pda-explainer.html`
- `tmp/cpi-flow.html`
- `tmp/spl-token-accounts.html`
- `tmp/transaction-lifecycle.html`

## Completion Checklist

- The artifact opens directly in a browser.
- It has no external runtime dependencies.
- The main idea is understandable from the first screen.
- The page can teach someone who has never seen the topic.
- It is concise enough to scan in under five minutes.
- It contains a concrete Solana example.
- Tables clarify relationships instead of decorating the page.
- The file path is reported to the user.
