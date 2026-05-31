# AEGIS DEFENSE — Game Systems

## 1. Core loop

1. Player logs in and selects a profession.
2. Player chooses a run contract, map, and starting loadout.
3. Player enters a 3D third-person battlefield and prepares defenses.
4. Enemy wave begins; player fights directly and manages towers/traps.
5. Wave ends; player drafts roguelite upgrades, repairs, or risk/reward modifiers.
6. Difficulty escalates through enemy variety, elite modifiers, map pressure, and boss waves.
7. Run ends in victory, extraction, or fortress breach.
8. Results screen awards rank progress, unlocks, resources, and build insights.

## 2. Third-person controls

Baseline actions:

- Move, sprint, dodge/evade.
- Basic attack or primary weapon action.
- Secondary/aim/block depending on profession.
- Interact/build/repair.
- Ability 1.
- Ability 2 where available.
- Ultimate.
- Build radial/menu.
- Ping/command.

Design rules:

- Movement must feel weighty but responsive.
- Camera must prioritize enemy readability and base-defense awareness.
- Melee lock-on, ranged aim assist, and tower placement helpers should be settings-aware.

## 3. Wave system

Each wave has:

- Enemy budget.
- Spawn lanes.
- Threat mix.
- Elite chance.
- Environmental modifier chance.
- Reward budget.

Wave cadence:

| Stage | Purpose |
|---|---|
| Preparation | Place/upgrade towers, inspect lanes, pick draft rewards |
| Warning | Show lane telegraphs and enemy silhouettes |
| Assault | Real-time combat and defense management |
| Crisis | Elite/breach event or objective twist |
| Resolution | Rewards, repairs, story/rank feedback |

Boss waves should appear at predictable intervals but vary mechanics.

## 4. Tower-defense layer

Defenses should be tactically distinct.

| Defense type | Role | Example upgrades |
|---|---|---|
| Ballista | Single-target armor piercing | Bleed bolts, shield-pierce, anti-air anchor |
| Ward Obelisk | Shielding and slow aura | Wider field, reflect pulse, overcharge burst |
| Flame Mortar | Area denial | Lingering fire, panic, armor melt |
| Tesla Spire | Chain damage/control | Longer arcs, stun cadence, drone link |
| Barricade Gate | Lane shaping | Thorns, self-repair, taunt beacon |
| Rune Mine | Trap burst | Element imprint, reset chance, boss shred |
| Repair Drone Dock | Sustain | Faster repair, emergency revive, resource salvage |

Rules:

- Towers cannot fully replace player action.
- Player cannot ignore towers and still succeed on intended difficulties.
- Every profession needs at least one defense synergy.

## 5. Character kit structure

Each playable profession instance uses:

- **1–2 passives**: always-on identity and scaling hook.
- **1–2 abilities**: short/medium cooldown actions that create decisions.
- **1 ultimate**: high-impact, charged through combat/objectives.

Kit requirements:

- One defensive or tactical contribution.
- One clear wave-clear, control, support, economy, or boss-pressure niche.
- At least one drawback, cooldown, resource cost, positioning risk, or build dependency.

## 6. Roguelite systems

### Run-based choices

Roguelite rewards appear between waves and at milestones:

- Profession augments.
- Tower augments.
- Relics.
- Weapon modifiers.
- Economy choices.
- Curse/challenge contracts.
- Map/lane alterations.

### Relic examples

| Relic | Effect | Tradeoff |
|---|---|---|
| Cracked Aegis Core | Base shield regenerates after no breach damage for 12s | Shield cap reduced |
| Siege Saint's Nail | Barricades taunt elites | Barricades cost more |
| Ember Tithe | Fire damage grants extra scrap | Healing received reduced |
| Clockwork Treaty | Every 5th tower shot repeats | Towers reload slower |
| Nameless Banner | Rank gain increased on victory | More elites spawn |

### Meta progression

Meta progression can unlock options but must not make early runs obsolete.

Allowed:

- New professions.
- New relic pools.
- Cosmetic rank frames.
- Starting loadout variety.
- Lore records.

Avoid:

- Permanent stat inflation that invalidates balance.
- Pay-to-win-like account power.
- Unlocks that make one profession strictly superior.

## 7. Enemy design

Enemy families should force different responses:

| Enemy role | Behavior | Counterplay |
|---|---|---|
| Swarm | Many weak bodies | Area damage, choke points |
| Bruiser | Slow high HP | Armor pierce, kiting, single-target towers |
| Runner | Rushes base | Slows, traps, player interception |
| Flyer | Ignores ground lanes | Anti-air towers, Dragoon/Archer tools |
| Saboteur | Disables towers | Player focus, detection, cleanse |
| Shielder | Protects packs | Flank, burst, dispel/curse |
| Artillery | Attacks from range | Mobility, sniper towers, line-of-sight denial |
| Boss | Multi-phase objective | Build synergy and profession mastery |

## 8. Difficulty and fairness

- Enemy telegraphs must be readable.
- Damage spikes must have counterplay.
- RNG should create variation, not unwinnable states.
- Draft choices need at least one broadly useful option.
- Every profession should be viable at baseline difficulty with sensible tower play.
