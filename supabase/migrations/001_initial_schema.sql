-- AEGIS DEFENSE — Initial Database Schema
-- Run this in Supabase SQL Editor or via supabase db push

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    rank_tier TEXT NOT NULL DEFAULT 'Recruit',
    rank_xp INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Username must be lowercase alphanumeric + underscore, 3-20 chars
ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_username_format
    CHECK (username ~ '^[a-z0-9_]{3,20}$');

ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_rank_tier_valid
    CHECK (rank_tier IN ('Recruit', 'Sentinel', 'Bulwark', 'Aegis Knight', 'Bastion Prime', 'Mythic Warden'));

-- ── Player Settings ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.player_settings (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    graphics_preset TEXT DEFAULT 'high',
    render_scale NUMERIC(3, 2) DEFAULT 1.0,
    camera_sensitivity NUMERIC(4, 2) DEFAULT 1.0,
    aim_sensitivity NUMERIC(4, 2) DEFAULT 1.0,
    keybindings JSONB DEFAULT '{}'::jsonb,
    audio JSONB DEFAULT '{}'::jsonb,
    accessibility JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Profession Unlocks ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profession_unlocks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    profession_id TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    mastery_xp INTEGER NOT NULL DEFAULT 0,
    UNIQUE(user_id, profession_id)
);

-- ── Run Summaries ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.run_summaries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    profession_id TEXT NOT NULL,
    map_id TEXT NOT NULL DEFAULT 'fortress_aegis',
    highest_wave INTEGER NOT NULL DEFAULT 0,
    result TEXT NOT NULL DEFAULT 'abandoned',
    rank_delta INTEGER NOT NULL DEFAULT 0,
    build_snapshot JSONB DEFAULT '{}'::jsonb,
    stats JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.run_summaries
    ADD CONSTRAINT run_summaries_result_valid
    CHECK (result IN ('victory', 'extraction', 'breach', 'abandoned'));

-- ── Balance Versions ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.balance_versions (
    version TEXT PRIMARY KEY,
    checksum TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.balance_versions (version, notes) VALUES
    ('0.1.0', 'Initial launch roster — 12 professions, 7 tower types, 10 wave configs')
    ON CONFLICT DO NOTHING;

-- ── Row Level Security ─────────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profession_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.run_summaries ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own
CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Player settings: users can CRUD their own
CREATE POLICY "settings_select_own" ON public.player_settings
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "settings_insert_own" ON public.player_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "settings_update_own" ON public.player_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Profession unlocks: read/insert own
CREATE POLICY "unlocks_select_own" ON public.profession_unlocks
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "unlocks_insert_own" ON public.profession_unlocks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Run summaries: read/insert own
CREATE POLICY "runs_select_own" ON public.run_summaries
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "runs_insert_own" ON public.run_summaries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Balance versions: public read
CREATE POLICY "balance_public_read" ON public.balance_versions
    FOR SELECT USING (true);

-- Service role bypass (for API routes using admin client)
CREATE POLICY "profiles_service_insert" ON public.profiles
    FOR INSERT WITH CHECK (true);
CREATE POLICY "settings_service_insert" ON public.player_settings
    FOR INSERT WITH CHECK (true);

-- ── Updated At Trigger ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER settings_updated_at
    BEFORE UPDATE ON public.player_settings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── Indexes ────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_run_summaries_user_id ON public.run_summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_run_summaries_created_at ON public.run_summaries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profession_unlocks_user_id ON public.profession_unlocks(user_id);
