# AEGIS DEFENSE — Technical Architecture

## 1. Deployment target

AEGIS DEFENSE must be deployable to **Vercel** with **Supabase** for authentication, database persistence, and server-side functionality.

Recommended initial stack:

- Next.js with TypeScript for Vercel-native routing and deployment.
- React Three Fiber / Three.js for browser-based 3D third-person gameplay.
- Zustand or similar lightweight state store for UI/session state.
- Deterministic gameplay simulation module separate from React rendering.
- Supabase JS client for auth/session and database calls.
- Supabase Row Level Security for player-owned data.

## 2. Architecture principles

- Separate gameplay simulation from rendering and UI.
- Treat Supabase as authority for accounts, profile, rank, unlocks, and run summaries.
- Keep moment-to-moment solo gameplay mostly client-simulated for responsiveness, with server validation for persistent rewards.
- Make balance data serializable and versioned.
- Avoid hardcoding profession stats inside components.
- Keep Vercel serverless limits in mind; do not require long-running Node processes.

## 3. Auth model

Requirement: username/password login with persistent session until logout.

Supabase Auth is email-oriented by default, so implementation should choose one of these approaches during coding:

1. **Username as profile alias + email/password auth**: simplest production path; collect username, require email internally.
2. **Username mapped to private generated email**: possible but more custom; must be carefully documented and secured.
3. **Custom auth**: not recommended unless Supabase Auth limitations are unacceptable.

Preferred path unless changed later:

- Use Supabase Auth for password handling.
- Store display username in `profiles.username` with unique constraint.
- Persist Supabase session in browser storage via official client behavior.
- Provide explicit logout that clears session.

## 4. Data model draft

### `profiles`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | References `auth.users.id` |
| `username` | text | Unique, user-facing |
| `display_name` | text | Optional future display override |
| `rank_tier` | text | Current rank label |
| `rank_xp` | integer | Rank progress |
| `created_at` | timestamptz | Audit |
| `updated_at` | timestamptz | Audit |

### `player_settings`

| Column | Type | Notes |
|---|---|---|
| `user_id` | uuid | Owner |
| `graphics_preset` | text | low/medium/high/ultra/custom |
| `render_scale` | numeric | Clamp in app |
| `camera_sensitivity` | numeric | Clamp in app |
| `aim_sensitivity` | numeric | Clamp in app |
| `keybindings` | jsonb | Versioned map |
| `audio` | jsonb | Master/music/sfx/UI |
| `accessibility` | jsonb | Motion, shake, colorblind, captions |

### `profession_unlocks`

| Column | Type | Notes |
|---|---|---|
| `user_id` | uuid | Owner |
| `profession_id` | text | Stable identifier |
| `unlocked_at` | timestamptz | Unlock time |
| `mastery_xp` | integer | Profession progression |

### `run_summaries`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Run id |
| `user_id` | uuid | Owner |
| `profession_id` | text | Profession used |
| `map_id` | text | Map/contract |
| `highest_wave` | integer | Main score |
| `result` | text | victory/extraction/breach/abandoned |
| `rank_delta` | integer | Rank change |
| `build_snapshot` | jsonb | Relics/towers/augments |
| `stats` | jsonb | Damage, repairs, kills, economy |
| `created_at` | timestamptz | Audit |

### `balance_versions`

| Column | Type | Notes |
|---|---|---|
| `version` | text | Semver or date version |
| `checksum` | text | Detect mismatch |
| `notes` | text | Changelog |
| `created_at` | timestamptz | Audit |

## 5. Row Level Security expectations

- Users can read/update only their own profile/settings/run summaries unless public leaderboard views are deliberately created.
- Username uniqueness must not leak sensitive auth data.
- Leaderboards should use sanitized views, not raw profile tables.
- Service role keys must never be exposed to the client.

## 6. Performance targets

Browser game targets for production:

- 60 FPS target on modern desktop discrete GPUs at high preset.
- 30 FPS acceptable fallback on lower-end integrated GPUs at low preset.
- Avoid unbounded enemy/tower object allocation during waves.
- Use pooling for projectiles/VFX where practical.
- Lazy-load nonessential screens/assets.
- Keep initial unauthenticated bundle focused on login/menu basics.

## 7. Settings persistence

- Store local copy for immediate boot.
- Sync authenticated settings to Supabase.
- Resolve conflicts by most recent `updated_at` unless a future cloud-save policy says otherwise.
- Keybindings must be versioned so new actions can receive defaults.

## 8. Security and integrity

- Passwords are handled only by Supabase Auth.
- Validate all persistent rewards server-side or through signed run summaries where feasible.
- Rate-limit auth-sensitive actions through Supabase/platform controls.
- Never trust client-submitted rank deltas without validation rules.
- Store gameplay balance version with every run summary.
