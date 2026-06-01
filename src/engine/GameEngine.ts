import { v4 as uuid } from "uuid";
import type {
  RunState, PlayerState, EnemyState, PlacedTower, Projectile,
  Vec3, GamePhase, WaveConfig, AbilityState, UltimateState,
  DraftOption,
} from "@/types/game";
import { ENEMY_DEFS, ELITE_MODIFIERS } from "@/data/enemies";
import { TOWER_DEFS, LANE_WAYPOINTS } from "@/data/towers";
import { getWaveConfig } from "@/data/waves";
import { getProfessionById } from "@/data/professions";

export type InputState = {
  keys: Set<string>;
  mouseButtons: Set<number>;
  mouseDeltaX: number;
  mouseDeltaY: number;
  mouseX: number;
  mouseY: number;
};

export type GameEngineCallback = (state: RunStateSnapshot) => void;
export type { DraftOption };

export interface RunStateSnapshot {
  phase: GamePhase;
  wave: number;
  scrap: number;
  baseHp: number;
  maxBaseHp: number;
  playerHp: number;
  playerMaxHp: number;
  playerPosition: Vec3;
  playerRotation: number;
  ultimateCharge: number;
  abilities: { cooldownRemaining: number; cooldown: number }[];
  waveTimer: number;
  prepTimer: number;
  totalKills: number;
  enemyCount: number;
  enemies: EnemySnapshot[];
  towers: TowerSnapshot[];
  projectiles: ProjectileSnapshot[];
  activeRelics: string[];
}

export interface EnemySnapshot {
  id: string;
  defId: string;
  position: Vec3;
  hp: number;
  maxHp: number;
  isElite: boolean;
  shieldHp?: number;
  effects: string[];
}

export interface TowerSnapshot {
  id: string;
  defId: string;
  position: Vec3;
  level: number;
  hp: number;
  maxHp: number;
  disabled: boolean;
  firing: boolean;
}

export interface ProjectileSnapshot {
  id: string;
  position: Vec3;
  color: string;
  type: string;
}

const PLAYER_SPEED = 8;
const PLAYER_SPRINT_MULT = 1.6;
const PLAYER_BASE_HP = 150;
const BASE_HP = 400;
const ATTACK_COOLDOWN = 0.5;
const ATTACK_DAMAGE = 45;
const ATTACK_RANGE = 2.5;
const DODGE_DURATION = 0.3;
const DODGE_COOLDOWN = 1.2;
const DODGE_SPEED = 20;

export class GameEngine {
  private state!: RunState;
  private waveConfig!: WaveConfig;
  private spawnTimers: number[] = [];
  private pendingSpawns: Array<{ defId: string; lane: number; isElite?: boolean; delay: number }> = [];
  private waveInProgress = false;
  private bossAlive = false;

  onStateUpdate?: GameEngineCallback;

  private get sprintActive(): boolean {
    return this.input.keys.has("ShiftLeft") || this.input.keys.has("ShiftRight");
  }

  input: InputState = {
    keys: new Set(),
    mouseButtons: new Set(),
    mouseDeltaX: 0,
    mouseDeltaY: 0,
    mouseX: 0,
    mouseY: 0,
  };

  cameraAngle = { horizontal: 0, vertical: 0.4 };

