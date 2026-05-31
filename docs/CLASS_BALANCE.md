# AEGIS DEFENSE — Profession and Balance Specification

## 1. Balance philosophy

AEGIS DEFENSE includes many professions. They do not all need identical output, but every profession must be viable and enjoyable when paired with appropriate towers, relics, and player skill.

Balance goals:

- No profession is a pure joke pick, even if its theme is comedic.
- Every profession has at least one tower-defense contribution: lane control, burst, sustain, scouting, economy, repair, buffing, debuffing, or boss pressure.
- Every profession has weaknesses that can be offset through towers or roguelite choices.
- Overpowered fantasy professions are balanced by cooldowns, risk, setup time, contract restrictions, or high skill requirements.
- Production implementation should start with a focused launch roster, then expand using this taxonomy.

## 2. Standard kit budget

Each profession should eventually receive:

- 1–2 passives.
- 1–2 abilities.
- 1 ultimate.

### Power budget axes

Rate each profession from 1–5 during implementation:

| Axis | Meaning |
|---|---|
| Damage | Single-target and wave damage potential |
| Defense | Personal survival and base protection |
| Control | Slows, stuns, displacement, lane shaping |
| Support | Healing, buffs, repairs, cleanse, information |
| Economy | Scrap, upgrade efficiency, item generation |
| Complexity | Execution and build-planning difficulty |

Target rule: if a profession has multiple 5s, it needs a meaningful drawback in range, setup, fragility, randomness, resource cost, or cooldown.

## 3. Launch roster recommendation

To avoid a shallow prototype while keeping scope achievable, prioritize a first polished roster of 12 professions before expanding all listed classes.

| Role | Launch profession | Why |
|---|---|---|
| Melee all-rounder | Warrior | Baseline tutorial-friendly kit |
| Tank | Heavy Fighter | Teaches aggro/base protection |
| Risk damage | Berserker | High emotion and roguelite synergy |
| Precision melee | Samurai | Counter/crit mastery |
| Holy support tank | Paladin | Protection and anti-undead identity |
| Element caster | Mage | Clear ranged AoE role |
| Control caster | Time Mage | Strong TD control fantasy |
| Summon/control | Summoner | Tactical lane reinforcement |
| Healer/support | Cleric | Sustain and cleanse |
| Stealth burst | Assassin | Priority target removal |
| Ranged | Archer | Anti-air and lane pressure |
| Builder | Engineer | Tower-defense anchor profession |

All other professions remain planned expansions and should use the balancing taxonomy below.

## 4. Full profession taxonomy

### Melee combat

| Profession | Role | Strength | Weakness | TD contribution |
|---|---|---|---|---|
| Warrior | Vanguard | Durable, flexible weapons | Less specialized scaling | Holds lanes, emergency wave clear |
| Swordsman | Skirmisher | Fast combos, counters | Lower sustain | Intercepts runners, parry elites |
| Heavy Fighter | Tank | Armor, shields, taunt | Low mobility | Redirects enemy pressure from base |
| Berserker | Risk DPS | Damage rises when hurt | Dangerous low-HP play | Deletes crisis packs if managed |
| Samurai | Precision DPS | Crits, iai counters | Timing dependent | Elite duels, boss phase punishes |
| Knight | Commander tank | Defense and formation buffs | Mount systems add complexity | Buffs nearby defenses/allies |
| Paladin | Holy protector | Shields, healing, undead damage | Faith/resource limits | Protects base and cleanses lanes |
| Dark Knight | Sacrifice DPS | HP-cost burst, curses | Self-damage risk | Converts health into boss pressure |
| Duelist | Boss specialist | 1v1 evasion/counter | Weak swarm clear | Locks down elites/bosses |
| Lancer | Reach striker | Charge, pierce | Vulnerable if surrounded | Pierces lanes and anti-cavalry rushes |
| Axe Fighter | Breaker | Armor break, high damage | Lower accuracy/speed | Opens armored waves for towers |
| Monk | Evasive brawler | Ki combos, mobility | Lower armor | Disrupts casters/saboteurs |
| Martial Artist | Scaling combo | Status resistance, growth | Requires execution | Combos scale across long runs |
| Gladiator | Momentum fighter | Crowd/fame buffs | Needs aggressive play | Gains buffs from streak defense |
| Dragoon | Anti-air diver | Leap attacks, flyer control | Cooldown windows | Intercepts airborne enemies |

