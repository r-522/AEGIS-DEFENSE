"use client";

import { create } from "zustand";
import { gameEngine } from "@/engine/GameEngine";
import type { RunStateSnapshot, DraftOption } from "@/engine/GameEngine";
import type { GamePhase } from "@/types/game";
import { RELICS } from "@/data/relics";
import { PROFESSIONS } from "@/data/professions";

interface GameStore {
  snapshot: RunStateSnapshot | null;
  professionId: string | null;
  draftOptions: DraftOption[];
  selectedRelic: string | null;
  cameraAngle: { horizontal: number; vertical: number };

  // Run management
  startRun: (professionId: string) => void;
  endRun: () => void;

  // Wave management
  startWave: () => void;
  proceedFromInterwave: (choice: DraftOption | null) => void;

  // Tower placement
  placeTower: (defId: string, position: { x: number; y: number; z: number }) => boolean;

  // State update (called every frame from game loop)
  updateSnapshot: (snap: RunStateSnapshot) => void;

  // Draft generation
  generateDraftOptions: () => void;
}

export type { RunStateSnapshot as GameSnapshot, DraftOption };

function generateDraftOptionsForWave(wave: number, professionId: string | null): DraftOption[] {
  const allRelics = [...RELICS];
  const shuffled = allRelics.sort(() => Math.random() - 0.5).slice(0, 3);

  return shuffled.map((r) => ({
    id: r.id,
    type: "relic" as const,
    name: r.name,
    description: r.description,
    rarity: r.rarity,
    tradeoff: r.tradeoff,
    relicId: r.id,
  }));
}

export const useGameStore = create<GameStore>((set, get) => ({
  snapshot: null,
  professionId: null,
  draftOptions: [],
  selectedRelic: null,
  cameraAngle: { horizontal: 0, vertical: 0.4 },

  startRun: (professionId: string) => {
    gameEngine.onStateUpdate = (snap) => get().updateSnapshot(snap);
    gameEngine.startRun(professionId);
    set({ professionId, snapshot: gameEngine.getSnapshot() });
  },

  endRun: () => {
    set({ snapshot: null, professionId: null });
  },

  startWave: () => {
    gameEngine.startWave();
  },

  proceedFromInterwave: (choice: DraftOption | null) => {
    if (choice?.relicId) {
      gameEngine.addRelic(choice.relicId);
    }
    gameEngine.nextWave();
  },

  placeTower: (defId, position) => {
    return gameEngine.placeTowerAt(defId, position);
  },

  updateSnapshot: (snap) => {
    set({ snapshot: snap, cameraAngle: { ...gameEngine.cameraAngle } });
  },

  generateDraftOptions: () => {
    const professionId = get().professionId;
    const options = generateDraftOptionsForWave(
      get().snapshot?.wave || 1,
      professionId
    );
    set({ draftOptions: options });
  },
}));
