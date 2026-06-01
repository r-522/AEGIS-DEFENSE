"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSettingsStore } from "@/lib/store/settingsStore";
import { useAuthStore } from "@/lib/store/authStore";
import { DEFAULT_KEYBINDINGS } from "@/types/game";

const ACTION_LABELS: Record<string, string> = {
  moveForward: "Move Forward",
  moveBack: "Move Back",
  moveLeft: "Move Left",
  moveRight: "Move Right",
  sprint: "Sprint",
  dodge: "Dodge / Evade",
  attack: "Attack",
  interact: "Interact / Build",
  ability1: "Ability 1",
  ability2: "Ability 2",
  ultimate: "Ultimate",
  buildMenu: "Build Menu",
  sellTower: "Sell Tower",
  ping: "Ping / Command",
};

function KeyBadge({ code, isActive, onClick }: { code: string; isActive?: boolean; onClick?: () => void }) {
  const display = code
    .replace("Key", "")
    .replace("Digit", "")
    .replace("Arrow", "↑")
    .replace("ShiftLeft", "L.Shift")
    .replace("ShiftRight", "R.Shift")
    .replace("Space", "SPACE")
    .replace("Mouse0", "LMB")
    .replace("Mouse1", "RMB")
    .replace("Mouse2", "MMB");

  return (
    <button
      onClick={onClick}
      className={`font-rajdhani font-600 text-xs tracking-wider px-2 py-1 min-w-16 text-center border transition-all ${
        isActive
          ? "border-aegis-gold bg-aegis-gold/10 text-aegis-gold scan-pulse"
          : "border-gunmetal text-ash hover:border-aegis-gold/40 hover:text-bone cursor-pointer"
      }`}
    >
      {isActive ? "..." : display}
    </button>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
  displayValue,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  displayValue?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex items-center gap-4">
      <span className="font-rajdhani text-xs uppercase tracking-wider text-ash w-40 flex-shrink-0">
        {label}
      </span>
      <div className="flex-1 relative h-6 flex items-center">
        <div className="w-full h-1 bg-gunmetal relative">
          <div
            className="absolute left-0 top-0 h-full bg-aegis-gold"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute w-full opacity-0 cursor-pointer h-6"
        />
        <div
          className="absolute w-3 h-3 bg-bone border border-aegis-gold rotate-45 pointer-events-none"
          style={{ left: `calc(${pct}% - 6px)` }}
        />
      </div>
      <span className="font-inter text-xs tabular-nums text-bone w-12 text-right flex-shrink-0">
        {displayValue || value.toFixed(2)}
      </span>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="flex items-center justify-between w-full py-2"
    >
      <span className="font-rajdhani text-xs uppercase tracking-wider text-ash">{label}</span>
      <div
        className={`w-10 h-5 rounded-none transition-all relative border ${
          value ? "border-aegis-gold bg-aegis-gold/10" : "border-gunmetal"
        }`}
      >
        <div
          className="absolute top-0.5 h-3.5 w-3.5 transition-all"
          style={{
            left: value ? "calc(100% - 16px)" : "2px",
            background: value ? "#C8A45D" : "#2B323D",
          }}
        />
      </div>
    </button>
  );
}

