# Barrowfall

A 3D arena-survivor built in the browser. Survive the waves, level up, choose upgrades.

**Play:** https://barrowfall.netlify.app
**Built in:** ~11 minutes from written concept to a playable, deployed build (first commit 14:10, gameplay complete 14:19 on 2026-09-17). The title screen computes the live figure from the first and latest commit via the GitHub API.
**Stack:** Three.js · TypeScript · Vite · Netlify
**Workflow:** designed and built with Claude Code as the primary development tool.

Controls: WASD / arrows to move. Attacks are automatic. Click an upgrade when you level.

## Why this exists

Built as the answer to GAMELINE's "Game Developer – AI-Powered Web Games" posting, which asks:
*"How quickly could you build a simple playable game from a written concept?"*
The concept was a one-page brief. The git history is the timeline. The title screen doubles as the application note, and the CV is served at `/cv.pdf`.

## What's in it

- Hero capsule, WASD movement, auto-attack at the nearest enemies
- Three enemy types (Shambler, Skitter, Brute) with a spawn ramp every 15s and +10% HP per minute
- XP gems, level-ups that pause the game and offer 3 of 8 upgrades
- HUD, title screen, death screen, hit flash, camera shake, death pop, gem bob
- Three.js primitives with flat shading and fog; no physics engine, no ECS, no state library

## Run locally

```
npm install
npm run dev
```

By Krastyo Yordanov — https://www.dracovallis.com
