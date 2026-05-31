# AEGIS DEFENSE

**AEGIS DEFENSE** is planned as a premium 3D third-person roguelite tower-defense game deployable to Vercel with Supabase-backed authentication, profiles, settings, rank, and run persistence.

This repository is currently in the documentation/specification phase. Real gameplay implementation should follow the project documents below rather than starting as a throwaway prototype.

## Project documents

- [CLAUDE.md](./CLAUDE.md) — Claude Code project memory and working rules.
- [Product Requirements](./docs/PRODUCT_REQUIREMENTS.md) — vision, screens, auth, settings, and release bar.
- [Design Direction](./docs/DESIGN_DIRECTION.md) — visual identity and anti-generic/anti-AI frontend rules.
- [Game Systems](./docs/GAME_SYSTEMS.md) — waves, towers, roguelite loop, character kit structure.
- [Class Balance](./docs/CLASS_BALANCE.md) — profession taxonomy, launch roster, example kits, balance process.
- [Technical Architecture](./docs/TECHNICAL_ARCHITECTURE.md) — Vercel/Supabase architecture, data model, security, performance.
- [Implementation Plan](./docs/IMPLEMENTATION_PLAN.md) — phased roadmap and definitions of done.
- [Prompt Guide](./docs/PROMPT_GUIDE.md) — templates for turning the specs into Claude Code prompts.

## Current phase

Phase 0: documentation foundation.

No production gameplay code has been added yet. Future code changes should begin with the scaffold described in `docs/IMPLEMENTATION_PLAN.md` and preserve the product pillars in `CLAUDE.md`.