type Tab = "display" | "audio" | "controls" | "accessibility";

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateGraphics, updateAudio, updateAccessibility, updateSensitivity,
    startRebinding, finishRebinding, cancelRebinding, rebinding, resetKeybindings, syncToCloud } = useSettingsStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>("display");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (rebinding) {
        e.preventDefault();
        finishRebinding(e.code);
      } else if (e.key === "Escape") {
        cancelRebinding();
      }
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [rebinding, finishRebinding, cancelRebinding]);

  const handleSave = async () => {
    if (user) await syncToCloud(user.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: "display", label: "Display" },
    { id: "audio", label: "Audio" },
    { id: "controls", label: "Controls" },
    { id: "accessibility", label: "Accessibility" },
  ];

  const PRESETS = ["low", "medium", "high", "ultra"] as const;

  return (
    <div className="min-h-screen bg-obsidian tactical-grid-bg">
      {/* Header */}
      <header className="border-b border-gunmetal/60 px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => router.push("/menu")}
          className="font-rajdhani text-xs tracking-widest uppercase text-ash hover:text-aegis-gold transition-colors"
        >
          ← Command Post
        </button>
        <h1 className="font-cinzel text-sm font-semibold tracking-widest text-aegis-gold">
          Field Systems
        </h1>
        <button
          onClick={handleSave}
          className={saved ? "btn-primary text-verdigris" : "btn-primary"}
        >
          {saved ? "Saved ✓" : "Save"}
        </button>
      </header>

      <div className="flex max-w-4xl mx-auto gap-0 mt-8 mx-6">
        {/* Tabs */}
        <div className="w-48 flex-shrink-0 border-r border-gunmetal mr-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 font-rajdhani text-xs uppercase tracking-widest transition-all border-l-2 ${
                activeTab === tab.id
                  ? "text-aegis-gold border-l-aegis-gold bg-aegis-gold/5"
                  : "text-ash border-l-transparent hover:text-bone hover:border-l-gunmetal"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 pb-10">
          {/* ── DISPLAY ───────────────── */}
          {activeTab === "display" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-cinzel text-sm font-semibold tracking-wider text-bone mb-4">
                  Graphics Quality
                </h2>
                <div className="flex gap-2 mb-6">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      onClick={() => updateGraphics({ preset: p })}
                      className={`flex-1 py-2 font-rajdhani text-xs uppercase tracking-wider border transition-all ${
                        settings.graphics.preset === p
                          ? "border-aegis-gold text-aegis-gold bg-aegis-gold/8"
                          : "border-gunmetal text-ash hover:border-aegis-gold/30 hover:text-bone"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="font-cinzel text-sm font-semibold tracking-wider text-bone">
                  Render Settings
                </h2>
                <Slider
                  label="Render Scale"
                  value={settings.graphics.renderScale}
                  min={0.5}
                  max={1.0}
                  step={0.05}
                  onChange={(v) => updateGraphics({ renderScale: v })}
                  displayValue={`${Math.round(settings.graphics.renderScale * 100)}%`}
                />
                <Toggle
                  label="Shadows"
                  value={settings.graphics.shadows}
                  onChange={(v) => updateGraphics({ shadows: v })}
                />
                <Toggle
                  label="Bloom Effect"
                  value={settings.graphics.bloom}
                  onChange={(v) => updateGraphics({ bloom: v })}
                />
                <Toggle
                  label="Vignette"
                  value={settings.graphics.vignette}
                  onChange={(v) => updateGraphics({ vignette: v })}
                />
                <Toggle
                  label="VSync"
                  value={settings.graphics.vsync}
                  onChange={(v) => updateGraphics({ vsync: v })}
                />
              </div>
            </div>
          )}

          {/* ── AUDIO ─────────────────── */}
          {activeTab === "audio" && (
            <div className="space-y-4">
              <h2 className="font-cinzel text-sm font-semibold tracking-wider text-bone mb-4">
                Audio Levels
              </h2>
              {[
                { label: "Master Volume", key: "master" as const },
                { label: "Music", key: "music" as const },
                { label: "SFX", key: "sfx" as const },
                { label: "UI Sounds", key: "ui" as const },
              ].map(({ label, key }) => (
                <Slider
                  key={key}
                  label={label}
                  value={settings.audio[key]}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={(v) => updateAudio({ [key]: v })}
                  displayValue={`${Math.round(settings.audio[key] * 100)}%`}
                />
              ))}
            </div>
          )}

          {/* ── CONTROLS ──────────────── */}
          {activeTab === "controls" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="font-cinzel text-sm font-semibold tracking-wider text-bone">
                  Sensitivity
                </h2>
                <Slider
                  label="Camera Horizontal"
                  value={settings.cameraSensitivityX}
                  min={0.1}
                  max={3.0}
                  step={0.05}
                  onChange={(v) => updateSensitivity(v, settings.cameraSensitivityY)}
                />
                <Slider
                  label="Camera Vertical"
                  value={settings.cameraSensitivityY}
                  min={0.1}
                  max={3.0}
                  step={0.05}
                  onChange={(v) => updateSensitivity(settings.cameraSensitivityX, v)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-cinzel text-sm font-semibold tracking-wider text-bone">
                    Key Bindings
                  </h2>
                  <button
                    onClick={resetKeybindings}
                    className="font-rajdhani text-xs uppercase tracking-wider text-ash hover:text-ember transition-colors"
                  >
                    Reset Defaults
                  </button>
                </div>

                {rebinding && (
                  <div className="mb-3 p-2 border border-aegis-gold/40 bg-aegis-gold/5 text-center">
                    <p className="font-rajdhani text-xs text-aegis-gold tracking-wider scan-pulse">
                      Press any key to bind "{ACTION_LABELS[rebinding]}" — ESC to cancel
                    </p>
                  </div>
                )}

                <div className="space-y-1">
                  {Object.entries(DEFAULT_KEYBINDINGS)
                    .filter(([k]) => k !== "version")
                    .map(([action]) => (
                      <div
                        key={action}
                        className="flex items-center justify-between py-2 border-b border-gunmetal/40"
                      >
                        <span className="font-rajdhani text-xs uppercase tracking-wider text-ash">
                          {ACTION_LABELS[action] || action}
                        </span>
                        <KeyBadge
                          code={(settings.keybindings as any)[action]}
                          isActive={rebinding === action}
                          onClick={() => startRebinding(action)}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ACCESSIBILITY ─────────── */}
          {activeTab === "accessibility" && (
            <div className="space-y-4">
              <h2 className="font-cinzel text-sm font-semibold tracking-wider text-bone mb-4">
                Accessibility
              </h2>
              <Toggle
                label="Reduce Motion"
                value={settings.accessibility.reducedMotion}
                onChange={(v) => updateAccessibility({ reducedMotion: v })}
              />
              <Toggle
                label="Camera Shake"
                value={settings.accessibility.cameraShake}
                onChange={(v) => updateAccessibility({ cameraShake: v })}
              />
              <Toggle
                label="HUD Subtitles / Callouts"
                value={settings.accessibility.hudSubtitles}
                onChange={(v) => updateAccessibility({ hudSubtitles: v })}
              />

              <div className="pt-2">
                <div className="flex items-center justify-between py-2 border-b border-gunmetal/40">
                  <span className="font-rajdhani text-xs uppercase tracking-wider text-ash">
                    Colorblind Mode
                  </span>
                  <select
                    value={settings.accessibility.colorblindMode}
                    onChange={(e) => updateAccessibility({ colorblindMode: e.target.value as any })}
                    className="aegis-input w-auto py-1 px-3 text-xs"
                  >
                    <option value="none">None</option>
                    <option value="protanopia">Protanopia (Red-blind)</option>
                    <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                    <option value="tritanopia">Tritanopia (Blue-blind)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
