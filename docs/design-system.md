# LearnSol design system

This is a forensic reconstruction of BuildAnything's live light UI, adapted only where LearnSol branding or product concepts require it. Measurements were taken on 27 August 2026 at 1440px, with responsive behavior checked at 768px and 390px. BuildAnything content and assets are not copied.

## A. Measured / observed

### 1. Design principles

- Product-first, restrained and editorial: hierarchy comes from type, spacing, thin borders and neutral surfaces.
- Dense enough to show curriculum and progress without full-viewport marketing sections.
- Controls are compact and rectangular with a 6px radius. Cards are quiet white surfaces.
- Decorative motion is absent. Interaction feedback uses opacity, color and a short active scale.

### 2. Color system

Observed light tokens: background `#f5f5f5`, foreground `#181818`, card `#ffffff`, secondary `#efefef`, muted `#ebebeb`, muted foreground `#636363`, border/input `#dedede`. BuildAnything primary is `#6e54ff`.

LearnSol keeps `#a9ff2f` for the mark, progress and small selected indicators. Large light-theme controls use the calmer derived green `#8fca32` (hover `#7eaf2e`) with near-black `#172006` text. Lime is never a page or large-section surface and has no glow.

### 3–7. Typography, roles, scale, line height and tracking

- UI/editorial: Inter variable. Code and utility labels: Roboto Mono variable. The reference also loads geistPixel but uses it selectively.
- Body: 16px/24px; long-form lesson body: 16px/28px; muted hero copy: 16px/26px.
- Hero and page H1 at desktop: 48px/48px, weight 500, tracking `-0.03em`.
- Section H2: 30px/30px, weight 500, tracking `-0.02em`.
- Lesson H2: 24px/32px, weight 500. Card title: 20px/20px, weight 500.
- Button/navigation: 14px/20px, weight 500. Code: Roboto Mono 14px/24px.
- Utility/section labels: Roboto Mono 12px/16px, uppercase, visibly expanded tracking.

### 8–12. Spacing, containers, grids and section rhythm

- Base spacing is a 4px system: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.
- Desktop content shell measured 1182px wide at 1440px, producing 129px side gutters.
- Lesson reading column measured 720px; table-of-contents rail measured 275px; gap measured 32px.
- Desktop hero content begins around 169px from viewport top beneath a 73px navigation.
- Hero title → description: 16px; description → CTA: 24px. Standard page intro uses a 16px stack gap.
- Track sections are full-width bands with content aligned to the 1182px shell; two-column content is used only where it carries real information.

### 13. Background treatments

The page is a flat `#f5f5f5`. The homepage uses a fixed viewport-sized background layer behind the page:

```css
background-image: radial-gradient(rgb(24 24 24 / 20%) 1px, transparent 0);
background-size: 26px 26px;
background-position: center;
mask-image: radial-gradient(ellipse 62% 52% at 50% 50%, black 28%, transparent 100%);
```

A second outer layer applies `backdrop-filter: blur(1.25px)` through `radial-gradient(ellipse 82% 72% at 50% 50%, transparent 55%, black 100%)`. There is no hero color gradient. The content surface remains partially transparent in the hero and becomes an opaque flat background at the next section, creating the transition.

### 14–16. Borders, radii and shadows

- Border: 1px `#dedede`.
- Radius: 4px small, 6px controls, 8px compact panels, 12px cards. Pills are reserved for true status/tag concepts.
- Cards use no visible elevation shadow. Buttons use `0 1px 2px rgb(0 0 0 / 20%)` plus a very faint inset top highlight.

### 17–18. Buttons and links

- Default button: 40px high, 6px radius, 20px horizontal padding, 14px/20px medium text.
- Primary uses the product accent; secondary uses `#efefef`; disabled returns to page background and muted text.
- Hover reduces opacity or changes neutral fill. Active state scales to 0.97. Focus is a visible 2px ring with offset.
- Text links stay literal and usually gain underline or opacity on hover. External links retain clear labels.

