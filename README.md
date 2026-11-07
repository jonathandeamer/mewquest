# Mew Quest
A gentle, full-window garden platformer. The game opens directly in the playing area, with instructions on a garden sign and matching illustrated HUD panels. The canvas adapts to portrait and landscape windows without stretching the characters.

## Play locally
Run `python3 -m http.server 4173 --directory dist`, then open http://localhost:4173. No build or runtime dependencies are required.

Move: arrows or A/D. Jump: C (hold for height). Dash: X or Shift, with arrows for direction. R: return safely to your resting spot. Escape: pause. Touch buttons appear on touch devices. Select Sound On for the original chiptune music and effects.

## Garden friends
Mew must land beside Rosie, Ernie, Darwin and Minka, and greet Mark. Rosie has white toes; Ernie is the larger ginger tom; Darwin is a brown tabby; Minka is predominantly black with a white muzzle/bib and purple collar. Darwin and Minka sit together. Coco alone patrols and must be jumped over. Friendly cats remain stationary.

Greetings are capitalised: Hi Rosie, Hi Ernie, Hi Minka And Darwin, Hi Mark and Hi Samuel. Mark’s greeting is queued separately after Ernie’s. Progress survives safe returns and resets on a new game. Gates remain visible garden ribbons with no instruction signs; resting spots are large flags without text labels.

Platforms are one-way: Mew jumps through from below and lands on top while falling. Rosie’s flag is beyond her raised ledge and activates after her greeting. Optional light-brown Dreamies are counted during play and in the larger ending popup naming Jenn and Samuel.

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
