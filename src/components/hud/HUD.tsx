"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/lib/store/gameStore";
import { useAuthStore } from "@/lib/store/authStore";
import { getRankFromXP } from "@/types/game";
import { getProfessionById } from "@/data/professions";

function CooldownArc({
  cooldown,
  max,
  size = 52,
  color = "#C8A45D",
  label,
  keyLabel,
  children,
}: {
  cooldown: number;
  max: number;
  size?: number;
  color?: string;
  label: string;
  keyLabel: string;
  children?: React.ReactNode;
}) {
  const pct = max > 0 ? cooldown / max : 0;
  const r = (size - 6) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="absolute inset-0"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(43,50,61,0.8)"
            strokeWidth={3}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={pct > 0 ? "#2B323D" : color}
            strokeWidth={3}
            strokeDasharray={circumference}
            strokeDashoffset={pct > 0 ? circumference - dash : 0}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.1s linear" }}
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center rounded-full"
          style={{
            background: pct > 0
              ? "rgba(11,14,18,0.9)"
              : `linear-gradient(135deg, rgba(43,50,61,0.9), rgba(23,27,34,0.95))`,
            border: `1px solid ${pct > 0 ? "rgba(43,50,61,0.6)" : color + "60"}`,
          }}
        >
          {pct > 0 ? (
            <span className="font-rajdhani text-xs font-bold text-ash tabular-nums">
              {Math.ceil(cooldown)}
            </span>
          ) : (
            children
          )}
        </div>
      </div>
      <div className="text-center">
        <p className="font-rajdhani text-xs font-semibold uppercase tracking-wider text-bone/80 leading-none">
          {label}
        </p>
        <p className="font-rajdhani text-xs text-ash/60">[{keyLabel}]</p>
      </div>
    </div>
  );
}

function UltimateBar({ charge, max }: { charge: number; max: number }) {
  const pct = max > 0 ? charge / max : 0;
  const ready = pct >= 1;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: 64, height: 64 }}>
        <svg
          width={64}
          height={64}
          className="absolute inset-0"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle cx={32} cy={32} r={28} fill="none" stroke="rgba(43,50,61,0.8)" strokeWidth={4} />
          <circle
            cx={32}
            cy={32}
            r={28}
            fill="none"
            stroke={ready ? "#C8A45D" : "#6FA38B"}
            strokeWidth={4}
            strokeDasharray={2 * Math.PI * 28}
            strokeDashoffset={(1 - pct) * 2 * Math.PI * 28}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.2s ease" }}
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center rounded-full"
          style={{
            background: ready
              ? "radial-gradient(circle, rgba(200,164,93,0.15), rgba(11,14,18,0.9))"
              : "rgba(11,14,18,0.9)",
            border: ready ? "1px solid rgba(200,164,93,0.5)" : "1px solid rgba(43,50,61,0.6)",
          }}
        >
          <span
            className="font-cinzel text-xs font-bold"
            style={{ color: ready ? "#C8A45D" : "#6FA38B" }}
          >
            {ready ? "R" : `${Math.floor(pct * 100)}%`}
          </span>
        </div>
        {ready && (
          <div
            className="absolute inset-0 rounded-full animate-pulse-gold"
            style={{ border: "1px solid rgba(200,164,93,0.3)" }}
          />
        )}
      </div>
      <p className="font-rajdhani text-xs uppercase tracking-wider text-aegis-gold/80 text-center leading-none">
        ULTIMATE
      </p>
      <p className="font-rajdhani text-xs text-ash/60 text-center">[R]</p>
    </div>
  );
}

function HPBar({ hp, max }: { hp: number; max: number }) {
  const pct = max > 0 ? hp / max : 0;
  const barRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="font-rajdhani text-xs uppercase tracking-widest text-ash">HP</span>
        <span className="font-inter text-xs tabular-nums text-bone">
          {hp} / {max}
        </span>
      </div>
      <div className="stat-bar-track h-2">
        <div
          ref={barRef}
          className="stat-bar-fill h-2 transition-all duration-200"
          style={{
            width: `${Math.max(0, pct * 100)}%`,
            background: pct > 0.5
              ? "linear-gradient(90deg, #6FA38B, #5FD7D1)"
              : pct > 0.25
              ? "linear-gradient(90deg, #C8A45D, #D49A35)"
              : "linear-gradient(90deg, #D45A35, #E06040)",
          }}
        />
      </div>
    </div>
  );
}

function BaseIntegrityBar({ hp, max }: { hp: number; max: number }) {
  const pct = max > 0 ? hp / max : 0;
  const critical = pct < 0.3;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span
          className={`font-rajdhani text-xs uppercase tracking-widest ${
            critical ? "text-ember wave-urgent" : "text-ward-cyan"
          }`}
        >
          AEGIS GATE
        </span>
        <span className="font-inter text-xs tabular-nums text-bone">
          {hp} / {max}
        </span>
      </div>
      <div className="stat-bar-track h-2">
        <div
          className="stat-bar-fill h-2 transition-all duration-500"
          style={{
            width: `${Math.max(0, pct * 100)}%`,
            background: critical
              ? "linear-gradient(90deg, #D45A35, #E07050)"
              : "linear-gradient(90deg, #5FD7D1, #6FA38B)",
          }}
        />
      </div>
    </div>
  );
}

