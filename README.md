# Mew Quest
A gentle, full-window garden platformer. The game opens directly in the playing area, with instructions on a garden sign and matching illustrated HUD panels. The canvas adapts to portrait and landscape windows without stretching the characters.

## Play locally
Run `python3 -m http.server 4173 --directory dist`, then open http://localhost:4173. No build or runtime dependencies are required.

Move: arrows or A/D. Jump: C (hold for height). Dash: X or Shift, with arrows for direction. R: return safely to your resting spot. Escape: pause. Touch buttons appear on touch devices. Select Sound On for the original chiptune music and effects.

## Garden friends
Mew must land beside Rosie, Ernie, Darwin and Minka, and greet Mark. Rosie has white toes; Ernie is the larger ginger tom; Darwin is a brown tabby; Minka is predominantly black with a white muzzle/bib and purple collar. Darwin and Minka sit together. Coco alone patrols and must be jumped over. Friendly cats remain stationary.

Greetings are capitalised: Hi Rosie, Hi Ernie, Hi Minka And Darwin, Hi Mark and Hi Samuel. Mark’s greeting is queued separately after Ernie’s. Progress survives safe returns and resets on a new game. Gates remain visible garden ribbons with no instruction signs; resting spots are large flags without text labels.

Platforms are one-way: Mew jumps through from below and lands on top while falling. Rosie’s flag is beyond her raised ledge and activates after her greeting. Optional light-brown Dreamies are counted during play and in the larger ending popup naming Jenn and Samuel.

## Mew Quest 3D
A third-person 3D version of the same adventure lives at `dist/3d/` (open http://localhost:4173/3d/ when serving locally). Mew crosses a pond garden of lawns, stepping stones, a plank bridge, flowerpots, a brick terrace, walls, a shed roof and lily pads to reach Jenn and Samuel at the cottage door. The rules match the 2D game: capitalised greetings (Hi Rosie, Hi Ernie, Hi Mark after Ernie, Hi Minka And Darwin), ribbon gates that open after each greeting, Coco patrolling the bridge, harm-free returns to cosy cushions, 15 optional Dreamies and the same doorstep line and ending. Sprinklers pulse on and off with a sputter before they restart, one lily pad slides, and one gap needs a jump then a dash.

Controls: arrows or WASD move, Space or C jumps, Shift or X dashes, R rests, Escape or P pauses, Enter starts. Phones get a floating thumb stick on the left and Jump, Dash and Rest buttons on the right. Sound is off until selected.

Modules in `dist/3d/`: `course.mjs` (layout and simulation, no rendering), `toolkit.mjs` (materials, shapes, textures), `characters.mjs` (Mew, the cats, Jenn, Samuel, Mark and their animation), `scene.mjs` (the garden), `effects.mjs` (sparkles, pollen, smoke), `render.mjs` (soft-focus finish and automatic quality steps for slower phones), `pacing.mjs` (blends between fixed 1/120 s steps so movement is even at any screen refresh rate), `labels.mjs`, `input.mjs`, `sound.mjs` and `game.mjs`, which ties them together. three.js r128 (MIT) is bundled at `dist/3d/vendor/three.min.js`, with public CDNs as fallbacks; if the game cannot start, the title card explains why. Reduced motion stills the grass, removes pollen and butterflies, and thins sparkles. `tests/course-3d.test.mjs` includes a scripted run through the whole course.

## Illustrated characters
Jenn: `dist/assets/jenn-welcome.png`. Samuel: `dist/assets/samuel-illustrated.png`. Mark: `dist/assets/mark-stocky.png`.

Samuel and Mark were generated using the built-in imagegen tool with Jenn’s sprite as the illustration-style reference. Samuel prompt: full-body transparent illustration of a smiling blonde, brown-eyed little boy in a green Minecraft Creeper-motif shirt, jeans and trainers, matching Jenn’s warm storybook shading and clean silhouette. Mark prompt: full-body transparent friendly man in a rust-and-cream checked shirt, jeans and brown shoes, holding a wooden four-string bass, matching Jenn’s exact illustrated style. Both preserve their existing character requirements. Small drawn fallbacks remain while images load.

## Music
“Garden Treasures” is an original 35.56-second chiptune loop. Regenerate with `python3 scripts/compose-soundtrack.py`. Music pauses with gameplay, focus loss and the ending, and is off until selected.

## Verification
Node 22+: `npm test`. Tests cover movement, one-way platforms, reachable ledges, Coco, required and queued greetings, checkpoint/replay state, Samuel timing, exact ending/count, illustrated rendering/fallbacks, responsive viewport/camera, speech clipping and music playback state. Live browser visual checks require an available browser host.

Each newly collected Dreamie creates a golden star pop at its position. Stars gently rise and fade for 0.75 seconds, pause with gameplay, clear on resting/replay, and remain still when reduced motion is preferred.

Mark’s current sprite was edited with the built-in imagegen tool: preserve his identity, outfit, bass and illustrated style, with broader shoulders, fuller torso and sturdier arms/legs rather than a skinny frame.

At the doorstep Mew says “Hi Samuel! Hi Jenn, It's good to be home!” in a wrapping speech bubble for 4.5 seconds before the ending popup.

## Phones and laptops
Use the same hosted game URL on both. Phones have large arrow buttons, labelled Jump and Dash buttons, and a safe Rest button. Hold a movement arrow with one thumb and Jump/Dash with the other. Multiple fingers are tracked independently; pause/focus loss clears held controls. Controls respect phone safe areas and remain visible on narrow or hybrid-touch screens. Landscape provides a wider view; portrait remains supported, with the camera showing more path ahead. Laptop controls remain arrows/A-D, C jump, X/Shift dash, R rest and Escape pause. Sound starts only after selecting Sound On. This is a browser game, not a store-installed app.

Phones/tablets (and narrow windows) retain the Mew Quest splash with Mew’s portrait and a large Tap To Play button. Simulation stays stopped until tap or Enter. Desktop-size keyboard-only browsers start directly in the garden. The game remains public and uses the same URL on both.
