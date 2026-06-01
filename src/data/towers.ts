import type { TowerDef, TowerType } from "@/types/game";

export const TOWER_DEFS: Record<TowerType, TowerDef> = {
  ballista: {
    id: "ballista",
    name: "Ballista",
    description: "Precision single-target armor-piercing bolts. Ideal for heavy enemies and elites.",
    role: "Single-target armor pierce",
    cost: 60,
    attackType: "single",
    projectileColor: "#C8A45D",
    stats: { damage: 120, range: 14, fireRate: 0.8, projectileSpeed: 22 },
    special: "Bolts pierce 25% of target armor",
    upgrades: [
      { level: 2, cost: 80, name: "Serrated Tip", improvements: "+40 damage, +15% armor pierce", statMod: { damage: 40 } },
      { level: 3, cost: 120, name: "Siege Ballista", improvements: "+60 damage, bolts apply 3s Bleed (30/s)", statMod: { damage: 60 } },
    ],
  },
  ward_obelisk: {
    id: "ward_obelisk",
    name: "Ward Obelisk",
    description: "Emits a shielding aura and slows nearby enemies. Defensive anchor for any lane.",
    role: "Aura shielding & slow",
    cost: 80,
    attackType: "aoe",
    projectileColor: "#5FD7D1",
    stats: { damage: 30, range: 10, fireRate: 1.5, splashRadius: 8 },
    special: "Aura slows enemies by 20%. Nearby structures gain 10% damage reduction.",
    upgrades: [
      { level: 2, cost: 90, name: "Resonant Ward", improvements: "+10% slow, aura +2m radius", statMod: { splashRadius: 2 } },
      { level: 3, cost: 130, name: "Overcharge Burst", improvements: "Every 15s: burst that stuns all aura enemies for 1.5s", statMod: { damage: 20 } },
    ],
  },
  flame_mortar: {
    id: "flame_mortar",
    name: "Flame Mortar",
    description: "Lobs incendiary shells. Excellent area denial with lingering fire damage.",
    role: "Area denial & DoT",
    cost: 90,
    attackType: "aoe",
    projectileColor: "#D45A35",
    stats: { damage: 80, range: 12, fireRate: 0.5, splashRadius: 4, projectileSpeed: 10 },
    special: "Creates a fire zone (3s). Enemies in zone take 25 damage/s and move 15% slower.",
    upgrades: [
      { level: 2, cost: 100, name: "Hellfire Shell", improvements: "Fire zone lasts 5s, +10 damage/s", statMod: { damage: 20 } },
      { level: 3, cost: 150, name: "Armor Melt Compound", improvements: "Enemies with Burn take 40% more damage from all sources for 6s", statMod: { damage: 30 } },
    ],
  },
  tesla_spire: {
    id: "tesla_spire",
    name: "Tesla Spire",
    description: "Chains lightning between nearby enemies. Effective against grouped or fast-moving threats.",
    role: "Chain damage & stun",
    cost: 100,
    attackType: "chain",
    projectileColor: "#9B59B6",
    stats: { damage: 60, range: 11, fireRate: 1.2 },
    special: "Lightning chains to 3 additional targets within 5m. 15% chance to stun each for 0.8s.",
    upgrades: [
      { level: 2, cost: 110, name: "Arc Amplifier", improvements: "+1 chain target, +10% stun chance", statMod: { damage: 15 } },
      { level: 3, cost: 160, name: "Overload Cascade", improvements: "Stunned enemies release a secondary chain on death", statMod: { damage: 25 } },
    ],
  },
  barricade_gate: {
    id: "barricade_gate",
    name: "Barricade Gate",
    description: "Shapes lanes, blocks paths, and creates chokepoints. Enemies must destroy it to advance.",
    role: "Lane shaping & block",
    cost: 40,
    attackType: "support",
    projectileColor: "#6FA38B",
    stats: { damage: 0, range: 0, fireRate: 0 },
    special: "400 HP. Thorns: enemies take 20 damage per melee hit. Taunts nearby runners.",
    upgrades: [
      { level: 2, cost: 50, name: "Reinforced Plating", improvements: "+200 HP, Thorns +15 damage", statMod: {} },
      { level: 3, cost: 80, name: "Electrified Barrier", improvements: "Enemies hitting barricade are briefly shocked (0.5s stun)", statMod: {} },
    ],
  },
  rune_mine: {
    id: "rune_mine",
    name: "Rune Mine",
    description: "Invisible trap that detonates on enemy proximity. Excellent burst for chokepoints.",
    role: "Trap burst",
    cost: 50,
    attackType: "trap",
    projectileColor: "#C8A45D",
    stats: { damage: 200, range: 3, fireRate: 0.2, splashRadius: 3 },
    special: "Invisible until triggered. Resets after 20s. Boss and elites take 50% extra damage.",
    upgrades: [
      { level: 2, cost: 60, name: "Elemental Imprint", improvements: "Applies random element on detonation (Burn/Freeze/Shock)", statMod: { damage: 50 } },
      { level: 3, cost: 90, name: "Cascade Mine", improvements: "20% chance to reset instantly on kill", statMod: { damage: 80 } },
    ],
  },
  repair_drone_dock: {
    id: "repair_drone_dock",
    name: "Repair Drone Dock",
    description: "Deploys drones that repair nearby towers and base segments. Essential for attrition defense.",
    role: "Sustain & repair",
    cost: 70,
    attackType: "support",
    projectileColor: "#6FA38B",
    stats: { damage: 0, range: 12, fireRate: 2 },
    special: "Drones repair 20 HP/s to lowest-HP tower in range. Dock itself can be repaired.",
    upgrades: [
      { level: 2, cost: 80, name: "Rapid Maintenance", improvements: "Repair rate +15 HP/s. Deploys 2 drones.", statMod: {} },
      { level: 3, cost: 120, name: "Emergency Revival", improvements: "Once per wave: revive a fully destroyed tower at 50% HP", statMod: {} },
    ],
  },
};

export const TOWER_PLACEMENT_GRID = {
  cols: 10,
  rows: 12,
  cellSize: 2,
  offsetX: -9,
  offsetZ: -10,
};

export const LANE_WAYPOINTS: [number, number][][] = [
  // Left lane
  [[-6, 10], [-6, 6], [-6, 2], [-6, -2], [-6, -6], [-6, -10]],
  // Center lane
  [[0, 10], [0, 6], [0, 2], [0, -2], [0, -6], [0, -10]],
  // Right lane
  [[6, 10], [6, 6], [6, 2], [6, -2], [6, -6], [6, -10]],
];
