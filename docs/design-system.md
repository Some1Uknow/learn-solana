# LearnSol design system

This document is the visual contract for the LearnSol redesign. The reference is BuildAnything's current product UI grammar: restrained, dense, literal, and product-first. LearnSol keeps its own identity, content, routes, and lime accent; it does not copy BuildAnything branding or assets.

## 1. Principles

1. **Product before decoration.** Show curriculum, progress, challenges, tools, and actions before marketing visuals.
2. **Literal language.** UI labels describe what a user can do. Avoid abstract product language.
3. **Dense, not cramped.** Prefer compact vertical rhythm and useful metadata over full-screen sections.
4. **One strong accent.** Lime is a state/action color, not a background effect.
5. **Flat hierarchy first.** Use spacing, type, borders, and contrast before shadows, gradients, or motion.
6. **Functional cards.** A card should contain an action, status, metadata, or real content—not just decorate a logo.
7. **Motion is feedback.** No ambient marquee, floating, orbit, glow, or continuous motion unless it communicates state.

## 2. Core palette

Reference dark tokens extracted from BuildAnything and adapted for LearnSol:

| Token | Value | Use |
| --- | --- | --- |
| `--ds-background` | `#060606` | page background |
| `--ds-foreground` | `#fcfcfc` | primary text |
| `--ds-card` | `#181818` | cards, menus, raised surfaces |
| `--ds-secondary` | `#232323` | secondary controls / hover surfaces |
| `--ds-muted` | `#272727` | quiet fills |
| `--ds-muted-foreground` | `#a0a0a0` | descriptions, metadata |
| `--ds-border` | `#292929` | default borders |
| `--ds-primary` | `#a9ff2f` | LearnSol action / active / progress accent |
| `--ds-primary-foreground` | `#060606` | text on lime |
| `--ds-danger` | `#ec5448` | destructive states only |
| `--ds-success` | `#22c55e` | success states only |

### Accent rules

Use lime for:
- primary CTA
- selected/current state
- progress/completion emphasis
- focus rings
- a small number of important links

Do not use lime for:
- radial page glows
- decorative halos
- every heading or icon
- large tinted panels unless the state is semantically important

## 3. Typography

### Families

- **UI / editorial:** Inter, variable 100–900
- **Code / utility labels:** Roboto Mono, variable 100–700
- **Pixel display:** do not introduce by default; reserve for a deliberate, rare treatment if the design needs it later

Fallbacks:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
font-family: "Roboto Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
```

### Scale

Use the reference scale rather than inventing display sizes:

| Name | Size | Typical use |
| --- | ---: | --- |
| xs | 12px | tiny metadata / section counters |
| sm | 14px | navigation, labels, metadata |
| base | 16px | body / card copy |
| lg | 18px | lead copy |
| xl | 20px | compact card headings |
| 2xl | 24px | section subhead |
| 3xl | 30px | section heading |
| 4xl | 36px | large section heading |
| 5xl | 48px | desktop hero ceiling |
| 6xl | 60px | exceptional marketing use only |

Rules:
- hero copy should normally cap around 48px, not 80–90px
- headings use `font-weight: 500–600`
- body is 400
- nav / compact UI is 500
- use tight tracking (`-0.02em` to `-0.04em`) only on larger headings
- body line-height: `1.5–1.625`

## 4. Spacing

Base unit: **4px**.

Preferred steps: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80`.

Avoid arbitrary spacing unless a measured layout requires it.

### Page rhythm

- desktop shell horizontal gutter: `32–40px`
- tablet: `24px`
- mobile: `16px`
- standard section block: `64–96px`, not `100svh`
- compact section label → heading: `12–16px`
- heading → supporting copy: `12–18px`
- section heading → content grid: `32–48px`

## 5. Containers

Reference container scale:

- `xs`: 320px
- `sm`: 384px
- `md`: 448px
- `lg`: 512px
- `xl`: 576px
- `2xl`: 672px
- `3xl`: 768px
- `4xl`: 896px

LearnSol application shell:

```css
width: min(1200px, calc(100vw - 64px));
margin-inline: auto;
```

Use narrower reading widths for prose (`672–768px`).

Never use `100vw` children inside a centered shell to create decorative full-bleed motion.

## 6. Radius, borders, shadows

Reference radius scale:

- `md`: 6px
- `lg`: 8px
- `xl`: 12px
- `3xl`: 24px (rare)

