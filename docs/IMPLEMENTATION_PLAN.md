# AEGIS DEFENSE — Implementation Plan

This plan intentionally starts with documentation and architecture before real gameplay code. The goal is to avoid a disposable prototype and build toward a premium game in deliberate vertical slices.

## Phase 0 — Documentation foundation

Status: current phase.

Deliverables:

- Project memory for Claude Code.
- Product requirements.
- Anti-generic design direction.
- Gameplay system specification.
- Profession and balance specification.
- Technical architecture specification.

Definition of done:

- All major user requirements are captured in Markdown.
- Future Claude Code sessions can understand priorities without rereading the original prompt.
- Documents separate product intent, systems, class balance, visual direction, and architecture.

## Phase 1 — Project scaffold

Deliverables:

- Next.js + TypeScript app deployable to Vercel.
- Supabase environment configuration pattern.
- Basic routing for login, menu, settings, and gameplay shell.
- Design token foundation from `docs/DESIGN_DIRECTION.md`.
- Lint/test/format commands documented.

Definition of done:

- App deploys locally and can be deployed to Vercel.
- No gameplay placeholder UI violates the anti-AI checklist.
- Auth/environment variables are documented but secrets are not committed.

## Phase 2 — Authentication and profile persistence

Deliverables:

- Supabase Auth sign up/sign in/sign out.
- Username profile creation and validation.
- Persistent session until logout.
- Profile screen/menu showing username and rank.
- RLS policies and migrations.

Definition of done:

- Refresh/reopen keeps the user logged in.
- Explicit logout clears authenticated state.
- Users cannot access other users' private profile/settings data.

## Phase 3 — 3D gameplay vertical slice

Deliverables:

- Third-person controller.
- Camera and sensitivity settings.
- One battlefield map with lanes and base objective.
- Basic enemy wave spawner.
- Basic combat hit/damage system.
- Gameplay HUD showing name, wave, rank, HP/resources/base integrity.

Definition of done:

- Player can complete/fail waves in a 3D scene.
- HUD is readable and visually aligned with AEGIS DEFENSE.
- Simulation logic is not tightly coupled to React render timing.

## Phase 4 — Tower-defense systems

Deliverables:

- Build/repair/upgrade flow.
- Initial defense types: Ballista, Ward Obelisk, Flame Mortar, Barricade Gate.
- Enemy roles: swarm, bruiser, runner, flyer, saboteur.
- Resource economy.

Definition of done:

- Player success requires both direct action and defense planning.
- Towers have clear counterplay value and upgrade identity.

## Phase 5 — Professions and abilities

Deliverables:

- Launch roster implementation target: Warrior, Heavy Fighter, Berserker, Samurai, Paladin, Mage, Time Mage, Summoner, Cleric, Assassin, Archer, Engineer.
- Each profession has 1–2 passives, 1–2 abilities, and 1 ultimate.
- Profession selection and recommended tower hints.
- Cooldown and ultimate charge UI.

Definition of done:

- Every launch profession passes baseline wave scenarios.
- No launch profession dominates every scenario.
- Ability feedback includes animation/VFX/SFX hooks.

## Phase 6 — Roguelite run depth

Deliverables:

- Inter-wave draft UI.
- Relic/augment pools.
- Risk/reward contracts.
- Run summary storage.
- Rank progress based on validated run results.

Definition of done:

- Runs vary meaningfully.
- Build synergies are understandable and exciting.
- Failure still creates motivation for the next run.

## Phase 7 — Settings and polish

Deliverables:

- Graphics presets and render scale.
- Sensitivity controls.
- Keybinding editor with conflict detection.
- Audio and accessibility settings.
- Cloud/local settings sync.
- Anti-AI visual pass across all screens.

Definition of done:

- Settings are persisted.
- Players can rebind required actions.
- Reduced motion/camera shake options work.

## Phase 8 — Content expansion and Steam-quality pass

Deliverables:

- More maps, bosses, relics, towers, and profession expansions.
- Full audio pass.
- Performance optimization.
- Onboarding/tutorial.
- Store-ready presentation assets.
- Bug fixing and balance telemetry.

Definition of done:

- Game has enough content and polish to justify premium pricing target.
- Performance meets targets in `docs/TECHNICAL_ARCHITECTURE.md`.
- UI and gameplay feel cohesive, readable, and authored.
