"use client";

import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { PlayerProfile } from "@/types/game";

interface AuthState {
  user: { id: string; email: string } | null;
  profile: PlayerProfile | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadProfile: () => Promise<void>;
  clearError: () => void;
}

function usernameToEmail(username: string): string {
  return `${username.toLowerCase().trim()}@player.aegis`;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const supabase = createClient();
      const email = usernameToEmail(username);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error("Invalid credentials. Check your username and password.");
      if (!data.user) throw new Error("Authentication failed.");
      set({ user: { id: data.user.id, email: data.user.email! } });
      await get().loadProfile();
    } catch (err) {
      set({ error: (err as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  signup: async (username: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed.");

      // Auto-login after signup
      const supabase = createClient();
      const email = usernameToEmail(username);
      const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) throw new Error("Account created. Please log in.");
      if (authData.user) {
        set({ user: { id: authData.user.id, email: authData.user.email! } });
        await get().loadProfile();
      }
    } catch (err) {
      set({ error: (err as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },

  loadProfile: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile) {
      set({
        user: { id: user.id, email: user.email! },
        profile: {
          id: profile.id,
          username: profile.username,
          displayName: profile.display_name,
          rankTier: profile.rank_tier,
          rankXP: profile.rank_xp,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at,
        },
      });
    }
  },

  clearError: () => set({ error: null }),
}));