### Magic

| Profession | Role | Strength | Weakness | TD contribution |
|---|---|---|---|---|
| Mage | AoE caster | Element burst | Fragile | Wave clear and elemental combos |
| Archmage | Heavy artillery | Massive spells | Long cast time | Deletes dense waves with setup |
| Witch | Debuffer | Curses, potions, familiar | Lower direct burst | Weakens lanes and elites |
| Hexer | DoT controller | Persistent curses | Slow payoff | Damage-over-time choke control |
| Summoner | Minion tactician | Flexible summons | Weak body | Temporary lane blockers/attackers |
| Elementalist | Terrain caster | Element zones | Matchup dependent | Alters lanes with hazards |
| Time Mage | Control support | Slow/haste/rewind | High cooldown/complexity | Buys tower firing time |
| Spatial Mage | Position strategist | Teleport/barriers | High skill | Repositions threats and creates chokepoints |
| Necromancer | Attrition commander | Undead army | Social/lore risk, setup | Converts kills into defenders |
| Rune Master | Prep defender | Wards and circles | Needs planning | Strongest in fixed defense zones |
| Alchemist | Item caster | Bombs, transmutation | Consumable economy | Converts resources into tactical effects |
| Sage | Analyst | Weakness detection, MP efficiency | Moderate raw power | Reveals vulnerabilities, optimizes damage |

### Support and recovery

| Profession | Role | Strength | Weakness | TD contribution |
|---|---|---|---|---|
| Cleric | Healer | Healing, holy damage | Low mobility/damage | Sustains base and allies |
| Priest | Ritual support | Group blessings | Ritual setup time | Wave-wide buffs and wards |
| Druid | Nature controller | Plants/weather | Map dependent | Roots, healing groves, terrain growth |
| Shaman | Spirit support | Ancestors/trance | Rhythm/resource management | Totems and spirit debuffs |
| Bard | Morale buffer | Songs, status effects | Vulnerable while performing | Buffs towers/player in aura |
| Dancer | Evasion support | Area buffs, dodge | Positioning intensive | Keeps zones safe through buffs |
| Oracle | Prediction support | Accuracy/evasion foresight | Low direct output | Reveals wave threats early |
| Healer | Pure recovery | Cleanses, big heals | Weak offense | Prevents attrition losses |

### Rogue and infiltration

| Profession | Role | Strength | Weakness | TD contribution |
|---|---|---|---|---|
| Thief | Utility scout | Speed, traps, stealing | Low durability | Disarms saboteurs and steals resources |
| Assassin | Priority killer | Poison, ambush | Poor sustained swarm clear | Eliminates elites/casters |
| Ninja | Mobility trickster | Clone/stealth/tools | Cooldown dependent | Distracts lanes and reaches threats |
| Scout | Information support | Mapping, detection | Lower combat power | Reveals spawns and hidden enemies |
| Spy | Deception utility | Disguise, intel | Context dependent | Delays or redirects enemy groups |
| Trickster | Chaos controller | Illusion/luck | Randomness | Confuses waves, risky burst |
| Hunter | Tracker ranged | Outdoor pursuit | Map dependent | Marks priority enemies |
| Ranger | Survival ranged | Animal allies, forests | Terrain dependency | Sustained lane pressure and scouting |

### Ranged and machinery

| Profession | Role | Strength | Weakness | TD contribution |
|---|---|---|---|---|
| Archer | Precision ranged | Long range, accuracy | Weak melee | Anti-air and runner interception |
| Gunner | Burst ranged | Firearms/explosives | Reload management | Mid-range burst and stagger |
| Sniper | Elite killer | Extreme range/weak points | Needs focus/position | Deletes high-value targets |
| Cannoneer | Siege AoE | Heavy explosions | Low mobility | Massive lane clear |
| Engineer | Builder controller | Turrets, mines, repair | Needs setup/resources | Best tower economy/control |
| Mechanic | Drone support | Repair, machines | Tech dependency | Drone repair and auxiliary fire |

### Special and anomalous

