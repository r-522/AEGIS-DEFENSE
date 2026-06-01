import type { WaveConfig } from "@/types/game";

export const WAVE_CONFIGS: WaveConfig[] = [
  {
    wave: 1,
    budget: 120,
    isBossWave: false,
    prepTime: 40,
    reward: 30,
    spawns: [
      { defId: "hollow_thrall", count: 8, interval: 1.2, lane: 1, delayStart: 0 },
      { defId: "hollow_thrall", count: 4, interval: 1.5, lane: 0, delayStart: 3 },
    ],
  },
  {
    wave: 2,
    budget: 180,
    isBossWave: false,
    prepTime: 35,
    reward: 35,
    spawns: [
      { defId: "hollow_thrall", count: 10, interval: 1.0, lane: 1, delayStart: 0 },
      { defId: "bone_swarm", count: 5, interval: 1.5, lane: 2, delayStart: 2 },
      { defId: "iron_brute", count: 1, interval: 5, lane: 0, delayStart: 6 },
    ],
  },
  {
    wave: 3,
    budget: 250,
    isBossWave: false,
    prepTime: 35,
    reward: 40,
    spawns: [
      { defId: "hollow_thrall", count: 12, interval: 0.8, lane: 0, delayStart: 0 },
      { defId: "void_sprinter", count: 3, interval: 2.0, lane: 2, delayStart: 1 },
      { defId: "iron_brute", count: 2, interval: 4, lane: 1, delayStart: 5 },
    ],
  },
  {
    wave: 4,
    budget: 320,
    isBossWave: false,
    prepTime: 35,
    reward: 45,
    spawns: [
      { defId: "bone_swarm", count: 15, interval: 0.7, lane: 1, delayStart: 0 },
      { defId: "siege_harpy", count: 4, interval: 2.0, lane: 1, delayStart: 2 },
      { defId: "circuit_wraith", count: 2, interval: 5, lane: 0, delayStart: 4 },
    ],
  },
  {
    wave: 5,
    budget: 500,
    isBossWave: true,
    prepTime: 50,
    reward: 100,
    spawns: [
      { defId: "hollow_thrall", count: 10, interval: 0.8, lane: 0, delayStart: 0 },
      { defId: "hollow_thrall", count: 10, interval: 0.8, lane: 2, delayStart: 1 },
      { defId: "fortress_leviathan", count: 1, interval: 999, lane: 1, delayStart: 8 },
    ],
    bossDefId: "fortress_leviathan",
  },
  {
    wave: 6,
    budget: 400,
    isBossWave: false,
    prepTime: 40,
    reward: 55,
    spawns: [
      { defId: "phase_hound", count: 5, interval: 1.5, lane: 2, delayStart: 0 },
      { defId: "iron_brute", count: 3, interval: 3, lane: 0, delayStart: 3 },
      { defId: "siege_cannon", count: 1, interval: 999, lane: 1, delayStart: 10 },
    ],
  },
  {
    wave: 7,
    budget: 480,
    isBossWave: false,
    prepTime: 35,
    reward: 60,
    spawns: [
      { defId: "void_sprinter", count: 8, interval: 1.0, lane: 0, delayStart: 0 },
      { defId: "siege_harpy", count: 6, interval: 1.5, lane: 1, delayStart: 1 },
      { defId: "stone_golem", count: 2, interval: 5, lane: 2, delayStart: 6 },
    ],
  },
  {
    wave: 8,
    budget: 580,
    isBossWave: false,
    prepTime: 35,
    reward: 65,
    spawns: [
      { defId: "hex_crawler", count: 4, interval: 2.5, lane: 0, delayStart: 0 },
      { defId: "aegis_breaker", count: 2, interval: 6, lane: 1, delayStart: 3 },
      { defId: "bone_swarm", count: 20, interval: 0.5, lane: 2, delayStart: 0 },
      { defId: "void_mantis", count: 2, interval: 4, lane: 1, delayStart: 8 },
    ],
  },
  {
    wave: 9,
    budget: 680,
    isBossWave: false,
    prepTime: 35,
    reward: 70,
    spawns: [
      { defId: "iron_brute", count: 5, interval: 2.5, lane: 0, delayStart: 0, isElite: true },
      { defId: "void_sprinter", count: 10, interval: 0.8, lane: 2, delayStart: 0 },
      { defId: "circuit_wraith", count: 3, interval: 3, lane: 1, delayStart: 5 },
    ],
  },
  {
    wave: 10,
    budget: 1000,
    isBossWave: true,
    prepTime: 60,
    reward: 150,
    spawns: [
      { defId: "hollow_thrall", count: 20, interval: 0.5, lane: 0, delayStart: 0 },
      { defId: "siege_harpy", count: 8, interval: 1.0, lane: 1, delayStart: 2 },
      { defId: "hollow_thrall", count: 20, interval: 0.5, lane: 2, delayStart: 1 },
      { defId: "undying_warlord", count: 1, interval: 999, lane: 1, delayStart: 12 },
    ],
    bossDefId: "undying_warlord",
    envModifier: "Darkness: tower range reduced by 20%",
  },
];

export function getWaveConfig(wave: number): WaveConfig {
  if (wave <= WAVE_CONFIGS.length) {
    return WAVE_CONFIGS[wave - 1];
  }
  // Generate scaled config for waves beyond the defined set
  const baseWave = WAVE_CONFIGS[WAVE_CONFIGS.length - 1];
  const scale = 1 + (wave - WAVE_CONFIGS.length) * 0.2;
  return {
    wave,
    budget: Math.floor(baseWave.budget * scale),
    isBossWave: wave % 5 === 0,
    prepTime: 35,
    reward: Math.floor(baseWave.reward * scale),
    spawns: baseWave.spawns.map((s) => ({
      ...s,
      count: Math.ceil(s.count * scale),
    })),
    bossDefId: wave % 5 === 0 ? "fortress_leviathan" : undefined,
  };
}
