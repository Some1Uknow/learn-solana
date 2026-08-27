# BuildAnything reconstruction roadmap

This document tracks the corrective redesign that starts from the current `main` branch. The acceptance standard is recognition of BuildAnything's design grammar across the complete LearnSol product—not a light theme that merely uses similar colors.

## Reference evidence

The live reference was re-inspected on 27 August 2026. Confirmed desktop characteristics include a 73px navigation, centered destination group, 48px/48px hero heading, 16px/26px hero description, 40px controls with 6px radii, a 1182px content shell at 1440px, and a 26px masked dot field. The reference hero extends to roughly 570px below the navigation before transitioning to the first opaque section.

The current LearnSol deployment is directionally similar but still drifts in visible ways:

- navigation destinations sit too far left and the lime wordmark lacks contrast;
- the hero is shorter and the dot field is too faint and evenly distributed;
- mobile hero and section spacing do not match the reference rhythm;
- module cards approximate the reference but metadata and access/progress hierarchy are weaker;
- many deeper routes still use the previous dark design language;
- workspaces and auth states do not yet feel like restrained extensions of the same system;
- final responsive and zoom verification has not been completed.

## Route inventory and target pattern

| LearnSol surface | Closest BuildAnything pattern | Corrective PR |
| --- | --- | --- |
| global navigation/footer | site navigation/footer | A |
| `/` | homepage | B |
| `/modules` | tracks index | C |
| `/modules/[moduleId]` | individual track | C |
| `/learn/...` | lesson reader | C |
| `/challenges` | tracks index | C |
| `/challenges/[track]` | individual track + progress | C |
| challenge workspace | lesson exercises / restrained product extension | C |
| `/build` and build stages | track + exercise workspace | D |
| `/tools` and Runtime Lab | track/progress grammar | D |
| Visual Builder | restrained developer-tool extension | D |
| opportunity routes | leaderboard/structured-list grammar | D |
| partner/branding/auth/404 | restrained system extension | D |

## PR sequence

### PR A — Reference-correct foundation

- correct shell, typography, navigation and footer proportions;
- use the LearnSol mark with a high-contrast wordmark;
- consolidate shared focus, button, card, field and section-label behavior;
- add skip navigation and baseline responsive rules;
- record measured values and deviations.

### PR B — Homepage reconstruction

- reproduce the reference hero height, masked dot field and surface transition;
- rebuild module, challenge, tool, agent-skill and proof sections with reference composition;
- remove remaining homepage-specific approximations;
- compare screenshots at 1440, 1280, 1024, 768, 430, 390, 375 and 320px.

### PR C — Learning product

- reconstruct module index, module detail and lesson reader;
- reconstruct challenge catalog, track progress and challenge workspace;
- cover breadcrumbs, TOC, code blocks, forms, loading, empty and error states;
- verify long-form readability and keyboard operation.

### PR D — Tools and remaining surfaces

- reconstruct Runtime Lab, Visual Builder, build stages, opportunities, auth/account, partner, branding and 404;
- preserve locally dark editors only where code contrast requires it;
- run dependency/dead-code audits and remove only confirmed unused items;
- finish mobile, overflow, hydration and reduced-motion checks.

## Verification gate for every PR

Each PR must pass relevant tests and compile as far as the available environment permits. It must also be compared against the live reference on desktop and mobile before the next PR starts. Layouts are checked at 100%, 125%, 150% and 200% zoom. Horizontal overflow must be fixed at its source rather than hidden globally.