  startRun(professionId: string) {
    const prof = getProfessionById(professionId);
    if (!prof || !prof.ready) throw new Error(`Profession ${professionId} not available`);

    const abilities: AbilityState[] = prof.abilities.map((a) => ({
      ability: a,
      cooldownRemaining: 0,
      isReady: true,
    }));

    const ultimate: UltimateState = {
      ultimate: prof.ultimate,
      charge: 0,
      maxCharge: prof.ultimate.chargeRequired,
      isActive: false,
      activeRemaining: 0,
    };

    const player: PlayerState = {
      position: { x: 0, y: 0.5, z: -2 },
      rotation: 0,
      velocity: { x: 0, y: 0, z: 0 },
      hp: PLAYER_BASE_HP,
      maxHp: PLAYER_BASE_HP,
      abilities,
      ultimate,
      activeEffects: [],
      attackCooldown: 0,
      isAttacking: false,
      isDodging: false,
      dodgeCooldown: 0,
    };

    this.state = {
      professionId,
      wave: 1,
      phase: "prep",
      scrap: 100,
      baseHp: BASE_HP,
      maxBaseHp: BASE_HP,
      enemies: new Map(),
      towers: new Map(),
      projectiles: new Map(),
      player,
      relics: [],
      towerAugments: {},
      waveTimer: 0,
      prepTimer: 40,
      totalKills: 0,
      totalDamageDealt: 0,
      totalScrapsEarned: 100,
    };

    this.waveConfig = getWaveConfig(1);
    this.initSpawnQueue();
  }

  private initSpawnQueue() {
    this.pendingSpawns = [];
    for (const spawn of this.waveConfig.spawns) {
      for (let i = 0; i < spawn.count; i++) {
        this.pendingSpawns.push({
          defId: spawn.defId,
          lane: spawn.lane,
          isElite: spawn.isElite,
          delay: spawn.delayStart + i * spawn.interval,
        });
      }
    }
    this.pendingSpawns.sort((a, b) => a.delay - b.delay);
    this.waveInProgress = false;
    this.bossAlive = false;
  }

  placeTower(defId: string, gridX: number, gridZ: number): boolean {
    const def = TOWER_DEFS[defId as keyof typeof TOWER_DEFS];
    if (!def) return false;
    if (this.state.scrap < def.cost) return false;
    if (this.state.phase !== "prep") return false;

    const id = uuid();
    this.state.towers.set(id, {
      instanceId: id,
      defId: defId as any,
      position: { x: gridX * 2 - 9, y: 0, z: gridZ * 2 - 10 },
      level: 1,
      hp: 200,
      maxHp: 200,
      cooldown: 0,
      disabled: false,
      augments: [],
    });
    this.state.scrap -= def.cost;
    return true;
  }

  placeTowerAt(defId: string, position: Vec3): boolean {
    const def = TOWER_DEFS[defId as keyof typeof TOWER_DEFS];
    if (!def) return false;
    if (this.state.scrap < def.cost) return false;

    const id = uuid();
    this.state.towers.set(id, {
      instanceId: id,
      defId: defId as any,
      position,
      level: 1,
      hp: 200,
      maxHp: 200,
      cooldown: 0,
      disabled: false,
      augments: [],
    });
    this.state.scrap -= def.cost;
    return true;
  }

  startWave() {
    if (this.state.phase !== "prep") return;
    this.state.phase = "wave";
    this.state.waveTimer = 0;
    this.waveInProgress = true;
    this.initSpawnQueue();
  }

  addRelic(relicId: string) {
    this.state.relics.push(relicId);
  }

  getSnapshot(): RunStateSnapshot {
    const s = this.state;
    return {
      phase: s.phase,
      wave: s.wave,
      scrap: s.scrap,
      baseHp: s.baseHp,
      maxBaseHp: s.maxBaseHp,
      playerHp: s.player.hp,
      playerMaxHp: s.player.maxHp,
      playerPosition: { ...s.player.position },
      playerRotation: s.player.rotation,
      ultimateCharge: s.player.ultimate.charge,
      abilities: s.player.abilities.map((a) => ({
        cooldownRemaining: a.cooldownRemaining,
        cooldown: a.ability.cooldown,
      })),
      waveTimer: s.waveTimer,
      prepTimer: s.prepTimer,
      totalKills: s.totalKills,
      enemyCount: s.enemies.size,
      enemies: Array.from(s.enemies.values()).map((e) => ({
        id: e.instanceId,
        defId: e.defId,
        position: { ...e.position },
        hp: e.hp,
        maxHp: e.maxHp,
        isElite: e.isElite,
        shieldHp: e.shieldHp,
        effects: e.effects.map((ef) => ef.type),
      })),
      towers: Array.from(s.towers.values()).map((t) => ({
        id: t.instanceId,
        defId: t.defId,
        position: { ...t.position },
        level: t.level,
        hp: t.hp,
        maxHp: t.maxHp,
        disabled: t.disabled,
        firing: t.cooldown < 0.1,
      })),
      projectiles: Array.from(s.projectiles.values()).map((p) => ({
        id: p.id,
        position: { ...p.position },
        color: p.color,
        type: p.type,
      })),
      activeRelics: [...s.relics],
    };
  }