### 19–20. Cards and section labels

- Card: white, 1px border, 12px radius, typically 24px padding; no gradients or decorative icon wells.
- Track cards prioritize name, direct description, lesson count, action and access requirement.
- Section label grammar is `[ 01 / 04 ] · Start Learning`, in mono 12px uppercase. The current number may use the product accent; punctuation and descriptor stay muted.

### 21. Navigation

- Desktop navigation is sticky, 73px high, 16px vertical padding, 1px bottom border, `#f5f5f5` at 80% opacity and `backdrop-filter: blur(16px)`.
- Brand is left; flat text destinations occupy the center/right; utility controls and sign-in sit at the edge. Ordinary links do not use pills.
- Mobile uses the same 64–73px bar and a single menu control, then a flat bordered menu. Escape closes it and body scroll is contained while open.

### 22. Tables

Leaderboard grammar is a restrained bordered data region with mono/compact column labels, horizontal row dividers, 14–16px values and right-aligned numeric columns. On narrow screens, preserve data with a locally scrollable table or collapse secondary columns; never cause page overflow.

### 23. Progress UI

Progress is shown as direct counts, lesson metadata, completion state and compact bars. Accent is reserved for current/completed states. Unauthenticated states state the requirement beside the action.

### 24. Form controls

Controls are 40px minimum height, white or neutral-filled, 1px border, 6px radius, 14–16px text and an explicit focus ring. Errors sit adjacent to their field; disabled controls remain legible.

### 25. Code / mono UI

Roboto Mono is used for code, counters, durations, XP, breadcrumbs where appropriate and section labels. Code blocks are bounded, high-contrast neutral surfaces with local horizontal scrolling and a 6–8px radius.

### 26. Empty, loading and error states

States use the same card/border system and one plain sentence plus one next action. Loading controls retain their dimensions. No mascot illustration or invented marketing copy is required.

### 27. Mobile behavior

- At 390px, page gutters are 16px and cards stack to one column.
- Hero H1 steps down to 36px; section headings step down to 24px.
- The lesson course sidebar is removed from the reader; a compact right-hand table of contents remains on desktop and is hidden below the desktop reading breakpoint. Navigation collapses before labels compress.
- Controls remain at least 40px high. Long code and tables scroll inside their own containers.

### 28–29. States and motion

- Hover: 150ms color/opacity transition. Focus: 2px visible ring. Active: 0.97 scale for buttons only.
- Menus/dialogs may transition over 150–220ms. Respect `prefers-reduced-motion`.
- No ambient marquee, float, glow, orbit, animated background or automatic carousel.

### 30. Do / don't

Do show real modules, challenges, progress and tool actions early. Use literal copy, stable reading widths, subtle borders and repeated primitives. Do fix overflow at its source.

Do not use bento grids, glassmorphism, large lime surfaces, gradients as filler, glowing borders, floating blobs, giant pill CTAs, fake proof, invented metrics or a generic component-showcase aesthetic.

## B. Inferred

The following values could not be confirmed as authored tokens and are treated as implementation inferences:

- Tablet horizontal gutter: 24px between 768px and 1023px.
- Mobile section spacing: 64px; desktop section spacing: 80–96px depending content density.
- Default card padding: 24px desktop and 20px mobile, inferred from repeated visual bounds.
- Table row height: approximately 56px; exact authored value was not exposed as a single token.
- Dropdown shadow: `0 24px 60px -40px rgb(0 0 0 / 35%)`, used only for floating layers.
- Breakpoints follow common 768px/1024px boundaries suggested by the live responsive class behavior.

## LearnSol-specific deviations

- BuildAnything purple is replaced by LearnSol lime only for primary actions, progress, selected state and focus, because the products must remain separately branded.
- LearnSol developer workspaces retain higher information density and locally dark code editors because syntax legibility and existing editor behavior take priority over applying a white surface everywhere.
- Opportunity destinations remain accessible through one compact navigation group because LearnSol has more top-level concepts than the reference navigation.