Defaults:
- controls: `6–8px`
- cards: `8–12px`
- dialogs: `12px`
- pills only for genuinely pill-shaped concepts such as tags/status chips

Border: `1px solid #292929`.

Default card shadow: none.

Floating overlays may use restrained shadow such as:

```css
box-shadow: 0 24px 60px -40px rgba(0, 0, 0, 0.7);
```

Do not use glow shadows as hierarchy.

## 7. Navigation

Navigation should be compact and stable.

Desktop:
- 64–68px tall
- logo left
- primary product navigation in normal document flow
- utilities/actions right
- no absolute-centered nav cluster
- no ordinary nav pills
- active state via text contrast / subtle surface, not glowing lime pills

Mobile:
- one compact menu button
- flat list of destinations
- preserve the same information architecture as desktop
- avoid nested decorative cards inside the menu

## 8. Buttons

### Primary
- lime background
- near-black text
- 40–44px default height
- 8px radius
- 14px / 500–600 text
- no glow

### Secondary
- card/secondary background or transparent
- 1px border
- foreground text
- same height/radius as primary

### Ghost
- transparent
- muted foreground
- secondary background on hover

Focus: 2px lime ring with visible offset.

No oversized 54px pill CTAs by default.

## 9. Cards

Cards must answer at least one of:
- What is this?
- What can I do here?
- What is my progress/status?
- What does this contain?

Default card:
- `#181818`
- 1px `#292929` border
- 8–12px radius
- 16–24px padding
- no decorative gradient
- no giant empty illustration region

Track cards should prioritize:
1. track/title
2. concise description
3. lesson/challenge/progress metadata
4. clear start/continue action

## 10. Section headers

Preferred grammar:

```text
[ 01 / 05 ] · Start learning
Learning tracks
Short literal description.
```

- counter/kicker: Roboto Mono, 12px, muted
- heading: Inter 30–48px depending context
- body: 16–18px, muted

Do not make every section a full viewport.

## 11. Forms and controls

- backgrounds: `#181818` or `#232323`
- border: `#292929`
- focus: lime ring
- 8px radius
- labels 12–14px
- help/error text adjacent to the control
- preserve density in developer tools where density is useful

## 12. Motion

Allowed:
- 150ms hover/focus color transitions
- 150–300ms menu/dialog transitions
- progress/state transitions

Avoid:
- infinite marquees
- ambient float
- ambient glow pulse
- auto-rotating decorative objects
- motion that consumes CPU without helping comprehension

Always respect `prefers-reduced-motion`.

## 13. Responsive behavior

- no horizontal scrolling at 320px+
- use `min-width: 0` in flexible/grid children
- long code/commands may scroll within their own bounded container
- cards collapse to one column when content no longer fits
- navigation collapses before labels become compressed
- do not hide layout problems using global `overflow-x: hidden`

## 14. Copy rules

UI copy is part of the design system.

Prefer:
- "30 Rust challenges"
- "Run the code"
- "Continue lesson"
- "Learn Rust, Anchor, and Solana clients"

Avoid:
- "durable product loop"
- "coherent system"
- "developer trust"
- "surfaces developers return to"
- "tighter loop that compounds"
- "entire-stack coverage" when a concrete list is available

No generic AI/startup filler such as unlock, empower, seamless, supercharge, revolutionize, or journey.

## 15. Do / don't

### Do
- show real curriculum early
- show real progress and challenge metadata
- use screenshots/product surfaces as proof
- keep sections compact
- let typography and borders carry hierarchy
- reuse a small number of primitives

### Don't
- default to bento grids
- put logos in 31rem poster cards
- use giant globes or maps as generic crypto decoration
- build fake stat cards around weak metrics
- use marquees to show compatible logos
- add gradients to make an empty layout feel designed
- create one-off visual systems per section

## 16. LearnSol-specific adaptation

BuildAnything is the reference for density, typography, radius, border, spacing, and information hierarchy. LearnSol remains recognizably LearnSol through:

- `learn.sol` brand assets
- `#A9FF2F` primary accent
- Solana/Rust/Anchor curriculum content
- challenge/progress data
- Runtime Lab, Visual Builder, and Agent Skill product surfaces

When the reference and an existing LearnSol functional requirement conflict, preserve functionality and apply the closest compatible design-system rule.
