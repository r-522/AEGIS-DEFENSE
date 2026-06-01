"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { RANK_THRESHOLDS, getRankFromXP, type RankTier } from "@/types/game";
import { createClient } from "@/lib/supabase/client";

const RANK_ROMAN: Record<RankTier, string> = {
  Recruit: "I",
  Sentinel: "II",
  Bulwark: "III",
  "Aegis Knight": "IV",
  "Bastion Prime": "V",
  "Mythic Warden": "VI",
};

function RankBar({ xp, rank }: { xp: number; rank: RankTier }) {
  const tiers = Object.entries(RANK_THRESHOLDS) as [RankTier, number][];
  const currentIdx = tiers.findIndex(([t]) => t === rank);
  const current = tiers[currentIdx];
  const next = tiers[currentIdx + 1];

  const progress = next
    ? ((xp - current[1]) / (next[1] - current[1])) * 100
    : 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="font-rajdhani text-xs tracking-widest text-ash uppercase">
          {rank}
        </span>
        {next && (
          <span className="font-inter text-xs text-ash opacity-60">
            {xp.toLocaleString()} / {next[1].toLocaleString()} XP
          </span>
        )}
      </div>
      <div className="stat-bar-track">
        <div
          className="stat-bar-fill"
          style={{
            width: `${Math.min(100, progress)}%`,
            background: "linear-gradient(90deg, #6FA38B, #C8A45D)",
          }}
        />
      </div>
    </div>
  );
}

export default function MenuPage() {
  const router = useRouter();
  const { profile, user, logout, loadProfile } = useAuthStore();
  const [runHistory, setRunHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!profile && user) loadProfile();
  }, [user, profile, loadProfile]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("run_summaries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => { if (data) setRunHistory(data); });
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const rank = profile ? getRankFromXP(profile.rankXP) : "Recruit";
  const rankNum = RANK_ROMAN[rank as RankTier] || "I";

  return (
    <div className="relative min-h-screen bg-obsidian overflow-hidden tactical-grid-bg">
      {/* Subtle center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(200,164,93,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="border-b border-gunmetal/60 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-5 border border-aegis-gold/60 rotate-45"
              style={{ background: "rgba(200,164,93,0.05)" }}
            />
            <span className="font-cinzel text-sm font-semibold tracking-widest text-aegis-gold">
              AEGIS DEFENSE
            </span>
          </div>
          <div className="flex items-center gap-4">
            {profile && (
              <span className="font-rajdhani text-xs tracking-widest uppercase text-ash">
                Operative:{" "}
                <span className="text-bone">{profile.displayName || profile.username}</span>
              </span>
            )}
            <button onClick={handleLogout} className="btn-danger text-xs py-1.5 px-4">
              Debrief
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex gap-6 p-6 max-w-6xl mx-auto w-full">
          {/* Left: Player Dossier */}
          <aside className="w-72 flex-shrink-0 space-y-4">
            {/* Profile card */}
            <div className="aegis-panel aegis-panel-gold p-5">
              <div className="mb-4 pb-4 border-b border-gunmetal">
                <p className="font-rajdhani text-xs tracking-widest uppercase text-ash mb-1">
                  Operative
                </p>
                <h2 className="font-cinzel text-xl font-bold text-bone">
                  {profile?.displayName || profile?.username || "—"}
                </h2>
              </div>

              {/* Rank section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-rajdhani text-xs tracking-widest uppercase text-ash">
                    Rank
                  </span>
                  <div className="rank-badge">{rank}</div>
                </div>
                <RankBar xp={profile?.rankXP || 0} rank={rank as RankTier} />
              </div>
            </div>

            {/* Recent runs */}
            <div className="aegis-panel p-4">
              <h3 className="font-rajdhani text-xs tracking-widest uppercase text-ash mb-3">
                Recent Operations
              </h3>
              {runHistory.length === 0 ? (
                <p className="font-inter text-xs text-ash opacity-50">
                  No records on file.
                </p>
              ) : (
                <ul className="space-y-2">
                  {runHistory.map((run) => (
                    <li
                      key={run.id}
                      className="flex items-center justify-between py-2 border-b border-gunmetal/40 last:border-0"
                    >
                      <div>
                        <span className="font-rajdhani text-xs text-bone capitalize">
                          {run.profession_id}
                        </span>
                        <p className="font-inter text-xs text-ash mt-0.5">
                          Wave {run.highest_wave}
                        </p>
                      </div>
                      <span
                        className={`font-rajdhani text-xs font-semibold ${
                          run.result === "victory" ? "text-verdigris" : "text-ember"
                        }`}
                      >
                        {run.result?.toUpperCase()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          {/* Center: Main navigation */}
          <div className="flex-1 flex flex-col justify-center items-center gap-2">
            {/* Title */}
            <div className="text-center mb-10">
              <h1
                className="font-cinzel text-6xl font-black tracking-tight text-bone mb-2"
                style={{ textShadow: "0 0 60px rgba(200,164,93,0.15)" }}
              >
                AEGIS
              </h1>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-aegis-gold opacity-40" />
                <span className="font-cinzel text-xl tracking-[0.5em] text-aegis-gold font-semibold">
                  DEFENSE
                </span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-aegis-gold opacity-40" />
              </div>
              <p className="mt-3 font-rajdhani text-xs tracking-[0.2em] uppercase text-ash">
                Defend the Fortress · Wave {runHistory.length ? (Math.max(...runHistory.map(r => r.highest_wave)) || 1) : "—"}+
              </p>
            </div>

            {/* Nav commands */}
            <div className="w-full max-w-xs space-y-3">
              <button
                onClick={() => router.push("/profession")}
                className="btn-primary w-full text-center py-4"
              >
                Begin Operation
              </button>

              <button
                onClick={() => router.push("/settings")}
                className="w-full py-3 font-rajdhani font-600 text-sm tracking-widest uppercase text-ash border border-gunmetal hover:border-aegis-gold/30 hover:text-bone transition-all"
              >
                Field Systems
              </button>
            </div>

            {/* Tagline */}
            <p className="mt-12 font-inter text-xs text-ash opacity-30 text-center">
              v0.1 ALPHA — Premium release target: ~¥2,000 on Steam
            </p>
          </div>

          {/* Right: Stats panel */}
          <aside className="w-64 flex-shrink-0 space-y-4">
            <div className="aegis-panel p-4">
              <h3 className="font-rajdhani text-xs tracking-widest uppercase text-ash mb-3">
                Field Data
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Total Runs", value: runHistory.length },
                  {
                    label: "Victories",
                    value: runHistory.filter((r) => r.result === "victory").length,
                  },
                  {
                    label: "Best Wave",
                    value: runHistory.length
                      ? Math.max(...runHistory.map((r) => r.highest_wave))
                      : 0,
                  },
                  { label: "Rank XP", value: (profile?.rankXP || 0).toLocaleString() },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center">
                    <span className="font-rajdhani text-xs uppercase tracking-wider text-ash">
                      {item.label}
                    </span>
                    <span className="font-inter text-sm font-semibold text-bone tabular-nums">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="aegis-panel aegis-panel-cyan p-4">
              <h3 className="font-rajdhani text-xs tracking-widest uppercase text-ward-cyan mb-2">
                Fortress Status
              </h3>
              <p className="font-inter text-xs text-ash leading-relaxed">
                Aegis holds. No breaches detected. All towers operational.
              </p>
              <div className="mt-3 h-px bg-gradient-to-r from-ward-cyan/30 to-transparent" />
              <p className="mt-2 font-rajdhani text-xs text-ash opacity-60 tracking-wide">
                SYSTEM: STANDBY
              </p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
