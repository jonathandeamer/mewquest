# Mew Quest
A gentle, side-scrolling precision platformer. Help ginger cat Mew reach Jenn, dodge garden objects and a playful black-and-white cat, and collect optional yarn. Every mishap returns Mew safely to a cosy checkpoint.

## Play locally
Run `python3 -m http.server 4173 --directory dist` from this directory, then open http://localhost:4173. No build or dependencies are required. Use a local server because the game uses JavaScript modules.

Move: arrows or A/D. Jump: C (hold for height). Dash: X or Shift, with arrows for direction; landing recharges it. R: checkpoint. Escape: pause. Touch buttons are available on touch devices. Sound is optional and off initially.

## Verify
Node 22+: `npm test`. Simulation tests cover movement, dash refill, safe returns, obstacles, patrol bounds, collectibles, pause, replay and completion.

The opening title screen uses pixel art based on the latest WhatsApp portrait (5 November 2026, 13:30). Press Enter or tap “press enter” to start directly.

## 8-bit presentation
Original sprites and tile scenery render on a 320×180 canvas with crisp nearest-neighbour scaling. The 18-colour palette, bitmap UI font, square-wave sound effects and block borders take inspiration from NES-era platform games. Physics and collision geometry remain independent of the renderer. Press Start 2P is bundled under the SIL Open Font License (see `dist/assets/FONT-LICENSE.txt`).