export default function HUD() {
  const { snapshot, professionId } = useGameStore();
  const { profile } = useAuthStore();

  if (!snapshot) return null;

  const profession = professionId ? getProfessionById(professionId) : null;
  const rank = profile ? getRankFromXP(profile.rankXP) : "Recruit";
  const phase = snapshot.phase;

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* ── TOP LEFT: Name / Wave / Rank ──────────── */}
      <div className="hud-cluster top-4 left-4 pointer-events-none" style={{ position: "absolute" }}>
        <div className="aegis-panel p-3 min-w-48">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 border border-aegis-gold rotate-45"
              style={{ background: "rgba(200,164,93,0.1)" }}
            />
            <span className="font-cinzel text-xs font-semibold tracking-widest text-bone">
              {profile?.displayName || profile?.username || "OPERATIVE"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-rajdhani text-xs uppercase tracking-widest text-ash">
              Wave
            </span>
            <span
              className={`font-cinzel text-xl font-bold tabular-nums ${
                phase === "boss" ? "text-ember" : "text-aegis-gold"
              }`}
            >
              {snapshot.wave}
              {phase === "boss" && (
                <span className="text-xs ml-1 font-rajdhani wave-urgent text-ember">BOSS</span>
              )}
            </span>
          </div>
          <div className="mt-1">
            <div className="rank-badge inline-block">{rank}</div>
          </div>
          {profession && (
            <p className="mt-1.5 font-rajdhani text-xs text-ash/60 uppercase tracking-wider">
              {profession.name} — {profession.role}
            </p>
          )}
        </div>
      </div>

      {/* ── TOP RIGHT: Base Integrity ──────────────── */}
      <div
        className="hud-cluster top-4 right-4 pointer-events-none"
        style={{ position: "absolute", minWidth: "200px" }}
      >
        <div className="aegis-panel aegis-panel-cyan p-3">
          <BaseIntegrityBar hp={snapshot.baseHp} max={snapshot.maxBaseHp} />
        </div>
      </div>

      {/* ── TOP CENTER: Wave/Phase info ────────────── */}
      {(phase === "prep" || phase === "interwave") && (
        <div
          className="absolute top-4 left-1/2 pointer-events-none"
          style={{ transform: "translateX(-50%)" }}
        >
          <div className="aegis-panel px-6 py-2 text-center">
            {phase === "prep" && (
              <p className="font-rajdhani text-xs uppercase tracking-widest text-aegis-gold scan-pulse">
                PREPARATION PHASE — Place towers, then press WAVE START
              </p>
            )}
            {phase === "interwave" && (
              <p className="font-rajdhani text-xs uppercase tracking-widest text-ward-cyan">
                WAVE CLEARED — Awaiting draft selection
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── BOTTOM LEFT: Abilities ─────────────────── */}
      <div
        className="hud-cluster bottom-6 left-6 pointer-events-none"
        style={{ position: "absolute" }}
      >
        <div className="aegis-panel p-3">
          {/* HP bar */}
          <div className="mb-4 min-w-40">
            <HPBar hp={snapshot.playerHp} max={snapshot.playerMaxHp} />
          </div>

          {/* Ability cluster */}
          <div className="flex items-end gap-4">
            {snapshot.abilities.map((ab, idx) => {
              const abData = profession?.abilities[idx];
              return abData ? (
                <CooldownArc
                  key={idx}
                  cooldown={ab.cooldownRemaining}
                  max={ab.cooldown}
                  color="#C8A45D"
                  label={abData.name.split(" ")[0]}
                  keyLabel={abData.key}
                >
                  <span className="font-cinzel text-xs font-bold text-aegis-gold">
                    {abData.key}
                  </span>
                </CooldownArc>
              ) : null;
            })}

            {/* Ultimate */}
            <UltimateBar charge={snapshot.ultimateCharge} max={profession?.ultimate.chargeRequired || 100} />
          </div>
        </div>
      </div>

      {/* ── BOTTOM RIGHT: Resources / Stats ─────────── */}
      <div
        className="hud-cluster bottom-6 right-6 pointer-events-none"
        style={{ position: "absolute" }}
      >
        <div className="aegis-panel p-3 text-right">
          <div className="flex items-center justify-end gap-2 mb-2">
            <span className="font-rajdhani text-xs uppercase tracking-widest text-ash">Scrap</span>
            <span className="font-cinzel text-xl font-bold text-aegis-gold tabular-nums">
              {snapshot.scrap}
            </span>
          </div>
          <div className="text-xs text-ash/60 font-rajdhani tracking-wider space-y-0.5">
            <p>Kills: <span className="text-bone">{snapshot.totalKills}</span></p>
            <p>Enemies: <span className="text-bone">{snapshot.enemyCount}</span></p>
          </div>
        </div>
      </div>

      {/* ── Phase overlays ────────────────────────── */}
      {phase === "gameover" && (
        <div className="absolute inset-0 flex items-center justify-center bg-obsidian/80 pointer-events-auto">
          <div className="aegis-panel aegis-panel-ember p-10 text-center max-w-md">
            <h2 className="font-cinzel text-4xl font-black text-ember mb-3">FORTRESS BREACHED</h2>
            <p className="font-rajdhani text-sm text-ash tracking-wider mb-6">
              The Aegis Gate has fallen. Wave {snapshot.wave} — {snapshot.totalKills} defenders dispatched.
            </p>
            <a href="/results" className="btn-primary inline-block">
              View Debrief
            </a>
          </div>
        </div>
      )}

      {/* Controls hint */}
      <div className="absolute bottom-6 left-1/2 pointer-events-none" style={{ transform: "translateX(-50%)" }}>
        {phase === "prep" && (
          <div className="aegis-panel px-4 py-2 opacity-60">
            <p className="font-rajdhani text-xs text-ash tracking-wider text-center">
              WASD Move · Click Attack · Q/E Abilities · R Ultimate · Click canvas for mouse look
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