| Profession | Role | Strength | Weakness | TD contribution |
|---|---|---|---|---|
| Psychic | Mental controller | Telekinesis/mind attacks | Mental strain | Displaces and disables enemies |
| Vampire | Sustain predator | Lifesteal/night power | Holy weakness | Self-sustains in dangerous lanes |
| Werewolf | Regenerating bruiser | Beast burst | Control difficulty | Crisis-mode frontline clear |
| Dragon Knight | Mythic aerial | Dragon pact/flight | High cooldown/lore cost | Air superiority and fear aura |
| Beast Tamer | Pet commander | Monster companions | Pet management | Custom lane companions |
| Puppeteer | Remote tactician | Puppets, safe control | Puppet vulnerability | Multi-lane interaction |
| Dreamwalker | Mind infiltrator | Dream/hallucination | Boss resistance tuning | Ignores some defenses/resistances |
| Chronobreaker | Time attacker | Turn/order disruption | High complexity | Breaks elite timings |
| Graviturge | Area controller | Gravity wells | Friendly positioning risk | Clumps enemies for towers |
| Astrologian | Fate support | Timed buffs | Date/time RNG must be fair | Predictive buffs and crit windows |

### Production and life professions

| Profession | Role | Strength | Weakness | TD contribution |
|---|---|---|---|---|
| Blacksmith | Gear enhancer | Weapon/tower upgrades | Lower direct combat | Improves fortifications mid-run |
| Chef | Buff support | Food buffs/healing | Prep/resource needs | Pre-wave meals and recovery |
| Merchant | Economy | Buying/selling bonuses | Lower combat | More upgrade choices/resources |
| Artificer | Device crafter | Magical automata | Mid/late scaling | Builds advanced defensive devices |
| Fisher | Resource specialist | Water resources/fish buffs | Map dependency | Generates rare consumables |
| Farmer | Terrain grower | Crops/land shaping | Slow ramp | Creates resource/healing fields |
| Architect | Base designer | Structures/layout | Setup heavy | Best barricade and lane shaping |

### Mythic and transcendent

| Profession | Role | Strength | Weakness | TD contribution |
|---|---|---|---|---|
| Demigod | Scaling mythic | Divine growth | Social/lore constraints, slow start | Late-run powerhouse |
| Angel Knight | Flying protector | Holy flight/protection | Anti-air vulnerability balancing | Protects allies/base from above |
| Demon Lord | Commander | Fear, minions | Reputation/curse drawbacks | Commands temporary armies |
| Godslayer | Boss hunter | Divine/boss damage | Narrow specialization | Extreme boss pressure |
| Void Caster | Erasure mage | Space deletion | High cost/danger | Removes lanes temporarily |
| Worldtree Guardian | Nature bastion | Regeneration/domain | Rooted/zone dependent | Supreme defensive zone creation |

### Joke and variant professions

| Profession | Role | Strength | Weakness | TD contribution |
|---|---|---|---|---|
| Gambler | High variance | Jackpot effects | Can backfire | Risk/reward wave swings |
| Courier | Mobility support | Speed/delivery | Low damage | Fast repairs and resource routing |
| Janitor | Cleanser | Removes hazards/status | Low burst | Keeps lanes/towers operational |
| Librarian | Analyst caster | Enemy info/forbidden books | Needs knowledge setup | Reveals weaknesses and counters |
| Relic Hunter | Artifact specialist | Ancient relic usage | Relic dependency | Finds and exploits run relics |
| Contractor | Pact support | Contract buffs | Costs/conditions | Trades constraints for power |
| Streamer | Momentum/social | Audience-based buffs | Volatile attention meter | Hype buffs from streaks/objectives |
| Gravekeeper | Anti-undead defender | Grave zones/resistance | Niche matchups | Fortifies death-heavy lanes |
| Dimensional Chef | Chaos buffer | Monster meals/mutations | Unpredictable side effects | Temporary mutation buffs |
| Glitcher | Meta disruptor | Rule-breaking effects | Instability/overheat | Temporarily breaks wave rules |

## 5. Example launch kits

These are design targets, not final code constants.

### Warrior

- Passive: **Frontline Discipline** — gain damage reduction while near enemies or the base gate.
- Passive: **Weapon Versatility** — weapon pickups grant a short adaptive bonus.
- Ability 1: **Shield-Breaking Cleave** — cone strike that weakens armor.
- Ability 2: **Rally Step** — short charge that grants temporary fortification aura.
- Ultimate: **Aegis Stand** — taunt nearby enemies and empower nearby towers.

### Heavy Fighter

- Passive: **Bulwark Frame** — high stagger resistance; reduced sprint speed.
- Ability 1: **Iron Taunt** — forces non-boss enemies to target the Heavy Fighter.
- Ability 2: **Shield Plant** — creates temporary cover that blocks projectiles.
- Ultimate: **Immovable Bastion** — becomes nearly unmovable and reflects damage in a defensive zone.