  update(dt: number) {
    if (!this.state) return;

    const clamped = Math.min(dt, 0.05);

    switch (this.state.phase) {
      case "prep":
        this.updatePrep(clamped);
        break;
      case "wave":
      case "boss":
        this.updateWave(clamped);
        break;
      case "interwave":
        break;
    }

    this.updatePlayer(clamped);
    this.updateCamera();
    this.onStateUpdate?.(this.getSnapshot());
  }

  private updatePrep(dt: number) {
    this.state.prepTimer = Math.max(0, this.state.prepTimer - dt);
    if (this.state.prepTimer <= 0) {
      this.startWave();
    }
  }

  private updateWave(dt: number) {
    this.state.waveTimer += dt;

    // Spawn enemies from queue
    while (
      this.pendingSpawns.length > 0 &&
      this.pendingSpawns[0].delay <= this.state.waveTimer
    ) {
      const spawn = this.pendingSpawns.shift()!;
      this.spawnEnemy(spawn.defId, spawn.lane, spawn.isElite);
    }

    // Update enemies
    for (const enemy of this.state.enemies.values()) {
      this.updateEnemy(enemy, dt);
    }

    // Remove reached-base enemies
    for (const [id, enemy] of this.state.enemies) {
      if (enemy.reachedBase) {
        this.state.baseHp = Math.max(0, this.state.baseHp - 50);
        this.state.enemies.delete(id);
        if (this.state.baseHp <= 0) {
          this.state.phase = "gameover";
          return;
        }
      }
    }

    // Update towers
    for (const tower of this.state.towers.values()) {
      if (!tower.disabled) {
        this.updateTower(tower, dt);
      }
    }

    // Update projectiles
    for (const [id, proj] of this.state.projectiles) {
      this.updateProjectile(id, proj, dt);
    }

    // Update effect timers on enemies
    for (const enemy of this.state.enemies.values()) {
      this.tickEffects(enemy, dt);
    }

    // Check wave completion
    if (
      this.pendingSpawns.length === 0 &&
      this.state.enemies.size === 0
    ) {
      this.completeWave();
    }
  }

  private spawnEnemy(defId: string, lane: number, isElite = false) {
    const def = ENEMY_DEFS[defId];
    if (!def) return;

    const waypoints = LANE_WAYPOINTS[lane] || LANE_WAYPOINTS[1];
    const startWp = waypoints[0];

    const id = uuid();
    const hpMult = isElite ? 2.0 : 1.0;
    const elite = isElite ? ELITE_MODIFIERS[Math.floor(Math.random() * ELITE_MODIFIERS.length)] : null;

    this.state.enemies.set(id, {
      instanceId: id,
      defId,
      position: { x: startWp[0] + (Math.random() - 0.5), y: def.isFlyer ? 2.5 : 0.5, z: startWp[1] },
      hp: def.hp * hpMult * (elite?.hpMult || 1),
      maxHp: def.hp * hpMult * (elite?.hpMult || 1),
      speed: def.speed * (elite?.speedMult || 1),
      waypointIndex: 1,
      effects: [],
      isElite,
      eliteMultiplier: elite?.hpMult || 1,
      shieldHp: isElite && elite?.shieldHp ? elite.shieldHp : undefined,
      disabled: false,
      reachedBase: false,
    });

    if (defId === this.waveConfig.bossDefId) {
      this.bossAlive = true;
      this.state.phase = "boss";
    }
  }

