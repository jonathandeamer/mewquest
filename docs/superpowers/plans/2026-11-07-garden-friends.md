# Garden Friends Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Require automatic greetings with stationary garden friends, preserve moving Coco, and add Samuel.
**Architecture:** Shared encounter data and greeting rules feed the existing fixed-step engine and separate Canvas character renderer. Preserve the existing movement and static hosting.
**Tech Stack:** HTML/CSS/JS Canvas; Node test runner.
**Spec:** docs/superpowers/specs/2026-11-07-garden-friends-design.md

## Global Constraints
No harm to Mew; Coco alone patrols and is not greeted. Rosie/Ernie/Darwin/Minka must be greeted. Darwin and Minka together: hi minka and darwin. Samuel: blonde hair, brown eyes, Minecraft T-shirt, hi samuel before exact existing popup. C jump and music remain.

## Review Focus
- Wrong-height or airborne encounters cannot satisfy greetings.
- Raised ledges and greeting gates must not soft-lock the route.
- Progress survives checkpoint returns and clears on replay.
- Samuel greeting is visible before win; pause freezes its delay.
- Canvas render and title/audio handlers must execute with new imports.

### Task 1: Encounter progression and raised level geometry
Files: dist/friends.mjs, dist/engine.mjs, tests/friends.test.mjs, tests/engine.test.mjs, tests/ernie.test.mjs.
Interfaces: ENCOUNTERS, SAMUEL, missingCats(g), closedGates(g), updateGreetings(g,dt).
- [x] Write failing tests for grounded automatic greeting, all-four requirement, paired greeting, excluded Coco, checkpoint persistence, replay reset, gate behavior, and Samuel delay/pause.
- [x] Add shared encounter data and timed greeting logic; preserve Ernie compatibility.
- [x] Add reachable stepping-stone shelves and unobtrusive greeting gates. Keep only one Coco patrol.
- [x] Run full tests including actual simulated crossings.

### Task 2: Character presentation and game integration
Files: dist/characters.mjs, dist/game.mjs, dist/ernie.mjs, dist/index.html, dist/style.css, README.md, tests/title-controls.test.mjs.
Interfaces: drawFriends(ctx,drawCat,g), drawSamuel(ctx), drawMewGreeting(ctx,p,text).
- [x] Render Rosie white toes, Darwin brown stripes, mostly-white patchy Minka, tuxedo Coco, and larger ginger Ernie.
- [x] Render blond brown-eyed Samuel in green Creeper-motif shirt beside Jenn; lighten rectangular Dreamies.
- [x] Update HUD and instructions with required progress and next stop; preserve exact final popup.
- [x] Run render integration and full suite; independent review; fix important findings; package and publish preserving audience.

## Verification
27/27 tests pass, including all base gaps, four raised shelf approaches, greeting-height checks, closed/open gates, Coco patrol, checkpoint persistence/replay, delayed Samuel greeting, and loaded/fallback renderer execution. Static independent review found no important issues. Fixed an independently discovered checkpoint-return-during-reunion bug with a failing-then-passing regression test. Browser preview host unavailable; visual browser QA remains unverified.
