"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PROFESSIONS, PROFESSION_CATEGORIES, DIFFICULTY_LABEL, DIFFICULTY_COLOR } from "@/data/professions";
import { useGameStore } from "@/lib/store/gameStore";
import type { Profession, ProfessionCategory } from "@/types/game";

function StatBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className="h-2 w-5 rounded-sm"
          style={{
            background: n <= value ? color : "rgba(43,50,61,0.8)",
            border: `1px solid ${n <= value ? color : "rgba(43,50,61,1)"}`,
          }}
        />
      ))}
    </div>
  );
}

function ProfessionDossier({ prof }: { prof: Profession }) {
  const colorHex = prof.ready ? prof.color : "#8B9098";

  return (
    <div className="h-full flex flex-col overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
      {/* Header */}
      <div className="p-5 border-b border-gunmetal" style={{ borderTopColor: colorHex, borderTopWidth: 2 }}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="font-cinzel text-xl font-bold text-bone">{prof.name}</h2>
            <p className="font-rajdhani text-sm text-ash tracking-wider">{prof.nameJP}</p>
          </div>
          <div className="text-right">
            <span
              className="font-rajdhani text-xs tracking-widest uppercase px-2 py-1"
              style={{
                color: DIFFICULTY_COLOR[prof.difficulty],
                border: `1px solid ${DIFFICULTY_COLOR[prof.difficulty]}40`,
                background: `${DIFFICULTY_COLOR[prof.difficulty]}10`,
              }}
            >
              {DIFFICULTY_LABEL[prof.difficulty]}
            </span>
          </div>
        </div>

        <span
          className="font-rajdhani text-xs tracking-wider uppercase"
          style={{ color: colorHex }}
        >
          {prof.role}
        </span>

        {!prof.ready && (
          <div className="mt-3 p-2 border border-gunmetal bg-charcoal-plate">
            <p className="font-rajdhani text-xs text-ash tracking-wider uppercase text-center">
              🔒 Unlock through meta progression
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="p-5 border-b border-gunmetal">
        <p className="font-inter text-sm text-bone/80 leading-relaxed">{prof.description}</p>
        {prof.lore !== "Coming soon." && (
          <p className="mt-2 font-inter text-xs text-ash/60 italic leading-relaxed">{prof.lore}</p>
        )}
      </div>

      {/* Stats */}
      <div className="p-5 border-b border-gunmetal">
        <h3 className="font-rajdhani text-xs tracking-widest uppercase text-ash mb-3">
          Power Profile
        </h3>
        <div className="space-y-2">
          {[
            { label: "Damage", value: prof.stats.damage, color: "#D45A35" },
            { label: "Defense", value: prof.stats.defense, color: "#6FA38B" },
            { label: "Control", value: prof.stats.control, color: "#5FD7D1" },
            { label: "Support", value: prof.stats.support, color: "#C8A45D" },
            { label: "Economy", value: prof.stats.economy, color: "#9B59B6" },
            { label: "Complexity", value: prof.stats.complexity, color: "#8B9098" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="font-rajdhani text-xs uppercase tracking-wider text-ash w-24">
                {label}
              </span>
              <StatBar value={value} color={color} />
            </div>
          ))}
        </div>
      </div>

      {/* Kit */}
      {prof.ready && prof.passives.length > 0 && (
        <div className="p-5 border-b border-gunmetal">
          <h3 className="font-rajdhani text-xs tracking-widest uppercase text-ash mb-3">
            Kit
          </h3>
          <div className="space-y-3">
            {prof.passives.map((p) => (
              <div key={p.id} className="p-3 border border-gunmetal bg-charcoal-plate/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-rajdhani text-xs uppercase tracking-wider text-ash">
                    Passive
                  </span>
                  <span className="font-rajdhani text-xs font-semibold text-bone">{p.name}</span>
                </div>
                <p className="font-inter text-xs text-ash/80 leading-relaxed">{p.description}</p>
              </div>
            ))}
            {prof.abilities.map((a) => (
              <div key={a.id} className="p-3 border border-gunmetal bg-charcoal-plate/50">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="font-rajdhani text-xs tracking-wider uppercase px-1.5 py-0.5"
                    style={{
                      color: "#C8A45D",
                      border: "1px solid rgba(200,164,93,0.3)",
                      background: "rgba(200,164,93,0.05)",
                    }}
                  >
                    {a.key}
                  </span>
                  <span className="font-rajdhani text-xs font-semibold text-bone">{a.name}</span>
                  <span className="ml-auto font-inter text-xs text-ash">{a.cooldown}s</span>
                </div>
                <p className="font-inter text-xs text-ash/80 leading-relaxed">{a.description}</p>
              </div>
            ))}
            <div className="p-3 border border-aegis-gold/20 bg-aegis-gold/5">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-rajdhani text-xs uppercase tracking-wider text-aegis-gold">
                  Ultimate
                </span>
                <span className="font-rajdhani text-xs font-semibold text-bone">
                  {prof.ultimate.name}
                </span>
                <span className="ml-auto font-inter text-xs text-ash">
                  {prof.ultimate.chargeRequired} charge
                </span>
              </div>
              <p className="font-inter text-xs text-ash/80 leading-relaxed">
                {prof.ultimate.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Strengths / weaknesses */}
      {prof.ready && prof.strengths.length > 0 && (
        <div className="p-5 border-b border-gunmetal">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-rajdhani text-xs tracking-widest uppercase text-verdigris mb-2">
                Strengths
              </h3>
              <ul className="space-y-1">
                {prof.strengths.map((s) => (
                  <li key={s} className="font-inter text-xs text-bone/70 flex items-start gap-1.5">
                    <span className="text-verdigris mt-0.5">▸</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-rajdhani text-xs tracking-widest uppercase text-ember mb-2">
                Weaknesses
              </h3>
              <ul className="space-y-1">
                {prof.weaknesses.map((w) => (
                  <li key={w} className="font-inter text-xs text-bone/70 flex items-start gap-1.5">
                    <span className="text-ember mt-0.5">▸</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tower recommendations */}
      {prof.ready && prof.preferredTowers.length > 0 && (
        <div className="p-5">
          <h3 className="font-rajdhani text-xs tracking-widest uppercase text-ash mb-2">
            Recommended Towers
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {prof.preferredTowers.map((t) => (
              <span
                key={t}
                className="font-rajdhani text-xs uppercase tracking-wider px-2 py-1 border border-gunmetal text-ash"
              >
                {t.replace("_", " ")}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfessionPage() {
  const router = useRouter();
  const { startRun } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<ProfessionCategory | "all">("melee");
  const [selectedProfId, setSelectedProfId] = useState("warrior");

  const filtered =
    selectedCategory === "all"
      ? PROFESSIONS
      : PROFESSIONS.filter((p) => p.category === selectedCategory);

  const selectedProf = PROFESSIONS.find((p) => p.id === selectedProfId) || PROFESSIONS[0];

  const handleBeginRun = () => {
    if (!selectedProf.ready) return;
    startRun(selectedProf.id);
    router.push("/play");
  };

  return (
    <div className="h-screen flex flex-col bg-obsidian overflow-hidden">
      {/* Header */}
      <header className="border-b border-gunmetal/60 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <button
          onClick={() => router.push("/menu")}
          className="font-rajdhani text-xs tracking-widest uppercase text-ash hover:text-aegis-gold transition-colors flex items-center gap-2"
        >
          ← Command Post
        </button>
        <h1 className="font-cinzel text-sm font-semibold tracking-widest text-aegis-gold">
          Operative Selection
        </h1>
        <div className="w-24" />
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Category + roster */}
        <div className="w-72 border-r border-gunmetal flex flex-col flex-shrink-0">
          {/* Category tabs */}
          <div className="border-b border-gunmetal p-3 flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`category-tab ${selectedCategory === "all" ? "active" : ""}`}
            >
              All
            </button>
            {PROFESSION_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as ProfessionCategory)}
                className={`category-tab ${selectedCategory === cat.id ? "active" : ""}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Profession list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map((prof) => (
              <button
                key={prof.id}
                onClick={() => setSelectedProfId(prof.id)}
                className={`w-full text-left px-4 py-3 border-b border-gunmetal/40 transition-all group ${
                  selectedProfId === prof.id
                    ? "bg-aegis-gold/8 border-l-2 border-l-aegis-gold"
                    : "hover:bg-charcoal-plate/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-rajdhani text-sm font-semibold ${
                      selectedProfId === prof.id ? "text-bone" : "text-ash group-hover:text-bone"
                    }`}>
                      {prof.name}
                      {!prof.ready && <span className="ml-1.5 text-gunmetal">🔒</span>}
                    </p>
                    <p className="font-inter text-xs text-ash/60">{prof.nameJP}</p>
                  </div>
                  <span
                    className="font-rajdhani text-xs"
                    style={{ color: DIFFICULTY_COLOR[prof.difficulty], opacity: 0.7 }}
                  >
                    {prof.difficulty.charAt(0).toUpperCase()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Dossier */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <ProfessionDossier prof={selectedProf} />
          </div>

          {/* Action bar */}
          <div className="border-t border-gunmetal px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              {selectedProf.recommended && (
                <span className="font-rajdhani text-xs tracking-wider uppercase text-verdigris">
                  ★ Recommended for new operatives
                </span>
              )}
            </div>
            <button
              onClick={handleBeginRun}
              disabled={!selectedProf.ready}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {selectedProf.ready ? "Deploy Operative" : "Locked"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