  private updateEnemy(enemy: EnemyState, dt: number) {
    if (enemy.disabled) return;
    if (enemy.hp <= 0) return;

    const lane = this.getLaneForEnemy(enemy);
    const waypoints = LANE_WAYPOINTS[lane] || LANE_WAYPOINTS[1];

    if (enemy.waypointIndex >= waypoints.length) {
      enemy.reachedBase = true;
      return;
    }

    const target = waypoints[enemy.waypointIndex];
    const dx = target[0] - enemy.position.x;
    const dz = target[1] - enemy.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    // Slow effect
    const slowEffect = enemy.effects.find((e) => e.type === "slow");
    const speedMult = slowEffect ? 1 - slowEffect.magnitude : 1;
    const effectiveSpeed = enemy.speed * speedMult * dt;

    if (dist < 0.3) {
      enemy.waypointIndex++;
    } else {
      enemy.position.x += (dx / dist) * effectiveSpeed;
      enemy.position.z += (dz / dist) * effectiveSpeed;
    }

    // Burn damage
    const burnEffect = enemy.effects.find((e) => e.type === "burn");
    if (burnEffect) {
      this.damageEnemy(enemy, burnEffect.magnitude * dt, "burn");
    }
    const bleedEffect = enemy.effects.find((e) => e.type === "bleed");
    if (bleedEffect) {
      this.damageEnemy(enemy, bleedEffect.magnitude * dt, "bleed");
    }
  }

  private getLaneForEnemy(enemy: EnemyState): number {
    const x = enemy.position.x;
    if (x < -3) return 0;
    if (x > 3) return 2;
    return 1;
  }

  private damageEnemy(enemy: EnemyState, damage: number, source = "tower") {
    if (enemy.shieldHp !== undefined && enemy.shieldHp > 0) {
      const absorbed = Math.min(damage, enemy.shieldHp);
      enemy.shieldHp -= absorbed;
      damage -= absorbed;
    }
    enemy.hp = Math.max(0, enemy.hp - damage);
    this.state.totalDamageDealt += damage;

    if (enemy.hp <= 0) {
      this.killEnemy(enemy);
    }
  }

  private killEnemy(enemy: EnemyState) {
    const def = ENEMY_DEFS[enemy.defId];
    if (!def) return;
    const reward = Math.ceil(def.reward * enemy.eliteMultiplier);
    this.state.scrap += reward;
    this.state.totalScrapsEarned += reward;
    this.state.totalKills++;
    this.state.player.ultimate.charge = Math.min(
      this.state.player.ultimate.maxCharge,
      this.state.player.ultimate.charge + 5
    );
    this.state.enemies.delete(enemy.instanceId);

    if (enemy.defId === this.waveConfig.bossDefId) {
      this.bossAlive = false;
    }
  }

  private tickEffects(enemy: EnemyState, dt: number) {
    enemy.effects = enemy.effects
      .map((e) => ({ ...e, duration: e.duration - dt }))
      .filter((e) => e.duration > 0);
  }

  private updateTower(tower: PlacedTower, dt: number) {
    tower.cooldown = Math.max(0, tower.cooldown - dt);
    if (tower.cooldown > 0) return;

    const def = TOWER_DEFS[tower.defId];
    if (!def) return;

    const range = def.stats.range + (tower.level - 1) * 1.5;
    const target = this.findEnemyInRange(tower.position, range, def.attackType === "aoe");
    if (!target) return;

    tower.cooldown = 1 / def.stats.fireRate;
    tower.targetId = target.instanceId;

    this.fireProjectile(tower, target, def);
  }

