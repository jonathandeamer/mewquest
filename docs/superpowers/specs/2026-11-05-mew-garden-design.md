# Mew’s Garden Adventure

## Intent
A browser-playable side-scrolling precision platformer starring Mew, a ginger cat, travelling through a garden to her owner Jenn. Jenn is a white-skinned woman with brown hair in a ponytail. The game is affectionate and completely free of violence or physical harm to Mew.

## Agreed direction
Side-scrolling exploration with gradually increasing difficulty and frequent checkpoints. The references are Mario’s readable platforming and the precise movement of Celeste and Super Meat Boy.

## Approaches considered
- Side-scrolling adventure: a connected journey through the garden, with short checkpoint sections. Selected by the user.
- Separate single-screen challenges: easier to practise individually, but less of a continuous journey.

## Proposed game
One complete, replayable adventure, split into three connected garden areas: the lawn, flowerpot terraces, and the path to Jenn’s doorstep. Early jumps teach movement; later sections combine gaps, small landing platforms, garden objects, and a patrolling black-and-white cat. The other cat is playful, never aggressive.

Mew can run, jump, and dash once in mid-air; landing restores the dash. Variable jump height, a short grace period after leaving an edge, and buffered jump presses make controls precise and forgiving. Garden objects are clearly distinguished from safe platforms. Touching an obstacle or the other cat, or slipping off the route, produces a brief sparkle transition and safely returns Mew to her latest cosy checkpoint. No injury, death animation, health bar, attacks, or violent language.

Jenn waits at the final doorstep; reaching her triggers a happy reunion and replay option. Optional collectible yarn balls encourage exploration without blocking progress.

## Presentation and controls — builder’s proposed defaults
Warm illustrated garden, expressive cat sprites, readable platforms, gentle background movement, and a compact HUD showing area, yarn collected, and progress. Keyboard: arrows or A/D to move, Space/Z to jump, Shift/X to dash, R to return to checkpoint, Escape to pause. On-screen touch controls support phones and tablets. Start screen teaches controls; pause and restart are available. Reduced-motion preferences are respected for decorative effects.

## Implementation — builder’s proposed defaults
Self-contained HTML, CSS, and JavaScript with Canvas rendering, no runtime dependencies. Responsive canvas, fixed-step simulation, axis-separated collisions, and camera tracking. Static hosting through Sites where available, with local source retained in this workspace.

## Acceptance checks
Verify startup, left/right movement, variable jump and dash, collision/landing, safe checkpoint reset, gradual level progression, other-cat patrol, collectibles, pause/resume, completion/replay, and touch buttons. Check that the route is physically reachable and the browser layout fits desktop and mobile viewports.

## Scope and constraints
One polished short adventure, rather than a large campaign or a recreation of copyrighted characters or level art. No accounts, backend, combat, or harm. Remaining tuning, palette, exact platform layout, audio choice, and decorative details are builder decisions.
