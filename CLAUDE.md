# CLAUDE.md — AEGIS DEFENSE Project Memory

This repository is the planning and implementation home for **AEGIS DEFENSE**, a premium 3D third-person roguelite tower-defense game intended to feel polished enough for a ~2,000 JPY Steam release while remaining deployable to Vercel.

Claude Code should treat this file as the concise project memory. Detailed product, design, balance, and technical decisions live in the linked documents below.

## Canonical project documents

Read the relevant document before editing implementation or planning files:

- @docs/PRODUCT_REQUIREMENTS.md — product goals, player experience, authentication, screens, release bar.
- @docs/DESIGN_DIRECTION.md — anti-generic/anti-"AI-looking" art direction, typography, UI, animation, accessibility.
- @docs/GAME_SYSTEMS.md — combat, waves, towers, roguelite loops, skills, ultimates, settings.
- @docs/CLASS_BALANCE.md — all professions, roles, class kits, balance rules, unlock/readiness policy.
- @docs/TECHNICAL_ARCHITECTURE.md — Vercel + Supabase architecture, data model, security, performance targets.
- @docs/IMPLEMENTATION_PLAN.md — phased build plan and definition of done.
- @docs/PROMPT_GUIDE.md — how to turn these specs into focused Claude Code implementation prompts.

## Non-negotiable product pillars

1. **Premium, not prototype**: avoid placeholder-feeling UX, toy balance, one-note enemies, and flat sample-app visuals.
2. **3D third-person tactical action tower defense**: the player controls one character directly while deploying/upgrading defenses and surviving waves.
3. **Roguelite depth**: each run has procedural offers, escalating waves, relic/build synergies, meta progression, and meaningful failure/retry loops.
4. **Persistent login**: username/password auth through Supabase; sessions persist until explicit logout.
5. **Balanced professions**: every profession must have a viable playstyle, clear strengths, clear weaknesses, and at least one tower-defense-relevant contribution.
6. **Human-crafted front end**: follow the design rules in `docs/DESIGN_DIRECTION.md`; never ship generic AI-dashboard gradients, random glass cards, lifeless symmetry, or lorem ipsum-like copy.
7. **Deployable to Vercel**: all implementation decisions must preserve serverless/frontend deployment compatibility.

## Expected tech direction

- Frontend: TypeScript-first web app suitable for Vercel.
- 3D: browser-based real-time 3D stack such as React Three Fiber / Three.js unless a future decision document supersedes this.
- Backend/data/auth: Supabase Auth, Postgres, Row Level Security, Edge Functions where needed.
- Styling: componentized design system using tokens from `docs/DESIGN_DIRECTION.md`.
- State: deterministic gameplay state separated from UI state; do not bind core simulation directly to React render timing.

## Working rules for future code changes

- Before coding, update or confirm the related design/spec section if requirements are ambiguous.
- Keep gameplay constants data-driven so balance changes do not require rewriting systems.
- Never put `try/catch` blocks around imports.
- Do not introduce mock security, fake auth, or client-side-only authority for persistent player data.
- Prefer small, reviewable commits that connect to a documented phase in `docs/IMPLEMENTATION_PLAN.md`.
- When modifying user-visible UI, verify it against the anti-AI checklist in `docs/DESIGN_DIRECTION.md`.

## Documentation style

- Keep project docs actionable: decisions, constraints, acceptance criteria, and examples beat vague aspirations.
- When a requirement changes, update the most specific document and only summarize in this file if it affects long-term Claude behavior.
- Prefer tables for balance data and matrices; prefer checklists for acceptance criteria.
