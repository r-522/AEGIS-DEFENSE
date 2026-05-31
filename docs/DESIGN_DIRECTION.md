# AEGIS DEFENSE — Design Direction

## 1. Intent

AEGIS DEFENSE must avoid the common "AI-generated frontend" feeling. The interface should look designed by a team with a world, material language, and gameplay priorities, not produced from a vague prompt.

Research summary used for this direction:

- Recent Claude Code guidance recommends concise, structured project memory with links to detailed context rather than an oversized single instruction file: https://docs.claude.com/en/docs/claude-code/memory
- Current discussion of AI-looking web output repeatedly identifies vague prompts, repetitive layouts, generic gradients, over-polished flatness, and lack of specific visual intent as major causes: https://shuffle.dev/blog/2026/01/why-do-most-ai-generated-websites-look-the-same/
- 2026 design trend coverage highlights a reaction against hyper-slick AI aesthetics through tactile materials, visible craft, texture, imperfection, and process marks: https://www.creativebloq.com/design/graphic-design/texture-warmth-and-tactile-rebellion-the-big-graphic-design-trends-for-2026

## 2. Visual identity

### Creative north star

**Fortress-forged mythic technology**: ancient defensive orders, heavy alloy plates, engraved ward lines, scorched stone, ritual circuitry, and military UI instrumentation.

The game should feel:

- Heavy, tactical, and legible.
- Premium and restrained rather than neon-chaotic.
- Handmade in details: scratches, bevel wear, stamped labels, physical panels, glyph marks, asymmetric battle damage.
- Cool and heroic, but never sterile.

### Avoid list: common AI-looking patterns

Do not use these as primary design language:

- Generic purple/blue SaaS gradients.
- Floating glassmorphism cards with no material logic.
- Perfectly centered hero sections with vague glowing blobs.
- Random oversized emojis or generic icons.
- Identical card grids without hierarchy.
- Smooth but meaningless micro-animations.
- Copy like "unlock your potential" or "seamless experience".
- Unmotivated cyberpunk neon when the game context calls for fortress weight.
- Overly clean white dashboards that ignore the dark fantasy/tactical setting.
- AI-art-like perfect symmetry, plastic skin, mushy ornament detail, or fake text glyphs.

## 3. Art direction pillars

| Pillar | Use | Avoid |
|---|---|---|
| Material weight | Brushed gunmetal, basalt, leather wraps, heat-scorched brass, engraved ceramic plates | Weightless translucent panels everywhere |
| Battlefield utility | HUD elements look bolted, etched, stamped, or projected from in-world devices | Decoration that hides gameplay state |
| Human craft | Slight asymmetry, scratches, repair seams, serial numbers, maker marks | Procedural noise pasted uniformly over everything |
| Mythic defense | Aegis glyphs, shield geometry, ward circles, bastion silhouettes | Generic fantasy filigree without function |
| Readability first | Clear contrast, cooldown arcs, wave urgency, enemy threat colors | Pretty but ambiguous effects |

## 4. Typography

Use heavy, grounded type choices.

Suggested direction:

- Display: **Cinzel**, **Trajan-like alternatives**, **Cormorant SC**, or another engraved serif with weight.
- UI headings: **Rajdhani**, **Oxanium**, **Saira Condensed**, or similar angular tactical sans.
- Body/UI: **Inter**, **Noto Sans JP**, or **IBM Plex Sans JP** for readability.
- Numbers/HUD: tabular numeric font, condensed and high contrast.

Rules:

- Japanese text must remain readable; do not choose a Latin-only display font for Japanese labels.
- Use font pairing intentionally: display font for title/rank, tactical sans for controls, readable sans for body.
- Avoid thin weights for critical HUD values.

## 5. Color palette

| Token | Suggested value | Use |
|---|---:|---|
| `obsidian` | `#0B0E12` | Primary background |
| `charcoal_plate` | `#171B22` | Panels |
| `gunmetal` | `#2B323D` | Borders, structure |
| `aegis_gold` | `#C8A45D` | Rank, premium highlights |
| `ward_cyan` | `#5FD7D1` | Shield/defense energy |
| `ember` | `#D45A35` | Damage, breach alerts |
| `verdigris` | `#6FA38B` | Nature/support effects |
| `bone` | `#D8D0BE` | Primary text |
| `ash` | `#8B9098` | Secondary text |

Rules:

- Keep the base dark and physical; highlights should mean something.
- Reserve gold for rank, rare rewards, and premium affordances.
- Reserve cyan for shields, Aegis systems, and defensive integrity.
- Use ember for danger only; do not dilute alert meaning.

## 6. UI composition

- Prefer anchored HUD clusters over centered web-app cards.
- Gameplay information must follow priority: survival > wave threat > ability state > rewards.
- Use panel depth through bevels, seams, hard shadows, and in-world projection hints.
- Important controls should look tactile: pressed metal, engraved text, illuminated slits.
- Every screen needs one memorable custom detail: seal, tactical map trace, animated forge spark, ward line sweep, or scratched rank plate.

## 7. Motion and feedback

- Abilities need anticipation, impact, and recovery.
- UI transitions should feel mechanical or arcane: locking plates, rune activation, relay flicker.
- Avoid generic fade/slide-only motion.
- Camera shake must be adjustable and never obscure threat readability.
- Hit feedback should combine animation, sound, VFX, and damage number hierarchy.

## 8. Accessibility and legibility

- Contrast must remain readable over 3D scenes.
- Do not communicate damage type by color alone.
- Support reduced motion and reduced camera shake.
- Keybinding UI must show conflicts and allow reset to defaults.
- Critical HUD values need readable size and clear silhouettes.

## 9. Anti-AI frontend checklist

Before merging a user-facing UI change, verify:

- [ ] The screen has a specific AEGIS DEFENSE material/setting rationale.
- [ ] Layout hierarchy is not a generic centered card stack unless justified.
- [ ] Copy names concrete game concepts, not generic marketing phrases.
- [ ] Colors follow semantic token rules.
- [ ] Typography has weight and Japanese readability.
- [ ] At least one handcrafted detail exists without harming clarity.
- [ ] Animations communicate game state, not decoration only.
