# Mew Quest
A gentle, side-scrolling precision platformer. Help ginger cat Mew reach Jenn, dodge garden objects and a playful black-and-white cat, and collect optional Dreamies (little brown rectangular cat treats). Every mishap returns Mew safely to a cosy checkpoint.

## Play locally
Run `python3 -m http.server 4173 --directory dist` from this directory, then open http://localhost:4173. No build or dependencies are required. Use a local server because the game uses JavaScript modules.

Move: arrows or A/D. Jump: C (hold for height). Dash: X or Shift, with arrows for direction; landing recharges it. R: checkpoint. Escape: pause. Touch buttons are available on touch devices. Sound is optional and off initially.

## Verify
Node 22+: `npm test`. Simulation tests cover movement, dash refill, safe returns, obstacles, patrol bounds, collectibles, pause, replay and completion.

The opening title screen uses pixel art based on the latest WhatsApp portrait (5 November 2026, 13:30). Press Enter or tap “press enter” to start directly.

Jenn’s doorstep character uses `dist/assets/jenn-welcome.png`, a transparent illustrated sprite based on the approved character concept. Her pink beanie, brown ponytail, teal coat, and welcoming crouch match the proposal. The imagegen prompt was: extract the left full-body Jenn from the approved sheet as one transparent game-ready character, preserving her identity, clothes, pose and soft style; omit text, scenery, other figures and ground. Sprite loading has a simple drawn fallback; level collision and completion rules are unchanged.
