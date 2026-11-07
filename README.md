# Mew Quest
A gentle, side-scrolling precision platformer. Help ginger cat Mew reach Jenn, jump over moving Coco, greet stationary Rosie, Ernie, Darwin and Minka on raised garden ledges, and collect optional Dreamies (little brown rectangular cat treats). Every mishap returns Mew safely to a cosy checkpoint.

## Play locally
Run `python3 -m http.server 4173 --directory dist` from this directory, then open http://localhost:4173. No build or dependencies are required. Use a local server because the game uses JavaScript modules.

Move: arrows or A/D. Jump: C (hold for height). Dash: X or Shift, with arrows for direction; landing recharges it. R: checkpoint. Escape: pause. Touch buttons are available on touch devices. Sound is optional and off initially.

## Verify
Node 22+: `npm test`. Simulation tests cover movement, dash refill, safe returns, obstacles, patrol bounds, collectibles, pause, replay and completion.

The opening title screen uses pixel art based on the latest WhatsApp portrait (5 November 2026, 13:30). Press Enter or tap “press enter” to start directly.

Jenn’s doorstep character uses `dist/assets/jenn-welcome.png`, a transparent illustrated sprite based on the approved character concept. Her pink beanie, brown ponytail, teal coat, and welcoming crouch match the proposal. The imagegen prompt was: extract the left full-body Jenn from the approved sheet as one transparent game-ready character, preserving her identity, clothes, pose and soft style; omit text, scenery, other figures and ground. Sprite loading has a simple drawn fallback; level collision and completion rules are unchanged.

## Music
“Garden Treasures” is an original 35.56-second chiptune loop: a lilting 6/8 melody, plucked arpeggios and triangle-like bass, with a stately British television/antique-fair mood. No television melody or recording is sampled. Start playing and select **Sound on** to hear it. Music pauses with the game, focus loss and the reunion screen; muting silences music and effects. Regenerate the bundled WAV with `python3 scripts/compose-soundtrack.py`.

Ernie, a larger friendly ginger tom with a blue collar, waits on the platform near the midpoint and greets Mew with “ Hello Mew!” in a speech bubble. He is scenery, not a collision obstacle.
Mew replies “hi ernie” in her own speech bubble when she passes him. Her reply follows her for four seconds of active play, appears once per playthrough, and clears on a checkpoint return.

## Garden friends and Samuel
Mew must land beside all four friendly cats and greet Mark before reaching the family. Rosie has white toes; Ernie is the larger ginger tom; Darwin is a brown tabby; Minka is predominantly black with a white muzzle/bib and a purple collar. Darwin and Minka sit together and Mew says “hi minka and darwin”. Friendly cats stay still. Coco is a mostly-black tuxedo cat who patrols and must be jumped over; no greeting is required for Coco. Garden ribbon gates and the FRIENDS counter identify the required encounters. Greetings survive safe checkpoint returns and reset with a new game.

Dreamies are light-brown rectangles. Samuel stands beside Jenn with blonde hair, brown eyes and a green Minecraft Creeper-motif T-shirt. Mew says “hi samuel” for 2.6 seconds before the final popup, which names Jenn and Samuel and shows the total Dreamies collected in larger text.

## Platform and checkpoint update
Platforms are now one-way: Mew can jump through their underside and pass through their sides, then land on top while falling. Rosie’s checkpoint sits on the route beyond her raised ledge, and activates only after greeting Rosie. Larger labelled checkpoint flags make all resting spots easier to notice.

Mark stands beside Ernie in a checked shirt holding a four-string bass. Mew says “hi ernie” then “hi mark” in separate queued bubbles; Mark is required for opening that stretch and finishing. The ending names Jenn and Samuel and shows the player’s actual collected Dreamies total.
