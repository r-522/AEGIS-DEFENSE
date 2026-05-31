# AEGIS DEFENSE — Product Requirements

## 1. Vision

**AEGIS DEFENSE** is a premium 3D third-person roguelite tower-defense game where the player is both battlefield commander and frontline hero. The game should feel like a complete commercial product, not a prototype: every system must contribute to tension, readable decisions, spectacle, and replayable buildcraft.

### Elevator pitch

Defend the living fortress Aegis against wave-based incursions by fighting in third person, placing and upgrading defensive structures, drafting roguelite relics, and mastering a profession with passives, abilities, and an ultimate.

## 2. Target quality bar

The target is a game that could credibly be sold on Steam for roughly **2,000 JPY** after full implementation.

This means the final product must include:

- Polished onboarding and first-run experience.
- A cohesive visual identity, not asset-store collage or AI-generated generic UI.
- Multiple viable professions and build paths.
- Meaningful progression, failure, unlocks, and run variety.
- Stable account persistence and secure cloud-backed profiles.
- Settings, key rebinding, accessibility basics, and performance options.
- Production deployment on Vercel with Supabase-backed auth/data.

## 3. Target player experience

Players should feel:

- **Heavy pressure** from advancing waves and strategic resource scarcity.
- **Physical presence** from third-person movement, weighty attacks, impact reactions, camera shake, and defensive fortifications.
- **Build ownership** from profession identity, relic choices, tower upgrades, and run-defining synergies.
- **Fairness** from clear telegraphs, readable damage sources, and balance that rewards mastery without forcing one meta.

## 4. Core requirements

### 4.1 Authentication

- Users log in with **username and password**.
- Supabase is the authoritative provider for auth and persistence.
- Once authenticated, the session persists until explicit logout.
- Login state must survive page refreshes, browser restarts, and normal session expiry handling through Supabase refresh tokens.
- Logout must be obvious and available from account/settings UI.
- Never store plaintext passwords or custom password hashes in app tables.

### 4.2 Main screen / HUD

The main gameplay screen must show:

- Player name.
- Current wave.
- Rank.
- Health/resource status.
- Ability cooldowns and ultimate charge.
- Defense/base integrity.
- Current roguelite modifiers or relic highlights.

### 4.3 Game format

- 3D third-person perspective.
- Wave-based defense.
- Character has:
  - 1–2 passives.
  - 1–2 active abilities.
  - 1 ultimate.
- Profession selected before or during run start.
- Towers/traps/defensive structures are essential, not decorative.
- Roguelite choices appear between waves and during milestone events.

### 4.4 Settings

Required settings:

- Graphics quality presets.
- Resolution/render scale where applicable.
- Sensitivity for camera and aim.
- Keybindings, including movement, attack, dodge, interact, ability slots, ultimate, build menu, and ping/command.
- Audio volume categories.
- Accessibility toggles for camera shake, motion blur, subtitles/callouts, colorblind-safe indicators.

## 5. Core screens

| Screen | Purpose | Required content |
|---|---|---|
| Login | Username/password access | Sign in, create account flow, validation, remember-persistent session behavior |
| Main menu | Hub entry | Player name, rank, continue/start run, profession, settings, logout |
| Profession select | Build identity | Role tags, passives, abilities, ultimate, difficulty, recommended towers |
| Run loadout | Pre-run preparation | Starting relic/defense choice, map/contract modifiers, readiness confirmation |
| Gameplay HUD | Real-time play | Name, wave, rank, cooldowns, base integrity, resources, minimap/radar |
| Inter-wave draft | Roguelite decision | Relics, tower upgrades, profession augments, risk/reward choices |
| Results | Run feedback | Waves survived, rank delta, unlocks, damage/tower stats, next goals |
| Settings | Personalization | Graphics, sensitivity, keybinds, audio, accessibility, account/logout |

## 6. Progression and rank

Rank communicates mastery and long-term progression.

- Rank increases through successful defense, objectives, and difficulty modifiers.
- Rank decreases or stalls from failed runs only if the design remains motivating and fair.
- Rank should not be pure grind; award skillful play, build diversity, and optional challenge completion.
- Rank appears on main menu and gameplay HUD.

Suggested rank ladder:

1. Recruit
2. Sentinel
3. Bulwark
4. Aegis Knight
5. Bastion Prime
6. Mythic Warden

## 7. Success criteria

A milestone is considered aligned with this PRD only when:

- It improves the third-person tower-defense fantasy.
- It supports secure account persistence or meaningful game progression.
- It preserves Vercel/Supabase deployment feasibility.
- It passes the anti-generic visual direction rules.
- It leaves room for all professions to become viable through data-driven tuning.
