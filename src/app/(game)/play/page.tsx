"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useGameStore } from "@/lib/store/gameStore";
import HUD from "@/components/hud/HUD";
import { TOWER_DEFS } from "@/data/towers";

const GameCanvas = dynamic(() => import("@/components/game/GameCanvas"), { ssr: false });

function WaveStartButton() {
  const { snapshot, startWave } = useGameStore();
  if (!snapshot || snapshot.phase !== "prep") return null;

  return (
    <button
      onClick={startWave}
      className="absolute bottom-24 left-1/2 -translate-x-1/2 btn-primary text-base px-8 py-4 pointer-events-auto"
      style={{ zIndex: 20 }}
    >
      Begin Wave {snapshot.wave}
    </button>
  );
}

function TowerBuilderPanel() {
  const { snapshot, placeTower } = useGameStore();
  const [selectedTower, setSelectedTower] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  if (!snapshot || snapshot.phase !== "prep") return null;

  const towers = Object.values(TOWER_DEFS);

  return (
    <div className="absolute left-4 bottom-28 pointer-events-auto" style={{ zIndex: 20 }}>
      <button
        onClick={() => setOpen(!open)}
        className="btn-primary px-4 py-2 text-sm mb-2"
      >
        [B] Build Menu
      </button>

      {open && (
        <div className="aegis-panel p-3 w-64 max-h-80 overflow-y-auto">
          <p className="font-rajdhani text-xs uppercase tracking-widest text-ash mb-2">
            Select Tower — Scrap: {snapshot.scrap}
          </p>
          <div className="space-y-1">
            {towers.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  if (snapshot.scrap >= t.cost) {
                    placeTower(t.id, { x: 0, y: 0, z: 0 });
                  }
                }}
                disabled={snapshot.scrap < t.cost}
                className={`w-full text-left p-2 border transition-all text-xs ${
                  snapshot.scrap >= t.cost
                    ? "border-gunmetal hover:border-aegis-gold/40 text-bone hover:text-aegis-gold cursor-pointer"
                    : "border-gunmetal/30 text-ash/30 cursor-not-allowed"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-rajdhani font-semibold uppercase tracking-wider">
                    {t.name}
                  </span>
                  <span className="font-inter tabular-nums text-aegis-gold">{t.cost}⚙</span>
                </div>
                <p className="font-inter text-xs text-ash/60 mt-0.5">{t.role}</p>
              </button>
            ))}
          </div>
          <p className="mt-2 font-inter text-xs text-ash/40 text-center">
            Click map after selecting to place
          </p>
        </div>
      )}
    </div>
  );
}

function InterWaveDraft() {
  const router = useRouter();
  const { snapshot, draftOptions, generateDraftOptions, proceedFromInterwave } = useGameStore();
  const [chosen, setChosen] = useState<string | null>(null);

  useEffect(() => {
    if (snapshot?.phase === "interwave") {
      generateDraftOptions();
    }
  }, [snapshot?.phase, generateDraftOptions]);

  if (!snapshot || snapshot.phase !== "interwave") return null;

  const handleChoice = (opt: (typeof draftOptions)[0]) => {
    setChosen(opt.id);
    setTimeout(() => {
      proceedFromInterwave(opt);
      setChosen(null);
    }, 600);
  };

  const RARITY_COLORS: Record<string, string> = {
    common: "#8B9098",
    uncommon: "#6FA38B",
    rare: "#5FD7D1",
    legendary: "#C8A45D",
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-auto"
      style={{ background: "rgba(11,14,18,0.92)", zIndex: 50 }}
    >
      <div className="w-full max-w-3xl px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="font-rajdhani text-xs tracking-[0.3em] uppercase text-ash mb-2">
            Wave {snapshot.wave} Complete
          </p>
          <h2 className="font-cinzel text-3xl font-bold text-bone mb-1">
            Augment Protocol
          </h2>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-aegis-gold opacity-30" />
            <p className="font-rajdhani text-xs text-ash/60 tracking-widest uppercase">
              Select one acquisition
            </p>
            <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-aegis-gold opacity-30" />
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-3 gap-4">
          {draftOptions.map((opt) => {
            const rarityColor = RARITY_COLORS[opt.rarity] || "#8B9098";
            const isChosen = chosen === opt.id;

            return (
              <button
                key={opt.id}
                onClick={() => handleChoice(opt)}
                className={`text-left p-5 border transition-all duration-200 ${
                  isChosen
                    ? "border-aegis-gold bg-aegis-gold/10"
                    : "border-gunmetal hover:border-aegis-gold/40 bg-charcoal-plate/80"
                }`}
                style={{
                  borderTopWidth: 2,
                  borderTopColor: rarityColor,
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
                }}
              >
                {/* Rarity */}
                <p
                  className="font-rajdhani text-xs uppercase tracking-widest mb-1"
                  style={{ color: rarityColor }}
                >
                  {opt.rarity} — {opt.type.replace("_", " ")}
                </p>

                {/* Name */}
                <h3 className="font-cinzel text-sm font-semibold text-bone mb-2">{opt.name}</h3>

                {/* Effect */}
                <p className="font-inter text-xs text-bone/70 leading-relaxed mb-3">
                  {opt.description}
                </p>

                {/* Tradeoff */}
                {opt.tradeoff && (
                  <div className="border-t border-gunmetal pt-2">
                    <p className="font-inter text-xs text-ember/80">⚠ {opt.tradeoff}</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Skip */}
        <div className="text-center mt-6">
          <button
            onClick={() => proceedFromInterwave(null)}
            className="font-rajdhani text-xs tracking-widest uppercase text-ash/50 hover:text-ash transition-colors"
          >
            Skip — Continue to Wave {snapshot.wave + 1}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlayPage() {
  const router = useRouter();
  const { snapshot, professionId } = useGameStore();

  useEffect(() => {
    if (!professionId) {
      router.push("/profession");
    }
  }, [professionId, router]);

  useEffect(() => {
    if (snapshot?.phase === "results") {
      router.push("/results");
    }
  }, [snapshot?.phase, router]);

  if (!professionId) return null;

  return (
    <div className="w-screen h-screen overflow-hidden bg-obsidian relative">
      {/* 3D Game Canvas */}
      <div className="absolute inset-0">
        <GameCanvas />
      </div>

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
        <HUD />
      </div>

      {/* Wave start button */}
      <WaveStartButton />

      {/* Tower builder */}
      <TowerBuilderPanel />

      {/* Inter-wave draft overlay */}
      <InterWaveDraft />

      {/* Back to menu (always accessible) */}
      <button
        onClick={() => router.push("/menu")}
        className="absolute top-4 left-1/2 -translate-x-1/2 font-rajdhani text-xs tracking-widest uppercase text-ash/30 hover:text-ash transition-colors pointer-events-auto"
        style={{ zIndex: 20 }}
      >
        ← Abandon Operation
      </button>
    </div>
  );
}
