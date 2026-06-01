// ============================================================
// AEGIS DEFENSE — Core Type Definitions
// ============================================================

export type Vec3 = { x: number; y: number; z: number };
export type EntityId = string;

// ── Profession ───────────────────────────────────────────────

export type ProfessionCategory =
  | "melee" | "magic" | "support" | "rogue" | "ranged" | "special" | "production" | "mythic" | "joke";

export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

export interface Passive {
  id: string;
  name: string;
  description: string;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  key: "Q" | "E";
  type: "damage" | "control" | "support" | "movement" | "defense";
}

export interface Ultimate {
  id: string;
  name: string;
  description: string;
  chargeRequired: number;
}

export interface ProfessionStats {
  damage: number;      // 1-5
  defense: number;     // 1-5
  control: number;     // 1-5
  support: number;     // 1-5
  economy: number;     // 1-5
  complexity: number;  // 1-5
}

export interface Profession {
  id: string;
  name: string;
  nameJP: string;
  category: ProfessionCategory;
  role: string;
  difficulty: Difficulty;
  ready: boolean;           // true = launch roster; false = locked
  recommended?: boolean;    // tutorial-friendly
  description: string;
  lore: string;
  stats: ProfessionStats;
  passives: Passive[];
  abilities: Ability[];
  ultimate: Ultimate;
  towerSynergies: string[];
  preferredTowers: string[];
  strengths: string[];
  weaknesses: string[];
  color: string;            // hex accent for the dossier card
}

// ── Tower ────────────────────────────────────────────────────

export type TowerType =
  | "ballista" | "ward_obelisk" | "flame_mortar"
  | "tesla_spire" | "barricade_gate" | "rune_mine" | "repair_drone_dock";

export interface TowerUpgrade {
  level: number;
  cost: number;
  name: string;
  improvements: string;
  statMod: Partial<TowerStats>;
}

export interface TowerStats {
  damage: number;
  range: number;
  fireRate: number;
  splashRadius?: number;
  projectileSpeed?: number;
}

export interface TowerDef {
  id: TowerType;
  name: string;
  description: string;
  role: string;
  cost: number;
  stats: TowerStats;
  upgrades: TowerUpgrade[];
  attackType: "single" | "aoe" | "chain" | "trap" | "support";
  projectileColor: string;
  special?: string;
}

export interface PlacedTower {
  instanceId: EntityId;
  defId: TowerType;
  position: Vec3;
  level: number;
  hp: number;
  maxHp: number;
  cooldown: number;
  targetId?: EntityId;
  disabled: boolean;
  augments: string[];
}

// ── Enemy ────────────────────────────────────────────────────

export type EnemyRole = "swarm" | "bruiser" | "runner" | "flyer" | "saboteur" | "shielder" | "artillery" | "boss";

export interface EnemyDef {
  id: string;
  name: string;
  role: EnemyRole;
  hp: number;
  speed: number;
  damage: number;
  armor: number;
  reward: number;       // scrap on kill
  special?: string;
  color: string;
  scale: number;
  isFlyer: boolean;
}

export interface EnemyState {
  instanceId: EntityId;
  defId: string;
  position: Vec3;
  hp: number;
  maxHp: number;
  speed: number;
  waypointIndex: number;
  effects: StatusEffect[];
  isElite: boolean;
  eliteMultiplier: number;
  shieldHp?: number;
  disabled: boolean;
  reachedBase: boolean;
}

export interface StatusEffect {
  type: "slow" | "burn" | "bleed" | "stun" | "armor_break" | "poison" | "freeze";
  duration: number;
  magnitude: number;
  sourceId: string;
}

// ── Projectile ───────────────────────────────────────────────

export interface Projectile {
  id: EntityId;
  position: Vec3;
  velocity: Vec3;
  damage: number;
  sourceId: EntityId;
  targetId?: EntityId;
  type: "arrow" | "bolt" | "fireball" | "lightning" | "slash" | "magic";
  ttl: number;
  color: string;
  aoeRadius?: number;
  effects?: Partial<StatusEffect>[];
}

// ── Relic ────────────────────────────────────────────────────

export type RelicRarity = "common" | "uncommon" | "rare" | "legendary";

export interface Relic {
  id: string;
  name: string;
  rarity: RelicRarity;
  description: string;
  tradeoff?: string;
  category: "offense" | "defense" | "economy" | "tower" | "profession";
  effect: RelicEffect;
}

export interface RelicEffect {
  type: string;
  value: number | string;
  condition?: string;
}

// ── Player ───────────────────────────────────────────────────

export interface PlayerState {
  position: Vec3;
  rotation: number;
  velocity: Vec3;
  hp: number;
  maxHp: number;
  abilities: AbilityState[];
  ultimate: UltimateState;
  activeEffects: StatusEffect[];
  attackCooldown: number;
  isAttacking: boolean;
  isDodging: boolean;
  dodgeCooldown: number;
}

export interface AbilityState {
  ability: Ability;
  cooldownRemaining: number;
  isReady: boolean;
}

export interface UltimateState {
  ultimate: Ultimate;
  charge: number;
  maxCharge: number;
  isActive: boolean;
  activeRemaining: number;
}

// ── Wave ─────────────────────────────────────────────────────

