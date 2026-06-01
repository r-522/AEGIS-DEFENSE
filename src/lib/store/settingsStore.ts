"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { GameSettings } from "@/types/game";
import { DEFAULT_SETTINGS } from "@/types/game";
import { createClient } from "@/lib/supabase/client";

interface SettingsStore {
  settings: GameSettings;
  rebinding: string | null;
  updateGraphics: (partial: Partial<GameSettings["graphics"]>) => void;
  updateAudio: (partial: Partial<GameSettings["audio"]>) => void;
  updateAccessibility: (partial: Partial<GameSettings["accessibility"]>) => void;
  updateSensitivity: (x: number, y: number) => void;
  startRebinding: (action: string) => void;
  finishRebinding: (code: string) => void;
  cancelRebinding: () => void;
  resetKeybindings: () => void;
  syncToCloud: (userId: string) => Promise<void>;
  loadFromCloud: (userId: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      rebinding: null,

      updateGraphics: (partial) =>
        set((s) => ({
          settings: { ...s.settings, graphics: { ...s.settings.graphics, ...partial } },
        })),

      updateAudio: (partial) =>
        set((s) => ({
          settings: { ...s.settings, audio: { ...s.settings.audio, ...partial } },
        })),

      updateAccessibility: (partial) =>
        set((s) => ({
          settings: {
            ...s.settings,
            accessibility: { ...s.settings.accessibility, ...partial },
          },
        })),

      updateSensitivity: (x, y) =>
        set((s) => ({
          settings: {
            ...s.settings,
            cameraSensitivityX: Math.max(0.1, Math.min(3.0, x)),
            cameraSensitivityY: Math.max(0.1, Math.min(3.0, y)),
          },
        })),

      startRebinding: (action) => set({ rebinding: action }),

      finishRebinding: (code) => {
        const action = get().rebinding;
        if (!action) return;
        set((s) => ({
          rebinding: null,
          settings: {
            ...s.settings,
            keybindings: { ...s.settings.keybindings, [action]: code },
          },
        }));
      },

      cancelRebinding: () => set({ rebinding: null }),

      resetKeybindings: () =>
        set((s) => ({
          settings: {
            ...s.settings,
            keybindings: DEFAULT_SETTINGS.keybindings,
          },
        })),

      syncToCloud: async (userId) => {
        const supabase = createClient();
        const s = get().settings;
        await supabase.from("player_settings").upsert({
          user_id: userId,
          graphics_preset: s.graphics.preset,
          render_scale: s.graphics.renderScale,
          camera_sensitivity: s.cameraSensitivityX,
          aim_sensitivity: s.aimSensitivity,
          keybindings: s.keybindings,
          audio: s.audio,
          accessibility: s.accessibility,
          updated_at: new Date().toISOString(),
        });
      },

      loadFromCloud: async (userId) => {
        const supabase = createClient();
        const { data } = await supabase
          .from("player_settings")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (data) {
          set((s) => ({
            settings: {
              ...s.settings,
              graphics: {
                ...s.settings.graphics,
                preset: data.graphics_preset || s.settings.graphics.preset,
                renderScale: data.render_scale || s.settings.graphics.renderScale,
              },
              cameraSensitivityX: data.camera_sensitivity || s.settings.cameraSensitivityX,
              aimSensitivity: data.aim_sensitivity || s.settings.aimSensitivity,
              keybindings: data.keybindings?.version
                ? data.keybindings
                : s.settings.keybindings,
              audio: data.audio || s.settings.audio,
              accessibility: data.accessibility || s.settings.accessibility,
            },
          }));
        }
      },
    }),
    {
      name: "aegis-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