### Berserker

- Passive: **Blood Heat** — damage rises as HP falls.
- Ability 1: **Rend Rush** — leap into a lane and inflict bleed.
- Ability 2: **Controlled Frenzy** — trade defense for attack speed and lifesteal window.
- Ultimate: **Crimson Overrun** — chain attacks through marked enemies; ends with exhaustion.

### Samurai

- Passive: **Still Mind** — standing briefly or perfect-dodging increases crit chance.
- Ability 1: **Iaijutsu Line** — delayed draw slash through a lane.
- Ability 2: **Honored Reversal** — counter the next heavy hit.
- Ultimate: **Moon-Cut Judgment** — precise multi-hit boss/elite execution zone.

### Paladin

- Passive: **Sacred Oath** — nearby base structures receive minor damage reduction.
- Ability 1: **Radiant Guard** — shield self or a defense.
- Ability 2: **Consecrate Lane** — holy field damaging undead and cleansing debuffs.
- Ultimate: **Aegis Benediction** — restore base shield and empower holy tower effects.

### Mage

- Passive: **Elemental Cycle** — alternating elements increases damage.
- Ability 1: **Ember Lance** — piercing fire projectile.
- Ability 2: **Frost Sigil** — slowing zone.
- Ultimate: **Cataclysm Script** — large cast that detonates marked elemental zones.

### Time Mage

- Passive: **Temporal Margin** — cooldowns slightly refund on perfect wave defense.
- Ability 1: **Delay Field** — slow enemies in a lane.
- Ability 2: **Haste Relay** — speed up nearby tower fire rate briefly.
- Ultimate: **Rewind Breach** — restore recent base damage and rewind enemy positions slightly.

### Summoner

- Passive: **Pact Slots** — can maintain a limited number of summons.
- Ability 1: **Call Warden Imp** — summon a blocker attacker.
- Ability 2: **Spirit Exchange** — sacrifice a summon to heal a tower/base segment.
- Ultimate: **Legion Gate** — temporary army floods threatened lanes.

### Cleric

- Passive: **Grace Economy** — healing also grants small shield fragments.
- Ability 1: **Mend Ward** — heal ally/structure/base segment.
- Ability 2: **Purge Hex** — cleanse tower disables and enemy curses.
- Ultimate: **Sanctuary Bell** — large protective dome and revive/repair pulse.

### Assassin

- Passive: **Marked Prey** — first hit on priority enemies deals bonus damage.
- Ability 1: **Shadow Step** — teleport behind marked target.
- Ability 2: **Venom Pin** — poison and slow elite/saboteur.
- Ultimate: **Blackout Edict** — enter stealth and execute chained low-health priority targets.

### Archer

- Passive: **High Ground Eye** — range/crit increases from elevated or prepared positions.
- Ability 1: **Piercing Volley** — line shot through a lane.
- Ability 2: **Tether Arrow** — roots flyer or runner.
- Ultimate: **Storm Quiver** — rapid anti-air and lane-covering barrage.

### Engineer

- Passive: **Field Fabricator** — reduced cost or faster placement for defenses.
- Ability 1: **Deploy Sentry** — temporary turret.
- Ability 2: **Overclock Node** — empower one tower with heat buildup risk.
- Ultimate: **Fortress Protocol** — all nearby defenses gain fire rate, repair, and shield for a short duration.

## 6. Balance process

1. Define profession fantasy and tower-defense contribution.
2. Assign target ratings across the six axes.
3. Create kit with one signature strength and one enforced weakness.
4. Test against standardized wave scenarios:
   - Swarm lane.
   - Armored elite lane.
   - Flyer pressure.
   - Saboteur/tower disable.
   - Boss phase.
   - Low-resource recovery.
5. Compare clear time, base damage, player damage taken, resource efficiency, and failure reasons.
6. Tune numbers first, then cooldowns/costs, then mechanics only if identity fails.

## 7. Anti-dominance rules

- If a profession wins all test scenarios with low skill and low tower investment, reduce generalism or increase resource pressure.
- If a profession cannot pass baseline scenarios with recommended towers, add baseline utility before buffing raw damage.
- If a profession is only viable through one relic, move part of that dependency into the base kit.
- If a profession trivializes boss waves, reduce boss-specific scaling and improve non-boss utility instead.
