# Brick Tile Shop Public Pages

## Objective
Continue the existing React/Three/GSAP Brick Tile Shop public microsite from the current repository state.
Do not rebuild from scratch.

## Non-negotiables
- Preserve the existing dark premium product-experience layout.
- Preserve the current 3D product system and section-based scroll choreography unless explicitly changing a section.
- Keep the product as Zambezi Thin Brick Tiles.
- Use Brick Tile Shop branding cues from `/references`:
  - real BTS logo treatment
  - BTS green as the primary UI accent / CTA color
  - charcoal / black UI base
  - clay browns inside product/materials, not as primary UI accents

## Required changes still outstanding
1. Make the hero background word "ZAMBEZI" more visible and better balanced behind the product.
2. Replace the current sports-style showcase/"Champion" section with a real Zambezi installation showcase using matching imagery and architectural product copy.
3. Remove the "Design Your Legacy" visual lab from the main page.
4. Move all visual-lab customization controls to a dedicated `/customize` page or route.
5. Add a final "Top Sellers" or "Related Products" section to the main page, inspired by the existing Brick Tile Shop website.
6. Keep interactivity and avoid regressions in:
   - 3D drag / inspect behavior
   - scroll-driven transforms
   - technical spec section
   - navigation and CTA hierarchy

## Guardrails
- Do not reintroduce basketball or sports language.
- Do not use unrelated stock architecture imagery.
- Do not let the tile float oversized across sections unless explicitly intended by the composition.
- Do not change unrelated spacing, typography hierarchy, or section order.
- Do not invent product facts.

## Workflow
- First inspect the codebase and identify the files/components/routes involved.
- Return a short file-by-file plan before major edits.
- Then implement changes surgically.
- Use the project’s existing package manager and scripts.
- Run the local build after changes and fix any build/runtime errors.
- Summarize changed files and any follow-up items.