export interface WaveSpawn {
  defId: string;
  count: number;
  interval: number;    // seconds between spawns
  lane: 0 | 1 | 2;
  delayStart: number;  // seconds before first spawn
  isElite?: boolean;
}

export interface WaveConfig {
  wave: number;
  budget: number;
  spawns: WaveSpawn[];
  isBossWave: boolean;
  bossDefId?: string;
  envModifier?: string;
  reward: number;
  prepTime: number;
}

// ── Game Run State ────────────────────────────────────────────

export type GamePhase = "prep" | "wave" | "boss" | "interwave" | "results" | "gameover";

export interface RunState {
  professionId: string;
  wave: number;
  phase: GamePhase;
  scrap: number;
  baseHp: number;
  maxBaseHp: number;
  enemies: Map<EntityId, EnemyState>;
  towers: Map<EntityId, PlacedTower>;
  projectiles: Map<EntityId, Projectile>;
  player: PlayerState;
  relics: string[];          // active relic IDs
  towerAugments: Record<string, string[]>;
  waveTimer: number;
  prepTimer: number;
  totalKills: number;
  totalDamageDealt: number;
  totalScrapsEarned: number;
}

// ── Draft (Inter-Wave Roguelite) ──────────────────────────────

export type DraftOptionType = "relic" | "tower_augment" | "profession_augment" | "economy" | "contract";

export interface DraftOption {
  id: string;
  type: DraftOptionType;
  name: string;
  description: string;
  rarity: RelicRarity;
  tradeoff?: string;
  relicId?: string;
  augmentId?: string;
  economyAmount?: number;
}

// ── Settings ─────────────────────────────────────────────────

export type GraphicsPreset = "low" | "medium" | "high" | "ultra";

export interface GraphicsSettings {
  preset: GraphicsPreset;
  renderScale: number;       // 0.5 – 1.0
  shadows: boolean;
  bloom: boolean;
  vignette: boolean;
  particleQuality: "off" | "low" | "high";
  vsync: boolean;
  targetFps: 30 | 60 | 120 | 0;
}

export interface AudioSettings {
  master: number;    // 0–1
  music: number;
  sfx: number;
  ui: number;
}

export interface AccessibilitySettings {
  reducedMotion: boolean;
  cameraShake: boolean;
  colorblindMode: "none" | "protanopia" | "deuteranopia" | "tritanopia";
  hudSubtitles: boolean;
}

export interface KeyBindings {
  version: number;
  moveForward: string;
  moveBack: string;
  moveLeft: string;
  moveRight: string;
  sprint: string;
  dodge: string;
  attack: string;
  interact: string;
  ability1: string;
  ability2: string;
  ultimate: string;
  buildMenu: string;
  sellTower: string;
  ping: string;
}

export interface GameSettings {
  graphics: GraphicsSettings;
  audio: AudioSettings;
  accessibility: AccessibilitySettings;
  keybindings: KeyBindings;
  cameraSensitivityX: number;   // 0.1 – 3.0
  cameraSensitivityY: number;
  aimSensitivity: number;
}

export const DEFAULT_KEYBINDINGS: KeyBindings = {
  version: 1,
  moveForward: "KeyW",
  moveBack: "KeyS",
  moveLeft: "KeyA",
  moveRight: "KeyD",
  sprint: "ShiftLeft",
  dodge: "Space",
  attack: "Mouse0",
  interact: "KeyF",
  ability1: "KeyQ",
  ability2: "KeyE",
  ultimate: "KeyR",
  buildMenu: "KeyB",
  sellTower: "KeyX",
  ping: "KeyG",
};

export const DEFAULT_SETTINGS: GameSettings = {
  graphics: {
    preset: "high",
    renderScale: 1.0,
    shadows: true,
    bloom: true,
    vignette: true,
    particleQuality: "high",
    vsync: true,
    targetFps: 60,
  },
  audio: {
    master: 0.8,
    music: 0.5,
    sfx: 0.8,
    ui: 0.7,
  },
  accessibility: {
    reducedMotion: false,
    cameraShake: true,
    colorblindMode: "none",
    hudSubtitles: false,
  },
  keybindings: DEFAULT_KEYBINDINGS,
  cameraSensitivityX: 1.0,
  cameraSensitivityY: 0.8,
  aimSensitivity: 1.0,
};

// ── Profile ───────────────────────────────────────────────────

export type RankTier =
  | "Recruit" | "Sentinel" | "Bulwark" | "Aegis Knight" | "Bastion Prime" | "Mythic Warden";

export const RANK_THRESHOLDS: Record<RankTier, number> = {
  Recruit: 0,
  Sentinel: 500,
  Bulwark: 1500,
  "Aegis Knight": 3500,
  "Bastion Prime": 7000,
  "Mythic Warden": 15000,
};

export function getRankFromXP(xp: number): RankTier {
  const tiers = Object.entries(RANK_THRESHOLDS) as [RankTier, number][];
  let current: RankTier = "Recruit";
  for (const [tier, threshold] of tiers) {
    if (xp >= threshold) current = tier;
    else break;
  }
  return current;
}

export interface PlayerProfile {
  id: string;
  username: string;
  displayName?: string;
  rankTier: RankTier;
  rankXP: number;
  createdAt: string;
  updatedAt: string;
}