  private findEnemyInRange(pos: Vec3, range: number, preferAoe: boolean): EnemyState | null {
    let best: EnemyState | null = null;
    let bestDist = Infinity;
    let lowestHp = Infinity;

    for (const enemy of this.state.enemies.values()) {
      if (enemy.hp <= 0) continue;
      const dx = enemy.position.x - pos.x;
      const dz = enemy.position.z - pos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist <= range) {
        if (preferAoe) {
          if (dist < bestDist) { bestDist = dist; best = enemy; }
        } else {
          // Target lowest-health first
          if (enemy.hp < lowestHp) { lowestHp = enemy.hp; best = enemy; }
        }
      }
    }
    return best;
  }

  private fireProjectile(tower: PlacedTower, target: EnemyState, def: (typeof TOWER_DEFS)[keyof typeof TOWER_DEFS]) {
    const dx = target.position.x - tower.position.x;
    const dy = target.position.y - tower.position.y;
    const dz = target.position.z - tower.position.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    const speed = def.stats.projectileSpeed || 15;
    const id = uuid();

    if (def.attackType === "trap") {
      // Rune Mine: instant AoE at tower position
      this.applyAoeDamage(tower.position, def.stats.splashRadius || 3, def.stats.damage + (tower.level - 1) * 50);
      return;
    }

    this.state.projectiles.set(id, {
      id,
      position: { ...tower.position, y: tower.position.y + 1 },
      velocity: {
        x: (dx / dist) * speed,
        y: (dy / dist) * speed,
        z: (dz / dist) * speed,
      },
      damage: def.stats.damage + (tower.level - 1) * 30,
      sourceId: tower.instanceId,
      targetId: target.instanceId,
      type: def.attackType === "chain" ? "lightning" : def.id === "flame_mortar" ? "fireball" : "bolt",
      ttl: 5,
      color: def.projectileColor,
      aoeRadius: def.stats.splashRadius,
      effects: def.id === "flame_mortar" ? [{ type: "burn", duration: 4, magnitude: 25 }] : undefined,
    });
  }

  private updateProjectile(id: string, proj: Projectile, dt: number) {
    proj.position.x += proj.velocity.x * dt;
    proj.position.y += proj.velocity.y * dt;
    proj.position.z += proj.velocity.z * dt;
    proj.ttl -= dt;

    if (proj.ttl <= 0) {
      this.state.projectiles.delete(id);
      return;
    }

    // Check hit
    for (const enemy of this.state.enemies.values()) {
      if (enemy.hp <= 0) continue;
      const dx = proj.position.x - enemy.position.x;
      const dy = proj.position.y - enemy.position.y;
      const dz = proj.position.z - enemy.position.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 0.8) {
        if (proj.aoeRadius) {
          this.applyAoeDamage(proj.position, proj.aoeRadius, proj.damage);
        } else {
          this.damageEnemy(enemy, proj.damage);
          // Apply status effects
          if (proj.effects) {
            for (const eff of proj.effects) {
              enemy.effects.push({ type: eff.type!, duration: eff.duration!, magnitude: eff.magnitude!, sourceId: proj.sourceId });
            }
          }
          // Chain lightning
          if (proj.type === "lightning") {
            this.chainLightning(enemy, proj.damage * 0.6, 3);
          }
        }
        this.state.projectiles.delete(id);
        return;
      }
    }
  }

  private applyAoeDamage(pos: Vec3, radius: number, damage: number) {
    for (const enemy of this.state.enemies.values()) {
      if (enemy.hp <= 0) continue;
      const dx = pos.x - enemy.position.x;
      const dz = pos.z - enemy.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist <= radius) {
        const falloff = 1 - (dist / radius) * 0.5;
        this.damageEnemy(enemy, damage * falloff);
        // Fire zone effect
        const burnProb = 0.6;
        if (Math.random() < burnProb) {
          const existing = enemy.effects.findIndex((e) => e.type === "burn");
          if (existing === -1) {
            enemy.effects.push({ type: "burn", duration: 3, magnitude: 25, sourceId: "tower_aoe" });
          }
        }
      }
    }
  }

  private chainLightning(origin: EnemyState, damage: number, chains: number) {
    if (chains <= 0) return;
    let nearest: EnemyState | null = null;
    let nearestDist = Infinity;
    for (const e of this.state.enemies.values()) {
      if (e === origin || e.hp <= 0) continue;
      const dx = e.position.x - origin.position.x;
      const dz = e.position.z - origin.position.z;
      const d = Math.sqrt(dx * dx + dz * dz);
      if (d < 5 && d < nearestDist) { nearestDist = d; nearest = e; }
    }
    if (nearest) {
      this.damageEnemy(nearest, damage);
      if (Math.random() < 0.15) {
        nearest.effects.push({ type: "stun", duration: 0.8, magnitude: 1, sourceId: "chain_lightning" });
      }
      this.chainLightning(nearest, damage * 0.8, chains - 1);
    }
  }

  private updatePlayer(dt: number) {
    const p = this.state.player;
    const keys = this.input.keys;

    // Camera-relative movement
    const angle = this.cameraAngle.horizontal;
    const forwardX = -Math.sin(angle);
    const forwardZ = -Math.cos(angle);
    const rightX = Math.cos(angle);
    const rightZ = -Math.sin(angle);

    let moveX = 0;
    let moveZ = 0;

    if (keys.has("KeyW") || keys.has("ArrowUp")) { moveX += forwardX; moveZ += forwardZ; }
    if (keys.has("KeyS") || keys.has("ArrowDown")) { moveX -= forwardX; moveZ -= forwardZ; }
    if (keys.has("KeyA") || keys.has("ArrowLeft")) { moveX -= rightX; moveZ -= rightZ; }
    if (keys.has("KeyD") || keys.has("ArrowRight")) { moveX += rightX; moveZ += rightZ; }

    const moveMag = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (moveMag > 0) {
      moveX /= moveMag;
      moveZ /= moveMag;
      p.rotation = Math.atan2(moveX, moveZ);
    }

    const speed = PLAYER_SPEED * (this.sprintActive ? PLAYER_SPRINT_MULT : 1) * (p.isDodging ? DODGE_SPEED / PLAYER_SPEED : 1);

    if (p.isDodging) {
      p.velocity.x = moveX * speed;
      p.velocity.z = moveZ * speed;
    } else {
      p.velocity.x += (moveX * speed - p.velocity.x) * (dt * 12);
      p.velocity.z += (moveZ * speed - p.velocity.z) * (dt * 12);
    }

    p.position.x += p.velocity.x * dt;
    p.position.z += p.velocity.z * dt;

    // Boundary clamp
    p.position.x = Math.max(-11, Math.min(11, p.position.x));
    p.position.z = Math.max(-12, Math.min(12, p.position.z));

    // Dodge
    p.dodgeCooldown = Math.max(0, p.dodgeCooldown - dt);
    if (p.isDodging) {
      p.activeEffects = p.activeEffects.map((e) => ({ ...e, duration: e.duration - dt })).filter((e) => e.duration > 0);
    }

    // Abilities cooldown
    for (const ab of p.abilities) {
      ab.cooldownRemaining = Math.max(0, ab.cooldownRemaining - dt);
      ab.isReady = ab.cooldownRemaining <= 0;
    }

    // Attack
    p.attackCooldown = Math.max(0, p.attackCooldown - dt);
    if (this.input.mouseButtons.has(0) && p.attackCooldown <= 0 && this.state.phase === "wave") {
      this.playerAttack();
    }

    // Ability activation (Q/E)
    if (keys.has("KeyQ") && p.abilities[0]?.isReady && this.state.phase === "wave") {
      this.activateAbility(0);
    }
    if (keys.has("KeyE") && p.abilities[1]?.isReady && this.state.phase === "wave") {
      this.activateAbility(1);
    }
    if (keys.has("KeyR") && p.ultimate.charge >= p.ultimate.maxCharge && !p.ultimate.isActive && this.state.phase === "wave") {
      this.activateUltimate();
    }
  }

  private playerAttack() {
    const p = this.state.player;
    p.attackCooldown = ATTACK_COOLDOWN;
    p.isAttacking = true;

    const attackDir = {
      x: Math.sin(p.rotation),
      z: Math.cos(p.rotation),
    };
    const attackPos: Vec3 = {
      x: p.position.x + attackDir.x * 1.5,
      y: p.position.y,
      z: p.position.z + attackDir.z * 1.5,
    };

    for (const enemy of this.state.enemies.values()) {
      const dx = enemy.position.x - attackPos.x;
      const dz = enemy.position.z - attackPos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < ATTACK_RANGE) {
        this.damageEnemy(enemy, ATTACK_DAMAGE);
        this.state.player.ultimate.charge = Math.min(
          p.ultimate.maxCharge,
          p.ultimate.charge + 3
        );
      }
    }
  }

  private activateAbility(index: number) {
    const ab = this.state.player.abilities[index];
    if (!ab || !ab.isReady) return;
    ab.cooldownRemaining = ab.ability.cooldown;
    ab.isReady = false;

    // Apply ability effect based on type
    switch (ab.ability.type) {
      case "damage": {
        // AoE around player
        this.applyAoeDamage(this.state.player.position, 6, 150);
        break;
      }
      case "control": {
        for (const enemy of this.state.enemies.values()) {
          const dx = enemy.position.x - this.state.player.position.x;
          const dz = enemy.position.z - this.state.player.position.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < 10) {
            enemy.effects.push({ type: "slow", duration: 4, magnitude: 0.6, sourceId: "player_ability" });
          }
        }
        break;
      }
      case "support": {
        // Buff nearby towers
        for (const tower of this.state.towers.values()) {
          tower.cooldown = 0; // Reset cooldowns
        }
        break;
      }
      case "movement": {
        // Teleport to nearest marked enemy
        const firstEnemy = Array.from(this.state.enemies.values())[0];
        if (firstEnemy) {
          const dx = firstEnemy.position.x - this.state.player.position.x;
          const dz = firstEnemy.position.z - this.state.player.position.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < 20) {
            this.state.player.position.x = firstEnemy.position.x - dx / dist * 1.5;
            this.state.player.position.z = firstEnemy.position.z - dz / dist * 1.5;
          }
        }
        break;
      }
      case "defense": {
        this.state.player.hp = Math.min(this.state.player.maxHp, this.state.player.hp + 40);
        break;
      }
    }
  }

  private activateUltimate() {
    const p = this.state.player;
    p.ultimate.charge = 0;
    p.ultimate.isActive = true;
    p.ultimate.activeRemaining = 6;

    // Default ultimate: massive AoE damage + tower buff
    this.applyAoeDamage(p.position, 12, 300);
    for (const tower of this.state.towers.values()) {
      tower.cooldown = 0;
    }
  }

  private updateCamera() {
    const sens = 0.002;
    this.cameraAngle.horizontal -= this.input.mouseDeltaX * sens;
    this.cameraAngle.vertical = Math.max(
      0.15,
      Math.min(Math.PI / 2 - 0.1, this.cameraAngle.vertical - this.input.mouseDeltaY * sens)
    );
    this.input.mouseDeltaX = 0;
    this.input.mouseDeltaY = 0;
  }

  private completeWave() {
    this.state.phase = "interwave";
    this.state.scrap += this.waveConfig.reward;
    this.state.totalScrapsEarned += this.waveConfig.reward;
  }

  nextWave() {
    this.state.wave++;
    this.waveConfig = getWaveConfig(this.state.wave);
    this.state.phase = "prep";
    this.state.prepTimer = this.waveConfig.prepTime;
    this.state.waveTimer = 0;
    // Repair towers partially
    for (const tower of this.state.towers.values()) {
      tower.hp = Math.min(tower.maxHp, tower.hp + 50);
      tower.disabled = false;
    }
    this.initSpawnQueue();
  }

  getState(): RunState {
    return this.state;
  }
}

export const gameEngine = new GameEngine();
