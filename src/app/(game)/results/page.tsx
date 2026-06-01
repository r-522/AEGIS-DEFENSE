"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store/gameStore";
import { useAuthStore } from "@/lib/store/authStore";
import { createClient } from "@/lib/supabase/client";
import { getRankFromXP } from "@/types/game";
import { getProfessionById } from "@/data/professions";

export default function ResultsPage() {
  const router = useRouter();
  const { snapshot, professionId, endRun } = useGameStore();
  const { profile, user, loadProfile } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [rankDelta, setRankDelta] = useState(0);

  const wave = snapshot?.wave || 0;
  const kills = snapshot?.totalKills || 0;
  const scrap = (snapshot as any)?.totalScrapsEarned || 0;
  const baseHp = snapshot?.baseHp || 0;
  const profession = professionId ? getProfessionById(professionId) : null;
  const isVictory = baseHp > 0;

  useEffect(() => {
    if (!user || !professionId || saved) return;

    const saveResults = async () => {
      const supabase = createClient();
      const earned = Math.ceil(wave * 50 + kills * 2 + (isVictory ? 200 : 0));
      setRankDelta(earned);

      await supabase.from("run_summaries").insert({
        user_id: user.id,
        profession_id: professionId,
        map_id: "fortress_aegis",
        highest_wave: wave,
        result: isVictory ? "victory" : "breach",
        rank_delta: earned,
        stats: { kills, scrap_earned: scrap, base_hp_remaining: baseHp },
      });

      // Update rank XP
      const newXP = (profile?.rankXP || 0) + earned;
      await supabase
        .from("profiles")
        .update({ rank_xp: newXP, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      await loadProfile();
      setSaved(true);
    };

    saveResults();
  }, [user, professionId, saved]);

  const handlePlayAgain = () => {
    endRun();
    router.push("/profession");
  };

  const handleMenu = () => {
    endRun();
    router.push("/menu");
  };

  const newRank = profile ? getRankFromXP(profile.rankXP) : "Recruit";

  return (
    <div className="min-h-screen bg-obsidian tactical-grid-bg flex items-center justify-center">
      <div className="w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="font-rajdhani text-xs tracking-[0.3em] uppercase text-ash mb-3">
            Operation Debrief
          </p>
          <h1
            className={`font-cinzel text-5xl font-black mb-2 ${
              isVictory ? "text-aegis-gold" : "text-ember"
            }`}
            style={{
              textShadow: isVictory
                ? "0 0 40px rgba(200,164,93,0.3)"
                : "0 0 40px rgba(212,90,53,0.3)",
            }}
          >
            {isVictory ? "VICTORY" : "FORTRESS BREACHED"}
          </h1>
          {profession && (
            <p className="font-rajdhani text-sm text-ash tracking-wider">
              {profession.name} — {profession.nameJP}
            </p>
          )}
        </div>

        {/* Stats panel */}
        <div className="aegis-panel p-6 mb-6" style={{ borderTopWidth: 2, borderTopColor: isVictory ? "#C8A45D" : "#D45A35" }}>
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Waves Survived", value: wave, color: "#C8A45D" },
              { label: "Enemies Eliminated", value: kills, color: "#D45A35" },
              { label: "Scrap Collected", value: scrap, color: "#6FA38B" },
              { label: "Gate HP Remaining", value: baseHp, color: "#5FD7D1" },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center p-4 border border-gunmetal">
                <p className="font-rajdhani text-xs uppercase tracking-widest text-ash mb-1">
                  {label}
                </p>
                <p className="font-cinzel text-3xl font-bold tabular-nums" style={{ color }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Rank change */}
        {saved && rankDelta > 0 && (
          <div className="aegis-panel aegis-panel-gold p-4 mb-6 text-center animate-lock-in">
            <p className="font-rajdhani text-xs uppercase tracking-widest text-ash mb-1">
              Rank Progress
            </p>
            <p className="font-cinzel text-lg font-bold text-aegis-gold">
              +{rankDelta} XP
            </p>
            <p className="font-rajdhani text-xs text-ash mt-1">
              Current Rank: <span className="text-bone">{newRank}</span>
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button onClick={handlePlayAgain} className="btn-primary px-8">
            Deploy Again
          </button>
          <button onClick={handleMenu} className="btn-danger px-8">
            Command Post
          </button>
        </div>

        {!saved && (
          <p className="text-center mt-4 font-rajdhani text-xs text-ash/40 scan-pulse">
            Recording operation data...
          </p>
        )}
      </div>
    </div>
  );
}
