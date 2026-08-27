# Product color and logo audit

Audited on 27 August 2026 across `app`, `components`, `lib`, `data`, and `public`.

## Recommended palette

The product should use warm neutral surfaces with one brand accent. The lime is for primary action, progress, selection, and small navigational emphasis—not for warnings or decoration.

| Role | Color | Use |
| --- | --- | --- |
| Canvas | `#f5f5f5` | page background |
| Card | `#ffffff` | raised reading surfaces |
| Subtle surface | `#efefef` | secondary controls and grouped content |
| Border | `#dedede` | structural dividers |
| Ink | `#181818` | primary text |
| Muted ink | `#636363` | descriptions and metadata |
| Brand lime | `#a9ff2f` | mark, active progress, small emphasis, and selected/focus states |
| Control green | `#8fca32` | large light-theme actions where the canonical lime would overpower the surface |
| Lime ink | `#172006` | text on brand lime |
| Muted lime | `#557b11` | accessible accent text on light surfaces |
| Soft lime | `#e8ffc8` | selected or instructional backgrounds |
| Warning | `#a86608` | warnings only |
| Warning surface | `#fff4d6` | warning background on light surfaces |
| Danger | `#b44343` | errors and failed states |
| Danger surface | `#fff0f0` | error background on light surfaces |

## Yellow references found

- lesson syntax highlighting used yellow-gold for types;
- exercise topic badges used Tailwind yellow;
- warning callouts used the macOS terminal yellow;
- challenge save and compiler errors used amber;
- Runtime Lab errors used amber;
- Visual Builder warnings and the transaction block used amber;
- the faux terminal title bar uses the conventional yellow traffic-light control.

The first six were normalized: brand/learning emphasis now uses lime, and errors use rose/red. Warnings retain a quieter amber because changing warning semantics to brand lime would make warnings read as success. The terminal traffic-light control remains yellow intentionally; it is interface chrome rather than a product accent.

## Logo placement policy

- LearnSol lockups belong in navigation, footers, metadata, app icons, and the branding page.
- Solana, Rust, Anchor, and Solana Kit marks identify their respective modules, module headers, documentation navigation, and challenge tracks.
- The Anchor mark identifies the local-program build workflow.
- The capstone art identifies complete-build challenges.
- The tool icon identifies Runtime Lab; Anchor identifies the program-oriented Visual Builder.
- Solana Foundation and sponsor marks appear only where the relationship is stated, never as decorative endorsement.
- CPMM and Orderbook artwork remains exclusive to those challenge tracks.
- Game artwork stays inside the Solana Clicker experience; sprite sheets and game assets must not leak into general product navigation.

Legacy duplicate exports such as `solanaMain.png`, `learnsol-logo.png`, and `learnsol-icon.png` are retained for compatibility, but canonical brand components use the files under `public/brand`. Repeating every duplicate asset would weaken hierarchy and create inconsistent marks.

## Identity pass

The homepage hero uses a color-preserving ASCII treatment generated from the latest clean Solana source. The original gradient is sampled into the glyph field, and the source alpha is used as a strict shape gate so no fragments leak into the gaps between the three bars. The cleaned `public/solanaLogo4k.png` remains the high-resolution source for module and opportunity marks, while the matching poster/video pair powers the animated hero.

The supplied `public/solanaFoundationLogo.svg` is the canonical Foundation lockup on light surfaces; its wordmark is ink-colored while the Solana mark keeps its source gradient.

The light navigation and shared footer render the `learn.sol` name as text beside the transparent LearnSol mark. This avoids placing the legacy black-background text tile on a light surface.
